<script lang="ts">
    import { Edge } from 'svelvet'

    let { wireId = 'default-Edge-Name' }: { wireId?: string } = $props()

    // it won't have a name until the connection is fully made.
    let wireActive: boolean | null = $state(null)
    // color is black until there is some signal going through it.

    // I need to find when, wire is created and connection is also created.
    console.log('WIRE CREATED')

    // circuit.findWireByLabel(wire[0])
    // circuit.monitorWire(
    //     circuit.findWireByLabel(wire[0]),
    //     (tick: number) => wireMonitoring(wire, tick)
    // )
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
    <button slot="label">
        <p>{wireId}</p>
    </button>
</Edge>

<style>
    path {
        stroke: var(--dark-blue);
        stroke-width: 4px;
    }

    .on {
        stroke: green;
        /* background-color: red; */
    }
    .off {
        stroke: red;
    }
</style>
