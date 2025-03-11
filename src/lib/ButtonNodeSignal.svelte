<script lang="ts">
    import { Node, Anchor, generateOutput } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import LogicGateAnchor from './LogicGateAnchor.svelte'
    import image from '../assets/svg/andgate.svg'

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

    let buttonColor = $derived(signalOn ? 'green' : 'red')

    // Define a new device
</script>

<!-- cursor = drop -->
<Node drop="cursor" id={nodeId}>
    <svg
        width="75"
        height="75"
        viewBox="0 0 100 200"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="lightgray"
            stroke="black"
            stroke-width="2"
        />
        <line
            x1="50"
            x2="200"
            y1="50"
            y2="50"
            stroke="black"
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
            fill={buttonColor}
            stroke="black"
            stroke-width="2"
        />
    </svg>

    <LogicGateAnchor
        offset={[95, 18]}
        location={['right', 'mid']}
        id={nodeId}
        io="output"
    />
</Node>
