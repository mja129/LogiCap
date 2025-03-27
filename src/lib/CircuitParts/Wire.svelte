<script lang="ts">
    import { onMount } from 'svelte'
    import { Edge } from 'svelvet'

    import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit'
    import {
        CircuitEngine,
        onWireChange,
        findWireInEngine,
    } from '@CircuitEngine'

    import {
        setAnchorSimStyles,
        getWireIdFromDOM,
        setLamp,
    } from './wireUtils.ts'

    let {
        initAncId,
    }: {
        initAncId: string
    } = $props()

    // used for finding the html element with the connectionID
    let edgeWrapper: SVGPathElement | null = null // I guess its not really a wrapper more of a child piece

    let wireActive: number = $state(-1)

    let wireId: string = $state('')
    // let wireConnecting: boolean = $derived(
    //     (wireId === '' && false) || wireId.includes('cursor')
    // )

    // I tried to get rid of onMount but I couldn't
    onMount(() => {
        let newId = getWireIdFromDOM(edgeWrapper, initAncId)
        wireMount(newId)
    })

    // creates a monitor on wireMount
    // also creates the wire name from the class on the wire that svelvet provides
    // definitely used when loading in circuits from a save
    function wireMount(
        newId: string | null,
        setWire: Function = (id: string) => (wireId = id)
    ) {
        // console.assert(newId !== null, 'wire id does not exist in edgeWrapper sibling nodes')
        if (!newId) return null

        // in theory the wireConnecting should update
        setWire(newId)

        const wireConnecting: boolean = newId.includes('cursor')

        wireConnecting && console.log('Connecting wire mounted')

        if (wireConnecting) return null // don't create listeners for connecting wires

        const monitorFn =
            ($CircuitEngine !== null && getMonitor($CircuitEngine)) ||
            (() => null)
        monitorFn()
    }

    // I know there is a less convoluted way to do this
    // I tried removing the inner function and just running monitorFn right away by default
    // It didn't work, very curious? I want to know why
    function getMonitor(
        digitalJsCircuit: CustomHeadlessCircuit,
        setWireCallback: Function = (newSignal: number) =>
            (wireActive = newSignal)
    ) {
        // console.log('Getting monitor')
        const currWire = findWireInEngine(digitalJsCircuit, wireId)
        if (currWire === null) return

        const monitorFn = () =>
            digitalJsCircuit.monitorWire(currWire, (tick: number) => {
                const wireChange = onWireChange(currWire)

                // wireActive = wireChange // side-effects
                // external global function that sets this, (like was here b4) is side-effects too
                setWireCallback(wireChange) // No side-effects basically!

                // get stuff out of the target.
                const {
                    id: connectedTo,
                    port: toPort,
                    magnet: _,
                }: Record<
                    'id' | 'port' | 'magnet',
                    string | undefined
                > = currWire.attributes?.target

                if (!connectedTo || !toPort) return

                setAnchorSimStyles(toPort, connectedTo, wireChange)

                const labelOutputTo =
                    connectedTo &&
                    digitalJsCircuit.getLabelIndex()['outputs'][connectedTo]

                if (!labelOutputTo) return null

                setLamp(connectedTo, wireChange)
            })
        return monitorFn
    }

    // decent amount of overhead here, new listeners for every wire on circuit update
    CircuitEngine.subscribe((digitalJsCircuit) => {
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

<Edge
    let:path
    let:destroy
    let:hovering
    enableHover={true}
    edgeClick={() => console.log('edge clicked')}
>
    <div style="font-size: 10px;" slot="label">
        {wireId}<span style="color: red">{initAncId}</span>
    </div>
    <path
        bind:this={edgeWrapper}
        d={path}
        class={wireActive === -1 ? '' : wireActive === 1 ? 'on' : 'off'}
    />
</Edge>

<style>
    path {
        stroke: black;
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
