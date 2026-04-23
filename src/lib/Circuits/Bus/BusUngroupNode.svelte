<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // groups: array of bit-widths per output slot, e.g. [1,1,1,1] for 4×1-bit outputs.
    // Each output slot i gets port name "out{i}" in DigitalJS.
    let {
        nodeId,
        groups = [1, 1],
    }: {
        nodeId: string
        groups?: number[]
    } = $props()

    const GRID = 22
    const HALF = 11
    const svgW = 88
    const svgH = $derived(groups.length === 2 ? 3 * GRID : groups.length * GRID)
    const pinSpacing = $derived(groups.length === 2 ? 2 * GRID : GRID)
    const inY = $derived(Math.round((svgH / 2 - HALF) / GRID) * GRID + HALF)
</script>

<svg
    width={svgW}
    height={svgH}
    viewBox="0 0 {svgW} {svgH}"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow:visible; display:block; max-width:unset;"
>
    <!-- Input stub (bus wire, thicker) -->
    <line x1="-22" y1={inY} x2="5" y2={inY} stroke="lightgray" stroke-width="4" stroke-linecap="round"/>

    <!-- Output stubs -->
    {#each groups as _, i}
        {@const y = HALF + i * pinSpacing}
        <line x1={svgW - 5} y1={y} x2={svgW + 22} y2={y} stroke="lightgray" stroke-width="2"/>
    {/each}

    <!-- Body -->
    <rect x="5" y="5" width={svgW - 10} height={svgH - 10}
          fill="black" stroke="lightgray" stroke-width="2" rx="2"/>

    <!-- Label -->
    <text
        x={svgW / 2} y={svgH / 2}
        text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="white" font-family="monospace"
    >BUS-</text>
</svg>

<!-- Input anchor: port name "in" -->
<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    side="west"
    position={{ x: -11, y: inY }}
/>

<!-- Output anchors: io="output" + ioId="0" → anchorId "out0_<id>", matching DigitalJS port "out0" -->
{#each groups as _, i}
    <SimulationNodeAnchor
        io="output"
        ioId={String(i)}
        id={nodeId}
        side="east"
        position={{ x: svgW + 11, y: HALF + i * pinSpacing }}
    />
{/each}
