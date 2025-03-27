<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { Svelvet, Minimap, ThemeToggle, Node, Anchor } from 'svelvet'

    import {
        circuitStore,
        saveCircuit,
        translateConnectionsToSvelvet,
    } from './lib/circuitStore'
    import SideMenu from './lib/SideMenu/SideMenu.svelte'
    import CommandMenu from './lib/CommandMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    import SimNode from './lib/SimNode.svelte'
    import type {
        dualInputLogicTypes,
        logicGateTypes,
    } from './lib/circuitModel'
    import { deviceFactoryMap } from './lib/makeDigitalJsJson'
    import SimMenu from './lib/SimMenu.svelte'
    import { onMount } from 'svelte'

    // this should probably be it's own file soon.

    // the Devices part of the digitalJS json.
    let currentDevicesData: DeviceRecord = $state({})
    // this is literally not state
    let existingConnections:
        | Map<string, Array<[string, string] | string>>
        | any = $state()

    // check if circuitStore is not null when the app starts up.
    onMount(() => {
        const saveJsonText =
            localStorage.getItem('circuitStoreSave') ||
            (console.log('No saved state found in localStorage.'), null)

        // sync up here.
        if (saveJsonText === null) {
            return
        }

        const saveJson = JSON.parse(saveJsonText)

        $circuitStore = saveJson

        existingConnections = translateConnectionsToSvelvet(
            $circuitStore.connectors
        )

        // console.log('circuitStore has devices on init')
        currentDevicesData = $circuitStore.devices
    })

    // create new node in the global store for circuitStore digital js backend.
    // sync the devices list with the currentDevicesData variable.
    const newGateCircuitStore = (
        gateType: string,
        uuid: string,
        options?: any
    ) => {
        const nodeName: string = `${gateType}_${uuid}`
        circuitStore.update((currentCircuit) => {
            // Add the new device with a unique ID, e.g., 'newDeviceId'
            // get function from map

            const newDevice: Device =
                options === undefined
                    ? deviceFactoryMap[gateType](nodeName)
                    : deviceFactoryMap[gateType](nodeName, options)

            // const nextDeviceNum = Object.keys(currentDevicesData).length
            currentCircuit.devices[nodeName] = newDevice

            // sync new Device data with currentDevicesData
            // I guess this could also just be currentDevicesData =
            // $circuitStore.devices, but it may update more frequently than we need.
            // makes more sense for it to be here.
            currentDevicesData = currentCircuit.devices
            // Add the new connector
            // currentCircuit.connectors.push(newConnector)

            // Return the updated circuit
            return currentCircuit
        })
        return nodeName
    }

    // this happens on every connection
    // ON change of global JSON circuit DATA, Run this.
    function generateNonce(length: number = 16): string {
        const charset =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return Array.from(
            values,
            (byte) => charset[byte % charset.length]
        ).join('')
    }

    // $inspect($circuitStore).with(console.log)
    // called on "drop" in sidemenugroupitems.svelte
    function createCanvasNode(e: any) {
        const gateType: logicGateTypes = e.gateType as logicGateTypes
        // this gate will update the store and then the subscribe will update the
        // list of circuits currently active on the screen

        // saves state to local storage on node add.
        const uuid = generateNonce()
        newGateCircuitStore(gateType, uuid)

        // save on every addition of a new node.
        saveCircuit()
    }

    // TELEPORT BUG GET FUCKED
    // try to fix the teleport bug.
    document.addEventListener('DOMContentLoaded', () => {
        const svelvetCanvas = document.querySelector('.svelvet-wrapper')
        if (svelvetCanvas) {
            // Create a MouseEvent with additional options
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
            })

            // Dispatch the event on the canvas
            svelvetCanvas.dispatchEvent(event)
            const eventUp = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
            })
            svelvetCanvas.dispatchEvent(eventUp)
        }
    })

    const clearCanvas = () => (currentDevicesData = {})
</script>

<main>
    <SideMenu {createCanvasNode} />
    <SimMenu {clearCanvas} />
    <CommandMenu {createCanvasNode} />
    <Svelvet theme="LogiCap" disableSelection={false} controls>
        <Minimap width={100} corner="NE" slot="minimap" />
        <ThemeToggle main="LogiCap" corner="NW" alt="LogiCap" slot="toggle" />
        {#each Object.entries(currentDevicesData) as [nodeId, device]}
            <!-- svelte-ignore svelte_component_deprecated -->
            <SimNode
                gateType={device.type as logicGateTypes}
                nodeProps={{
                    gateType: device.type as dualInputLogicTypes,
                    width: 80,
                    height: 50,
                    position: device.position,
                    connections:
                        existingConnections === undefined
                            ? []
                            : existingConnections.get(nodeId) || [],
                    nodeId,
                    // Add any other specific props your node components need
                }}
            />
            <!-- content here -->
        {/each}
        <!-- <Node id="testNode2" connections={['testNode1', 'in_testNode1']}> -->
        <!--     <div style="width:300px; background-color: red; height: 100px;"> -->
        <!--         testNode2 -->
        <!--     </div> -->
        <!--     <Anchor -->
        <!--         let:linked -->
        <!--         let:hovering -->
        <!--         let:connecting -->
        <!--         id={'out_testNode2'} -->
        <!--         key={'out_testNode2'} -->
        <!--         direction={'east'} -->
        <!--         output -->
        <!--     ></Anchor> -->
        <!-- </Node> -->
        <!-- <Node id="testNode1" position={{ x: 40, y: 60 }}> -->
        <!--     <div style="width:300px; background-color: red; height: 100px;"> -->
        <!--         testNode1 -->
        <!--     </div> -->
        <!--     <Anchor -->
        <!--         let:linked -->
        <!--         let:hovering -->
        <!--         let:connecting -->
        <!--         id={'in_testNode1'} -->
        <!--         key={'in_testNode1'} -->
        <!--         direction={'west'} -->
        <!--         input -->
        <!--     ></Anchor> -->
        <!-- </Node> -->
    </Svelvet>
</main>

<style>
    :root {
        --app-bar-height: 50px;
        --main-app-flex-height: calc(100vh - var(--app-bar-height));
    }

    /*   Hide the svelvet theme toggle button but make a proxy for it in simMenu.svelte */
    :global(.controls-wrapper:has(.save-button)) {
        display: none !important;
    }

    main {
        display: flex;
        flex-direction: row;
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        padding-left: calc(1.5vw);
        justify-content: center;
        align-items: center;
        /* max-height: 100vh; */
    }

    :global(.svelvet-node) {
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: auto !important;
        height: auto !important;
    }
    :global(
        .svelvet-wrapper,
        .svelvet-wrapper:focus-visible,
        .svelvet-wrapper:active,
        .svelvet-wrapper:focus
    ) {
        /* border-radius: 20px; */
        outline: none !important;
        border: none !important;
        box-shadow: unset !important;
    }
    :global(.svelvet-wrapper) {
        /* max-height: calc(100% - 3.5vh); */
        flex: 1;
    }
</style>
