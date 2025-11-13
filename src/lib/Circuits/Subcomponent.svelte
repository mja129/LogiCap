<script lang="ts">
    import { get, type Writable } from 'svelte/store'

    import { CircuitStore } from '@CircuitStore'

    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import gatesvg from '@assets/svg/subcomponent.svg'
    import { getContext, onMount } from 'svelte'
    import { getViewbox, makeEmptySvgEle, parseSvg } from '@Util/parseSvg'
    // import { transform } from 'custom_digitaljs'

    let {
        width = 80,
        height = 50,
        nodeId,
        celltype,
        inputs,
        outputs
    }: {
        width?: number
        height?: number
        gateType?: 'Subcircuit'
        nodeId: string
        celltype: string
        inputs: number
        outputs: number
    } = $props()

    let inputOffsets: Record<string, [number, number]> = {}
    for (let i = 1; i <= inputs; i++) {
      inputOffsets[`in${i}`] = [-7.5, 6.66 + ((i - 1) * 61.84 / (inputs - 1))]
    }
    let outputOffsets: Record<string, [number, number]> = {}
    if (outputs > 1) {
      for (let i = 1; i <= inputs; i++) {
        outputOffsets[`out${i}`] = [95, 6.66 + ((i - 1) * 61.84 / (outputs - 1))]
      }
    } else {
      outputOffsets['out'] = [95, 37.58]
    }


    // the svg image coorisponding to the 'gateType' passed in.
    let circuitSvg = gatesvg
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

<h3 style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 5;'>{celltype}</h3>

<!-- Position property only works if cursor is set to false. -->
<!-- <circuitSvgElement /> -->
<svg bind:this={circuitSvgEle} class="circuitSvgContainer"></svg>

{#each Object.entries(inputOffsets) as [name, offset]}
<SimulationNodeAnchor
    side="west"
    id={nodeId}
    io="input"
    ioId={name[2]}
    offset={offset}
/>
{/each}
{#each Object.entries(outputOffsets) as [name, offset]}
<SimulationNodeAnchor
    side="east"
    id={nodeId}
    io="output"
    ioId=""
    offset={offset}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>
{/each}
