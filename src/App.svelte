<!-- https://coolorgS.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script module>
    export function onWireConnection() {
        console.log('CONNECTED IN APP')
        // saveCircuit() // we could auto-save on wire linking
        return null
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { Svelvet, Minimap, ThemeToggle } from 'svelvet'

    import { CircuitStore, loadCircuit, saveCircuit } from '@CircuitStore'

    import type { logicGateTypes } from '@CircuitModel'

    import SideMenu from '@AppComponents/SideMenu/SideMenu.svelte'

    // I could call this 'generic' circuit or something
    import Circuit from './lib/Circuit.svelte'
    import SimMenu from '@AppComponents/SimMenu.svelte'
    import { fixSvelvetBugs, generateNonce } from './app'

    // the Devices part of the digitalJS json. (manually synched with the CircuitStore)
    let currentDevicesData: Devices = $state({ ...$CircuitStore.devices })
    const clearDeviceData = () => (currentDevicesData = {})
    // const setDeviceData = (newData: Devices) => (currentDevicesData = newData)

    // check if circuitStore is not null when the app starts up.
    onMount(() => {
        // All three of these ways work
        // loadCircuit((newData: Devices) => setDeviceData(newData))
        // loadCircuit((newData: Devices) => (currentDevicesData = newData))
        loadCircuit() // load circuit from LS into CircuitStore,
        currentDevicesData = $CircuitStore.devices
        fixSvelvetBugs() // doesn't have to be on mount could just be in the component scope its the same.
    })

    // save circuit on page reload.
    window.addEventListener('beforeunload', () => {
        saveCircuit()
    })

    // create new node in the global store for circuitStore digital js backend.
    // sync the devices list with the currentDevicesData variable.

    // called on "drop" in sidemenugroupitem.svelte
    function createCanvasDevice(e: MouseEvent & { gateType: string }) {
        const gateType: logicGateTypes = e.gateType as logicGateTypes
        // this gate will update the store and then the subscribe will update the
        // list of circuits currently active on the screen

        // saves state to local storage on node add.
        const uuid = generateNonce()

        // create new gate on global circuit store on drop
        const newDeviceList = CircuitStore.addCircuitDevice(
            gateType,
            uuid
        ) as Devices
        currentDevicesData = newDeviceList

        // save on every addition of a new node.
        saveCircuit()
    }
</script>

<main id="logicap">
    <SideMenu {createCanvasDevice} />
    <SimMenu clearCanvas={clearDeviceData} />
    <Svelvet theme="LogiCap" disableSelection={false} controls>
        <Minimap width={100} corner="NE" slot="minimap" />
        <ThemeToggle main="LogiCap" corner="NW" alt="LogiCap" slot="toggle" />
        {#each Object.entries(currentDevicesData) as [nodeId, device] (nodeId)}
            <Circuit
                gateType={device.type as logicGateTypes}
                position={device.position}
                {nodeId}
                nodeProps={{
                    ...(device.type && { gateType: device.type }),
                    width: 80,
                    height: 50,
                    // Add any other specific props your node components need
                }}
            />
        {/each}
    </Svelvet>
</main>

<style>
    :root {
        --app-bar-height: 50px;
        --main-app-flex-height: calc(100vh - var(--app-bar-height));
    }

    /*   Hide the svelvet theme toggle button but make a proxy for it in simMenu.svelte *note 'has selector in css' is pretty cool*/
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
        min-width: 80px;
        min-height: 50px;
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
