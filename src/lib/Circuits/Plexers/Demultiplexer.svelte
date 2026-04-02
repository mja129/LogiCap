<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // Constant offsets for the anchors
    type DemuxAnchors = 'in0' | 'sel' | 'out0' | 'out1'

    const anchorOffsets: Record<DemuxAnchors, [number, number]> = {
        in0: [-6.5, 35],
        sel: [24.5, 95],
        out0: [53.75, 10],
        out1: [53.75, 60],
    }
</script>

<script lang="ts">
    let {
        nodeId
    }: {
        nodeId: string
    } = $props()
</script>

<!-- SVG of the Demux -->
<svg
    width="75"
    height="80"
    viewBox="-2 -2 100 120"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <!-- Trapezoid body -->
    <polygon
        points="60,0 0,15 0,85 60,100"
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
        x="37"
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
        x="39"
        y="80"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="30"
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
    side="west"
    offset={anchorOffsets['in0']}
/>

<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    offset={anchorOffsets['sel']}
/>

<SimulationNodeAnchor
    io="output"
    ioId="1"
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[
    ('out1_' + nodeId) as outputAnchorName
    ]}
    offset={anchorOffsets['out0']}
/>

<SimulationNodeAnchor
    io="output"
    ioId="2"
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[
        ('out2_' + nodeId) as outputAnchorName
    ]}
    offset={anchorOffsets['out1']}
/>