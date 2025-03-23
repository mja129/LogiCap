<script lang="ts">
    import { Node } from 'svelvet'
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'

    let {
        width = 80,
        height = 50,
        signalOn = false,
        position = undefined,
        connections = [],
        nodeId,
    }: {
        width: number
        height: number
        signalOn?: boolean
        position?: { x: number; y: number } | undefined
        connections: any
        nodeId: string
    } = $props()

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })
    // Define a new device

    const lampOffset: [number, number] = [-5, 35.43]

</script>

<!-- cursor = drop -->
<Node
    drop={position !== undefined ? false : 'cursor'}
    {connections}
    {position}
    id={nodeId}
>
    <svg
        width="85"
        height="65"
        viewBox="-12 0 95 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line
            x1="-50"
            x2="5"
            y1="45"
            y2="45"
            stroke={buttonColor.outlineColor}
            stroke-width="8"
        />

        <!-- Circle -->
        <circle
            cx="50"
            cy="50"
            r="45"
            fill={buttonColor.color}
            stroke={buttonColor.outlineColor}
            stroke-width="7"
        />
    </svg>

    <!-- FEATURE: Make the line draggable around the whole circle  -->
    <SimulationNodeAnchor
        offset={lampOffset}
        location={['left', 'mid']}
        id={nodeId}
        io="input"
    />
</Node>
