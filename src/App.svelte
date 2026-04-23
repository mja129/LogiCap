<!-- https://coolorgS.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script module lang="ts">
    import { CircuitStore, loadCircuit, saveCircuit } from '@CircuitStore'
    import { type CircuitSave, createCircuitSave, type SingleSaveDataFormat } from '@src/lib/circuitSave.ts'
    import { get, type Readable, writable, type Writable } from 'svelte/store'

    export const canvasTransform = writable({ x: 0, y: 0, scale: 1 })

    export function onWireConnection(wireId: string) {
        console.log('Success new connection made id: ' + wireId)
        // saveCircuit() // we could auto-save on wire linking
        // but save on reload pretty much covers us.
        return null
    }

    /**
     * The save file representing the current open project.
     */
    export const circuitSave: CircuitSave = createCircuitSave(localStorage.getItem('currentCircuitSave') || undefined);
    /**
     * Forces a save that syncs the CircuitStore with the save file.
     */
    export function saveCircuitSave() {
        saveCircuit();
        (circuitSave.getCircuit(get(currentCircuit)) as SingleSaveDataFormat).circuit = get(CircuitStore);
        localStorage.setItem('currentCircuitSave', circuitSave.getSaveJson());
    }

    /**
     * Writable representing the name of the current displayed circuit.
     */
    export const currentCircuit: Writable<string> = writable(localStorage.getItem('currentActiveCircuit') || circuitSave.getMainCircuitName());
    currentCircuit.subscribe(currentCircuit => { // track changes in local storage
        localStorage.setItem('currentActiveCircuit', currentCircuit);
    });
    const circuitLoadTrigger_i: Writable<boolean> = writable(false);
    /**
     * Trigger to listen for when the loaded circuit changes.
     */
    export const circuitLoadTrigger: Readable<boolean> = circuitLoadTrigger_i;

    /**
     * Changes the circuit currently being displayed (and housed by the CircuitStore).
     * @param name The name of the circuit to load and display.
     * @param save Whether the currently displayed circuit should be saved before being closed.
     */
    export function setCurrentCircuit(name: string, save: boolean = true) {
        if (save) {
            saveCircuitSave();
        }
        const circuit = circuitSave.getCircuit(name);
        if (circuit === null) {
            console.log(`Attempted to load unknown circuit '${name}'!`);
            return;
        }
        loadCircuit(circuit.circuit);
        currentCircuit.set(name);
        circuitLoadTrigger_i.update((rerender: boolean) => !rerender);
    }
</script>

