<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { getRunning } from '@CircuitEngine'

    /**
     * GRID MATH:
     * Node is 66x66. Output pin exits east.
     * Anchor x: 91 aligns to next vertical grid dot.
     * Anchor y: 33 (vertically centered).
     */
    const anchorPosition = { x: 91, y: 33 };
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()

    let color = $derived({
        stroke: getRunning() ? 'var(--lime-red)' : 'lightgray',
    })
</script>

<svg
    width="66"
    height="66"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible; display: block;"
>
    <rect
        x="0"
        y="0"
        width="66"
        height="66"
        fill="black"
        stroke={color.stroke}
        stroke-width="2"
    />

    <!-- Ground symbol: vertical stem down from center, then three bars (wide to narrow) -->
    <line x1="33" y1="33" x2="33" y2="42" stroke={color.stroke} stroke-width="4" />
    <line x1="9"  y1="42" x2="57" y2="42" stroke={color.stroke} stroke-width="4" />
    <line x1="17" y1="50" x2="49" y2="50" stroke={color.stroke} stroke-width="4" />
    <line x1="25" y1="58" x2="41" y2="58" stroke={color.stroke} stroke-width="4" />

    <!-- Output wire stub east -->
    <line
        x1="33"
        y1="33"
        x2="88"
        y2="33"
        stroke={color.stroke}
        stroke-width="4"
    />
</svg>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={anchorPosition}
/>

<style>
    :global(.svelvet-node) {
        width: 0 !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
    }
</style>
