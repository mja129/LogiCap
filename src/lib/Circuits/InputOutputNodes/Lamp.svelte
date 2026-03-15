<script lang="ts">
    import { CircuitEngine, getRunning, wireSignals } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    
    // Exact same half-step math as your perfectly working Mux
    const anchorPosition = { x: -11, y: 33 };

    let { nodeId }: { nodeId: string } = $props()

    let signalOn = $derived($wireSignals[nodeId] === 1);

    let lampColor = $derived({
        fill: getRunning() ? (signalOn ? 'green' : 'red') : 'gray',
        stroke: getRunning() ? (signalOn ? 'var(--lime-green)' : 'var(--lime-red)') : 'lightgray',
    })

    const unsubscriber = CircuitEngine.subscribe((circuit) => {});
    onDestroy(unsubscriber);
</script>

<svg
    width="88"
    height="66"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible; display: block;"
>
    <line x1="-22" y1="33" x2="15" y2="33" stroke={lampColor.stroke} stroke-width="4" stroke-linecap="round"/>
    <circle cx="33" cy="33" r="20" fill={lampColor.fill} stroke={lampColor.stroke} stroke-width="4"/>
    <circle cx="28" cy="27" r="6" fill="white" opacity="0.3" />
</svg>

<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    position={anchorPosition}
/>
