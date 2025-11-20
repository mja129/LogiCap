import { writable, get, type Writable } from 'svelte/store'
import { deviceJsonFactoryMap } from './Util/makeDigitalJsJson'
import { setScale, setTranslation} from '@Util/graphUtils'
import { circuitSave, currentCircuit } from '@src/App.svelte'

// Explains the json representation
// https://github.com/tilk/digitaljs

interface CircuitStoreType extends Writable<Circuit> {
    reset(): void
    addConnection(
        fromAnchorId: outputAnchorName,
        toAnchorId: inputAnchorName
    ): void
    removeConnection(inputAnchorId: string): void
    addCircuitDevice(gateType: string, uuid: string, options?: any, celltype?: string): Devices
    removeCircuitDevice(gateTypePlus_uuid:string) : Devices
}

// TODO put somewhere better?
export function createEmptyCircuit(): Circuit {
    return {
        devices: {},
        connectors: {},
        subcircuits: [],
        wireManipulations: {},
    };
}

// create a custom svelte store
const createCircuitStore = (): CircuitStoreType => {
    const initialCircuit: Circuit = createEmptyCircuit();
    const { subscribe, set, update } = writable<Circuit>(initialCircuit)

    return {
        subscribe,
        set,
        update,
        reset: () =>
            update(() => {
                return {
                    devices: {},
                    connectors: {},
                    subcircuits: [],
                    wireManipulations: {},
                }
            }),
        addConnection: (fromId: outputAnchorName, toId: inputAnchorName) => {
            const toNodeId: inputGateName = toId.substring(
                toId.indexOf('_') + 1
            ) as inputGateName
            update((currCircuit) => {
                if (!(fromId in currCircuit.connectors)) {
                    currCircuit.connectors[fromId] = new Array()
                }
                // I wanna check if the full array copy is needed here, I think it is tbh
                currCircuit.connectors[fromId] = [
                    ...currCircuit.connectors[fromId],
                    [toNodeId, toId],
                ]
                console.log(currCircuit.connectors)
                return currCircuit
            })
        },
        removeConnection: (inputAnchorId: string) => {
            update((currCircuit) => {
                const newConnectors: SvelvetConnectors = {}
                // O(N*M) where N is number of output anchors
                // and M is the number of connections per output anchor
                // this could be faster.
                for (const fromAnchorId in currCircuit.connectors) {
                    // Filter out any connections that match the `toAnchorId`
                    // This logic would also remove duplicates, could be good or bad.
                    newConnectors[fromAnchorId as outputAnchorName] = [
                        ...currCircuit.connectors[
                            fromAnchorId as outputAnchorName
                        ].filter(([, anchorId]) => {
                            return anchorId !== inputAnchorId
                        }),
                    ]
                }
                // console.log(newConnectors);
                currCircuit.connectors = newConnectors
                return currCircuit
            })
        },
        addCircuitDevice: (gateType: string, uuid: string, options?: any) => {
            const nodeName: string = `${gateType}_${uuid}`
            let newDevices: Devices | null = null;
            let celltype = options?.celltype;
            update((currCircuit) => {
                const newDevice: Device =
                    options === undefined
                        ? deviceJsonFactoryMap[gateType](nodeName)
                        : deviceJsonFactoryMap[gateType](nodeName, options)

                if (gateType == 'Subcircuit') {
                    if (currCircuit.subcircuits.indexOf(celltype) == -1) currCircuit.subcircuits.push(celltype)
                    // detect recursive subcircuitry
                    let queue: string[][] = [[get(currentCircuit)]]
                    while (queue.length > 0) {
                        let item = queue.pop()
                        if (!item) {continue}
                        let lastCircJson = circuitSave.getCircuit(item[item.length - 1])
                        lastCircJson.subcircuits.forEach((newCirc: string) => {
                            if (item.indexOf(newCirc) != -1) {
                                item.push(newCirc)
                                alert('Recursive subcircuitry!\n' + item.join(' -> '))
                                throw Error
                            }
                            item.push(newCirc)
                            queue.push(item)
                        })
                    }
                }
                currCircuit.devices[nodeName] = newDevice
                newDevices = currCircuit.devices

                return currCircuit
            })
            if (newDevices === null) {
                throw new Error('devices null after setting devices')
            }
            return newDevices
        },
        removeCircuitDevice(gateTypePlus_uuid:string) {
            let newDevices: Devices | null = null
            update((currCircuit) => {
                delete currCircuit.devices[gateTypePlus_uuid];
                newDevices = currCircuit.devices
                return currCircuit
            })
            if (newDevices === null) {
                throw new Error('devices null after setting devices')
            }
            // todo remove orphaned wire connection
            return newDevices;
        },
    }
}

export const CircuitStore: CircuitStoreType = createCircuitStore()

// the info that we will extract from the svelvet save.
type NodeInfoList = {
    nodeType: string
    uuid: string
    position: { x: number; y: number }
}[]

