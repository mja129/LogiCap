import { writable, get } from 'svelte/store'

// Explains the json representation
// https://github.com/tilk/digitaljs

const initialCircuit: Circuit = {
    devices: {},
    connectors: {},
    subcircuits: {},
}

export let CircuitStore = writable<Circuit>(initialCircuit)

// reasonable because there is only 1 'connecting' at a time
export function resetCircuitStore() {
    CircuitStore.update((currentCircuit) => {
        currentCircuit = {
            devices: {},
            connectors: {},
            subcircuits: {},
        }
        return currentCircuit
    })
}

// Link anchor used in customAnchor.svelte mainly
// we could make it $CircuitStore.addLinking -> I would preferthat TBH
export function addConnection(
    fromAnchorId: outputAnchorName,
    toAnchorId: inputAnchorName
) {
    const toNodeId: inputGateName = toAnchorId.substring(
        toAnchorId.indexOf('_') + 1
    ) as inputGateName

    // instead of push try de-structuring
    CircuitStore.update((currCircuit) => {
        if (!(fromAnchorId in currCircuit.connectors)) {
            currCircuit.connectors[fromAnchorId] = new Array()
        }
        // I wanna check if the full array copy is needed here, I think it is tbh
        currCircuit.connectors[fromAnchorId] = [
            ...currCircuit.connectors[fromAnchorId],
            [toNodeId, toAnchorId],
        ]
        console.log(currCircuit.connectors)
        return currCircuit
    })
}

export function removeConnection(inputAnchorId: string) {
    CircuitStore.update((currCircuit) => {
        const newConnectors: SvelvetConnectors = {}
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
}

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
    if (saveJsonText === null) return null

    const savedNodeNames: NodeInfoList | null = filterSvelvetSave(saveJsonText)

    // state exists but there are no nodes.
    if (savedNodeNames === null) return null

    // create saved nodes on canvas.
    CircuitStore.update((currCircuit) => {
        savedNodeNames.forEach(({ nodeType, uuid, position }) => {
            const nodeName = `${nodeType}_${uuid}`
            currCircuit.devices[nodeName].position = position
        })
        return currCircuit
    })
}

// save the current circuit store to localStorage
function saveCircuitStoreToLS() {
    const CircuitStoreSave: string | null = getLsItem('circuitStoreSave')

    // getLsItem might warn that CircuitStoreSave does not exist, in this case
    // we are creating it for the first time, thats okay

    localStorage.setItem('circuitStoreSave', JSON.stringify(get(CircuitStore)))
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
//
export async function saveCircuit() {
    // click on the hidden svelvet button, the button is in "theme toggle" but I set it to display: none,
    // and now we trigger it with css, after it triggers we use the svelvet json positions to set our digitial js positions
    // the digitalJS save is the main save and we are just piggybacking off the svelvet save a bit
    // the svelvet save does save our camera position and stuff though.
    clickSvelvetSave()

    savePositionsToCircuitStore()

    saveCircuitStoreToLS()
}

// on reload the saved connections are sent implicitly through the Circuit components
// but the 'currentDevicesData' state variable in App.svelte
// needs to sync with the CircuitStore.devices on loadCircuit, and this is why we pass in a function
// to set that state 'remotely' lets say
export function loadCircuit(setDevices: Function = () => null) {
    const savedCircuitText =
        localStorage.getItem('circuitStoreSave') ||
        (console.log('No saved state found in localStorage.'), null)

    if (savedCircuitText === null) {
        return null
    }

    const savedCircuit = JSON.parse(savedCircuitText)

    CircuitStore.set(savedCircuit)
    setDevices(savedCircuit.devices)
}

// remove circuitStore save and backup to prevCircuitStore, iff you aren't deleting an empty circuit.
export function backupDelete() {
    // what if they clear an empty canvas.
    saveCircuit()
    // save previously deleted.

    const saveDeleted = localStorage.getItem('circuitStoreSave')
    if (!saveDeleted) {
        console.warn('we saved before deleting so this should not be possible')
    } else if (
        // only save non empty circuits to previousCircuitStore.
        saveDeleted === '{"devices":{},"connectors":[],"subcircuits":{}}'
    ) {
        console.warn(
            'EMPTY on delete, do not set prevCircuitStore just empty stores.'
        )
    } else {
        localStorage.setItem('prevCircuitStore', saveDeleted)
    }
    localStorage.removeItem('circuitStoreSave')
    // localStorage.removeItem('state')
}
