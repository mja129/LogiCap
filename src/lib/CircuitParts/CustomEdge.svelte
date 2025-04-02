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
    }: {
        initAncId: string
        currentPath: string
    } = $props()

    // used for finding the html element with the connectionID

    let wireActive: number = $state(-1)

    let wireId: string = $state('')

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
    function monitorWire(
        newId: string | null,
        setWire: Function = (id: string) => (wireId = id)
    ) {
        // console.assert(newId !== null, 'wire id does not exist in edgeWrapper sibling nodes')
        if (!newId) return null

        // in theory the wireConnecting should update
        setWire(newId)

        const wireConnecting: boolean = newId.includes('cursor')

        wireConnecting && console.log('Connecting wire mounted')

        if (wireConnecting) return null // don't create listeners for connecting wires

        const monitorFn =
            ($CircuitEngine !== null && getMonitor($CircuitEngine)) ||
            (() => null)
        monitorFn()
    }

    // I know there is a less convoluted way to do this
    // I tried removing the inner function and just running monitorFn right away by default
    // It didn't work, very curious? I want to know why
    function getMonitor(
        digitalJsCircuit: CustomHeadlessCircuit,
        setWireCallback: Function = (newSignal: number) =>
            (wireActive = newSignal)
    ) {
        // console.log('Getting monitor')
        const currWire = findWireInEngine(digitalJsCircuit, wireId)
        if (currWire === null) return

        const monitorFn = () =>
            digitalJsCircuit.monitorWire(currWire, (tick: number) => {
                const wireChange = onWireChange(currWire)

                // wireActive = wireChange // side-effects
                // external global function that sets this (not param), (like was here b4) is side-effects too
                setWireCallback(wireChange) // No side-effects basically!

                // get stuff out of the target.
                const {
                    id: connectedTo,
                    port: toPort,
                    magnet: _,
                }: Record<
                    'id' | 'port' | 'magnet',
                    string | undefined
                > = currWire.attributes?.target

                if (!connectedTo || !toPort) return

                setAnchor(toPort, connectedTo, wireChange)

                const labelOutputTo =
                    connectedTo &&
                    digitalJsCircuit.getLabelIndex()['outputs'][connectedTo]

                if (!labelOutputTo) return null

                setLamp(connectedTo, wireChange)
            })
        return monitorFn
    }

    // decent amount of overhead here, new listeners for every wire on circuit update
    CircuitEngine.subscribe((digitalJsCircuit) => {
        // reset on play/pause
        // console.log('ENGINE UPDATE')
        if (digitalJsCircuit === null) {
            // console.log('circuitEngine has become null set wire to be inactive')
            wireActive = -1
            return
        }

        const monitorFn =
            (digitalJsCircuit !== null && getMonitor(digitalJsCircuit)) ||
            (() => null)
        monitorFn()
    })

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

<!-- <path -->
<!--     class={wireActive === -1 -->
<!--         ? 'hit-area' -->
<!--         : wireActive === 1 -->
<!--           ? 'hit-area on' -->
<!--           : 'hit-area off'} -->
<!--     d={currentPath} -->
<!-- /> -->

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
        fill: orange;
        stroke-width: 1;
        pointer-events: all !important;
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