// this function could be associated with the circuit store object
export function findOutputAnchor(inputAnchorId: string) {
    let outputAnchorId: outputAnchorName | undefined
    // O(N*M) where N is number of output anchors
    // and M is the number of connections per output anchor
    // this could be faster.
    for (const fromAnchorId in get(CircuitStore).connectors) {
        // Filter out any connections that match the `toAnchorId`
        // This logic would also remove duplicates, could be good or bad.
        get(CircuitStore).connectors[
            fromAnchorId as outputAnchorName
        ].forEach(([inputNode, inputAnc]) => {
            // console.log(inputAnc)
            if (inputAnc === inputAnchorId) {
                outputAnchorId = fromAnchorId as outputAnchorName
            }
        })
    }
    // console.log(outputAnchorTuple)
    return outputAnchorId
}

// SAVE RELATED CODE //

// filters the svelvet library store for the data that we need.
function filterSvelvetSave(saveJsonText: string) {
    const saveJson: SvelvetSave = JSON.parse(saveJsonText)

    if (saveJson.nodes.length === 0) {
        console.warn('save json exists but there are no nodes')
        return null
    }

    const savedNodeNames: NodeInfoList = saveJson.nodes.map(
        (node: SvelvetNode) => {
            let [nodeType, uuid] = node.id.substring(2).split('_')
            return { nodeType, uuid, position: node.position }
        }
    )
    return savedNodeNames
}

function getLsItem(lsKey: string): string | null {
    return (
        localStorage.getItem(lsKey) ||
        (console.warn(`No saved "${lsKey}" found in localStorage.`), null)
    )
}

// saves positions from svelvet save to CircuitStore, in memory
function savePositionsToCircuitStore() {
    // this is an arrow function because this function kinda loads -> and saves
    // and it could be a separate function, I want it to be at least named getSvelvetSave
    // so im wrapping for the naming.
    const getSvelvetSave = () => getLsItem('state')
    const saveJsonText = getSvelvetSave()

    // early return, state not found in localStorage
    if (!saveJsonText) return console.warn('svelvet save unsucessful'), null

    const savedNodeNames: NodeInfoList | null = filterSvelvetSave(saveJsonText)

    // state exists but there are no nodes.
    if (savedNodeNames === null) return null

    // create saved nodes on canvas.
    CircuitStore.update((currCircuit) => {
        savedNodeNames.forEach(({ nodeType, uuid, position }) => {
            const nodeName = `${nodeType}_${uuid}`
            if(nodeName in currCircuit.devices){
                currCircuit.devices[nodeName].position = position
            }
        })
        return currCircuit
    })
}

export function clickSvelvetSave() {
    const svelvetSaveButton = document.querySelector('.save-button')
    const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    })
    // const mouseEventUp = new MouseEvent('mouseup', { bubbles: true })
    svelvetSaveButton?.dispatchEvent(mouseEvent)
    // some error handling?
}

// this is essentially a sync with localStorage.
// Sync svelvet by clicking its button through clickListener, (I could probably find the function they use on this button lol, sounds like a good idea)
export function saveCircuit() {
    // click on the hidden svelvet button, the button is in "theme toggle" but I set it to display: none,
    // and now we trigger it with css, after it triggers we use the svelvet json positions to set our digitial js positions
    // the digitalJS save is the main save and we are just piggybacking off the svelvet save a bit
    // the svelvet save does save our camera position and stuff though.
    clickSvelvetSave()

    savePositionsToCircuitStore()
}

// on reload the saved connections are sent implicitly through the Circuit components
// but the 'currentDevicesData' state variable in App.svelte
// needs to sync with the CircuitStore.devices on loadCircuit, and this is why we pass in a function
// to set that state 'remotely' lets say
// default is local storage
function validateSavedCircuit(savedCircuit: any) {
    if (!savedCircuit?.devices || !savedCircuit?.connectors || !savedCircuit?.subcircuits) {
		let missingProps = "";
		if(!savedCircuit?.devices) missingProps += "[Devices]";
		if(!savedCircuit?.devices) missingProps += "[Connectors]";
		if(!savedCircuit?.devices) missingProps += "[Subciruits]";


      throw new Error('Parsed circuit object is missing required properties ' + missingProps);
    }
    else if (Object.keys(savedCircuit.devices).length === 0) {
      console.log('Loaded in a valid circuit with empty devices');
    }
}

export function loadCircuit(circuit: Circuit) {
    validateSavedCircuit(circuit);

    CircuitStore.set({
        devices: circuit.devices,
        connectors: circuit.connectors,
        subcircuits: circuit.subcircuits,
        wireManipulations: circuit.wireManipulations
    });

    // TODO improve this...
    if ((circuit as any).translation) {
        setTranslation((circuit as any).translation);
    }
    if ((circuit as any).zoom) {
        console.log((circuit as any).zoom);
        setScale((circuit as any).zoom);
    }
}
