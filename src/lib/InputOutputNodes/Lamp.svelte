<script lang="ts">
    import { Node } from 'svelvet'
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'

    let {
        width = 80,
        height = 50,
        nodeStartPos,
        signalOn = false,
        nodeId,
    }: {
        width: number
        height: number
        nodeStartPos: number
        signalOn?: boolean
        nodeId: string
    } = $props()

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })
    // Define a new device
</script>

<!-- cursor = drop -->
<Node drop="cursor" id={nodeId}>
    <svg
        width="85"
        height="85"
        viewBox="-50 0 200 100"
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
        offset={[-5, 41.8]}
        location={['left', 'mid']}
        id={nodeId}
        io="input"
    />
</Node>
