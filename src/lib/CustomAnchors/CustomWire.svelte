<script lang="ts">
    import { Edge } from 'svelvet'
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import {
        wireSignals,
        circuitEngine,
        wireMonitoring,
        onWireChange,
    } from '../circuitEngine.svelte.ts'
    import { get } from 'svelte/store'

    let {
        sourceAnchorId,
        wireId,
        connecting = $bindable(),
    }: {
        sourceAnchorId: string
        wireId: string
        connecting: boolean
    } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)
    let wireListener: any = $state()
    // color is black until there is some signal going through it.

    // I need to find when, wire is created and connection is also created.
    $inspect(connecting).with(console.warn)

    // circuit.findWireByLabel(wire[0])
    // circuit.monitorWire(
    //     circuit.findWireByLabel(wire[0]),
    //     (tick: number) => wireMonitoring(wire, tick)
    // )

    // wireSignals.subscribe((signal) => {
    //     wireActive = signal[wireId]
    // })

    $effect(() => {
        if (!connecting && wireId == 'No Connection') {
            console.log('wire should be connected but wireID is ' + wireId)
        } else if (wireId !== 'No Connection') {
            // console.log('CONNECTION CREATED')
            let curWir: any = circuitEngine?.findWireByLabel(wireId)
            circuitEngine?.monitorWire(curWir, (tick: number) => {
                let wireChange = onWireChange(wireId, curWir, tick)
                console.log('wireChanged: ' + wireChange)
                wireActive = wireChange
            })

            console.log(wireId)
        }
    })
</script>

<Edge let:path let:destroy>
    {#key wireActive}
        <path
            d={path}
            class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
        />
    {/key}
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
