<script lang="ts" module>
    import { CircuitEngine, getRunning } from '@CircuitEngine'
    import { onDestroy, onMount } from 'svelte'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    const anchorOffset: [number, number] = [-5, 35.43];

    interface SVGLamp extends SVGSVGElement {
        setLampState(this: SVGSVGElement, state: number): void;
    }

    export function setLampState(connectedTo: string, wireChange: number) : void {
        let currLampSvg: SVGLamp | null = document.querySelector(`#N-${connectedTo} svg.LampSVG`);
        if (currLampSvg === null) {
            return;
        }
        currLampSvg.setLampState(wireChange);
    }
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

    let lampColor = $derived({
        fill: getRunning() ? signalOn ? 'green' : 'red' : 'gray',
        stroke: getRunning() ? signalOn ? 'var(--lime-green)' : 'var(--lime-red)' : 'lightgray',
    })

    function setLampState(this: SVGSVGElement, state: number): void {
        signalOn = state == 1;
    }
    let lampSVGElement : SVGSVGElement;
    onMount(() => {
        // assign property
        Object.assign(lampSVGElement, { setLampState });
    })

    const unsubscriber = CircuitEngine.subscribe((circuit) => {
        // Turn off lamps on simulation stop
        if (circuit === null) {
            signalOn = false;
            return;
        }
    });
    onDestroy(unsubscriber);
</script>

<div style="min-width: 85px !important;">
    <svg
        width="85"
        height="65"
        viewBox="-12 0 95 100"
        xmlns="http://www.w3.org/2000/svg"
        class={'LampSVG'}
        bind:this={lampSVGElement}
    >
        <line
            x1="-50"
            x2="5"
            y1="45"
            y2="45"
            stroke={lampColor.stroke}
            stroke-width="8"
        />

        <!-- Circle -->
        <circle
            cx="50"
            cy="50"
            r="45"
            fill={lampColor.fill}
            stroke={lampColor.stroke}
            stroke-width="7"
        />
    </svg>
</div>

<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    side="west"
    offset={anchorOffset}
/>
