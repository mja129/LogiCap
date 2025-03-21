import { writable } from 'svelte/store'

// Explains the json representation
// https://github.com/tilk/digitaljs

const initialCircuit: Circuit = {
    devices: {},
    connectors: [],
    subcircuits: {},
}

let pendingConnection: ConnectorPiece | null = null

export let circuitStore = writable<Circuit>(initialCircuit)

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
        currentCircuit.connectors.forEach((item: Connector, idx: number) => {
            // ASSUMPTION, 'to' is always input. this function will only run from an input.
            if (item.to.id == inputConnectionId) {
                foundInputLinking = idx;
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