<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning, getCurrTick } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    // Output anchor position — matches the line endpoint on the SVG
    const anchorOffset: [number, number] = [95, 40.4];
</script>

<script lang="ts">
    let {
        width = 80,
        height = 50,
        nodeId,
        frequency = 1, // how many ticks between each toggle
    }: {
        width?: number
        height?: number
        nodeId: string
        frequency?: number
    } = $props()

    let signalOn: boolean = $state(false);

    // Color reflects simulation state: gray when idle, green/red when running
    let buttonColor = $derived({
        fill: getRunning() ? signalOn ? 'green' : 'red' : 'gray',
        stroke: getRunning() ? signalOn ? 'var(--lime-green)' : 'var(--lime-red)' : 'lightgray',
    })

    // Manual toggle — allows clicking the clock to flip it mid-simulation
    function toggleClock() {
        if (getRunning()) {
            signalOn = !signalOn;
            inputSetter(nodeId);
        }
    }

    // Watch the circuit engine for start/stop and auto-toggle on ticks
    const unsubscriber = CircuitEngine.subscribe((circuit) => {
        // Reset clock state when simulation stops
        if (circuit === null) {
            signalOn = false;
            return;
        }

        // Auto-toggle: flip the signal every `frequency` ticks
        const tick = getCurrTick();
        if (tick > 0 && tick % frequency === 0) {
            toggleClock();
        }
    });

    let connections = $derived(
    get(CircuitStore).connectors[('out_' + nodeId) as outputAnchorName]
);
    onDestroy(unsubscriber);

    
</script>

<svg
    width="75"
    height="60"
    viewBox="-2 2 140 95"
    xmlns="http://www.w3.org/2000/svg"
>
    <!-- Component body -->
    <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="black"
        stroke={buttonColor.stroke}
        stroke-width="2"
    />
    <!-- Output wire stub -->
    <line
        x1="100"
        x2="190"
        y1="50"
        y2="50"
        stroke={buttonColor.stroke}
        stroke-width="8"
    />

    <!-- Clickable circle — also allows manual override during simulation -->
    <circle class="button-circle"
        onclick={toggleClock}
        role="presentation"
        cx="50"
        cy="50"
        r="30"
        aria-label="clock node toggle"
        fill={buttonColor.fill}
        stroke={buttonColor.stroke}
        stroke-width="7"
    />
</svg>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    connections={connections}
    side="east"
    offset={anchorOffset}
/>

<style>
    :global(.running .button-circle:hover) {
        cursor: pointer;
    }
</style>