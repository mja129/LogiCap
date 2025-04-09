<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import type { Action } from 'svelte/action'

    import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit'

    import {
        CircuitEngine,
        onWireChange,
        findWireInEngine,
    } from '@CircuitEngine'

    import {
        setAnchor,
        getWireIdFromDOM,
        setLamp,
        getSvelvetEdgeEle,
    } from './wireUtils.ts'

    import {
        createDragWire,
        toggleManipulationTools,
        toolsOff,
        toolsOn,
    } from './manipulateWire.ts'

    let {
        initAncId,
        currentPath,
        wireActive = $bindable(),
        monitorWire,
    }: {
        initAncId: string
        currentPath: string
        wireActive: number
        monitorWire: Function
    } = $props()

    // used for finding the html element with the connectionID

    let edgeWrapper: SVGPathElement | null = $state(null)
    // $inspect(currentPath).with(console.log)
    onMount(() => {
        let [wireId, domWireId] = getWireIdFromDOM(edgeWrapper, initAncId)
        monitorWire(wireId)

        if (!edgeWrapper) return
        if (editWire) {
            createDragWire(edgeWrapper)
        }
    })

    $effect(() => {
        // createDragWire(edgeWrapper)
        if (currentPath) {
            if (!edgeWrapper || !editWire) return
            createDragWire(edgeWrapper, currentPath)
        }
    })
    // $inspect(currentPath).with(console.warn)

    // creates a monitor on wireMount
    // also creates the wire name from the class on the wire that svelvet provides
    // definitely used when loading in circuits from a save

    // I know there is a less convoluted way to do this
    // I tried removing the inner function and just running monitorFn right away by default
    // It didn't work, very curious? I want to know why

    let editWire: boolean = $state(false)
</script>

<!-- Invisible element -->

<path
    id="bezierCurve"
    d={currentPath}
    role="presentation"
    class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
    bind:this={edgeWrapper}
    onclick={() => {
        if (editWire && edgeWrapper) {
            toggleManipulationTools(edgeWrapper)
        } else {
            editWire = true
            if (!edgeWrapper) return
            toolsOn(edgeWrapper)
        }
    }}
    oncontextmenu={(e) => {
        e.preventDefault()
        const pathReset: any = getSvelvetEdgeEle(edgeWrapper)
        if (!pathReset || !edgeWrapper) return
        editWire = false
        toolsOff(edgeWrapper)
        edgeWrapper.setAttribute('d', pathReset.getAttribute('d'))
        // currentPath = pathReset.getAttribute('d')

        console.warn(pathReset)
    }}
/>

<style>
    path {
        stroke: black;
        stroke-width: 7px !important;
    }
    path:hover.on {
        stroke: rgba(0, 255, 0, 0.4) !important;
        stroke-width: 9px !important;
    }
    path:hover.off {
        stroke: rgba(255, 0, 0, 0.4) !important;
        stroke-width: 8px !important;
    }
    path:hover {
        stroke: rgba(0, 0, 0, 0.4) !important;
        stroke-width: 8px !important;
    }
    /* :global(.light .edges-wrapper path:hover) {
        stroke: black !important;
        stroke-width: 6px !important;
        opacity: 100%;
    }
    :global(.dark .edges-wrapper path:hover) {
        stroke: white !important;
        stroke-width: 5px !important;
        opacity: 100%;
    } */

    .on {
        stroke: green !important;
        /* background-color: red; */
    }
    .off {
        stroke: red !important;
    }

    :global(.control-point) {
        cursor: pointer !important; /* Indicate these points are draggable */
        fill: var(--cream);
        border: black;
        border-radius: 999px;
        stroke-width: 1;
        pointer-events: all !important;
        outline: 4px solid black; /* Add an outline to the circle */
        outline-offset: 0; /* Offset the outline for better visibility */
    }
    :global(.control-point:hover) {
        filter: brightness(70%);
    }
    :global(.end-point) {
        fill: none;
    }
    :global(.control-line) {
        stroke: lightgrey;
        stroke-dasharray: 4 4;
        stroke-width: 2;
    }
    #bezierCurve {
        stroke: black;
        stroke-width: 2;
        fill: none;
        pointer-events: stroke !important;
        cursor: pointer;
    }
</style>
