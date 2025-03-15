<script lang="ts">
    import { Edge } from 'svelvet'
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import { wireSignals, addMonitor, circuitEngine } from '../TestEngine.ts'
    import { get } from 'svelte/store'

    let { sourceAnchorId, wireId }: { sourceAnchorId: string; wireId: string } =
        $props()

    // it won't have a name until the connection is fully made.
    let wireActive: number = $state(-1)
    // color is black until there is some signal going through it.

    // I need to find when, wire is created and connection is also created.
    console.log('WIRE CREATED FROM: ' + sourceAnchorId)

    // circuit.findWireByLabel(wire[0])
    // circuit.monitorWire(
    //     circuit.findWireByLabel(wire[0]),
    //     (tick: number) => wireMonitoring(wire, tick)
    // )

    wireSignals.subscribe((signal) => {
        wireActive = signal[wireId]
    })

    $effect(() => {
        if (circuitEngine == null) {
            return
        }
        if (wireId !== 'No connection') {
            console.log(`Connection made with name ${wireId}`)
            addMonitor(wireId)
        }
    })
</script>

<Edge let:path let:destroy>
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
        stroke: green;
        /* background-color: red; */
    }
    .off {
        stroke: red;
    }
</style>
