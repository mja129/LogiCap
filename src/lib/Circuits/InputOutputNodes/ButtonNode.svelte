<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning } from '@CircuitEngine'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import { rejectMoveClick } from '@Util/cursors.ts'
    // import Switch from './Switch.svelte'

    let {
        width = 80,
        height = 50,
        nodeId,
        rotation = $bindable(),
    }: {
        width?: number
        height?: number
        nodeId: string
        rotation?: number
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
    function buttonSwitch() {
        if (getRunning()) {
            // Flip the signal only if it was a click, not a drag, and its on
            // console.log(getRunning())
            signalOn = !signalOn
            inputSetter(nodeId)
        }
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
        onmousedowncapture={(e: MouseEvent) => rejectMoveClick(e, buttonSwitch)}
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

{#key rotation}
    <SimulationNodeAnchor
        offset={buttonOffset}
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        connections={get(CircuitStore).connectors[
            ('out_' + nodeId) as outputAnchorName
        ]}
    />
{/key}
