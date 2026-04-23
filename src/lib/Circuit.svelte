<script lang="ts" module>
    import { Node } from 'svelvet'
    import { setContext, onDestroy, type Component, type Snippet } from 'svelte'
    import NodeMenu from '@CircuitParts/NodeMenu.svelte'
    import {
        getComponent,
        type AllNodeProps,
        type AllNodePropsWithoutId,
        type allNodeTypes,
    } from '@CircuitModel'
    import { writable, type Writable, get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import { getRunning } from '@CircuitEngine'
    import { GRID_SIZE } from './grid'
    import { canvasTransform } from '@src/App.svelte';
    import { selectedNodeIds, wireMoveOffset, selectedWireIds, nodePositionRegistry } from './wireModeStore';

    // TODO can this be further simplified
    interface SimNodeProps {
        nodeId: string
        gateType: allNodeTypes
        position: { x: number; y: number } | undefined
        nodeProps: AllNodePropsWithoutId
    }

    
</script>

<script lang="ts">
    let { nodeId, gateType, position: initialPos, nodeProps }: SimNodeProps = $props()
    const nodeComponent = getComponent(gateType);
    let isSelected: Writable<boolean> = writable(false);
    setContext('selected', isSelected);

    // I'm making a custom dragging flow, since Svelte's internal snapping seems to be really difficult to work with
    let isDragging = false;
    let dragStartMouse = { x: 0, y: 0 };
    let groupStartPositions = new Map<string, { x: number; y: number }>();

    function snapToGrid(value: number): number {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    }

    function captureSvelvetNode(el: HTMLElement, nodeObj: any) {
        nodePositionRegistry.update(m => { m.set(nodeId, nodeObj.position); return m; });

        // Initial Drop Fix
        if (initialPos === undefined) {
            setTimeout(() => {
                const livePos: Position = get(nodeObj.position);
                const snappedX = snapToGrid(livePos.x);
                const snappedY = snapToGrid(livePos.y);
                nodeObj.position.set({ x: snappedX, y: snappedY });
                $CircuitStore.devices[nodeId].position = { x: snappedX, y: snappedY };
            }, 10);
        }
        return {};
    }

    onDestroy(() => {
        nodePositionRegistry.update(m => { m.delete(nodeId); return m; });
    });

    let hasMoved = false;

    // Sync $isSelected from the global selectedNodeIds store
    $effect(() => {
        $isSelected = $selectedNodeIds.has(nodeId);
    });

    // This will call getRunning, so stuff still works.
    function onCustomDragStart(e: MouseEvent) {
        if (getRunning()) return;

        // Capture pre-click selection state before the store is mutated
        wasSelected = $selectedNodeIds.has(nodeId);

        // Manage selection ourselves since locked={true} prevents Svelvet's nodeSelectLogic
        selectedNodeIds.update(sel => {
            const next = new Set(sel);
            if (e.shiftKey) {
                if (next.has(nodeId)) next.delete(nodeId);
                else next.add(nodeId);
            } else {
                if (!next.has(nodeId)) {
                    next.clear();
                    next.add(nodeId);
                }
                // if already selected, keep multi-select as-is (for group drag)
            }
            return next;
        });

        isDragging = true;
        hasMoved = false;
        dragStartMouse = { x: e.clientX, y: e.clientY };

        // Snapshot starting positions for all selected nodes
        const registry = get(nodePositionRegistry);
        groupStartPositions = new Map();
        for (const id of get(selectedNodeIds)) {
            const posStore = registry.get(id);
            if (posStore) groupStartPositions.set(id, { ...get(posStore) });
        }

        window.addEventListener('mousemove', onCustomDragMove);
        window.addEventListener('mouseup', onCustomDragEnd);
    }

    function onCustomDragMove(e: MouseEvent) {
        if (!isDragging) return;

        const dx = (e.clientX - dragStartMouse.x);
        const dy = (e.clientY - dragStartMouse.y);

        // Deadzone
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            hasMoved = true;
        }

        if (!hasMoved) return;
        const scale = get(canvasTransform).scale;

        // Move every selected node by the same delta
        const registry = get(nodePositionRegistry);
        for (const [id, startPos] of groupStartPositions) {
            const posStore = registry.get(id);
            if (posStore) posStore.set({
                x: snapToGrid(startPos.x + dx / scale),
                y: snapToGrid(startPos.y + dy / scale),
            });
        }
    }

    function onCustomDragEnd(e: MouseEvent) {
        if (!isDragging) return;
        isDragging = false;

        window.removeEventListener('mousemove', onCustomDragMove);
        window.removeEventListener('mouseup', onCustomDragEnd);

        // Persist final positions for all nodes that moved
        if (hasMoved) {
            const registry = get(nodePositionRegistry);
            for (const id of groupStartPositions.keys()) {
                const posStore = registry.get(id);
                if (posStore) $CircuitStore.devices[id].position = { ...get(posStore) };
            }
        }
    }

    let menuContent = $state<Snippet | null>(null);
    setContext('registerMenu', (snippet: Snippet) => { menuContent = snippet; });

    // obtain rotation from CircuitStore if available
    let rotation: Writable<number> = writable($CircuitStore.devices[nodeId].rotation || 0);
    // enable anchor children to track rotation
    setContext('rotation', rotation);

    // used for executing actions on already selected nodes
    let wasSelected = false;

    // Bridges Svelvet's internal box-selection state into selectedNodeIds.
    // locked={true} means Svelvet only sets selected=true via box selection (never via click),
    // so syncing true→store is safe. The false case is omitted: WireCanvas already calls
    // selectedNodeIds.set(new Set()) when the canvas background is clicked (same moment Svelvet clears).
    function bridgeBoxSelection(_el: HTMLElement, selected: boolean) {
        return {
            update(selected: boolean) {
                if (selected) selectedNodeIds.update(sel => new Set(sel).add(nodeId));
            }
        };
    }

