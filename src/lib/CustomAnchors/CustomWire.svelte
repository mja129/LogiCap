<script lang="ts">
    import { Edge } from 'svelvet'

    let {
        sourceAnchorId,
        wireId = 'default-edge-name',
    }: { sourceAnchorId: string; wireId?: string } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: boolean | null = $state(null)
    // color is black until there is some signal going through it.

    // I need to find when, wire is created and connection is also created.
    console.log('WIRE CREATED FROM: ' + sourceAnchorId)

    // circuit.findWireByLabel(wire[0])
    // circuit.monitorWire(
    //     circuit.findWireByLabel(wire[0]),
    //     (tick: number) => wireMonitoring(wire, tick)
    // )
    $inspect(wireId).with(console.log)
    $effect(() => {
        if (wireId !== 'No connection') {
            console.log('Connection made with name')
            //    circuit.findWireByLabel(wire[0])
            //     circuit.monitorWire(
            //         circuit.findWireByLabel(wire[0]),
            //         (tick: number) => wireMonitoring(wire, tick)
            //     )
        }
    })
</script>

<Edge
    let:path
    let:destroy
    label={wireId}
    edgeClick={() => {
        if (wireActive === null) {
            wireActive = false
        } else {
            wireActive = !wireActive
        }
    }}
>
    <path
        d={path}
        class={wireActive === null ? '' : wireActive ? 'on' : 'off'}
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
