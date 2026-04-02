<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { getRunning } from '@CircuitEngine'

    /**
     * GRID MATH:
     * Node is 66x66. Output pin exits east.
     * Anchor x: 91 (66 + 11 + 14) aligns to next vertical grid dot.
     * Anchor y: 33 (vertically centered).
     */
    const anchorPosition = { x: 91, y: 33 };
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()

    let color = $derived({
        fill: getRunning() ? 'green' : 'gray',
        stroke: getRunning() ? 'var(--lime-green)' : 'lightgray',
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

    <!-- Power symbol: right-pointing triangle (VCC, constant 1) -->
    <polygon
        points="8,10 8,56 55,33"
        fill={color.fill}
        stroke={color.stroke}
        stroke-width="2"
    />

    <!-- Output wire stub -->
    <line
        x1="55"
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
