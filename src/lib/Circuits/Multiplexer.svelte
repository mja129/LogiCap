<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // The mathematically perfect absolute coordinates from the top-left (0,0) of the node.
    // Every value MUST end in 11, 33, 55, 77, or 99 to match the HALF offset of the wire grid.
    const anchorOffsets = {
        in0: { x: -11, y: 11 },   // Left side, top grid cell
        in1: { x: -11, y: 55 },   // Left side, bottom grid cell
        sel: { x: 33, y: 77 },    // Bottom middle
        out: { x: 99, y: 33 },    // Right side, middle grid cell
    }
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()
</script>

<svg
    width="88"
    height="66"
    viewBox="0 0 88 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <polygon
        points="0,0 66,22 66,44 0,66"
        fill="black"
        stroke="lightgray"
        stroke-width="2"
    />
    
    <line x1="0" y1="11" x2="-11" y2="11" stroke="lightgray" stroke-width="2"/>
    <line x1="0" y1="55" x2="-11" y2="55" stroke="lightgray" stroke-width="2"/>
    <line x1="66" y1="33" x2="99" y2="33" stroke="lightgray" stroke-width="2"/>
    <line x1="33" y1="55" x2="33" y2="77" stroke="lightgray" stroke-width="2"/>

    <text x="8" y="14" fill="white" font-size="12" dominant-baseline="middle">0</text>
    <text x="8" y="58" fill="white" font-size="12" dominant-baseline="middle">1</text>
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