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
    const width = 55;
    const height = 40 + (22.5 * inputs);
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
        x="10"
        y="19"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="150%"
        fill="white"
    >
        0
    </text>
    <!-- V-bit Label -->
    <text
        x="40"
        y="19"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="150%"
        fill="white"
    >
        V
    </text>
    <!-- Pri Label -->
    <text
        x=25%
        y=50%
        text-anchor="start"
        dominant-baseline="middle"
        font-size="200%"
        fill="white"
    >
        Pri
    </text>
</svg>

<!-- Dynamically size something based on something idk comment here awesome!! -->
 <!-- Inputs Nodes -->
{#each { length: inputs } as _, index}
    <SimulationNodeAnchor
        io="input"
        ioId={(index + 1).toString()}
        id={nodeId}
        side="west"
        offset={[-7.5, 13 + (25 * index)]}
        usePixelOffset={true}
    />
{/each}

<!-- Output Nodes -->
{#each { length: outputs } as _, index}
    <SimulationNodeAnchor
        io="output"
        ioId={(index + 1).toString()}
        id={nodeId}
        connections={get(CircuitStore).connectors[
            (`out${index+1}_` + nodeId) as outputAnchorName
        ]}
        side="east"
        offset={[50, 13 + (40 * index)]}
        usePixelOffset={true}
    />
{/each}

