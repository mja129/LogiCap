<script lang="ts">
    import { Edge } from 'svelvet'
    import {
        circuitEngine,
        onWireChange,
        lastConnected,
    } from '../circuitEngine.svelte.ts'
    import { circuitStore, connectingEdge } from '../circuitStore'
    import { onDestroy, onMount, type Component } from 'svelte'
    import { get } from 'svelte/store'
    import type { HeadlessCircuit } from 'custom_digitaljs'

    let {
        initId,
        connecting = get(connectingEdge),
    }: {
        initId: string
        connecting?: boolean
    } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)

    // how can this not be shit why am I blanking on it.

    let wireId: string = $state((!connecting && get(lastConnected)) || '')
    // this global could be soooo problematic.
    // yup.

    function getMonitor(digitalJsCircuit: HeadlessCircuit) {
        const currWire = findWireInEngine(digitalJsCircuit)
        if (currWire === null) return

        const monitorFn = () =>
            digitalJsCircuit.monitorWire(currWire, (tick: number) => {
                const wireChange = onWireChange(wireId, currWire, tick)
                setWire(wireChange)
                let connectedTo: string | null
                connectedTo = currWire.attributes?.target['id']
                if (
                    connectedTo != null &&
                    digitalJsCircuit.getLabelIndex()['outputs'][connectedTo] !=
                        null
                ) {
                    let curElement: Element | null = document.querySelector(
                        `#N-${connectedTo}`
                    )
                    if (curElement != null) {
                        let circleElement: SVGCircleElement | null =
                            curElement.querySelector('circle')
                        let lineElement: SVGLineElement | null =
                            curElement.querySelector('line')
                        if (circleElement != null && lineElement != null) {
                            if (wireChange == 1) {
                                circleElement.setAttribute('fill', 'green')
                                circleElement.setAttribute(
                                    'stroke',
                                    'var(--lime-green)'
                                )
                                lineElement.setAttribute(
                                    'stroke',
                                    'var(--lime-green)'
                                )
                            } else {
                                circleElement.setAttribute('fill', 'red')
                                circleElement.setAttribute(
                                    'stroke',
                                    'var(--lime-red)'
                                )
                                lineElement.setAttribute(
                                    'stroke',
                                    'var(--lime-red)'
                                )
                            }
                        }
                    }
                }
            })
        return monitorFn
    }

    let edgeWrapper: any

    onMount(() => {
        // when we mount wire after reload
        // Access the path element through the Edge component's method
        // console.log('Path classes:', pathElement.classList)
        // fan out

        if (!connecting) {
            // but we didnt start or reload
            const lastCon = get(lastConnected)
            if (lastCon) {
                wireId = lastCon
            } else {
                console.log('Nada on Mont')
            }
            // $lastConnected = undefined
            // make sure its named? find its linking.
            // if (sourceAnchorId in $circuitStore.connectors) {
            //     // propogate???
            //     $circuitStore.connectors[sourceAnchorId as outputAnchorName]
            // }
            const monitorFn =
                ($circuitEngine !== null && getMonitor($circuitEngine)) ||
                (() => null)
            monitorFn()
        }
    })

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

    const setWire = (wireChange: number) => (wireActive = wireChange)

    onDestroy(() => {
        // if you disconnect a connected wire when the simulation is running?
        // if you connect a wire while running ?
        // console.log('the component is being destroyed')
    })
    // color is black until there is some signal going through it.

    // I need to find when, wire is created and connection is also created.
    // $inspect(wireId).with(console.warn)

    // circuit.findWireByLabel(wire[0])
    // circuit.monitorWire(
    //     circuit.findWireByLabel(wire[0]),
    //     (tick: number) => wireMonitoring(wire, tick)
    // )

    // wireSignals.subscribe((signal) => {
    //     wireActive = signal[wireId]
    // })

    circuitEngine.subscribe((digitalJsCircuit) => {
        // reset on play/pause
        if (digitalJsCircuit === null) {
            // console.log('circuitEngine has become null set wire to be inactive')
            wireActive = -1
            return
        }

        // this isn't really a thing anymore
        // but we need to beware of the "connecTING node" vs the "connecTED node"
        // if (wireId === 'First Connection') {
        //     console.warn(
        //         "Wire that you tried to create a listener for is 'First Connection'"
        //     )
        //     return
        // }
        const monitorFn =
            (digitalJsCircuit !== null && getMonitor(digitalJsCircuit)) ||
            (() => null)
        monitorFn()
    })

    document.addEventListener('DOMContentLoaded', () => {
        // we could get rid of the last connected global var
        // if we got rid of it we would need to get rid of this statement.
        // its basically -> only make the wireId like this on appMount
        if ($lastConnected !== undefined) {
            return null
        }
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

        wireId = initId + '-' + getInputAnchorId(edgeId)

        const monitorFn =
            ($circuitEngine !== null && getMonitor($circuitEngine)) ||
            (() => null)
        monitorFn()
        // console.log(Array.from(fullEdgeComponent.childNodes))
        // const [autoGenClass] =
    })
</script>

<Edge let:path let:destroy>
    <div style="font-size: 10px;" slot="label">
        {wireId}<span style="color: red">{initId}</span><span
            style="color: blue">{get(connectingEdge)}</span
        >
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
