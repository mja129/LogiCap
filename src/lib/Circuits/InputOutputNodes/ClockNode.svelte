<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy, onMount, getContext, type Snippet } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    // Output anchor position — matches the line endpoint on the SVG
    const anchorOffset: [number, number] = [123, 42];
</script>

<script lang="ts">
    let {
        width = 88,
        height = 88,
        nodeId,
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

    // Sync visual state with engine ticks
    // DigitalJS handles the actual clock toggling internally
    const tickUnsub = tickSignal.subscribe((tick) => {
        if (!getRunning()) {
            signalOn = false;
            return;
        }
        const currEngine = get(CircuitEngine);
        if (currEngine) {
            try {
                const sig = currEngine.getLabelIndex().devices[nodeId].attributes.outputSignals.out._avec[0];
                signalOn = sig === 1;
            } catch {
                // device not ready yet
            }
        }
    });

    // Reset visual state when simulation stops
    const engineUnsub = CircuitEngine.subscribe((circuit) => {
        if (circuit === null) {
            signalOn = false;
        }
    });

    let connections = $derived(
        get(CircuitStore).connectors[('out_' + nodeId) as outputAnchorName]
    );

    onDestroy(() => {
        tickUnsub();
        engineUnsub();
    });
</script>

<svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible; display: block;"
>
    <!-- Component body -->
    <rect
        x="0"
        y="0"
        width="66"
        height="66"
        fill="black"
        stroke={buttonColor.stroke}
        stroke-width="2"
    />
    <!-- Output wire stub -->
    <line
        x1="66"
        y1="33"
        x2="99"
        y2="33"
        stroke={buttonColor.stroke}
        stroke-width="4"
    />

    <!-- Clock circle — click to manually toggle during simulation -->
    <circle class="button-circle"
        onclick={(e) => { e.stopPropagation(); toggleClock(); }}
        role="presentation"
        cx="33"
        cy="33"
        r="23"
        aria-label="clock node toggle"
        fill={buttonColor.fill}
        stroke={buttonColor.stroke}
        stroke-width="4"
    />

    <!-- Clock hour hand -->
    <line
        x1="33" y1="18" x2="33" y2="33"
        stroke={buttonColor.stroke}
        stroke-width="4"
        stroke-linecap="round"
    />
    <!-- Clock minute hand -->
    <line
        x1="33" y1="33" x2="45" y2="45"
        stroke={buttonColor.stroke}
        stroke-width="3"
        stroke-linecap="round"
    />
    <!-- Center dot -->
    <circle cx="33" cy="33" r="3" fill={buttonColor.stroke} />
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