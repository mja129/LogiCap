<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // The mathematically perfect absolute coordinates from the top-left (0,0) of the node.
    // Every value MUST end in 11, 33, 55, 77, or 99 to match the HALF offset of the wire grid.
    const anchorOffsets = {
        in0: { x: 11, y: 11 },   // Left side, top grid cell
        in1: { x: 11, y: 55 },   // Left side, bottom grid cell
        sel: { x: 33, y: 99 },    // Bottom middle
        out: { x: 55, y: 33 },    // Right side, middle grid cell
    }
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()
</script>

<svg
    width="88"
    height="88"
    viewBox="0 0 88 88"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <!-- Trapezoid Body -->
    <polygon
        points="11,-11 11,77 55,55 55,11"
        fill="black" stroke="lightgray"
        stroke-width="2"
    />
    <!-- sel prong going down -->
    <rect
        x="32" y="66"
        width="3" height="33"
        fill="lightgray"
        stroke-width="1"
    />
    <!-- 0 Label -->
    <text
        x="22" y="11"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    > 0 
    </text>
    <!-- 1 Label -->
    <text
        x="24" y="55"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    > 1 
    </text>
</svg>

<SimulationNodeAnchor
    io="input"
    ioId="0"
    id={nodeId}
    position={anchorOffsets.in0}
/>

<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    position={anchorOffsets.in1}
/>

<SimulationNodeAnchor
    io="input"
    ioId="sel"
    id={nodeId}
    position={anchorOffsets.sel}
    usePortName={true}
/>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    position={anchorOffsets.out}
/>