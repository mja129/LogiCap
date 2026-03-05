<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    const anchorDiameter = 15;
    const anchorPadding = 5;
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
        nodeId,
        inputs,
        outputs
    }: {
        nodeId: string
        inputs: number
        outputs: number
    } = $props()

    //calculate size, alignment from number of inputs/outputs
    const width = 50;
    const height = 80;
    // const height = ((anchorDiameter + anchorPadding) * Math.max(inputs, outputs)) + anchorPadding;
    // const inputOffset = ((height - ((anchorDiameter + anchorPadding) * inputs) + anchorPadding) / 2.0) + 1;
    // const outputOffset = ((height - ((anchorDiameter + anchorPadding) * outputs) + anchorPadding) / 2.0) + 1;

</script>


<!-- SVG of the Encoder -->
<svg
    width={width}
    height={height}
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <!-- Box -->
    <rect
        x="0" y="0"
        width = {width}
        height = {height}
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
        x={width / 4}
        y={height / 3}
        text-anchor="start"
        dominant-baseline="middle"
        font-size="40"
        fill="white"
    >
        Pri
    </text>
</svg>

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

<!-- Dynamically size something based on something idk comment here awesome!! -->
{#each { length: inputs } as _, index}
    <SimulationNodeAnchor
        io="input"
        ioId={(index + 1).toString()}
        id={nodeId}
        side="west"
        offset={[-6.5, 30 + ((anchorDiameter + anchorPadding + 13.5) * index)]}
        usePixelOffset={true}
    />
{/each}
{#each { length: outputs-1 } as _, index}
    <SimulationNodeAnchor
        io="output"
        ioId={(index + 2).toString()}
        id={nodeId}
        connections={get(CircuitStore).connectors[
            (`out${index+2}_` + nodeId) as outputAnchorName
        ]}
        side="east"
        offset={[60, 30 + ((anchorDiameter + anchorPadding + 13.5) * (index+1))]}
        usePixelOffset={true}
    />
{/each}

