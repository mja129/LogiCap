<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { CircuitEngine, inputSetter, getRunning } from '@CircuitEngine'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'

    /**
     * GRID MATH:
     * Node starts at 0,0.
     * Button is 66x66.
     * Anchor x: 77 (66 + 11) hits the next vertical grid dot line.
     * Anchor y: 33 (centered vertically on the wire grid).
     */
    const anchorPosition = { x: 91, y: 33 };
</script>

<script lang="ts">
    let {
        nodeId,
    }: {
        nodeId: string
    } = $props()

    let signalOn: boolean = $state(false);

    let buttonColor = $derived({
        fill: getRunning() ? (signalOn ? 'green' : 'red') : 'gray',
        stroke: getRunning() ? (signalOn ? 'var(--lime-green)' : 'var(--lime-red)') : 'lightgray',
    })

    function toggleButton() {
        if (getRunning()) {
            signalOn = !signalOn;
            inputSetter(nodeId);
        }
    }

    const unsubscriber = CircuitEngine.subscribe((circuit) => {
        if (circuit === null) {
            signalOn = false;
        }
    });
    onDestroy(unsubscriber);
</script>

<svg
    width="66"
    height="66"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible; display: block;"
>
    <rect
        x="0"
        y="0"
        width="66"
        height="66"
        fill="black"
        stroke={buttonColor.stroke}
        stroke-width="2"
    />
    
    <line
        x1="66"
        y1="33"
        x2="88"
        y2="33"
        stroke={buttonColor.stroke}
        stroke-width="4"
    />

    <circle 
        class="button-circle"
        onmousedown={(e) => {
            e.stopPropagation();
            console.log("Mouse down on button SVG");
            toggleButton();
        }}
        role="presentation"
        cx="33"
        cy="33"
        r="20"
        aria-label="input button node toggle"
        fill={buttonColor.fill}
        stroke={buttonColor.stroke}
        stroke-width="4"
    />
</svg>

<!-- We no longer need a connections prop for our node anchors, since that's handle @ compile time -->
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    
    side="east"
    position={anchorPosition}
/>

<style>
    /* Inherited from Lamp fix to ensure zero-drift origin */
    :global(.svelvet-node) {
        width: 0 !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
    }

    .button-circle {
        transition: fill 0.1s ease;
    }

    /* Change cursor only when simulation is active */
    :global(.svelvet-node .button-circle:hover) {
        cursor: pointer;
    }
</style>
