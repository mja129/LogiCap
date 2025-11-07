<script lang="ts" module>
    import { Anchor as SvelvetAnchor, type Direction } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { getRunning } from '@CircuitEngine'
    import { getContext, onMount } from 'svelte'
    import { writable, type Writable } from 'svelte/store'

    export let anchorRendererQ: Writable<Array<string>> = writable([]);

    type LocationX = 'left' | 'right' | 'center'
    type LocationY = 'top' | 'bot' | 'mid'
    type LocationTuple = [LocationX, LocationY]
    type portNames = `in${number}` | 'out' | 'in' | ''

    // TODO these functions should probably be elsewhere
    function getDirection(locationX: string, rotation: number) : Direction {
        if (locationX === 'right') {
            rotation = (rotation + 180) % 360; // invert
        }
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
    function getPortName(location: LocationTuple) : portNames {
        switch (location[0]) {
            case 'left':
                switch (location[1]) {
                    case 'top':
                        return 'in1';
                    case 'bot':
                        return 'in2';
                    case 'mid':
                        return 'in';
                }
            case 'right':
                return 'out';
            case 'center':
                // TODO this doesn't seem right
                return '';
        }
    }
</script>

<script lang="ts">
    let {
        location = ['left', 'top'],
        id,
        io,
        offset = [],
        connections,
    }: {
        location: LocationTuple
        id: string
        io: 'input' | 'output'
        offset?: [number, number] | []
        connections?: any
    } = $props()

    let portName: portNames = getPortName(location);
    const anchorId = `${portName}_${id}`
    const rotation: Writable<number> = getContext('rotation')

    /*
     * when a component's input anchors are rotated, the connection(s) to those input anchors are lost.
     * to rerender those connections, we must rerender the component(s) outputting the connection(s).
     * we use a list that stores the IDs of anchors that need to rerender themselves.
     * anchors are subscribed to this list so that they know when to rerender.
     */
    let updateTrigger = $state(false)
    let isProcessing = false
    onMount(() => {
        anchorRendererQ.subscribe((value) => {
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
    });
</script>

{#snippet anchor()}
    <div
        style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}
    >
        <SvelvetAnchor
            let:linked
            let:hovering
            let:connecting
            id={anchorId}
            key={anchorId}
            direction={getDirection(location[0], $rotation)}
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
