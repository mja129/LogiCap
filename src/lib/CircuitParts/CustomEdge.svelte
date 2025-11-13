<script lang="ts" module>
    import { writable, type Writable } from 'svelte/store'

    type WireId = string
    type ControlPoints = string
    type toolsActive = boolean
    let wireManipulationStore: Writable<
        Record<WireId, [ControlPoints, toolsActive]>
    > = writable(
        (localStorage.getItem('manipulations') &&
            JSON.parse(localStorage.getItem('manipulations') || '{}')) ||
            {}
    )
    // wire with active wire editing tools, only one at once is allowed.
    // empty means we are not editing any right now
    // that doesnt mean there arent any saved edits.
    // let editSingle: Writable<WireId> = writable('')
</script>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte'

    import {
        setAnchor,
        getWireIdFromDOM,
        getSvelvetEdgeEle,
    } from './wireUtils.ts'

    import {
        createDragWire,
        hasTools,
        parseCubicBezierD,
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
    const saveManipulatedPoints = (controlPoints: string, wireId: string) => {
        // console.log('ranCallback')
        if (wireId === '')
            return (
                console.warn('tried to save manipulations for empty wire id'),
                null
            )

        // if (!(wireId in $wireManipulationStore)) {
        //     // add wireId to wireManipulation sotre
        //     $wireManipulationStore[wireId] = controlPoints
        // }
        // this code runs super often because of how often we are rerendering
        if (
            JSON.stringify($wireManipulationStore) !==
            JSON.stringify(controlPoints)
        ) {
            $wireManipulationStore[wireId][0] = controlPoints
            // $wireManipulationStore[wireId][1] = false
            $wireManipulationStore = $wireManipulationStore
        }
    }
    // $inspect($wireManipulationStore).with(console.log)
    let wireId: string | undefined = $state(undefined)

    onMount(() => {
        wireId = getWireIdFromDOM(edgeWrapper, initAncId)[0]
        monitorWire(wireId)

        if (!edgeWrapper) return

        let savedElePath: string = ''

        // wires not in the store are not edited.
        if (!(wireId in $wireManipulationStore)) return

        savedElePath = $wireManipulationStore[wireId][0]
        // tool were off but we rerendered and now they turned on.

        createDragWire(
            edgeWrapper,
            (points: string) => saveManipulatedPoints(points, wireId || ''),
            savedElePath
        )
        // if its false turn off
        if (!$wireManipulationStore[wireId][1]) {
            toolsOff(edgeWrapper)
        }
    })

    $effect(() => {
        // createDragWire(edgeWrapper)
        if (
            currentPath &&
            edgeWrapper &&
            wireId &&
            wireId in $wireManipulationStore
        ) {
            let savedElePath: string | undefined
            // if (wireId in $wireManipulationStore) {
            //     // get p0 and p3
            //     savedElePath = $wireManipulationStore[wireId]
            // }
            // console.log(hasTools(edgeWrapper))
            // don't show edit tools for something that doesnt have them.

            createDragWire(
                edgeWrapper,
                (points: string) => saveManipulatedPoints(points, wireId || ''),
                savedElePath || currentPath
            )
            // bad
            localStorage.setItem(
                'manipulations',
                JSON.stringify($wireManipulationStore)
            )
        }
    })
    // $inspect(currentPath).with(console.warn)

    // creates a monitor on wireMount
    // also creates the wire name from the class on the wire that svelvet provides
    // definitely used when loading in circuits from a save

    // I know there is a less convoluted way to do this
    // I tried removing the inner function and just running monitorFn right away by default
    // It didn't work, very curious? I want to know why
</script>

<!-- Invisible element -->

<path
    id="bezierCurve"
    d={currentPath}
    role="presentation"
    class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
    bind:this={edgeWrapper}
    onclick={(e: MouseEvent) => {
        e.preventDefault()
        // if
        if (!wireId || !edgeWrapper) return

        if (!(wireId in $wireManipulationStore)) {
            $wireManipulationStore[wireId] = ['', false]
            $wireManipulationStore[wireId][0] = currentPath
            $wireManipulationStore[wireId][1] = false
        }

        $wireManipulationStore[wireId][1] = !$wireManipulationStore[wireId][1]
        $wireManipulationStore = $wireManipulationStore
        toggleManipulationTools(edgeWrapper)
    }}
    oncontextmenu={(e) => {
        e.preventDefault()
        const pathReset: any = getSvelvetEdgeEle(edgeWrapper)
        if (!pathReset || !edgeWrapper) return
        toolsOff(edgeWrapper)

        if (wireId) {
            delete $wireManipulationStore[wireId]
            $wireManipulationStore = $wireManipulationStore
        }
        edgeWrapper.setAttribute('d', pathReset.getAttribute('d'))
        // currentPath = pathReset.getAttribute('d')
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