<script lang="ts">
    import CommandMenu from './lib/CommandMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    // import Circuit from './Circuit.svelte'

    // import { deviceFactoryMap } from '@Util/makeDigitalJsJson'
    import { onMount } from 'svelte'
    import { Svelvet, Minimap, ThemeToggle } from 'svelvet'

    import type { logicGateTypes, allNodeTypes } from '@CircuitModel'

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
    import WireCanvas from './lib/CircuitParts/WireCanvas.svelte'
    import { wireMode, selectedWireIds, selectedNodeIds } from './lib/wireModeStore'

    // the Devices part of the digitalJS json. (manually synched with the CircuitStore)
    let currentDevicesData: Devices = $state({ ...$CircuitStore.devices })
    const clearDeviceData = () => {
        currentDevicesData = {};
        $CircuitStore.wireManipulations = {};
    }
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
        canvasTransform.set({ x, y, scale })
        let saveData = circuitSave.getCircuit(get(currentCircuit));
        if (saveData !== null) {
            saveData.zoom = scale;
            saveData.translation = { x: x, y: y };
        }
    }

    // const setDeviceData = (newData: Devices) => (currentDevicesData = newData)

    // check if circuitStore is not null when the app starts up.
    onMount(() => {
        // All three of these ways work
        // loadCircuit((newData: Devices) => setDeviceData(newData))
        // loadCircuit((newData: Devices) => (currentDevicesData = newData))

        // prepare initial view
        const saveData = circuitSave.getCircuit(get(currentCircuit)) as SingleSaveDataFormat;
        initialScale = saveData.zoom;
        initialTranslation = saveData.translation;

        // populate circuit
        setCurrentCircuit(get(currentCircuit), false);
        circuitLoadTrigger.subscribe(() => {
            setDeviceData($CircuitStore.devices);
            const saveData = circuitSave.getCircuit(get(currentCircuit)) as SingleSaveDataFormat;
            setScale(saveData.zoom);
            setTranslation(saveData.translation);
        })

        fixSvelvetBugs() // doesn't have to be on mount could just be in the component scope its the same.
        //Needs to wait until the dom catches up
        requestAnimationFrame(() => {
            const el = document.querySelector(querySelector) as HTMLElement

            if (!el) {
                console.warn('ZoomTrackerDOM: Svelvet wrapper not found')
                return
            }

            parseTransform(el.style.transform)

            // Re-apply the current transform so Svelvet's Background component
            // re-reads offsetWidth/Height now that layout has settled, fixing
            // the initial dot-grid offset (same issue as the window resize case).
            const { x, y, scale } = get(canvasTransform)
            setTranslation({ x, y })
            setScale(scale)

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
        saveCircuitSave();
    })

    // When the window resizes, svelvet's Background component doesn't know the
    // wrapper dimensions changed (it only re-reads offsetWidth/Height when
    // translationStore updates). Re-applying the current translation forces the
    // reactive block to re-run with the correct dimensions.
    window.addEventListener('resize', () => {
        const { x, y, scale } = get(canvasTransform);
        setTranslation({ x, y });
        setScale(scale);
    })

    // create new node in the global store for circuitStore digital js backend.
    // sync the devices list with the currentDevicesData variable.

    // called on "drop" in sidemenugroupitem.svelte
    function createCanvasDevice(e: MouseEvent & { gateType: string, celltype?: string, inputs?: number, outputs?: number }) {
        const gateType: allNodeTypes = e.gateType as allNodeTypes
        // this gate will update the store and then the subscribe will update the
        // list of circuits currently active on the screen

        // saves state to local storage on node add.
        const uuid = generateNonce()

        // create new gate on global circuit store on drop
        var newDeviceList
        if (gateType == 'TunnelInput' || gateType == 'TunnelOutput') {
          let tunnelName = prompt('Enter tunnel name:')
          if (!tunnelName) return
          newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid,
              {
                celltype: tunnelName.toLowerCase(), // make tunnels case insensitive bc everything is capitalized in this font lol
              }
          ) as Devices
        } else if (gateType == 'Demux') {
            //Create device
            newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid,
              { 
                celltype: 'Demux'
             }
            ) as Devices
        } else if (gateType == 'Encoder') {
        // Get the amount of bits for the Encoder using a prompt()
            let selStr = prompt('Enter number of select bits (1, 2, 3, or 4):')
            if(!selStr) return
            let selbits = parseInt(selStr) //convert string to int
            //Diagnostic
            if(![1, 2, 3, 4].includes(selbits)) {
                alert('Invalid number of data bits. Enter either 1, 2, 3, or 4.')
                return
            }
            //Create device and pass bits in
            newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid,
              { 
                selbits,
                celltype: `Encoder_${selbits}`
             } //also passes celltype so it's accessible in circuitStore.ts
            ) as Devices
        } else if (gateType == 'Decoder') {
        // Get the amount of bits for the Decoder using a prompt()
            let selStr = prompt('Enter number of select bits (1, 2, 3, or 4):')
            if(!selStr) return
            let selbits = parseInt(selStr) //convert string to int
            //Diagnostic
            if(![1, 2, 3, 4].includes(selbits)) {
                alert('Invalid number of data bits. Enter either 1, 2, 3, or 4.')
                return
            }
            //Create device and pass bits in
            newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid,
              { 
                selbits,
                celltype: `Decoder_${selbits}`
             }
            ) as Devices
        } else if (e.celltype) {
          try {
            newDeviceList = CircuitStore.addCircuitDevice(
                gateType,
                uuid,
                {
                  celltype: e.celltype,
                  inputs: e.inputs,
                  outputs: e.outputs
                }
            ) as Devices
          } catch {
            console.log('circuit add aborted')
            return
          }
        } else if (gateType === 'BusGroup' || gateType === 'BusUngroup') {
            const bitsStr = prompt(`Enter number of bits (2–16):`)
            if (!bitsStr) return
            const bits = parseInt(bitsStr)
            if (isNaN(bits) || bits < 2 || bits > 16) {
                alert('Invalid number of bits. Enter a value between 2 and 16.')
                return
            }
            newDeviceList = CircuitStore.addCircuitDevice(
                gateType,
                uuid,
                { groups: Array(bits).fill(1) }
            ) as Devices
        } else {
          newDeviceList = CircuitStore.addCircuitDevice(
              gateType,
              uuid
          ) as Devices
        }
        currentDevicesData = newDeviceList

        // save on every addition of a new node.
        saveCircuitSave();
    }
    // fitView={true}

    //Helper function to map a device to its display gate type
    //Add a new if-statement for each hard-coded circuit
    function getGateType(device: CircuitDevice): logicGateTypes {
        const sub = device as Subcomponent;
        if (sub.celltype?.startsWith('Demux')) return 'Demux';
        if (sub.celltype?.startsWith('Encoder')) return 'Encoder';
        if (sub.celltype?.startsWith('Decoder')) return 'Decoder';
        return device.type as logicGateTypes;
    }

    let setDevices = (d: Devices) => (currentDevicesData = d)

    function deletedSelectedNodes(){
        const selNodes = get(selectedNodeIds);
        const ids_to_del = Object.keys(currentDevicesData).filter(id => selNodes.has(id));

        let newDeviceList = currentDevicesData
        ids_to_del.forEach((id) => {
            newDeviceList = CircuitStore.removeCircuitDevice(id)
        })
        currentDevicesData = newDeviceList
        selectedNodeIds.set(new Set())

        // Also delete any selected wire segments
        const selWires = get(selectedWireIds);
        if (selWires.size > 0) {
            CircuitStore.update(circuit => {
                circuit.wireSegments = circuit.wireSegments.filter(seg => !selWires.has(seg.id));
                return circuit;
            });
            selectedWireIds.set(new Set());
        }

        // setDevices(newDeviceList);
        saveCircuitSave();
    }

    async function copySelectedNodes() {
        const selNodes = get(selectedNodeIds);
        const ids_to_copy = Object.keys(currentDevicesData).filter(id => selNodes.has(id));
        if (ids_to_copy.length === 0) { // nothing to copy
            return;
        }

        // TODO redo this
        saveCircuitSave();
        // create a clone of the circuit
        let save = JSON.parse(JSON.stringify(circuitSave.getCircuit($currentCircuit)?.circuit));
        if (save === null) { // should be impossible
            console.log("if you are seeing this, very bad things have happened");
            return;
        }

        let copiedCircuits: any = {
            devices: {},
            connectors: {},
            subcircuits: {}
        }

        copiedCircuits.devices = Object.fromEntries(
            Object.entries(save.devices).filter(([key]) =>
                ids_to_copy.includes(key)
            )
        )

        let all_subcircuit_names_used = Object.values(copiedCircuits.devices)
            .filter( (d: any) => d.type === "Subcircuit")
            .map( (d : any) => d.celltype);
        let subcircuit_q = [...all_subcircuit_names_used];

        while (subcircuit_q.length > 0){
            let subcircuitName = subcircuit_q.pop();
            if (!all_subcircuit_names_used.includes(subcircuitName)){
                all_subcircuit_names_used.push(subcircuitName);
            }

            let subcircuit_to_explore = circuitSave.getCircuit(subcircuitName)?.circuit;

            for (let device of Object.values(subcircuit_to_explore?.devices ?? {})){
                if(device.type === "Subcircuit"){
                    subcircuit_q.push((device as any ).celltype);
                }
            }
        }

         all_subcircuit_names_used.forEach( subCircuitName=>{
            copiedCircuits.subcircuits[subCircuitName] = circuitSave.getCircuit(subCircuitName)
        })

        let anyEndsWith = (query:string , possibleSuffixes: string[]) =>{
            return possibleSuffixes.some((x: string)=>query.endsWith(x))
        }

        copiedCircuits.connectors = save.connectors
        for (const src of Object.keys(copiedCircuits.connectors)) {
            if (anyEndsWith(src,ids_to_copy) ) {
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

                let newOptions = {...device};

                newOptions.position = {
                    x: cur.x + relativeX,
                    y: cur.y + relativeY
                }

                delete newOptions.label;
                delete newOptions.net;
                
                newDeviceData = CircuitStore.addCircuitDevice(
                    gateType,
                    circuitRenaming[devName].split('_')[1],
                    newOptions
                )
            }
            currentDevicesData = newDeviceData as Devices;

            for (let srcName of Object.keys(circuitToPaste.connectors)) {
                // let renamedSrcName: any = 'out_' + circuitRenaming[srcName.slice('out_'.length)]

                let renamedSrcName: any = srcName.split("_")[0] + "_" + circuitRenaming[srcName.split("_").slice(1).join('_')];

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

            for(let subCircuitName of Object.keys(circuitToPaste.subcircuits)){
                circuitSave.createSubcomponent(subCircuitName); 
                circuitSave.setCircuit(subCircuitName, circuitToPaste.subcircuits[subCircuitName]);
            }

            saveCircuitSave();

        })
    }
