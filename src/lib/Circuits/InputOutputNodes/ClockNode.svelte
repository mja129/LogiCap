<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning, tickSignal } from '@CircuitEngine'
    import { onDestroy, getContext } from 'svelte'
    import { get, type Writable } from 'svelte/store'
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

    // Get selection state from parent Circuit.svelte
    const isSelected = getContext<Writable<boolean>>('selected');

    // Frequency menu input — initialized to current frequency
    let freqInput: number = $state(frequency);

    // Apply new frequency from the menu
    function applyFrequency() {
        frequency = freqInput;
    }

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

    <!-- Clock circle — click to manually toggle during simulation -->
    <circle class="button-circle"
        onclick={(e) => { e.stopPropagation(); toggleClock(); }}
        role="presentation"
        cx="50"
        cy="50"
        r="30"
        aria-label="clock node toggle"
        fill={buttonColor.fill}
        stroke={buttonColor.stroke}
        stroke-width="7"
    />

    <!-- Clock hour hand -->
    <line
        x1="50" y1="50" x2="50" y2="30"
        stroke={buttonColor.stroke}
        stroke-width="4"
        stroke-linecap="round"
    />
    <!-- Clock minute hand -->
    <line
        x1="50" y1="50" x2="65" y2="50"
        stroke={buttonColor.stroke}
        stroke-width="3"
        stroke-linecap="round"
    />
    <!-- Center dot -->
    <circle cx="50" cy="50" r="3" fill={buttonColor.stroke} />
</svg>

<!-- Frequency menu appears above the clock when selected -->
{#if $isSelected}
    <div class="clock-context-menu" onclick={(e) => e.stopPropagation()}>
        <label>
            Frequency (ticks):
            <input
                type="number"
                min="1"
                bind:value={freqInput}
            />
        </label>
        <button onclick={applyFrequency}>Apply</button>
    </div>
{/if}

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

    /* Frequency menu — floats above the clock when selected */
    .clock-context-menu {
        position: absolute;
        top: -60px;
        left: 0;
        z-index: 100;
        background: var(--lightblue, #2a2a2a);
        border: 2px solid black;
        border-radius: 6px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 150px;
    }
    .clock-context-menu input {
        width: 60px;
        margin-left: 4px;
    }
    .clock-context-menu button {
        cursor: pointer;
        padding: 2px 8px;
    }
</style>