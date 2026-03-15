<script lang="ts" module>
    import { Node } from 'svelvet'
    import { setContext, type Component } from 'svelte'
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
    let svelvetNodeStore: any = null;
    let isDragging = false;
    let dragStartMouse = { x: 0, y: 0 };
    let dragStartNode = { x: 0, y: 0 };

    function snapToGrid(value: number): number {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    }

    function captureSvelvetNode(el: HTMLElement, nodeObj: any) {
        svelvetNodeStore = nodeObj;
        
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

    let hasMoved = false;

    // This will call getRunning, so stuff still works.
    function onCustomDragStart(e: MouseEvent) {
        if (getRunning()) return;
        
        // Let the event propagate so Svelvet still selects the node, 
        // but because we set locked={true} below, Svelvet won't drag it.
        isDragging = true;
        hasMoved = false;
        dragStartMouse = { x: e.clientX, y: e.clientY };
        
        const currentPos: Position = get(svelvetNodeStore.position);
        dragStartNode = { x: currentPos.x, y: currentPos.y };

        window.addEventListener('mousemove', onCustomDragMove);
        window.addEventListener('mouseup', onCustomDragEnd);
    }

    function onCustomDragMove(e: MouseEvent) {
        if (!isDragging) return;

        // Factor in the zoom scale so the mouse delta perfectly matches the canvas
        const dx = (e.clientX - dragStartMouse.x);
        const dy = (e.clientY - dragStartMouse.y);

        // Deadzone
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            hasMoved = true;
        }

        if (!hasMoved) return;
        const scale = get(canvasTransform).scale;

        // Applying the mathematical grid in real-time
        const newX = snapToGrid(dragStartNode.x + dx / scale);
        const newY = snapToGrid(dragStartNode.y + dy / scale);

        // Instantly update Svelvet visually
        svelvetNodeStore.position.set({ x: newX, y: newY });
    }

    function onCustomDragEnd(e: MouseEvent) {
        if (!isDragging) return;
        isDragging = false;

        window.removeEventListener('mousemove', onCustomDragMove);
        window.removeEventListener('mouseup', onCustomDragEnd);

        // Only save position if we actually dragged
        if (hasMoved) {
            const finalPos: Position = get(svelvetNodeStore.position);
            $CircuitStore.devices[nodeId].position = { x: finalPos.x, y: finalPos.y };
        }
    }

    // obtain rotation from CircuitStore if available
    let rotation: Writable<number> = writable($CircuitStore.devices[nodeId].rotation || 0);
    // enable anchor children to track rotation
    setContext('rotation', rotation);

    // used for executing actions on already selected nodes
    let wasSelected = false;

    function syncSelected(node: HTMLElement, sel: boolean) {
        $isSelected = sel;
        return {
            update(sel: boolean) {
                $isSelected = sel;
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
        let:selected
        let:node
        on:nodeClicked={(event) => {
            // track here whether node was selected, as it always will be by the time nodeReleased fires
            wasSelected = event.detail.e.currentTarget.classList.contains('selected');
        }}
        on:nodeReleased={(event) => {
            // block rotation during simulation
            // rotation should also only be allowed if the element is already selected
            // if shift key is down, the element is being deselected
            if (getRunning() || !wasSelected || event.detail.e.shiftKey) {
                return;
            }

            // rotate
            $rotation = ($rotation + 90) % 360;
            // do not set Node rotation property, see below
            //event.detail.node.rotation.set($rotation);
            $CircuitStore.devices[nodeId].rotation = $rotation;
        }}
    >
        <!--
            Node's rotation property causes bugs with wire connections, so apply it ourselves.
            Specifically, when determining the connection angle of a wire into an anchor,
             is is improperly considered together with Direction, resulting in an incorrect connection angle
        -->
        <div
            class:selected
            style="transform:rotate({$rotation}deg)"
            use:syncSelected={selected}
            use:captureSvelvetNode={node}
            onmousedown={onCustomDragStart} 
        >
            <MyComponent {nodeId} {...nodeProps} />
        </div>

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
    }
    
    /* Make it look like you are physically holding it when clicking */
    :global(.svelvet-node:active) {
        cursor: grabbing !important;
    }
</style>
