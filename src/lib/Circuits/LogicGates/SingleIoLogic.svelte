<script lang="ts" module>
    import { get } from 'svelte/store'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'

    import notGate from '@assets/svg/notgate.svg'
    import repeaterGate from '@assets/svg/repeater.svg'
    import type { singleIoLogicTypes } from '@CircuitModel'
    import { CircuitStore } from '@CircuitStore'
    import { getViewbox, parseSvg } from '@Util/parseSvg'
    
    // These shouldn't change -- the svg abides by these. 
    const anchorPositions = {
        in: { x: -11, y: 33 }, 
        out: { x: 77, y: 33 }, 
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

    let gateSVGElement: SVGElement;
    
    // Using $effect to match Svelte 5 runes, with a strict exit guard
    $effect(() => {
        if (!gateSVGElement) return;

        const parsedSvg = parseSvg(gateSVGs[gateType as singleIoLogicTypes])
        
        // Exact mirror of the dual-gate fix
        gateSVGElement.style.overflow = "visible";
        gateSVGElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
        gateSVGElement.setAttribute('width', width.toString())
        gateSVGElement.setAttribute('height', height.toString())
        
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
    ioId=""
    id={nodeId}
    side="west"
    position={anchorPositions['in']}
/>

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={anchorPositions['out']}
/>