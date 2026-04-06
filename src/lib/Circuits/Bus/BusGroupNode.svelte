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
    const svgW = 66
    // Height: one grid cell per input, anchored at half-grid steps
    const svgH = $derived(groups.length * GRID)
    // Snap output to the nearest half-grid row (N*22+11) so wire endpoints align.
    // For even input counts, svgH/2 lands on a full-grid position which is 11px
    // away from any wire snap point — snapping to HALF-grid fixes that.
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
        {@const y = GRID / 2 + i * GRID}
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
        position={{ x: -11, y: GRID / 2 + i * GRID }}
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