</script>

<!-- I added this here because I kept changing the SvelvetNode properties in all
of the different components now I just need to do it here -->
{#snippet wrapInSvelvetNode(MyComponent: Component<AllNodeProps>)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <Node
        drop={initialPos !== undefined ? false : 'cursor'}
        position={initialPos}
        editable={false}
        locked={true}
        id={nodeId}
        let:node
        let:selected
        on:nodeReleased={(event) => {
            // block rotation during simulation
            // rotation should also only be allowed if the element is already selected
            // if shift key is down, the element is being deselected
            if (getRunning() || !wasSelected || event.detail.e.shiftKey) {
                return;
            }
            const before = get(nodePositionRegistry).get(nodeId);
            console.log('position before rotate:', before ? get(before) : null);

            // rotate
            $rotation = ($rotation + 90) % 360;
            // do not set Node rotation property, see below
            //event.detail.node.rotation.set($rotation);
            $CircuitStore.devices[nodeId].rotation = $rotation;

            setTimeout(() => {
                const after = get(nodePositionRegistry).get(nodeId);
                console.log('position after rotate:', after ? get(after) : null);
            }, 50);

        }}
    >
        <!--
            Node's rotation property causes bugs with wire connections, so apply it ourselves.
            Specifically, when determining the connection angle of a wire into an anchor,
             is is improperly considered together with Direction, resulting in an incorrect connection angle
             changing the transform origin so that rotation doesn't bork logic gates.
        -->
        <div
            class:selected={$isSelected}
            style="position: relative; width: max-content; height: max-content; transform:rotate({$rotation}deg); transform-origin: 33px 33px; display: flex;"
            use:captureSvelvetNode={node}
            use:bridgeBoxSelection={selected}
            onmousedown={onCustomDragStart}
        >
            <MyComponent {nodeId} {...nodeProps} />
        </div>

        {#if $isSelected && menuContent}
            <NodeMenu>
                {@render menuContent()}
            </NodeMenu>
        {/if}

    </Node>
{/snippet}


{#if nodeComponent}
    <!-- svelte-ignore svelte_component_deprecated -->
    {@render wrapInSvelvetNode(nodeComponent)}
{:else}
    <!-- Optional fallback -->
    <div>Unknown gate type: {gateType}</div>
{/if}

<style>
    /* only for logic gates */

    /* add outline and gray color on light mode */
    :global(.light .svelvet-node:not(.selected) svg) {
        filter: drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white)
            drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)
            drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black)
            drop-shadow(0 -1px 0 black) drop-shadow(0 1px 0 black);
    }
    :global(.dark .svelvet-node svg) {
        filter: unset;
    }

    /* give some visual indication if gate is selected */
    .selected {
        filter: drop-shadow(2px 2px lawngreen) drop-shadow(2px -2px lawngreen)
        drop-shadow(-2px 2px lawngreen) drop-shadow(-2px -2px lawngreen);
    }


    /* Since nodes are now permenately set to locked, i need to change the cursor forcefully*/
    :global(.svelvet-node) {
        cursor: grab !important;
        padding: 0 !important;      
        border: none !important; 
        background: none !important; 
    }
    
    /* Make it look like you are physically holding it when clicking */
    :global(.svelvet-node:active) {
        cursor: grabbing !important;
    }
</style>
