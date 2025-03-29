<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    let {
        width = 80,
        height = 50,
        nodeId,
    }: {
        width?: number
        height?: number
        nodeId: string
    } = $props()

    const lampOffset: [number, number] = [-5, 35.43]
</script>

<!-- cursor = drop -->
<svg
    width="85"
    height="65"
    viewBox="-12 0 95 100"
    xmlns="http://www.w3.org/2000/svg"
    class={'LampSVG'}
>
    <line
        x1="-50"
        x2="5"
        y1="45"
        y2="45"
        stroke={'lightgray'}
        stroke-width="8"
    />

    <!-- Circle -->
    <circle
        cx="50"
        cy="50"
        r="45"
        fill={'lightgray'}
        stroke={'gray'}
        stroke-width="7"
    />
</svg>

<SimulationNodeAnchor
    offset={lampOffset}
    location={['left', 'mid']}
    id={nodeId}
    io="input"
/>
