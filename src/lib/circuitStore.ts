import { writable, get, type Writable } from 'svelte/store'
import { deviceJsonFactoryMap } from './Util/makeDigitalJsJson'
import { circuitSave, currentCircuit } from '@src/App.svelte'

// Explains the json representation
// https://github.com/tilk/digitaljs

interface CircuitStoreType extends Writable<Circuit> {
    reset(): void
    addCircuitDevice(gateType: string, uuid: string, options?: any, celltype?: string): Devices
    removeCircuitDevice(gateTypePlus_uuid:string) : Devices
}

// TODO put somewhere better?
// gutting the wireManipulations -- its no longer need with the new wiring system
export function createEmptyCircuit(): Circuit {
    return {
        devices: {},
        connectors: {},
        subcircuits: [],
        wireSegments: [],
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
                    wireSegments: [],
                }
            }),
        
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
                    let queue: string[][] = [[get(currentCircuit)]];
                    while (queue.length > 0) {
                        let item = queue.pop()
                        if (!item) {continue}

                        let subcircuitName = item[item.length - 1];

                        let lastCircJson = circuitSave.getCircuit(subcircuitName)?.circuit as Circuit
                        if (!lastCircJson){
                            console.warn("subcircut not defined!");
                            circuitSave.createSubcomponent(subcircuitName);
                            continue;
                        }
                        lastCircJson.subcircuits.forEach((newCirc: string) => {
                            if (item.indexOf(newCirc) != -1) {
                                console.error("recursive subcir");
                                currCircuit.subcircuits.pop(); // remove subcircuit we just pushed since it causes recursion
                                alert('Recursive subcircuitry!\n' + item.join(' -> '))
                                throw Error
                            }
                            queue.push( item.concat([newCirc]) );
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
                // if this is the last of a subcircuit, remove it from subcircuits
                if (currCircuit.devices[gateTypePlus_uuid].type === 'Subcircuit') {
                    const sub: Subcomponent = currCircuit.devices[gateTypePlus_uuid] as Subcomponent;
                    let found = false;
                    for (const deviceId in currCircuit.devices) {
                        if (deviceId === gateTypePlus_uuid) {
                            continue;
                        }
                        let device = currCircuit.devices[deviceId];
                        if (device.type === 'Subcircuit' && (device as Subcomponent).celltype === sub.celltype) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        currCircuit.subcircuits.splice(currCircuit.subcircuits.indexOf(sub.celltype), 1);
                    }
                }

                // remove orphaned wires
                for (const connectionId in currCircuit.connectors) {
                    if (connectionId.endsWith(gateTypePlus_uuid)) { // one of the outputs
                        delete currCircuit.connectors[connectionId as outputAnchorName];
                    } else { // check the inputs for any to remove
                        currCircuit.connectors[connectionId as outputAnchorName] = currCircuit.connectors[connectionId as outputAnchorName]
                            .filter(([gateId, _]) => {
                                return gateId !== gateTypePlus_uuid;
                            })
                    }
                }

                // remove the device
                delete currCircuit.devices[gateTypePlus_uuid];
                newDevices = currCircuit.devices;
                return currCircuit;
            })
            if (newDevices === null) {
                throw new Error('devices null after setting devices')
            }

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
    circuitSave.updateSubcomponenUsages(get(currentCircuit))
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
		if(!savedCircuit?.connectors) missingProps += "[Connectors]";
		if(!savedCircuit?.subcircuits) missingProps += "[Subcircuits]";


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
        wireSegments: circuit.wireSegments ?? [],
    });
}
