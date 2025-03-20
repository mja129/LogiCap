<script lang="ts">
    import { Node } from 'svelvet'
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'
    import { inputSetter } from '../circuitEngine.svelte'

    let {
        width = 80,
        height = 50,
        canvasClicked = false,
        position = undefined,
        nodeId,
    }: {
        width: number
        height: number
        canvasClicked: boolean
        position?: { x: number; y: number } | undefined
        nodeId: string
    } = $props()

    let signalOn: boolean = $state(false)

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })

    const buttonOffset: [number, number] = [95, 40.4]

    // Define a new device

    // pretty simple function
    // after a mouse down, if you start dragging, don't flip the signal
    // if after mousedown you get mouseUp, flip the signal
    // After you get either of them, both listeners are killed and created again on the next mousedown.
    function handleMouseDown(e: any) {
        e.preventDefault()

        let isDragging = false

        function handleMouseMove() {
            isDragging = true
            cleanup()
        }

        function handleMouseUp() {
            if (!isDragging) {
                // Flip the signal only if it was a click, not a drag
                // Side Effects!!
                signalOn = !signalOn
                inputSetter(nodeId)
            }
            cleanup()
        }

        function cleanup() {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }
</script>

<Node drop={position !== undefined ? false : 'cursor'} {position} id={nodeId}>
    <svg
        width="75"
        height="60"
        viewBox="-2 2 140 95"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="black"
            stroke={buttonColor.outlineColor}
            stroke-width="2"
        />
        <line
            x1="100"
            x2="190"
            y1="50"
            y2="50"
            stroke={buttonColor.outlineColor}
            stroke-width="8"
        />

        <!-- Circle -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <circle
            onmousedowncapture={handleMouseDown}
            cx="50"
            cy="50"
            r="30"
            aria-label="input button node toggle"
            fill={buttonColor.color}
            stroke={buttonColor.outlineColor}
            stroke-width="7"
        />
    </svg>

    <SimulationNodeAnchor
        offset={buttonOffset}
        location={['right', 'mid']}
        id={nodeId}
        io="output"
    />
</Node>
