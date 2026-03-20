<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    // Left side: D, clk
    const leftOffsets: Record<string, [number, number]> = {
        in:  [-7, 25],
        clk: [-7, 55],
    }
    // Top: en, set, aload (optional — uncomment when polarity is enabled)
    // const topOffsets: Record<string, [number, number]> = {
    //     en:    [35, -7],
    //     set:   [75, -7],
    //     aload: [115, -7],
    // }
    // Bottom: arst, srst, clr, ain (optional — uncomment when polarity is enabled)
    // const bottomOffsets: Record<string, [number, number]> = {
    //     arst: [25, 127],
    //     srst: [55, 127],
    //     clr:  [85, 127],
    //     ain:  [115, 127],
    // }
    // Right: Q
    const outputOffset: [number, number] = [107, 40];
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
    width="100"
    height="75"
    viewBox="0 0 100 75"
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Component body -->
    <rect
        x="5" y="5"
        width="90" height="65"
        fill="black"
        stroke={dffColor.stroke}
        stroke-width="2"
        rx="3"
    />

    <!-- Title -->
    <text x="50" y="20"
        text-anchor="middle" fill={dffColor.stroke}
        font-size="12" font-weight="bold">DFF</text>

    <!-- D label -->
    <text x="14" y="28" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">D</text>

    <!-- clk label -->
    <text x="20" y="58" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">clk</text>

    <!-- Clock triangle -->
    <polygon
        points="10,51 17,58 10,65"
        fill="none"
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />

    <!-- Top port labels (optional — uncomment when polarity is enabled) -->
    <!-- <text x="35" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">en</text>
    <text x="75" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">set</text>
    <text x="115" y="3" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">aload</text> -->

    <!-- Bottom port labels (optional — uncomment when polarity is enabled) -->
    <!-- <text x="25" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">arst</text>
    <text x="55" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">srst</text>
    <text x="85" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">clr</text>
    <text x="115" y="119" fill={dffColor.stroke}
        font-size="8" text-anchor="middle">ain</text> -->

    <!-- Q label -->
    <text x="82" y="43"
        text-anchor="end" fill={dffColor.stroke}
        font-size="10" dominant-baseline="middle">Q</text>

    <!-- Output wire stub -->
    <line
        x1="95" x2="120"
        y1="40" y2="40"
        stroke={dffColor.stroke}
        stroke-width="4"
    />

    <!-- Output state indicator -->
    <circle
        cx="80" cy="40" r="5"
        fill={dffColor.fill}
        stroke={dffColor.stroke}
        stroke-width="1.5"
    />
</svg>

<!-- D input -->
<SimulationNodeAnchor
    io="input" ioId="" id={nodeId}
    side="west" offset={leftOffsets['in']}
/>
<!-- clk input -->
<SimulationNodeAnchor
    io="input" ioId="clk" id={nodeId}
    side="west" offset={leftOffsets['clk']}
    usePortName={true}
/>

<!-- Top anchors: en, set, aload (optional — uncomment when polarity is enabled) -->
<!-- {#each Object.entries(topOffsets) as [port, offset]}
    <SimulationNodeAnchor
        io="input" ioId={port} id={nodeId}
        side="north" offset={offset}
        usePortName={true}
    />
{/each} -->

<!-- Bottom anchors: arst, srst, clr, ain (optional — uncomment when polarity is enabled) -->
<!-- {#each Object.entries(bottomOffsets) as [port, offset]}
    <SimulationNodeAnchor
        io="input" ioId={port} id={nodeId}
        side="south" offset={offset}
        usePortName={true}
    />
{/each} -->

<!-- Q output -->
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