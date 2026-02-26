<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // Constant offsets for the anchors
    // type MuxAnchors = 'in1' | 'in2' | 'out'

    // const anchorOffsets: Record<MuxAnchors, [number, number]> = {
    //     in0: [-6.5, 10],
    //     in1: [-6.5, 60],
    //     sel: [24.5, 95],
    //     out: [53.75,35],
    // }
</script>

<script lang="ts">
    let {
        nodeId
    }: {
        nodeId: string
    } = $props()
</script>

<!-- SVG of the Encoder -->
<svg
    width="100"
    height="200"
    viewBox="-2 -2 140 235"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <!-- Box -->
    <rect
        x="0" y="0"
        width = "90"
        height = "130"
        stroke="lightgray"
        stroke-width="1"
    />

    <!-- 0 Label -->
    <text
        x="12"
        y="25"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="30"
        fill="white"
    >
        0
    </text>
    <!-- V-bit Label -->
    <text
        x="62"
        y="27.5"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="35"
        fill="white"
    >
        V
    </text>
    <!-- Pri Label -->
    <text
        x="23"
        y="70"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="40"
        fill="white"
    >
        Pri
    </text>
</svg>


<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    offset={[-6.5,14.5]}
/>

<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    offset={[-6.5,42.5]}
/>

<!-- Valid bit -->
<SimulationNodeAnchor
    io="output"
    ioId="1"
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[
        ('out1_' + nodeId) as outputAnchorName
    ]}
    offset={[60,15]}
/>

<SimulationNodeAnchor
    io="output"
    ioId="2"
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[
        ('out2_' + nodeId) as outputAnchorName
    ]}
    offset={[60,28.5]}
/>