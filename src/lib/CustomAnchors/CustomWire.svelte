<script lang="ts">
    import { Edge } from 'svelvet'
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import {
        circuitEngine,
        wireMonitoring,
        onWireChange,
        lastConnected,
    } from '../circuitEngine.svelte.ts'
    import { get } from 'svelte/store'
    import LogicGate from '../LogicGates/LogicGate.svelte'

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
    $inspect(wireId).with(console.warn)

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

    // $effect(() => {
    //     if (!connecting && wireId == 'No Connection') {
    //         console.log('wire should be connected but wireID is ' + wireId)
    //     } else if (wireId !== 'No Connection') {
    //         // console.log('CONNECTION CREATED')
    //         if (!circuitEngine) {
    //             // This should never be true, we should create
    //             // the headless circuit and add gates to it on drop in app.svelte
    //             // and create the links on line 189
    //         }

    //         // listen for global circuit change.
    //         // make or remove listeners when this happens
    //         // listen for circuitEngine change.
    //         let curWir = $circuitEngine?.findWireByLabel(wireId)
    //         if (!curWir) {
    //             curWir = $circuitEngine?.findWireByLabel(wireId)
    //         }
    //         // monitorFn = () =>
    //         //     $circuitEngine?.monitorWire(curWir, (tick: number) => {
    //         //         let wireChange = onWireChange(wireId, curWir, tick)
    //         //         console.log('wireChanged: ' + wireChange)
    //         //         return wireChange
    //         //     })

    //         console.log(wireId)
    //     }
    // })
    // could subscribe for connectors updates
    // could subscribe for changes in global headlessCircuit.
    // yes subscribe for changes in global headlessCircuit.
    // unmonitor would be a good thing to do
    // instead of unmonitor, what if I just replace the function that is monitoring.

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
                console.warn(
                    "Wire that you tried to create a listener for is 'no connection'"
                )
                return
            } else if (!digitalJsCircuit) {
                console.warn('digital js circuit is null on subscribe')
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
                    console.log('wireChanged: ' + wireChange)
                    // you could get the callback result out of the return of this
                    // function and await in the await block below.
                    setWire(wireChange)
                })

            console.log('function created')
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
