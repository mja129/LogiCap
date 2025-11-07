<script lang="ts">
    import { get, type Writable } from 'svelte/store'

    import { CircuitStore } from '@CircuitStore'
    import type { dualInputLogicTypes, logicGateTypes } from '@CircuitModel'

    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import andGate from '@assets/svg/andgate.svg'
    import nandGate from '@assets/svg/nandgate.svg'
    import orGate from '@assets/svg/orgate.svg'
    import norGate from '@assets/svg/norgate.svg'
    import xorGate from '@assets/svg/xorgate.svg'
    import xnorGate from '@assets/svg/xnorgate.svg'
    import { getContext, onMount } from 'svelte'
    import { getViewbox, makeEmptySvgEle, parseSvg } from '@Util/parseSvg'
    // import { transform } from 'custom_digitaljs'

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

    const logicGateAnchorOffsets: Record<LogicGateAnchors, [number, number]> = {
        in1: [-7.5, 68.5],
        in2: [-7.5, 7.5],
        out: [100, 37.58],
    }

    type LogicGateAnchors = 'in1' | 'in2' | 'out'

    const circuitSvgs: Record<dualInputLogicTypes, string> = {
        And: andGate,
        Nand: nandGate,
        Or: orGate,
        Nor: norGate,
        Xor: xorGate,
        Xnor: xnorGate,
    }

    // the svg image coorisponding to the 'gateType' passed in.
    let circuitSvg = circuitSvgs[gateType as dualInputLogicTypes]
    let circuitSvgEle: SVGElement = $state(makeEmptySvgEle())

    // make the svgFile that we linked into an actual svg on the page as opposed to an image with an 'src={circuitSvgImport}' attribute
    onMount(() => {
        // check if html element 'doc.documentElement' has
        const parsedSvg = parseSvg(circuitSvg)
        let svgViewbox: string = getViewbox(parsedSvg)

        circuitSvgEle.setAttribute('viewBox', svgViewbox)
        circuitSvgEle.setAttribute('width', width.toString())
        circuitSvgEle.setAttribute('height', height.toString())
        circuitSvgEle.innerHTML = parsedSvg.innerHTML
    })

    // decodeSvgUrl already checks that the element is an svg so, we can safely cast and tell typescript to shut up

    // this function is unused, should it be deleted
    // it seems like functionality that should be in circuitStore.
    // finding an output anchor via an inputAnchor.
    // $inspect($savedConnections).with(console.log)

    let rotation: Writable<number> = getContext('rotation')
</script>

<!-- Position property only works if cursor is set to false. -->
<!-- <circuitSvgElement /> -->
<svg bind:this={circuitSvgEle} class="circuitSvgContainer"></svg>

<SimulationNodeAnchor
    location={['left', 'top']}
    id={nodeId}
    io="input"
    ioId="1"
    offset={logicGateAnchorOffsets['in1']}
/>
<SimulationNodeAnchor
    location={['left', 'bot']}
    id={nodeId}
    io="input"
    ioId="2"
    offset={logicGateAnchorOffsets['in2']}
/>
<!-- This code solves a problem that there were two ways to solve, 
Rotating the node via the svelvet rotation property on a node, only works dynamically if you rerender
the entire node, this sucessfully reloads the wires too, but because of the way position: works, the node 
ends up snapping back after we rerender it like that. 

the position data is only used for reloading saved nodes
So when you refresh the page, 
Or load from a file
Or go to a new tab

the only problem with rerendering the entire node is that position is defined when triggering the rotation
and rerendering the entire node

We could just unset position on node rotation.
It does work but its chunky and teleports for some reason
this passing the rotation as a bindable prop in all components is the best solution
rerender only the output anchor, very demure very minimal.
-->
<SimulationNodeAnchor
    location={['right', 'mid']}
    id={nodeId}
    io="output"
    ioId=""
    offset={logicGateAnchorOffsets['out']}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>
