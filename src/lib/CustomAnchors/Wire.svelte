<script lang="ts">
    import { Edge } from 'svelvet'
    import {
        circuitEngine,
        onWireChange,
        lastConnected,
    } from '../circuitEngine.svelte.ts'
    import { circuitStore, connectingEdge } from '../circuitStore'
    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import type { HeadlessCircuit } from 'custom_digitaljs'

    let {
        initId,
        connecting = get(connectingEdge),
        wireId,
    }: {
        initId: string
        connecting?: boolean
        wireId: string
    } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)

    // how can this not be shit why am I blanking on it.
    let monitorFn: any = $state(() => null)
    // this global could be soooo problematic.
    // yup.

    function setMonitor(digitalJsCircuit: HeadlessCircuit) {
        const currWire = findWireInEngine(digitalJsCircuit)
        if (currWire === null) return

        monitorFn = () =>
            digitalJsCircuit.monitorWire(currWire, (tick: number) => {
                const wireChange = onWireChange(wireId, currWire, tick)
                console.warn(wireChange)
                setWire(wireChange)
            })
    }

    onMount(() => {
        // when we mount wire after reload
        console.log('WIRE MOUNTED')
        if (!connecting) {
            // but we didnt start or reload
            wireId = $lastConnected
            // make sure its named? find its linking.
            // if (sourceAnchorId in $circuitStore.connectors) {
            //     // propogate???
            //     $circuitStore.connectors[sourceAnchorId as outputAnchorName]
            // }
            if ($circuitEngine) {
                setMonitor($circuitEngine)
            }
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
        console.log('the component is being destroyed')
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
            console.log('circuitEngine has become null set wire to be inactive')
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
        setMonitor(digitalJsCircuit)
        monitorFn()
    })
</script>

<Edge let:path let:destroy>
    <div style="font-size: 10px;" slot="label">
        {#if wireId}
            {wireId}<span style="color: red">{initId}</span><span
                style="color: blue">{get(connectingEdge)}</span
            >
        {/if}
    </div>
    <path
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
