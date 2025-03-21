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

export function saveDigitalJsState() {
    const circuitStoreSave: string | null =
        localStorage.getItem('circuitStoreSave')
    if (circuitStoreSave === null) {
        console.log(
            'Setting circuit store save in local storage for the first time'
        )
    }
    localStorage.setItem('circuitStoreSave', JSON.stringify(get(circuitStore)))
}

type NodeInfoList = {
    nodeType: string
    uuid: string
    position: { x: number; y: number }
}[]

// saves the current circuitStore to localStorage under key 'circuitStoreSave'

// filters the svelvet library store for the data that we need.
function filterSvelvetSave(saveJsonText: string) {
    const saveJson: SvelvetSave = JSON.parse(saveJsonText)
    const savedNodeNames: NodeInfoList = saveJson.nodes.map(
        (node: SvelvetNode) => {
            let [nodeType, uuid] = node.id.substring(2).split('_')
            return { nodeType, uuid, position: node.position }
        }
    )
    return savedNodeNames
}

// saves positions from svelvet save to savePositionsToCircuitStore
function savePositionsToCircuitStore() {
    const saveJsonText =
        localStorage.getItem('state') ||
        (console.warn('No saved state found in localStorage.'), null)

    if (saveJsonText === null) return null

    const savedNodeNames: NodeInfoList | null =
        filterSvelvetSave(saveJsonText) ||
        (console.warn('save json exists but there are no nodes'), null)

    if (savedNodeNames === null) return null

    // create saved nodes on canvas.
    circuitStore.update((currCircuit) => {
        savedNodeNames.forEach(({ nodeType, uuid, position }) => {
            const nodeName = `${nodeType}_${uuid}`
            currCircuit.devices[nodeName].position = position
            // side effects
            // find nodeName in devices
            // newGateCircuitStore(nodeType, uuid, { position })
        })
        return currCircuit
    })
    // save the state after updating it.
    saveDigitalJsState()
}

type NodeId = string
type InputAnchorId = string
type OutputAnchorId = string
type ConnectionTuple = [NodeId, InputAnchorId]
type SvelvetConnection = Array<ConnectionTuple | NodeId>
// AnchorId will always be anchorId's for output nodes. all input linkings are dependent on output ones
type SvelvetConnections = Record<OutputAnchorId, SvelvetConnection>
export let savedConnections: Writable<SvelvetConnections | {}> = writable({})

export async function translateConnectionsToSvelvet(connections : Connector[] | undefined) {
    let svelvetConnections: SvelvetConnections | {} = {}

    if(connections === undefined) {
        return
    }

    for (let i = 0; i < connections.length && connections[i] !== undefined; i++) {
        const outId = connections[i].from.id
        const inId = connections[i].to.id

        // const [outFrom, inTo] = connections[i].name.split["-"]
        const [outGateType, outUuid] = outId.split("_")
        const [inGateType, inUuid] = inId.split("_")
        const inputAnchorName = connections[i].to.port + "_" + inId

        if (!svelvetConnections[outId]) {
            svelvetConnections[outId] = []
        }
        svelvetConnections[outId].push([inId, inputAnchorName])

    }
    return svelvetConnections
}

export function clickSvelvetSave() {

    const svelvetSaveButton = document.querySelector('.save-button')
    const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
    })
    // const mouseEventUp = new MouseEvent('mouseup', { bubbles: true })
    svelvetSaveButton?.dispatchEvent(mouseEvent)
}

export async function saveCircuit() {
    // click on the hidden svelvet button, the button is in "theme toggle" but I set it to display: none,
    // and now we trigger it with css, after it triggers we use the svelvet json positions to set our digitial js positions
    // the digitalJS save is the main save and we are just piggybacking off the svelvet save a bit
    // the svelvet save does save our camera position and stuff though.
    clickSvelvetSave()

    // make sure it actually updated
    // there is a better way of doing this
    // I don't even know if its a problem

    savePositionsToCircuitStore()

}

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

        // const matchedIndex = currentCircuit.connectors.fi(conn => { console.log(JSON.stringify(connector)); console.log(JSON.stringify(conn)); return JSON.stringify(conn) == JSON.stringify(connection) });
        if (foundInputLinking !== -1) {
            // remove 1 element starting from 'matchedIndex'
            currentCircuit.connectors.splice(foundInputLinking, 1)
        }
        return currentCircuit
    })
}
