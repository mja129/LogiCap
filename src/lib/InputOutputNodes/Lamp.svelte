<script lang="ts">
    import { Node } from 'svelvet'
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'
    import { wireSignals } from '../circuitEngine.svelte'

    let {
        width = 80,
        height = 50,
        signalOn = false,
        canvasClicked = false,
        position = undefined,
        nodeId,
    }: {
        width: number
        height: number
        signalOn?: boolean
        canvasClicked: boolean
        position?: { x: number; y: number } | undefined
        nodeId: string
    } = $props()

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })
    // Define a new device

    const lampOffset: [number, number] = [-5, 35.43]

    wireSignals.subscribe((signal) => {
        let matchingWire = Object.keys(signal).find((wireId) =>
            wireId.includes(nodeId)
        )
        if (matchingWire) {
            if (signal[matchingWire] == 1) {
                signalOn = true
            } else {
                signalOn = false
            }
        } else {
            signalOn = false
        }
    })
</script>

<!-- cursor = drop -->
<Node drop={position !== undefined ? false : 'cursor'} {position} id={nodeId}>
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
