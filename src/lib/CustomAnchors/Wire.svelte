<script lang="ts">
    import { Edge } from 'svelvet'
    import { circuitEngine, onWireChange } from '../circuitEngine.svelte.ts'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import type { HeadlessCircuit } from 'custom_digitaljs'

    let {
        initId,
    }: {
        initId: string
    } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)

    // how can this not be shit why am I blanking on it.

    let wireId: string = $state('')
    // this global could be soooo problematic.
    // yup.
    const setWire = (wireChange: number) => (wireActive = wireChange)

    // used for finding the html element with the connectionID
    let edgeWrapper: any

    // I don't think this even needs to be on mount, it can be in the component I think.
    onMount(() => {
        // when we mount wire after reload
        // Access the path element through the Edge component's method
        // console.log('Path classes:', pathElement.classList)
        // fan out
        const newWireId = getWireIdFromDOM()
        if (newWireId) {
            wireId = newWireId
            // the connecting wire will have 'cursor' in the name instead of the destination anchor
            if (wireId.includes('cursor')) {
                console.log('Connecting Wire Mounted')
            } else {
                const monitorFn =
                    ($circuitEngine !== null && getMonitor($circuitEngine)) ||
                    (() => null)
                monitorFn()
            }
        }
    })

    function getMonitor(digitalJsCircuit: HeadlessCircuit) {
        // console.log('Getting monitor')
        const currWire = findWireInEngine(digitalJsCircuit)
        if (currWire === null) return

        const monitorFn = () =>
            digitalJsCircuit.monitorWire(currWire, (tick: number) => {
                const wireChange = onWireChange(wireId, currWire, tick)

                setWire(wireChange)
                let connectedTo: string | null
                connectedTo = currWire.attributes?.target['id']

                const labelOutputTo =
                    connectedTo &&
                    digitalJsCircuit.getLabelIndex()['outputs'][connectedTo]

                if (connectedTo && labelOutputTo !== null) {
                    setLamp(connectedTo, wireChange)
                }
            })
        return monitorFn
    }

    function setLamp(connectedTo: string, wireChange: number) {
        let curElement: Element | null = document.querySelector(
            `#N-${connectedTo}`
        )

        if (curElement === null) return

        const circleElement: SVGCircleElement | null =
            curElement.querySelector('circle')
        const lineElement: SVGLineElement | null =
            curElement.querySelector('line')

        if (circleElement === null || lineElement === null) return

        if (wireChange == 1) {
            circleElement.setAttribute('fill', 'green')
            circleElement.setAttribute('stroke', 'var(--lime-green)')
            lineElement.setAttribute('stroke', 'var(--lime-green)')
        } else {
            circleElement.setAttribute('fill', 'red')
            circleElement.setAttribute('stroke', 'var(--lime-red)')
            lineElement.setAttribute('stroke', 'var(--lime-red)')
        }
    }

    function findWireInEngine(digitalJsCircuit: HeadlessCircuit) {
        let currWire = digitalJsCircuit?.findWireByLabel(wireId)
        if (!currWire) {
            console.warn(
                'Wire not created yet on headless circuit creation or update'
            )
            return null
        }
        return currWire
    }

    // svelvet makes classes on edges, Its much easier to use them.
    function getWireIdFromDOM() {
        const allEdgeNodes: HTMLElement[] = Array.from(
            edgeWrapper.parentElement.childNodes
        )

        const eleWithId: HTMLElement | undefined = allEdgeNodes.find(
            (ele: any) => ele.role === 'presentation'
        )

        const edgeId: string | null =
            (eleWithId && eleWithId.getAttribute('id')) || null

        if (!edgeId) {
            console.warn(
                'No Id found on the edge component when loading in the component'
            )
            return null
        }
        // example:
        // A-in2_Nand_R6ecBvquImEbPYoo/N-Nand_R6ecBvquImEbPYoo+A-out_Button_NqRwJIgwMnCkcvwZ/N-Button_NqRwJIgwMnCkcvwZ-target
        const getInputAnchorId = (edgeId: string) => {
            const startInputId = edgeId.indexOf('-') + 1
            const endInputId = edgeId.indexOf('/')
            return edgeId.substring(startInputId, endInputId)
        }

        const wireId = initId + '-' + getInputAnchorId(edgeId)
        return wireId
    }

    circuitEngine.subscribe((digitalJsCircuit) => {
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
</script>

<Edge let:path let:destroy>
    <div style="font-size: 10px;" slot="label">
        {wireId}<span style="color: red">{initId}</span>
    </div>
    <path
        bind:this={edgeWrapper}
        d={path}
        class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
    />
</Edge>

<style>
    path {
        stroke: var(--dark-blue);
        stroke-width: 4px;
    }
    path:hover {
        stroke-width: 5px !important;
    }
    :global(.light .edges-wrapper path:hover) {
        stroke: black !important;
        stroke-width: 6px !important;
        opacity: 100%;
    }
    :global(.dark .edges-wrapper path:hover) {
        stroke: white !important;
        stroke-width: 5px !important;
        opacity: 100%;
    }

    .on {
        stroke: green !important;
        /* background-color: red; */
    }
    .off {
        stroke: red !important;
    }
</style>
