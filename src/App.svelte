<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { Svelvet, Minimap, ThemeToggle } from 'svelvet'

    import { circuitStore } from './lib/circuitStore'
    import SideMenu from './lib/SideMenu/SideMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    import SimNode from './lib/SimNode.svelte'
    import type {
        dualInputLogicTypes,
        logicGateTypes,
    } from './lib/circuitModel'
    import { deviceFactoryMap } from './lib/makeDigitalJsJson'
    import SimMenu from './lib/SimMenu.svelte'

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
    // the Devices part of the digitalJS json.
    let currentDevicesData: DeviceRecord = $state({})

    // create new node in the global store for circuitStore digital js backend.
    // sync the devices list with the currentDevicesData variable.
    const newGateCircuitStore = (gateType: string) => {
        const nodeName: string = `${gateType}_${generateNonce()}`
        circuitStore.update((currentCircuit) => {
            // Add the new device with a unique ID, e.g., 'newDeviceId'
            // get function from map
            const newDevice: Device = deviceFactoryMap[gateType](nodeName)
            // const nextDeviceNum = Object.keys(currentDevicesData).length
            currentCircuit.devices[nodeName] = newDevice

            // sync new Device data with currentDevicesData
            // I guess this could also just be currentDevicesData =
            // $circuitStore.devices, but it may update more frequently than we need.
            currentDevicesData = currentCircuit.devices
            // Add the new connector
            // currentCircuit.connectors.push(newConnector)

            // Return the updated circuit
            return currentCircuit
        })
        return nodeName
    }
    $inspect($circuitStore).with(console.log)

    // called on "drop" in sidemenugroupitems.svelte
    function createCanvasNode(e: any) {
        const gateType: logicGateTypes = e.gateType as logicGateTypes
        // this gate will update the store and then the subscribe will update the
        // list of circuits currently active on the screen
        newGateCircuitStore(gateType)
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
</script>

<main>
    <SideMenu {createCanvasNode} />
    <SimMenu />
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
                    canvasClicked: true,
                    nodeId,
                    nodeStartPos: 200,
                    // Add any other specific props your node components need
                }}
            />
            <!-- content here -->
        {/each}
    </Svelvet>
</main>

<style>
    :root {
        --app-bar-height: 50px;
        --main-app-flex-height: calc(100vh - var(--app-bar-height));
    }

    /*   Hide the svelvet theme toggle button   */
    :global(button:has(.material-symbols-outlined)) {
        display: none !important;
    }
    :global(.controls-wrapper:has(.save-button)) {
        left: 360px !important;
    }

    :global(.save-button) {
        font-size: 1.5rem;
        padding-block: 5px !important;
        padding-inline: 8px !important;
    }
    /*   That CSS is kinda sick!!   */
    :global(.save-button::before) {
        content: '💾';
        margin-right: 10px;
        margin-left: 0px;
    }
    :global(.controls-wrapper:has(.save-button):hover) {
        filter: brightness(140%) !important;
        /* background-color: red !important; */
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
