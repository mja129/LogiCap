<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning } from '@CircuitEngine'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    const buttonOffset: [number, number] = [95, 40.4];
</script>

<script lang="ts">
    let {
        width = 80,
        height = 50,
        nodeId,
    }: {
        width?: number
        height?: number
        nodeId: string
    } = $props()

    let signalOn: boolean = $state(false);

    let buttonColor = $derived({
        fill: getRunning() ? signalOn ? 'green' : 'red' : 'gray',
        stroke: getRunning() ? signalOn ? 'var(--lime-green)' : 'var(--lime-red)' : 'lightgray',
    })

    function toggleButton() {
        if (getRunning()) {
            signalOn = !signalOn;
            inputSetter(nodeId);
        }
    }

    CircuitEngine.subscribe((circuit) => {
        // Turn off buttons on simulation stop
        if (circuit === null) {
            signalOn = false;
            return;
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
        stroke={buttonColor.stroke}
        stroke-width="2"
    />
    <line
        x1="100"
        x2="190"
        y1="50"
        y2="50"
        stroke={buttonColor.stroke}
        stroke-width="8"
    />

    <!-- Circle -->
    <circle class="button-circle"
        onclick={toggleButton}
        role="presentation"
        cx="50"
        cy="50"
        r="30"
        aria-label="input button node toggle"
        fill={buttonColor.fill}
        stroke={buttonColor.stroke}
        stroke-width="7"
    />
</svg>

<SimulationNodeAnchor
    offset={buttonOffset}
    side="east"
    id={nodeId}
    io="output"
    ioId=""
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>

<style>
    :global(.running .button-circle:hover) {
        cursor: pointer;
    }
</style>
