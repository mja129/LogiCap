<!-- <script module lang="ts"> -->
<!--     import { writable, type Writable } from 'svelte/store' -->
<!--     type AnchorId = string -->
<!--     type WireType = string -->
<!--     // how do I avoid having these for input and outputs? -->
<!--     // probably with the inverted mapping I keep talking about. -->
<!--     type WireSaveData = Record<AnchorId, WireType> -->
<!---->
<!--     let wireSaveData: Writable<WireSaveData> = writable({}) -->
<!-- </script> -->

<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Edge } from 'svelvet'

    import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit'

    import {
        CircuitEngine,
        onWireChange,
        findWireInEngine,
    } from '@CircuitEngine'

    import { setAnchor, getWireIdFromDOM, setLamp } from './wireUtils.ts'
    import { createDragWire } from './manipulateWire.ts'
    import CustomEdge from './CustomEdge.svelte'
    import NormalEdge from './NormalEdge.svelte'

    let wireActive: number = $state(-1)
    let wireId: string = $state('')

    import { settingsStore } from '@AppComponents/SettingsMenu.svelte'

    let {
        initAncId,
        wireType = $settingsStore.wireType,
    }: {
        initAncId: string
        wireType?: string
    } = $props()

    // $inspect($wireSaveData).with(console.log)
    // Cache the wire type.
    // once a wire type is created once it will always be that type of wire unless edited with the cursor tool
    // onMount(() => {
    //     if (!(initAncId in $wireSaveData)) {
    //         $wireSaveData[initAncId] = $settingsStore.wireType
    //     }
    //     wireType = $wireSaveData[initAncId]
    // })

    function monitorWire(
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
                // external global function that sets this (not param), (like was here b4) is side-effects too
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

                setAnchor(toPort, connectedTo, wireChange)

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

    // used for finding the html element with the connectionID
</script>

<!-- I need this custom element (even though I don't want the extra nexting) because I need to track changes in 'Path' actively-->
<Edge
    straight={wireType === 'straight'}
    step={wireType === 'step'}
    let:path
    let:destroy
    let:hovering
>
    {#if wireType === 'bezier'}
        <CustomEdge {initAncId} currentPath={path} {wireActive} {monitorWire} />
    {:else if wireType === 'step' || wireType == 'straight'}
        <NormalEdge {initAncId} currentPath={path} {wireActive} {monitorWire} />
    {/if}
</Edge>
