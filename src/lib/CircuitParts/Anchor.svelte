
<!-- I completely refactored this for the new wiring system, idk how good this is-->
<script lang="ts" module>
    import { Anchor as SvelvetAnchor, type Direction } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import { getRunning } from '@CircuitEngine'

    // Calculates which way the wire should route out of the anchor
    function getDirection(offset: Direction, rotation: number) : Direction {
        let rot = rotation;
        switch (offset) {
            case 'north': rot += 90; break;
            case 'east': rot += 180; break;
            case 'south': rot += 270; break;
        }
        rot %= 360; 
        switch (rot) {
            case 0: return 'west';
            case 90: return 'north';
            case 180: return 'east';
            case 270: return 'south';
            default: return 'west';
        }
    }
</script>

<script lang="ts">
    import { getContext } from 'svelte'
    import { writable, type Writable } from 'svelte/store'

    let {
        io,
        ioId,
        id,
        side = 'west',
        offset = [],
        usePixelOffset = false,
        usePortName = false,
        position 
    }: {
        io: 'input' | 'output'
        ioId: string
        id: string
        side?: Direction
        offset?: [number, number] | []
        usePixelOffset?: boolean
        usePortName?: boolean
        position?: { x: number; y: number}
    } = $props()

    const anchorId = usePortName ? `${ioId}_${id}` :
        `${io === 'input' ? 'in' : 'out'}${ioId}_${id}` 

    // Grabbing the rotation from Circuit.svelte context safely
    let rotationStore = getContext<Writable<number>>('rotation');
    if (!rotationStore) {
        rotationStore = writable(0); // Failsafe if not wrapped in Circuit.svelte
    }

    // Wrapper div math
    const leftVal = position ? `${position.x}px` : (offset.length ? `${offset[0]}${usePixelOffset ? 'px' : '%'}` : '0px');
    const topVal = position ? `${position.y}px` : (offset.length ? `${offset[1]}${usePixelOffset ? 'px' : '%'}` : '0px');
</script>

<div 
    class="custom-anchor-positioner" 
    style="position:absolute; left: {leftVal}; top: {topVal};"
>
    <SvelvetAnchor
        let:linked
        let:hovering
        let:connecting
        id={anchorId}
        key={anchorId}
        direction={getDirection(side, $rotationStore)}
        output={io === 'output'}
        input={io === 'input'}
        locked={getRunning()}
    >
        <CustomAnchor {io} {connecting} {linked} {anchorId} {hovering} />
    </SvelvetAnchor>
</div>

<style>
    /* Forcing Svelvet's internal container to surrender its coordinates and respect MY math */
    :global(.custom-anchor-positioner > div) {
        top: 0 !important;
        left: 0 !important;
        transform: translate(-50%, -50%) !important; 
    }
</style>
