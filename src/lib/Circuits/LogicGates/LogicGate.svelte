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

    type LogicGateAnchors = 'in1' | 'in2' | 'out'

    const anchorOffsets: Record<LogicGateAnchors, [number, number]> = {
        in1: [-7.5, 68.5],
        in2: [-7.5, 7.5],
        out: [100, 37.58],
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
        height = 50,
        gateType = 'And',
        nodeId,
    }: {
        width?: number
        height?: number
        gateType?: logicGateTypes
        nodeId: string
    } = $props()

    // make the svgFile that we linked into an actual svg on the page as opposed to an image with an 'src={circuitSvgImport}' attribute
    let gateSVGElement: SVGElement;
    onMount(() => {
        const parsedSvg = parseSvg(gateSVGs[gateType as dualInputLogicTypes])
        gateSVGElement.setAttribute('viewBox', getViewbox(parsedSvg));
        gateSVGElement.setAttribute('width', width.toString())
        gateSVGElement.setAttribute('height', height.toString())
        gateSVGElement.innerHTML = parsedSvg.innerHTML
    })
</script>

<svg bind:this={gateSVGElement} class="circuitSvgContainer"></svg>

<SimulationNodeAnchor
    io="input"
    ioId="1"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in1']}
/>
<SimulationNodeAnchor
    io="input"
    ioId="2"
    id={nodeId}
    side="west"
    offset={anchorOffsets['in2']}
/>
<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
    side="east"
    offset={anchorOffsets['out']}
/>
