<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    // Left side: D, clk
    const leftOffsets: Record<string, [number, number]> = {
        in:  [-7, 40],
        clk: [-7, 80],
    }
    // Top: en, set, aload
    const topOffsets: Record<string, [number, number]> = {
        en:    [35, -7],
        set:   [75, -7],
        aload: [115, -7],
    }
    // Bottom: arst, srst, clr, ain
    const bottomOffsets: Record<string, [number, number]> = {
        arst: [25, 127],
        srst: [55, 127],
        clr:  [85, 127],
        ain:  [115, 127],
    }
    // Right: Q
    const outputOffset: [number, number] = [157, 60];
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
</script>

<svg
    width="150"
    height="120"
    viewBox="0 0 150 120"
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Component body -->
    <rect
        x="5" y="5"
        width="140" height="110"
        fill="black"
        stroke={dffColor.stroke}
        stroke-width="2"
        rx="3"
    />

    <!-- Title -->
    <text x="75" y="22"
        text-anchor="middle" fill={dffColor.stroke}
        font-size="14" font-weight="bold">DFF</text>

    <!-- Left port labels -->
    <text x="16" y="43" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">D</text>
    <text x="20" y="83" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">clk</text>

    <!-- Clock triangle -->
    <polygon
        points="10,76 18,83 10,90"
        fill="none"
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />

    <!-- Top port labels -->
    <text x="35" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">en</text>
    <text x="75" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">set</text>
    <text x="115" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">aload</text>

    <!-- Bottom port labels -->
    <text x="25" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">arst</text>
    <text x="55" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">srst</text>
    <text x="85" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">clr</text>
    <text x="115" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">ain</text>

    <!-- Output label -->
    <text x="130" y="63"
        text-anchor="end" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">Q</text>

    <!-- Output wire stub -->
    <line
        x1="145" x2="170"
        y1="60" y2="60"
        stroke={dffColor.stroke}
        stroke-width="4"
    />

    <!-- Output state indicator -->
    <circle
        cx="125" cy="60" r="5"
        fill={dffColor.fill}
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />
</svg>

<!-- Left anchors: D and clk -->
<SimulationNodeAnchor
    io="input" ioId="" id={nodeId}
    side="west" offset={leftOffsets['in']}
/>
<SimulationNodeAnchor
    io="input" ioId="clk" id={nodeId}
    side="west" offset={leftOffsets['clk']}
/>

<!-- Top anchors: en, set, aload -->
{#each Object.entries(topOffsets) as [port, offset]}
    <SimulationNodeAnchor
        io="input" ioId={port} id={nodeId}
        side="north" offset={offset}
    />
{/each}

<!-- Bottom anchors: arst, srst, clr, ain -->
{#each Object.entries(bottomOffsets) as [port, offset]}
    <SimulationNodeAnchor
        io="input" ioId={port} id={nodeId}
        side="south" offset={offset}
    />
{/each}

<!-- Output anchor -->
<SimulationNodeAnchor
    io="output" ioId="" id={nodeId}
    connections={connections}
    side="east" offset={outputOffset}
/>

<style>
    text {
        font-family: monospace;
        pointer-events: none;
    }
</style>