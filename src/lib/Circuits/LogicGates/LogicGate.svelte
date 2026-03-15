
<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import type { dualInputLogicTypes, logicGateTypes } from '@CircuitModel'

    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import andGate from '@assets/svg/andgate.svg'
    import nandGate from '@assets/svg/nandgate.svg'
    import orGate from '@assets/svg/orgate.svg'
    import norGate from '@assets/svg/norgate.svg'
    import xorGate from '@assets/svg/xorgate.svg'
    import xnorGate from '@assets/svg/xnorgate.svg'
    import { onMount } from 'svelte'
    import { getViewbox, parseSvg } from '@Util/parseSvg'

    // Use explicit pixel positions to avoid percentage-based drift.
    const anchorPositions = {
        in1: { x: -11, y: 11 },   
        in2: { x: -11, y: 55 },   
        // Pulling the output yellow dot left to meet the bubble
        out: { x: 77, y: 33 }, 
    }

    const gateSVGs: Record<dualInputLogicTypes, string> = {
        And: andGate,
        Nand: nandGate,
        Or: orGate,
        Nor: norGate,
        Xor: xorGate,
        Xnor: xnorGate,
    }
</script>

<script lang="ts">
    let {
        width = 80,
        height = 80,
        gateType = 'And',
        nodeId,
    }: {
        width?: number
        height?: number
        gateType?: logicGateTypes
        nodeId: string
    } = $props()

    let gateSVGElement: SVGElement;

    onMount(() => {
        const parsedSvg = parseSvg(gateSVGs[gateType as dualInputLogicTypes])

        // allow the SVG to draw outside its box to reach the -11px anchors
        gateSVGElement.style.overflow = 'visible'

        // setting viewBox to match width/height exactly (1:1 mapping). 
        // This stops the browser from auto-scaling and distorting the gate.
        gateSVGElement.setAttribute("viewBox", `0 0 ${width} ${height}`)
        gateSVGElement.setAttribute("width", width.toString())
        gateSVGElement.setAttribute("height", height.toString())

        // Translate LEFT (-11) to meet the input anchors, not RIGHT
        gateSVGElement.innerHTML = `
            <g transform="translate(-11,0)">
                ${parsedSvg.innerHTML}
            </g>
            `
    })
</script>

<svg bind:this={gateSVGElement} class="circuitSvgContainer"></svg>

<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    position={anchorPositions['in1']}
/>

<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    position={anchorPositions['in2']}
/>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={anchorPositions['out']}
/>


