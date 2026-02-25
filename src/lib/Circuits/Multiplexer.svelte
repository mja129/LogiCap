<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // Constant offsets for the anchors
    type MuxAnchors = 'in1' | 'in2' | 'out'

    const anchorOffsets: Record<MuxAnchors, [number, number]> = {
        in0: [-6.5, 10],
        in1: [-6.5, 60],
        sel: [24.5, 95],
        out: [53.75,35],
    }
</script>

<script lang="ts">
    let {
        nodeId
    }: {
        nodeId: string
    } = $props()
</script>

<!-- SVG of the Mux -->
<svg
    width="75"
    height="80"
    viewBox="-2 -2 100 120"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <!-- Trapezoid body -->
    <polygon
        points="0,0 60,15 60,85 0,100"
        fill="black"
        stroke="lightgray"
        stroke-width="1"
    />
    <!-- sel prong going down -->
    <rect
        x="27" y="95"
        width = "5"
        height = "80"
        stroke="lightgray"
        stroke-width="1"
    />
    <!-- 0 Label -->
    <text
        x="10"
        y="19.5"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="30"
        fill="white"
    >
        0
    </text>
    <!-- 1 Label -->
    <text
        x="10"
        y="80"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="30"
        fill="white"
    >
        1
    </text>
</svg>

<!-- Anchor nodes: in0, in1, sel, out -->
<SimulationNodeAnchor
    io="input"
    ioId="0"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in0']}
/>

<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in1']}
/>

<SimulationNodeAnchor
    io="input"
    ioId="sel"
    id={nodeId}
    side="south"
    offset={anchorOffsets['sel']}
    usePortName={true}
/>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
    offset={anchorOffsets['out']}
/>