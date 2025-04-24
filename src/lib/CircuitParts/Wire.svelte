<script module lang="ts">
    import { writable, type Writable } from 'svelte/store'
    // out_Or_qBoVfe501f-in2_Xnor_OhSTyJtjsm
    type WireId = string
    type WireType = string
    // how do I avoid having these for input and outputs?
    // probably with the inverted mapping I keep talking about.
    type WireSaveData = Record<WireId, WireType>

    let wireSaveData: Writable<WireSaveData> = writable({})
    let lastDel: Writable<{ type: string; id: string }> = writable({
        type: '',
        id: '',
    })

    export let handleDisconnect: Writable<boolean> = writable(false)
    // save a few connections after deleting, mainly the most recent one, so
    // that you can toggle a connection without it reverting to the default value
</script>

<script lang="ts">
    import { Edge } from 'svelvet'

    import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit'

    import {
        CircuitEngine,
        onWireChange,
        findWireInEngine,
    } from '@CircuitEngine'
    import { CircuitStore } from '@CircuitStore'

    import { setAnchor, getWireIdFromDOM, setLamp } from './wireUtils.ts'
    import { createDragWire } from './manipulateWire.ts'
    import CustomEdge from './CustomEdge.svelte'
    import NormalEdge from './NormalEdge.svelte'

    let wireActive: number = $state(-1)
    let wireId: string = $state('')

    import { settingsStore } from '@AppComponents/SettingsMenu.svelte'
    import { onDestroy, onMount } from 'svelte'

    let {
        initAncId,
        wireType = $settingsStore.wireType,
    }: {
        initAncId: string
        wireType?: string
    } = $props()

    // keep track of length, this is more computation than necessary
    // map works too map has .size
    // set to save data on mount.
    // this is what links to local storage
    if (Object.keys($wireSaveData).length === 0) {
        $wireSaveData = $CircuitStore.wireManipulations
        $wireSaveData = $wireSaveData
    }

    // $inspect($wireSaveData).with(console.log)
    // Cache the wire type.
    // once a wire type is created once it will always be that type of wire unless edited with the cursor tool
    // $inspect($lastDelType).with(console.log)

    // after component is destroyed checks mouseup
    async function handleMouseUp(e: MouseEvent) {
        console.log('Mouse up target class:')
        // after disconnecting a linked anchor did we connect it to something else or drop it somewhere random
        // whatever we drop it onto will have the same type as the one we just removed.
        // or we drop it nowhere and we empty lastDel and unset handleDisconnect
        // dropped as opposed to 'connectedAfterDisconnect'
        const connectedAfterDisconnect = Array.from(
            (e.target as HTMLElement)?.classList
        )?.includes('custom_anchor')
        if (!connectedAfterDisconnect) {
            $lastDel.type = ''
            $lastDel.id = ''
            $lastDel = $lastDel
            if (disableTapUpdate) {
                wireSaveData.update((currData) => {
                    delete currData[wireId]
                    return currData
                })
            }
        }
        // remove yourself
        window.removeEventListener('mouseup', handleMouseUp, {
            capture: true,
        })
    }
    // you must fully drop anchors to get the wireType change to the global settings type
    // settings option
    let disableTapUpdate = false
    let disableInputCarryType = false

    onDestroy(async () => {
        // make sure that wire types persist correctly
        // remove when input linking is removed.
        if (
            $handleDisconnect &&
            wireId !== '' &&
            !wireId.includes('cursor') &&
            wireId in $wireSaveData
        ) {
            lastDel.update(() => {
                return { type: wireType, id: wireId }
            })

            window.addEventListener('mouseup', handleMouseUp, { capture: true })

            if (!disableTapUpdate) {
                wireSaveData.update((currData) => {
                    delete currData[wireId]
                    return currData
                })
            }

            $handleDisconnect = false
        }
    })
    $effect(() => {
        if (wireId !== '' && !wireId.includes('cursor')) {
            // console.warn('WIREIDNOTNULL: ' + wireId)

            if (!(wireId in $wireSaveData)) {
                if ($lastDel.type !== '' && $handleDisconnect === false) {
                    $wireSaveData[wireId] = disableInputCarryType
                        ? $settingsStore.wireType
                        : $lastDel.type
                    wireType = $wireSaveData[wireId]

                    wireSaveData.update((currData) => {
                        delete currData[$lastDel.id]
                        return currData
                    })
                    $lastDel.type = ''
                    $lastDel.id = ''
                    $lastDel = $lastDel
                    return
                }
                $wireSaveData[wireId] = $settingsStore.wireType
            }
            // check map on every rerender, where the wire is linked
            wireType = $wireSaveData[wireId]
        }
    })

    function monitorWire(
        newId: string | null,
        setWire: Function = (id: string) => (wireId = id)
    ) {
        // console.assert(newId !== null, 'wire id does not exist in edgeWrapper sibling nodes')
        if (!newId) return null

        // in theory the wireConnecting should update
        setWire(newId)

        const wireConnecting: boolean = newId.includes('cursor')

        // wireConnecting && console.log('Connecting wire mounted')

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

    wireSaveData.subscribe((newSaveData) => {
        $CircuitStore.wireManipulations = newSaveData
        $CircuitStore = $CircuitStore
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