</script>

<main id="logicap">
    <SettingsMenu />
    <SideMenu {createCanvasDevice} />
    <SimMenu
        clearCanvas={clearDeviceData}
    />
    <CommandMenu
        {createCanvasDevice}
        {deletedSelectedNodes}
        {copySelectedNodes}
        {pasteNodes}
    />
    <TabMenu />

    <!-- [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/border) -->
    <div class="canvas-container">
        <Svelvet
            theme="LogiCap"
            zoom={initialScale}
            translation={initialTranslation}
            editable={false}
            disableSelection={false}
            pannable={$wireMode == 0}
            controls 
        >
            <ZoomThing></ZoomThing>
            <Minimap width={100} corner="NE" slot="minimap" />
            <ThemeToggle main="LogiCap" corner="NW" alt="LogiCap" slot="toggle" />
            {#each Object.entries(currentDevicesData) as [nodeId, device] (nodeId)}
                <!-- For gateType, uses celltype to identify Encoder and use its own Svelte file -->
                <Circuit
                    gateType={getGateType(device)}
                    position={device.position}
                    {nodeId}
                    nodeProps={{
                        ...(device.type && { gateType: device.type }),
                        width: 80,
                        height: 50,
                        ...((device as Subcomponent).celltype && { celltype: (device as Subcomponent).celltype, inputs: (device as Subcomponent).inputs, outputs: (device as Subcomponent).outputs }),
                        ...((device as BusGroup).groups && { groups: (device as BusGroup).groups }),
                        ...(device.type === 'Constant' && { bits: (device as Constant).bits, value: (device as Constant).value }),
                    }}
                />
            {/each}
        </Svelvet>
        <WireCanvas />
    </div>
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
    .canvas-container {
        position: relative;
        flex: 1;
        height: 100%;
        display: flex;
    }
    :global(.svelvet-wrapper) {
        /* max-height: calc(100% - 3.5vh); */
        flex: 1;
    }
</style>
