<script lang="ts">
    import { CircuitEngine, getRunning, wireSignals } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    
    // We still need the grid math for the anchor
    const anchorPosition = { x: -11, y: 33 };

    let { nodeId }: { nodeId: string } = $props()

    // 1. REACTIVE MAGIC: The Lamp just watches the store for its own ID!
    let signalOn = $derived($wireSignals[nodeId] === 1);

    // 2. The colors automatically update when signalOn changes
    let lampColor = $derived({
        fill: getRunning() ? (signalOn ? 'green' : 'red') : 'gray',
        stroke: getRunning() ? (signalOn ? 'var(--lime-green)' : 'var(--lime-red)') : 'lightgray',
    })

    const unsubscriber = CircuitEngine.subscribe((circuit) => {
        // We don't even need to reset signalOn here manually, 
        // because getRunning() handles the gray-out in the derived colors!
    });
    onDestroy(unsubscriber);
</script>

<svg
    width="66"
    height="66"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    class="LampSVG"
    style="display: block; overflow: visible; user-select: none; pointer-events: none;"
>
    <line x1="-11" y1="33" x2="11" y2="33" stroke={lampColor.stroke} stroke-width="4" stroke-linecap="round"/>
    <circle cx="33" cy="33" r="20" fill={lampColor.fill} stroke={lampColor.stroke} stroke-width="4"/>
    <circle cx="28" cy="27" r="6" fill="white" opacity="0.3" />
</svg>

<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    side="west"
    position={anchorPosition}
/>

<style>
    :global(.svelvet-node) {
        width: 0 !important;
        height: 0 !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
    }
</style>
