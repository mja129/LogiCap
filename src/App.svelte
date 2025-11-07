<!-- https://coolorgS.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script module lang="ts">
    export function onWireConnection(wireId: string) {
        console.log('Success new connection made id: ' + wireId)
        // saveCircuit() // we could auto-save on wire linking
        // but save on reload pretty much covers us.
        return null
    }
</script>

<script lang="ts">
    import CommandMenu from './lib/CommandMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    // import Circuit from './Circuit.svelte'

    // import { deviceFactoryMap } from '@Util/makeDigitalJsJson'
    import { onMount } from 'svelte'
    import { Svelvet, Minimap, ThemeToggle } from 'svelvet'

    import {
        CircuitStore,
        loadCircuit,
        saveCircuit,
    } from '@CircuitStore'

    import type { logicGateTypes } from '@CircuitModel'

    import SideMenu from '@AppComponents/SideMenu/SideMenu.svelte'

    // I could call this 'generic' circuit or something
    import Circuit from './lib/Circuit.svelte'
    import SimMenu from '@AppComponents/SimMenu.svelte'
    import { fixSvelvetBugs, generateNonce, captureCurrentZoom } from './app'
    import SingleIoLogic from './lib/Circuits/LogicGates/SingleIoLogic.svelte'
    import TabMenu from '@AppComponents/TabMenu.svelte'
    import SettingsMenu from '@AppComponents/SettingsMenu.svelte'
    import ZoomThing from './lib/ZoomThing.svelte'
    import { setScale, setTranslation } from '@Util/graphUtils'

    // the Devices part of the digitalJS json. (manually synched with the CircuitStore)
    let currentDevicesData: Devices = $state({ ...$CircuitStore.devices })
    const clearDeviceData = () => (currentDevicesData = {})
    const setDeviceData = (devs: Devices) => (currentDevicesData = devs)

    let initialScale: number = $state(1)
    let initialTranslation: { x: number; y: number } = $state({ x: 0, y: 0 })

    let observer: MutationObserver

    // Dom stuff to find svelvet transformation data
    const querySelector = '[class^="svelvet-graph-wrapper"]'

    function parseTransform(transform: string) {
        // Some matching voodoo
        const match = transform.match(
            /translate\(([-.\d]+)px,\s*([-.\d]+)px\)\s*scale\(([-.\d]+)\)/
        )
        if (!match) return

        const [, x, y, scale] = match.map(Number)
        localStorage.setItem('canvasZoom', scale.toString())
        localStorage.setItem('canvasTranslation', JSON.stringify({ x, y }))
    }

    // const setDeviceData = (newData: Devices) => (currentDevicesData = newData)

    // check if circuitStore is not null when the app starts up.
    onMount(() => {
        // All three of these ways work
        // loadCircuit((newData: Devices) => setDeviceData(newData))
        // loadCircuit((newData: Devices) => (currentDevicesData = newData))
        initialScale = parseFloat(localStorage.getItem('canvasZoom') || '1')
        initialTranslation = JSON.parse(
            localStorage.getItem('canvasTranslation') || '{"x":0,"y":0}'
        )

        loadCircuit() // load circuit from LS into CircuitStore,
        currentDevicesData = $CircuitStore.devices

        fixSvelvetBugs() // doesn't have to be on mount could just be in the component scope its the same.
        //Needs to wait until the dom catches up
        requestAnimationFrame(() => {
            const el = document.querySelector(querySelector) as HTMLElement

            if (!el) {
                console.warn('ZoomTrackerDOM: Svelvet wrapper not found')
                return
            }

            parseTransform(el.style.transform)

            observer = new MutationObserver(() => {
                parseTransform(el.style.transform)
            })

            observer.observe(el, {
                attributes: true,
                attributeFilter: ['style'],
            })
        })
        // restrictFitViewZoom()
    })

    // save circuit on page reload.
    window.addEventListener('beforeunload', () => {
        saveCircuit()
    })

    // create new node in the global store for circuitStore digital js backend.
    // sync the devices list with the currentDevicesData variable.

    // called on "drop" in sidemenugroupitem.svelte
    function createCanvasDevice(e: MouseEvent & { gateType: string, celltype?: string }) {
        const gateType: logicGateTypes = e.gateType as logicGateTypes
        // this gate will update the store and then the subscribe will update the
        // list of circuits currently active on the screen

        // saves state to local storage on node add.
        const uuid = generateNonce()

        // create new gate on global circuit store on drop
        var newDeviceList
        if (e.celltype) {  
          newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid,
              undefined,
              e.celltype
          ) as Devices
        } else {
          newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid
          ) as Devices
        }
        currentDevicesData = newDeviceList

        // save on every addition of a new node.
        saveCircuit()
    }
    // fitView={true}

    let setDevices = (d: Devices) => (currentDevicesData = d)
    let currCircuitName = $state('')

    function deletedSelectedNodes(){
        let domEls = Object.keys(currentDevicesData)
            .map((x) => 'N-' + x)
            .map((x) => document.getElementById(x))

        let selected = domEls.filter((x) =>
            x === null ? false : x.classList.contains('selected')
        )
        let not_selected = domEls.filter((x) =>
            x === null ? false : !x.classList.contains('selected')
        )

        let newDeviceList = currentDevicesData

        let ids_to_del = selected.map((x) =>
            x === null ? '' : x.id.substring(2)
        )
        ids_to_del.forEach((id) => {
            newDeviceList = CircuitStore.removeCircuitDevice(id)
            // delete newDeviceList[id]
        })
        currentDevicesData = newDeviceList
        // setDevices(newDeviceList);
        saveCircuit()
    }

    async function copySelectedNodes() {
        let domEls = Object.keys(currentDevicesData)
            .map((x) => 'N-' + x)
            .map((x) => document.getElementById(x))

        let selected = domEls.filter((x) =>
            x === null ? false : x.classList.contains('selected')
        )
        let ids_to_copy = selected.map((x) =>
            x === null ? '' : x.id.substring(2)
        )

        // TODO redo this
        saveCircuit()

        let save = JSON.parse(localStorage.getItem('circuitStoreSave') ?? '')

        let copiedCircuits: any = {
            devices: {},
            connectors: {},
        }

        copiedCircuits.devices = Object.fromEntries(
            Object.entries(save.devices).filter(([key]) =>
                ids_to_copy.includes(key)
            )
        )

        copiedCircuits.connectors = save.connectors
        for (const src of Object.keys(copiedCircuits.connectors)) {
            if (ids_to_copy.includes(src.slice('out_'.length))) {
                let filtered = copiedCircuits.connectors[src].filter(
                    (arr: any) => {
                        // arr should be [deviceName, devicePort]
                        return ids_to_copy.includes(arr[0])
                    }
                )
                copiedCircuits.connectors[src] = filtered
            } else {
                delete copiedCircuits.connectors[src]
            }
        }

        await navigator.clipboard.writeText(JSON.stringify(copiedCircuits))
        // debugger;
    }

    function pasteNodes() {
        navigator.clipboard.readText().then((text) => {
            let circuitToPaste = JSON.parse(text)

            let circuitRenaming: any = {}

            const positions = Object.values(circuitToPaste.devices).map((d: any) => d.position);
            const xMin = Math.min(...positions.map(p => p.x));
            const xMax = Math.max(...positions.map(p => p.x));
            const yMin = Math.min(...positions.map(p => p.y));
            const yMax = Math.max(...positions.map(p => p.y));

            let cur = (window as any).getCursor();

            let newDeviceData = null;
            for (let devName of Object.keys(circuitToPaste.devices)) {
                circuitRenaming[devName] =
                    devName.split('_')[0] + '_' + generateNonce()
                let gateType = circuitToPaste.devices[devName].type;

                let device = circuitToPaste.devices[devName];

                let relativeX =  device.position.x - xMin;
                let relativeY =  device.position.y - yMin;

                newDeviceData = CircuitStore.addCircuitDevice(
                    gateType,
                    circuitRenaming[devName].split('_')[1],
                    {
                        rotation: device.rotation,
                        position: {
                            x: cur.x + relativeX,
                            y: cur.y + relativeY
                        }
                    }
                )
            }
            currentDevicesData = newDeviceData as Devices;

            for (let srcName of Object.keys(circuitToPaste.connectors)) {
                let renamedSrcName: any = 'out_' + circuitRenaming[srcName.slice('out_'.length)]

                for (let target of circuitToPaste.connectors[srcName]) {
                    let renamedTargetName = circuitRenaming[target[0]]
                    let renamedTargetPort = target[1].replace(
                        target[0],
                        renamedTargetName
                    )

                    console.log('adding',renamedSrcName,renamedTargetPort);
                    CircuitStore.addConnection(
                        renamedSrcName,
                        renamedTargetPort
                    )
                }
            }
            console.log('rename',circuitRenaming);
            saveCircuit();

        })
        // debugger;
        // we need to randomize the circuitName before we paste it in
    }
</script>

<main id="logicap">
    <SettingsMenu />
    <SideMenu {createCanvasDevice} />
    <SimMenu
        clearCanvas={clearDeviceData}
        {currCircuitName}
        setCanvas={setDevices}
    />
    <CommandMenu
        {createCanvasDevice}
        {deletedSelectedNodes}
        {copySelectedNodes}
        {pasteNodes}
    />
    <TabMenu {clearDeviceData} {setDeviceData} />

    <!-- [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/border) -->
    <Svelvet
        theme="LogiCap"
        zoom={initialScale}
        translation={initialTranslation}
        editable={false}
        disableSelection={false}
        controls
    >
        <ZoomThing></ZoomThing>
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
        outline: none !important;
        border: none !important;
        box-shadow: unset !important;
    }
    :global(.svelvet-wrapper) {
        /* max-height: calc(100% - 3.5vh); */
        flex: 1;
    }
</style>
