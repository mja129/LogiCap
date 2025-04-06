<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning } from '@CircuitEngine'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    // import Switch from './Switch.svelte'

    let {
        width = 80,
        height = 50,
        nodeId,
    }: {
        width?: number
        height?: number
        nodeId: string
    } = $props()

    let signalOn: boolean = $state(false)

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })

    const buttonOffset: [number, number] = [95, 40.4]

    // after a mouse down, if you start dragging, don't flip the signal
    // if after mousedown you get mouseUp, flip the signal
    // After you get either of them, both listeners are killed and created again on the next mousedown.
    function toggleButton(e: MouseEvent) {
        e.preventDefault()
        // e.stopImmediatePropagation()

        let isDragging = false
        const startX = e.clientX
        const startY = e.clientY
        const dragThreshold = 5 // Allow for small movements while clicking

        function handleMouseMove(moveEvent: MouseEvent) {
            const distanceX = moveEvent.clientX - startX
            const distanceY = moveEvent.clientY - startY
            // euclidian distance
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

            if (distance > dragThreshold) {
                isDragging = true
                cleanup()
            }
        }

        function handleMouseUp() {
            if (!isDragging && getRunning()) {
                // Flip the signal only if it was a click, not a drag, and its on
                console.log(getRunning())
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

    CircuitEngine.subscribe((digitalJsCircuit) => {
        //Turn off buttons on stop
        if (digitalJsCircuit === null) {
            signalOn = false
            return
        }
    })
</script>

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
    <circle
        onmousedowncapture={toggleButton}
        role="presentation"
        cx="50"
        cy="50"
        r="30"
        aria-label="input button node toggle"
        fill={buttonColor.color}
        stroke={buttonColor.outlineColor}
        stroke-width="7"
    />
</svg>
<!-- <Switch signalOn {toggleButton} /> -->

<SimulationNodeAnchor
    offset={buttonOffset}
    location={['right', 'mid']}
    id={nodeId}
    io="output"
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>
