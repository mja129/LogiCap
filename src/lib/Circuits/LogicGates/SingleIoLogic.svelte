<script lang="ts">
    import { get } from 'svelte/store'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    // these are different
    import notGate from '@assets/svg/notgate.svg'
    import repeaterGate from '@assets/svg/repeater.svg'
    import type { logicGateTypes, singleIoLogicTypes } from '@CircuitModel'
    import { CircuitStore } from '@CircuitStore'
    import { getViewbox, makeEmptySvgEle, parseSvg } from '@Util/parseSvg'
    import { onMount } from 'svelte'

    type SingleLogicGateAnchors = 'in' | 'out'
    const singleIoGateAnchorOffests: Record<
        SingleLogicGateAnchors,
        [number, number]
    > = {
        in: [-15, 38.7],
        out: [100, 38],
    }

    const circuitSvgs: Record<singleIoLogicTypes, string> = {
        Not: notGate,
        Repeater: repeaterGate,
    }

    let {
        width = 80,
        height = 50,
        gateType = 'Not',
        nodeId,
    }: {
        width?: number
        height?: number
        gateType?: logicGateTypes
        nodeId: string
    } = $props()

    let circuitSvg = circuitSvgs[gateType as singleIoLogicTypes]
    let circuitSvgEle: SVGElement = $state(makeEmptySvgEle())

    onMount(() => {
        // check if html element 'doc.documentElement' has
        const parsedSvg = parseSvg(circuitSvg)
        let svgViewbox: string = getViewbox(parsedSvg)

        circuitSvgEle.setAttribute('viewBox', svgViewbox)
        circuitSvgEle.setAttribute('width', width.toString())
        circuitSvgEle.setAttribute('height', height.toString())
        circuitSvgEle.innerHTML = parsedSvg.innerHTML
    })

    // Define a new device
</script>

<svg bind:this={circuitSvgEle} class="circuitSvgContainer"></svg>

<SimulationNodeAnchor
    location={['left', 'mid']}
    id={nodeId}
    io="input"
    offset={singleIoGateAnchorOffests['in']}
/>

<SimulationNodeAnchor
    location={['right', 'mid']}
    id={nodeId}
    io="output"
    offset={singleIoGateAnchorOffests['out']}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>
