<script lang="ts">
    import { Edge } from 'svelvet'
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import { circuitStore } from '../circuitStore.ts'

    let {
        sourceAnchorId,
        wireId = 'default-edge-name',
    }: { sourceAnchorId: string; wireId?: string } = $props()

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

    function wireMonitoring(wire: any, tick: number) {
        let logicValue: number
        console.log(wire)
        //console.log(wire)
        if (wire.attributes.signal) {
            if (
                wire.attributes.signal._avec[0] ==
                wire.attributes.signal._bvec[0]
            ) {
                logicValue = wire.attributes.signal._avec[0]
            } else {
                logicValue = -1
            }
            console.log(
                `${wire.attributes.netname} has changed signal to ${logicValue} at tick ${tick}`
            )
            return logicValue
        }
    }

    let circuit: HeadlessCircuit = $derived(new HeadlessCircuit($circuitStore))

    $inspect(circuit).with(console.log)
    $effect(() => {
        if (wireId !== 'No connection') {
            console.log(`Connection made with name ${wireId}`)
            let currWire: any = circuit.findWireByLabel(wireId)
            circuit.monitorWire(
                circuit.findWireByLabel(wireId),
                (tick: number) => wireMonitoring(currWire, tick)
            )
        }
    })
</script>

<Edge
    let:path
    let:destroy
    label={wireId}
    edgeClick={() => {
        if (wireActive === -1) {
            wireActive = 0
        } else {
            wireActive = wireActive === 0 ? 1 : 0
        }
    }}
>
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
