<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'


    const anchorOffsets = {
        in0:  { x: 11, y: 33 },
        sel:  { x: 33, y: 99 },
        out0: { x: 55, y: 11 },
        out1: { x: 55, y: 55 },
    }
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()
</script>

<!-- SVG of the Demux -->
<svg
    width="88"
    height="88"
    viewBox="0 0 88 88"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <!-- Trapezoid body -->
    <polygon
        points="11,11 11,55 55,77 55,-11"
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
        x="38" y="11"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    >
        0
    </text>
    <!-- 1 Label -->
    <text
        x="40" y="55"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    >
        1
    </text>
</svg>

<!-- Anchor nodes: in0, sel, out0, out1 -->
<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    position={anchorOffsets.in0}
/>

<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    position={anchorOffsets.sel}
/>

<SimulationNodeAnchor
    io="output"
    ioId="1"
    id={nodeId}
    position={anchorOffsets.out0}
/>

<SimulationNodeAnchor
    io="output"
    ioId="2"
    id={nodeId}
    position={anchorOffsets.out1}
/>