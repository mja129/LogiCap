<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // SVG is 66x66. Body: x=5, y=5, w=56, h=56.
    // All anchor positions are at HALF + n*GRID_SIZE (11 + n*22) for grid alignment.
    const anchorPositions = {
        in1:  { x: -11, y: 11 }, // west, upper
        in2:  { x: -11, y: 55 }, // west, lower
        out:  { x: 99,  y: 33 }, // east, center
        cout: { x: 33,  y: -11 }, // north
        cin:  { x: 33,  y: 77 },  // south
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
    width="88"
    height="66"
    viewBox="0 0 88 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <!-- cout prong (top) -->
    <line x1="33" y1="0" x2="33" y2="5" stroke="lightgray" stroke-width="2"/>
    <!-- cin prong (bottom) -->
    <line x1="33" y1="61" x2="33" y2="66" stroke="lightgray" stroke-width="2"/>
    <!-- in1 stub (left, upper) -->
    <line x1="0" y1="11" x2="5" y2="11" stroke="lightgray" stroke-width="2"/>
    <!-- in2 stub (left, lower) -->
    <line x1="0" y1="55" x2="5" y2="55" stroke="lightgray" stroke-width="2"/>
    <!-- out stub (right) -->
    <line x1="83" y1="33" x2="88" y2="33" stroke="lightgray" stroke-width="2"/>

    <!-- Body -->
    <rect
        x="5" y="5"
        width="78" height="56"
        fill="black"
        stroke="lightgray"
        stroke-width="2"
        rx="2"
    />

    <!-- + symbol -->
    <text
        x="44" y="33"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="26"
        fill="white"
        font-family="monospace"
    >+</text>

    <!-- in1 label -->
    <text x="8" y="11" font-size="9" fill="lightgray" font-family="monospace" dominant-baseline="middle">in1</text>
    <!-- in2 label -->
    <text x="8" y="55" font-size="9" fill="lightgray" font-family="monospace" dominant-baseline="middle">in2</text>
    <!-- cout label -->
    <text x="36" y="3" font-size="7" fill="lightgray" font-family="monospace" dominant-baseline="middle">cout</text>
    <!-- cin label -->
    <text x="36" y="63" font-size="7" fill="lightgray" font-family="monospace" dominant-baseline="middle">cin</text>
</svg>

<!-- in1 input (west, upper) -->
<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    position={anchorPositions['in1']}
/>

<!-- in2 input (west, lower) -->
<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    position={anchorPositions['in2']}
/>

<!-- sum output (east) -->
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={anchorPositions['out']}
/>

<!-- cout output (north / top) -->
<SimulationNodeAnchor
    io="output"
    ioId="cout"
    id={nodeId}
    side="north"
    usePortName={true}
    position={anchorPositions['cout']}
/>

<!-- cin input (south / bottom) -->
<SimulationNodeAnchor
    io="input"
    ioId="cin"
    id={nodeId}
    side="south"
    usePortName={true}
    position={anchorPositions['cin']}
/>
