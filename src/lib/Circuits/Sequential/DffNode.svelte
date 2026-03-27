<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    // SVG is 88x66. Body: x=5, y=5, w=78, h=56.
    // All anchor positions are at HALF + n*GRID_SIZE (11 + n*22) for grid alignment.
    // y=11 → grid row 0, y=33 → grid row 1 (matches old clk grid row), y=99 → right edge
    const anchorPositions = {
        in:  { x: -11, y: 11 }, // D input, west upper
        clk: { x: -11, y: 33 }, // Clock input, west center (grid row 1 — same as before)
        out: { x: 99,  y: 33 }, // Q output, east center
    }
</script>

<script lang="ts">
    let {
        nodeId,
    }: {
        nodeId: string
    } = $props()

    let outputOn: boolean = $state(false);

    let dffColor = $derived({
        fill: getRunning() ? outputOn ? 'green' : 'red' : 'gray',
        stroke: getRunning() ? outputOn ? 'var(--lime-green)' : 'var(--lime-red)' : 'lightgray',
    })

    const tickUnsub = tickSignal.subscribe((_tick) => {
        if (!getRunning()) {
            outputOn = false;
            return;
        }
        const currEngine = get(CircuitEngine);
        if (currEngine) {
            try {
                const sig = currEngine.getLabelIndex().devices[nodeId].attributes.outputSignals.out._avec[0];
                outputOn = sig === 1;
            } catch {
                // device not ready yet
            }
        }
    });

    const engineUnsub = CircuitEngine.subscribe((circuit) => {
        if (circuit === null) {
            outputOn = false;
        }
    });

    onDestroy(() => {
        tickUnsub();
        engineUnsub();
    });
</script>

<svg
    width="88"
    height="66"
    viewBox="0 0 88 66"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow:visible;"
>
    <!-- Component body -->
    <rect
        x="5" y="5"
        width="78" height="56"
        fill="black"
        stroke={dffColor.stroke}
        stroke-width="2"
        rx="3"
    />

    <!-- D stub (left, upper) -->
    <line x1="0" y1="11" x2="5" y2="11" stroke={dffColor.stroke} stroke-width="2"/>
    <!-- clk stub (left, center) -->
    <line x1="0" y1="33" x2="5" y2="33" stroke={dffColor.stroke} stroke-width="2"/>
    <!-- Q stub (right) -->
    <line x1="83" y1="33" x2="88" y2="33" stroke={dffColor.stroke} stroke-width="4"/>

    <!-- Title -->
    <text x="44" y="12"
        text-anchor="middle" fill={dffColor.stroke}
        font-size="12" font-weight="bold">DFF</text>

    <!-- D label -->
    <text x="14" y="14" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">D</text>

    <!-- Clock triangle (centered on clk at y=33) -->
    <polygon
        points="5,26 12,33 5,40"
        fill="none"
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />

    <!-- clk label -->
    <text x="20" y="33" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">clk</text>

    <!-- Q label -->
    <text x="74" y="33"
        text-anchor="end" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">Q</text>

    <!-- Output state indicator -->
    <circle
        cx="72" cy="33" r="5"
        fill={dffColor.fill}
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />
</svg>

<!-- D input -->
<SimulationNodeAnchor
    io="input" ioId="" id={nodeId}
    side="west" position={anchorPositions['in']}
/>
<!-- clk input -->
<SimulationNodeAnchor
    io="input" ioId="clk" id={nodeId}
    side="west" position={anchorPositions['clk']}
    usePortName={true}
/>

<!-- Q output -->
<SimulationNodeAnchor
    io="output" ioId="" id={nodeId}
    side="east" position={anchorPositions['out']}
/>

<style>
    text {
        font-family: monospace;
        pointer-events: none;
    }
</style>
