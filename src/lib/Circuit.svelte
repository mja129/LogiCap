<script lang="ts" module>
    import { Node } from 'svelvet'
    import { setContext, type Component } from 'svelte'
    import {
        getComponent,
        type AllNodeProps,
        type AllNodePropsWithoutId,
        type allNodeTypes,
    } from '@CircuitModel'
    import { writable, type Writable } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import { getRunning } from '@CircuitEngine'

    // TODO can this be further simplified
    interface SimNodeProps {
        nodeId: string
        gateType: allNodeTypes
        position: { x: number; y: number } | undefined
        nodeProps: AllNodePropsWithoutId
    }
</script>

<script lang="ts">
    let { nodeId, gateType, position, nodeProps }: SimNodeProps = $props()
    const nodeComponent = getComponent(gateType);

    // obtain rotation from CircuitStore if available
    let rotation: Writable<number> = writable($CircuitStore.devices[nodeId].rotation || 0);
    // enable anchor children to track rotation
    setContext('rotation', rotation);

    // used for executing actions on already selected nodes
    let wasSelected = false;
</script>

<!-- I added this here because I kept changing the SvelvetNode properties in all
of the different components now I just need to do it here -->
{#snippet wrapInSvelvetNode(MyComponent: Component<AllNodeProps>)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <Node
        drop={position !== undefined ? false : 'cursor'}
        {position}
        editable={false}
        locked={getRunning()}
        id={nodeId}
        let:selected
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
</style>
