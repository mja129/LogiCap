<script lang="ts" module>
    import { get } from 'svelte/store'

    import { CircuitStore } from '@CircuitStore'

    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    const anchorDiameter = 15;
    const anchorPadding = 5;
</script>

<script lang="ts">
    let {
        nodeId,
        celltype,
        inputs,
        outputs
    }: {
        gateType?: 'Subcircuit'
        nodeId: string
        celltype: string
        inputs: number
        outputs: number
    } = $props();

    // calculate size, alignment from number of inputs/outputs
    const width = 100; // TODO should this change?
    const height = ((anchorDiameter + anchorPadding) * Math.max(inputs, outputs)) + anchorPadding;
    const inputOffset = ((height - ((anchorDiameter + anchorPadding) * inputs) + anchorPadding) / 2.0) + 1;
    const outputOffset = ((height - ((anchorDiameter + anchorPadding) * outputs) + anchorPadding) / 2.0) + 1;
</script>

<svg
    width={width}
    height={height}
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="black"
    />
    <text
        x="50%"
        y="50%"
        text-anchor="middle"
        alignment-baseline="middle"
        textLength="{width * 0.8}px"
        lengthAdjust="spacingAndGlyphs"
        font-size="200%"
        fill="white"
    >
        {celltype}
    </text>
</svg>

{#each { length: inputs } as _, index}
    <SimulationNodeAnchor
        io="input"
        ioId={(index + 1).toString()}
        id={nodeId}
        side="west"
        offset={[-7.5, inputOffset + ((anchorDiameter + anchorPadding) * index)]}
        usePixelOffset={true}
    />
{/each}
{#each { length: outputs } as _, index}
    <SimulationNodeAnchor
        io="output"
        ioId={(index + 1).toString()}
        id={nodeId}
        connections={get(CircuitStore).connectors[
            (`out${index+1}_` + nodeId) as outputAnchorName
        ]}
        side="east"
        offset={[width - 5, outputOffset + ((anchorDiameter + anchorPadding) * index)]}
        usePixelOffset={true}
    />
{/each}
