import { writable, get } from 'svelte/store'

// Explains the json representation
// https://github.com/tilk/digitaljs

const initialCircuit: Circuit = {
    devices: {},
    connectors: [],
    subcircuits: {},
}

export let circuitStore = writable<Circuit>(initialCircuit)

export function resetCircuitStore() {
    circuitStore.update((currentCircuit) => {
        currentCircuit = {
            devices: {},
            connectors: [],
            subcircuits: {},
        }
        return currentCircuit
    })
}

// Link anchor used in customAnchor.svelte mainly
export function handleLinkAnchorConnection(connection: Connector) {
    const pushNewLinking = (connector: Connector) => {
        circuitStore.update((currentCircuit) => {
            // Add the new device with a unique ID, e.g., 'newDeviceId'
            currentCircuit.connectors.push(connector)
            // Add the new connector
            // currentCircuit.connectors.push(newConnector)

            // Return the updated circuit
            return currentCircuit
        })
    }
    pushNewLinking(connection)
}

// Unlink Connection linking in our json representation
// TODO: there is a way to restructure the map so that we can search by device and not have to spend all of this time with searching and inserting + shifting
export const removeLinking = (inputConnectionId: string) => {
    circuitStore.update((currentCircuit) => {
        let foundInputLinking: number = -1
        currentCircuit.connectors.forEach((item: any, idx: number) => {
            // ASSUMPTION, 'to' is always input. this function will only run from an input.
            if (item.to.id == inputConnectionId) {
                foundInputLinking = idx
            }
        })

        if (foundInputLinking !== -1) {
            // remove 1 element starting from 'matchedIndex'
            currentCircuit.connectors.splice(foundInputLinking, 1)
        }
        return currentCircuit
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
    return localStorage.getItem(lsKey) || (console.warn(`No saved "${lsKey}" found in localStorage.`), null)
}


// saves positions from svelvet save to circuitStore, in memory
function savePositionsToCircuitStore() {
    // this is an arrow function because this function kinda loads -> and saves
    // and it could be a separate function, I want it to be at least named getSvelvetSave
    // so im wrapping for the naming.
    const getSvelvetSave = () => getLsItem("state")
    const saveJsonText = getSvelvetSave()

    // early return, state not found in localStorage
    if (saveJsonText === null) return null

    const savedNodeNames: NodeInfoList | null = filterSvelvetSave(saveJsonText)

    // state exists but there are no nodes.
    if (savedNodeNames === null) return null

    // create saved nodes on canvas.
    circuitStore.update((currCircuit) => {
        savedNodeNames.forEach(({ nodeType, uuid, position }) => {
            const nodeName = `${nodeType}_${uuid}`
            currCircuit.devices[nodeName].position = position
        })
        return currCircuit
    })
}

// save the current circuit store to localStorage
function saveCircuitStoreToLS() {
    const circuitStoreSave: string | null = getLsItem("circuitStoreSave")

    // getLsItem might warn that circuitStoreSave does not exist, in this case
    // we are creating it for the first time, thats okay

    localStorage.setItem('circuitStoreSave', JSON.stringify(get(circuitStore)))
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

type NodeId = string
type InputAnchorId = string
type OutputAnchorId = string
type ConnectionTuple = [NodeId, InputAnchorId]
type SvelvetConnection = Array<ConnectionTuple | NodeId>
// AnchorId will always be anchorId's for output nodes. all input linkings are dependent on output ones
// the anchor id's in the generated html are A-{ourId} or B-{ourId}, maybe this
// is causing issues with reloading output anchors that have multiple edges/wires.
// Maybe the linking issues could also be solved by passing {connections} directly into anchors.
type SvelvetConnections = Map<OutputAnchorId, SvelvetConnection>

// I tried out a global solution below, maybe if I could get the links to be null after loading all of the nodes
// Then set the links, it might trigger a re-render
// export let savedConnections: Writable<SvelvetConnections | {default: }> = writable({})

// On application mount, translate the saved CircuitStore to a map of stores that can be passed into svelvet nodes. 
export function translateConnectionsToSvelvet(connections: Connector[] | undefined) {
    let svelvetConnections: SvelvetConnections = new Map<OutputAnchorId, SvelvetConnection>()

    if (connections === undefined) {
        console.log("nothing when trying to load saved connections")
        return undefined
    }

    if (connections.length === 0) {
        console.log("saved circuit has no connections: when trying to load saved connections")
        return undefined
    }

    for (let i = 0; i < connections.length && connections[i] !== undefined; i++) {
        const outId = connections[i].from.id
        const inId = connections[i].to.id

        // there is some issue with this code when it comes to dual outputs.
        // 1 output with multiple wires.
        // const [outFrom, inTo] = connections[i].name.split["-"]
        const inputAnchorName = connections[i].to.port + "_" + inId

        if (outId in svelvetConnections) {
            svelvetConnections.get(outId)?.push([inId, inputAnchorName]);
            // svelvetConnections[outId].push([inId, inputAnchorName]);
        }
        else {
            svelvetConnections.set(outId, [[inId, inputAnchorName]])
        }

    }
    // savedConnections.set(svelvetConnections)
    return svelvetConnections
}

