<script lang="ts" module>
    import { Anchor as SvelvetAnchor, type Direction } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { getRunning } from '@CircuitEngine'
    import { getContext, onDestroy, onMount } from 'svelte'
    import { writable, type Writable } from 'svelte/store'
    import { findOutputAnchor } from '@CircuitStore'

    let anchorRendererQ: Writable<Array<string>> = writable([]);

    function getDirection(offset: Direction, rotation: number) : Direction {
        switch (offset) { // adjust for offset
            case 'north':
                rotation += 90;
                break;
            case 'east':
                rotation += 180;
                break;
            case 'south':
                rotation += 270;
                break;
        }
        rotation %= 360; // ensure within bounds (0, 90, 180, 270)
        switch (rotation) {
            case 0:
                return 'west' as Direction;
            case 90:
                return 'north' as Direction;
            case 180:
                return 'east' as Direction;
            case 270:
                return 'south' as Direction;
            default:
                // should not ever make it here
                return 'west' as Direction;
        }
    }
</script>

<script lang="ts">
    let {
        io,
        ioId,
        id,
        connections,
        side,
        offset = [],
        usePixelOffset = false,
    }: {
        io: 'input' | 'output'
        ioId: string
        id: string
        connections?: any
        side: Direction
        offset?: [number, number] | []
        usePixelOffset?: boolean
    } = $props()
    const anchorId = `${io === 'input' ? 'in' : 'out'}${ioId}_${id}`

    const rotation: Writable<number> = getContext('rotation')
    rotation.subscribe(() => {
        let outputId = findOutputAnchor(anchorId);
        if (outputId) { // if we have an output
            anchorRendererQ.update((curr) => [...curr, outputId]);
        }
    });

    /*
     * when a component's input anchors are rotated, the connection(s) to those input anchors are lost.
     * to rerender those connections, we must rerender the component(s) outputting the connection(s).
     * we use a list that stores the IDs of anchors that need to rerender themselves.
     * anchors are subscribed to this list so that they know when to rerender.
     */
    let updateTrigger = $state(false)
    let isProcessing = false
    onMount(() => {
        const unsubscriber = anchorRendererQ.subscribe((value) => {
            if (value.includes(anchorId) && !isProcessing) {
                isProcessing = true;
                // so this timeout is basically black magic
                setTimeout(() => {
                    updateTrigger = !updateTrigger;
                    anchorRendererQ.update(() => {
                        return value.filter((signal) => signal !== anchorId)
                    });
                    isProcessing = false;
                });
            }
        });
        onDestroy(unsubscriber);
    });
</script>

{#snippet anchor()}
    <div
        style={`position:absolute;left: ${offset[0]}${usePixelOffset ? "px" : "%"}; top: ${offset[1]}${usePixelOffset ? "px" : "%"};`}
    >
        <SvelvetAnchor
            let:linked
            let:hovering
            let:connecting
            id={anchorId}
            key={anchorId}
            direction={getDirection(side, $rotation)}
            output={(io === 'output' && true) || false}
            input={(io === 'input' && true) || false}
            locked={getRunning()}
            {connections}
        >
            <CustomAnchor {io} {connecting} {linked} {anchorId} {hovering} />
            <Wire initAncId={anchorId} slot="edge" />
        </SvelvetAnchor>
    </div>
{/snippet}

{#key $rotation}
    {#if io === 'input'}
        {@render anchor()}
    {:else}
        {#key updateTrigger} <!-- rerender when updateTrigger changes -->
            {@render anchor()}
        {/key}
    {/if}
{/key}
