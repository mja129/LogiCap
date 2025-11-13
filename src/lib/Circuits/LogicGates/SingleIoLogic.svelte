<script lang="ts" module>
    import { get } from 'svelte/store'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    import notGate from '@assets/svg/notgate.svg'
    import repeaterGate from '@assets/svg/repeater.svg'
    import type { singleIoLogicTypes } from '@CircuitModel'
    import { CircuitStore } from '@CircuitStore'
    import { getViewbox, parseSvg } from '@Util/parseSvg'
    import { onMount } from 'svelte'

    type SingleLogicGateAnchors = 'in' | 'out'

    const anchorOffsets: Record<SingleLogicGateAnchors, [number, number]> = {
        in: [-15, 38.7],
        out: [100, 38],
    }

    const gateSVGs: Record<singleIoLogicTypes, string> = {
        Not: notGate,
        Repeater: repeaterGate,
    }
</script>

<script lang="ts">
    let {
        width = 80,
        height = 50,
        gateType = 'Not',
        nodeId,
    }: {
        width?: number
        height?: number
        gateType?: singleIoLogicTypes
        nodeId: string
    } = $props()

    // make the svgFile that we linked into an actual svg on the page as opposed to an image with an 'src={circuitSvgImport}' attribute
    let gateSVGElement: SVGElement;
    onMount(() => {
        const parsedSvg = parseSvg(gateSVGs[gateType as singleIoLogicTypes])
        gateSVGElement.setAttribute('viewBox', getViewbox(parsedSvg))
        gateSVGElement.setAttribute('width', width.toString())
        gateSVGElement.setAttribute('height', height.toString())
        gateSVGElement.innerHTML = parsedSvg.innerHTML
    })
</script>

<svg bind:this={gateSVGElement} class="circuitSvgContainer"></svg>

<SimulationNodeAnchor
    io="input"
    ioId=""
    id={nodeId}
    side="west"
    offset={anchorOffsets['in']}
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
