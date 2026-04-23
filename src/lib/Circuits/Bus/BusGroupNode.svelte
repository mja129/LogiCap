<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // groups: array of bit-widths per input slot, e.g. [1,1,1,1] for 4×1-bit inputs.
    // Each input slot i gets port name "in{i}" in DigitalJS.
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
    // N=2 uses 3 rows so the bus output lands on its own center grid row (y=33),
    // separate from both input rows (y=11, y=55). For N>2 one row per input.
    const svgH = $derived(groups.length === 2 ? 3 * GRID : groups.length * GRID)
    // Pin spacing: for N=2 spread inputs across the outer two rows (skip the center).
    const pinSpacing = $derived(groups.length === 2 ? 2 * GRID : GRID)
    const outY = $derived(Math.round((svgH / 2 - HALF) / GRID) * GRID + HALF)
</script>

<svg
    width={svgW}
    height={svgH}
    viewBox="0 0 {svgW} {svgH}"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow:visible; display:block; max-width:unset;"
>
    <!-- Input stubs -->
    {#each groups as _, i}
        {@const y = HALF + i * pinSpacing}
        <line x1="-22" y1={y} x2="5" y2={y} stroke="lightgray" stroke-width="2"/>
    {/each}

    <!-- Output stub -->
    <line x1={svgW - 5} y1={outY} x2={svgW + 22} y2={outY} stroke="lightgray" stroke-width="4" stroke-linecap="round"/>

    <!-- Body -->
    <rect x="5" y="5" width={svgW - 10} height={svgH - 10}
          fill="black" stroke="lightgray" stroke-width="2" rx="2"/>

    <!-- Label -->
    <text
        x={svgW / 2} y={svgH / 2}
        text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="white" font-family="monospace"
    >BUS+</text>
</svg>

<!-- Input anchors: one per group slot, port name "in{i}" -->
{#each groups as _, i}
    <SimulationNodeAnchor
        io="input"
        ioId={String(i)}
        id={nodeId}
        side="west"
        position={{ x: -11, y: HALF + i * pinSpacing }}
    />
{/each}

<!-- Output anchor: port name "out" -->
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={{ x: svgW + 11, y: outY }}
/>
