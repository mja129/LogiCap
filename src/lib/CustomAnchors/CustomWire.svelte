<script lang="ts">
    import { Edge } from 'svelvet'
    import {
        circuitEngine,
        onWireChange,
        lastConnected,
    } from '../circuitEngine.svelte.ts'

    let {
        sourceAnchorId,
        connecting = $bindable(),
    }: {
        sourceAnchorId: string
        connecting: boolean
    } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)
    let monitorFn: any = $state(() => -1)
    // this global could be soooo problematic.
    let wireId: string = $lastConnected
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

    async function waitForWireCreated(
        conditionFn: () => boolean,
        interval = 100
    ) {
        while (!conditionFn()) {
            await new Promise((resolve) => setTimeout(resolve, interval))
        }
    }

    const setWire = (wireChange: number) => (wireActive = wireChange)

    circuitEngine.subscribe(
        (digitalJsCircuit) => {
            // reset on play/pause
            if (digitalJsCircuit === null) {
                wireActive = -1
                return
            }
            // this isn't really a thing anymore
            // but we need to beware of the "connecTING node" vs the "connecTED node"
            if (wireId === 'No Connection') {
                // console.warn(
                //     "Wire that you tried to create a listener for is 'no connection'"
                // )
                return
            } else if (!digitalJsCircuit) {
                // console.warn('digital js circuit is null on subscribe')
                return
            }

            let curWir = digitalJsCircuit?.findWireByLabel(wireId)
            if (!curWir) {
                console.warn(
                    'Wire not created yet on headless circuit creation or update'
                )
                return
            }
            monitorFn = async () =>
                await digitalJsCircuit.monitorWire(curWir, (tick: number) => {
                    let wireChange = onWireChange(wireId, curWir, tick)
                    // console.log('wireChanged: ' + wireChange)
                    // you could get the callback result out of the return of this
                    // function and await in the await block below.
                    setWire(wireChange)
                    let connectedTo: string | null
                    connectedTo = curWir.attributes?.target['id']
                    if(connectedTo != null && digitalJsCircuit.getLabelIndex()['outputs'][connectedTo] != null)
                    {
                        let curElement: Element | null = document.querySelector(`#N-${connectedTo}`)
                        if(curElement != null)
                        {
                            let circleElement: SVGCircleElement | null = curElement.querySelector('circle')
                            let lineElement: SVGLineElement | null = curElement.querySelector('line')
                            if (circleElement != null && lineElement != null)
                            {
                                if(wireChange == 1)
                                {
                                    circleElement.setAttribute('fill', 'green')
                                    circleElement.setAttribute('stroke', 'var(--lime-green)')
                                    lineElement.setAttribute('stroke', 'var(--lime-green)')
                                }
                                else
                                {
                                    circleElement.setAttribute('fill', 'red')
                                    circleElement.setAttribute('stroke', 'var(--lime-red)')
                                    lineElement.setAttribute('stroke', 'var(--lime-red)')
                                }
                            }

                        }
                    }
                })

            // console.log('function created')
        } // circuit engine should change when...
        // going from started to stopped
        // making a new link? (yes for now)
        // Do the old wire listeners die?
    )
    // monitorFn()
</script>

<Edge let:path let:destroy>
    {#await monitorFn() then monitor}
        <path
            d={path}
            class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
        />
    {/await}
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
