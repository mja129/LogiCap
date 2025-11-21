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
    }: {
        gateType?: 'TunnelOutput'
        nodeId: string
        celltype: string
    } = $props();

    const width = 80;
    const height = 50;
</script>

<svg
    width={width}
    height={height}
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <polygon
        points="0,0 {width * 0.75},0 {width},{height / 2} {width * 0.75},{height} 0,{height}"
        fill="black"
    />
    <text
        x="5%"
        y="50%"
        text-anchor="start"
        alignment-baseline="middle"
        textLength="{width * 0.8}px"
        lengthAdjust="spacingAndGlyphs"
        font-size="200%"
        fill="white"
    >
        {celltype}
    </text>
</svg>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
    side="east"
    offset={[75, 20]}
    usePixelOffset={true}
/>
