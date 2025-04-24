<script module lang="ts">
    import { writable, type Writable } from 'svelte/store'
    // out_Or_qBoVfe501f-in2_Xnor_OhSTyJtjsm
    type WireId = string
    type WireType = string
    // how do I avoid having these for input and outputs?
    // probably with the inverted mapping I keep talking about.
    type WireSaveData = Record<WireId, WireType>
    let wireSaveData: Writable<WireSaveData> = writable({})
    let lastDelType: Writable<string> = writable('')
    export let handleDisconnect: Writable<boolean> = writable(false)
    // save a few connections after deleting, mainly the most recent one, so
    // that you can toggle a connection without it reverting to the default value
    let deletedWireCache: Writable<Array<[WireId, WireType]> | []> = writable(
        []
    )
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

    // $inspect($wireSaveData).with(console.log)
    // Cache the wire type.
    // once a wire type is created once it will always be that type of wire unless edited with the cursor tool
    // $inspect($lastDelType).with(console.log)

    onDestroy(() => {
        // make sure that wire types persist correctly
        // remove when input linking is removed.
        if (
            $handleDisconnect &&
            wireId !== '' &&
            !wireId.includes('cursor') &&
            wireId in $wireSaveData
        ) {
            // const deletedWireType = structuredClone($wireSaveData[wireId])
            console.log('destory')
            console.log(initAncId)

            // lastDelType.update(() => wireType)

            const cachedIds: string[] = $deletedWireCache.map(
                ([id, type]) => id
            )

            if (cachedIds.includes(wireId)) return

            wireSaveData.update((currData) => {
                delete currData[wireId]
                return currData
            })

            // last destroyed input and its type
            // lastDelType.update(() => wireType + '|' + wireId.split('-')[1])

            $deletedWireCache = [[wireId, wireType], ...$deletedWireCache]

            if ($deletedWireCache.length > 2) {
                deletedWireCache.update((currCache) => {
                    currCache.pop()
                    return currCache
                })
            }
            $handleDisconnect = false
        }
    })
    $effect(() => {
        if (wireId !== '' && !wireId.includes('cursor')) {
            // console.warn('WIREIDNOTNULL: ' + wireId)
            const inputId = wireId.split('-')[1]

            if (!(wireId in $wireSaveData)) {
                // the cache is okay for now but this is better
                // if ($lastDelType !== '') {
                //     $wireSaveData[wireId] = $settingsStore.wireType
                //     wireType = $wireSaveData[wireId]
                //     $lastDelType = ''
                //     return
                // }
                let savedType: string | undefined
                $deletedWireCache.forEach(([delId, delType]) => {
                    if (wireId === delId) {
                        savedType = delType
                        return
                    }
                })
                // if (savedType) {
                //     $wireSaveData[wireId] = savedType
                // } else {
                // }
                $wireSaveData[wireId] = savedType || $settingsStore.wireType
                console.warn('HIT default store')
            }
            wireType = $wireSaveData[wireId]
            // bezier, strait, or step
            // when you update a node
        } else if (wireId.includes('cursor')) {
            // console.log('Includes cursor: ' + wireType)
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
