<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    // Anchor positions for all ports
    // Left side: in, clk, arst, srst, en, set, clr, ain, aload
    // Right side: out
    const inputOffsets: Record<string, [number, number]> = {
        in:    [-7.5, 10],
        clk:   [-7.5, 30],
        arst:  [-7.5, 50],
        srst:  [-7.5, 70],
        en:    [-7.5, 90],
        set:   [-7.5, 110],
        clr:   [-7.5, 130],
        ain:   [-7.5, 150],
        aload: [-7.5, 170],
    }
    const outputOffset: [number, number] = [160, 90];
</script>

<script lang="ts">
    let {
        width = 140,
        height = 180,
        nodeId,
    }: {
        width?: number
        height?: number
        nodeId: string
    } = $props()

    let outputOn: boolean = $state(false);

    // Color reflects simulation state
    let dffColor = $derived({
        fill: getRunning() ? outputOn ? 'green' : 'red' : 'gray',
        stroke: getRunning() ? outputOn ? 'var(--lime-green)' : 'var(--lime-red)' : 'lightgray',
    })

    // Sync visual state with engine ticks
    const tickUnsub = tickSignal.subscribe((tick) => {
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

    // Reset on simulation stop
    const engineUnsub = CircuitEngine.subscribe((circuit) => {
        if (circuit === null) {
            outputOn = false;
        }
    });

    let connections = $derived(
        get(CircuitStore).connectors[('out_' + nodeId) as outputAnchorName]
    );

    onDestroy(() => {
        tickUnsub();
        engineUnsub();
    });

    // Port labels for rendering
    const inputPorts = ['in', 'clk', 'arst', 'srst', 'en', 'set', 'clr', 'ain', 'aload'];
</script>

<svg
    width={width}
    height={height}
    viewBox="-10 -5 {width + 40} {height + 10}"
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Component body -->
    <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="black"
        stroke={dffColor.stroke}
        stroke-width="2"
        rx="4"
    />

    <!-- Title -->
    <text x={width / 2} y="-8" text-anchor="middle"
        fill={dffColor.stroke} font-size="12" font-weight="bold">DFF</text>

    <!-- Input port labels -->
    {#each inputPorts as port, i}
        <text x="8" y={15 + i * 20} fill={dffColor.stroke}
            font-size="10" dominant-baseline="middle">{port}</text>
    {/each}

    <!-- Clock triangle symbol on clk input -->
    <polygon
        points="2,25 10,30 2,35"
        fill="none"
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />

    <!-- Output label -->
    <text x={width - 8} y={90} text-anchor="end" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">out</text>

    <!-- Output wire stub -->
    <line
        x1={width}
        x2={width + 25}
        y1="90"
        y2="90"
        stroke={dffColor.stroke}
        stroke-width="4"
    />

    <!-- Output indicator dot -->
    <circle
        cx={width - 15}
        cy="90"
        r="6"
        fill={dffColor.fill}
        stroke={dffColor.stroke}
        stroke-width="2"
    />
</svg>

<!-- Input anchors -->
{#each inputPorts as port, i}
    <SimulationNodeAnchor
        io="input"
        ioId={port === 'in' ? '' : port}
        id={nodeId}
        side="west"
        offset={inputOffsets[port]}
    />
{/each}

<!-- Output anchor -->
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    connections={connections}
    side="east"
    offset={outputOffset}
/>

<style>
    text {
        font-family: monospace;
        pointer-events: none;
    }
</style>