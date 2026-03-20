<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // SVG is 80x90. Box body: x=5, y=12, w=70, h=66 (y:12->78)
    // cout prong goes up from y=12 to y=0 (top)
    // cin prong goes down from y=78 to y=90 (bottom)
    const anchorOffsets = {
        in1:  [-7, 33]  as [number, number], // west, upper third
        in2:  [-7, 68]  as [number, number], // west, lower third
        out:  [107, 50] as [number, number], // east, center
        cout: [50, -4]  as [number, number], // north, top of prong
        cin:  [50, 103] as [number, number], // south, bottom of prong
    }
</script>

<script lang="ts">
    let {
        nodeId,
    }: {
        nodeId: string
    } = $props()
</script>

<svg
    width="80"
    height="90"
    viewBox="0 0 80 90"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset;"
>
    <!-- cout prong (top) -->
    <line x1="40" y1="0" x2="40" y2="12" stroke="lightgray" stroke-width="2"/>
    <!-- cin prong (bottom) -->
    <line x1="40" y1="78" x2="40" y2="90" stroke="lightgray" stroke-width="2"/>

    <!-- Body -->
    <rect
        x="5" y="12"
        width="70" height="66"
        fill="black"
        stroke="lightgray"
        stroke-width="2"
        rx="2"
    />

    <!-- + symbol -->
    <text
        x="40" y="48"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="26"
        fill="white"
        font-family="monospace"
    >+</text>

    <!-- in1 label -->
    <text x="10" y="30" font-size="9" fill="lightgray" font-family="monospace" dominant-baseline="middle">in1</text>
    <!-- in2 label -->
    <text x="10" y="62" font-size="9" fill="lightgray" font-family="monospace" dominant-baseline="middle">in2</text>
    <!-- cout label -->
    <text x="44" y="6" font-size="7" fill="lightgray" font-family="monospace" dominant-baseline="middle">cout</text>
    <!-- cin label -->
    <text x="44" y="84" font-size="7" fill="lightgray" font-family="monospace" dominant-baseline="middle">cin</text>
</svg>

<!-- in1 input (west, upper) -->
<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in1']}
/>

<!-- in2 input (west, lower) -->
<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in2']}
/>

<!-- sum output (east) -->
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    connections={get(CircuitStore).connectors[('out_' + nodeId) as outputAnchorName]}
    offset={anchorOffsets['out']}
/>

<!-- cout output (north / top) -->
<SimulationNodeAnchor
    io="output"
    ioId="cout"
    id={nodeId}
    side="north"
    usePortName={true}
    connections={get(CircuitStore).connectors[('cout_' + nodeId) as outputAnchorName]}
    offset={anchorOffsets['cout']}
/>

<!-- cin input (south / bottom) -->
<SimulationNodeAnchor
    io="input"
    ioId="cin"
    id={nodeId}
    side="south"
    usePortName={true}
    offset={anchorOffsets['cin']}
/>
