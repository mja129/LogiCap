<script lang="ts">
    import { Node } from 'svelvet'
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'

    let {
        width = 80,
        height = 50,
        nodeStartPos,
        nodeId,
    }: {
        width: number
        height: number
        nodeStartPos: number
        nodeId: string
    } = $props()

    let signalOn: boolean = $state(false)

    let buttonColor = $derived({
        color: signalOn ? 'green' : 'red',
        outlineColor: signalOn ? 'var(--lime-green)' : 'var(--lime-red)',
    })

    // Define a new device
</script>

<Node drop="cursor" id={nodeId}>
    <svg
        width="75"
        height="75"
        viewBox="10 00 100 190"
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
            onclick={(e) => {
                e.preventDefault()
                e.stopImmediatePropagation()
                signalOn = !signalOn
            }}
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
        offset={[95, 19.63]}
        location={['right', 'mid']}
        id={nodeId}
        io="output"
    />
</Node>
