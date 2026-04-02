<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    const anchorPosition = { x: -11, y: 77 }
    const HIGH = '#03c03c'
    const LOW  = '#3c3c3c'
</script>

<script lang="ts">
    let { nodeId }: { nodeId: string } = $props()

    // bits[0]=g (LSB), bits[1]=f, bits[2]=e, bits[3]=d,
    // bits[4]=c, bits[5]=b, bits[6]=a, bits[7]=dp (MSB)
    let bits = $state<number[]>(Array(8).fill(0))

    let seg = $derived({
        a:  getRunning() && bits[6] === 1 ? HIGH : LOW,
        b:  getRunning() && bits[5] === 1 ? HIGH : LOW,
        c:  getRunning() && bits[4] === 1 ? HIGH : LOW,
        d:  getRunning() && bits[3] === 1 ? HIGH : LOW,
        e:  getRunning() && bits[2] === 1 ? HIGH : LOW,
        f:  getRunning() && bits[1] === 1 ? HIGH : LOW,
        g:  getRunning() && bits[0] === 1 ? HIGH : LOW,
        dp: getRunning() && bits[7] === 1 ? HIGH : LOW,
    })

    let wireStroke = $derived(getRunning() ? '#aaaaaa' : 'lightgray')
    let bodyStroke = $derived(getRunning() ? '#888888' : '#555555')

    const tickUnsub = tickSignal.subscribe((_tick) => {
        if (!getRunning()) {
            bits = Array(8).fill(0)
            return
        }
        const currEngine = get(CircuitEngine)
        if (currEngine) {
            try {
                const sig = currEngine.getLabelIndex().devices[nodeId].attributes.inputSignals.in
                bits = Array.from({ length: 8 }, (_, i) => sig.get(i) === 1 ? 1 : 0)
            } catch {
                // device not ready yet
            }
        }
    })

    const engineUnsub = CircuitEngine.subscribe((circuit) => {
        if (circuit === null) bits = Array(8).fill(0)
    })

    onDestroy(() => {
        tickUnsub()
        engineUnsub()
    })
</script>

<!--
    Segment layout (Wikipedia standard):
     _
    |_|
    |_|  .

    Bit mapping (MSB → LSB): dp, a, b, c, d, e, f, g
-->
<svg
    width="88"
    height="132"
    viewBox="0 0 88 132"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow:visible; display:block;"
>
    <!-- Input wire stub -->
    <line x1="-22" y1="77" x2="5" y2="77"
          stroke={wireStroke} stroke-width="4" stroke-linecap="round"/>

    <!-- Display body background -->
    <rect x="4" y="5" width="80" height="122"
          fill="#1a1a1a" stroke={bodyStroke} stroke-width="2" rx="3"/>

    <!-- Segment a — top horizontal -->
    <polygon points="13,18 19,12 55,12 61,18 55,24 19,24" fill={seg.a}/>
    <!-- Segment b — upper right vertical -->
    <polygon points="61,18 67,24 67,60 61,66 55,60 55,24" fill={seg.b}/>
    <!-- Segment c — lower right vertical -->
    <polygon points="61,66 67,72 67,108 61,114 55,108 55,72" fill={seg.c}/>
    <!-- Segment d — bottom horizontal -->
    <polygon points="61,114 55,120 19,120 13,114 19,108 55,108" fill={seg.d}/>
    <!-- Segment e — lower left vertical -->
    <polygon points="13,114 7,108 7,72 13,66 19,72 19,108" fill={seg.e}/>
    <!-- Segment f — upper left vertical -->
    <polygon points="13,66 7,60 7,24 13,18 19,24 19,60" fill={seg.f}/>
    <!-- Segment g — middle horizontal -->
    <polygon points="13,66 19,60 55,60 61,66 55,72 19,72" fill={seg.g}/>
    <!-- Decimal point -->
    <circle cx="74.8" cy="113.4" r="6.6" fill={seg.dp}/>
</svg>

<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    position={anchorPosition}
/>
