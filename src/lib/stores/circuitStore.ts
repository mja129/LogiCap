import { writable } from 'svelte/store'

export type Device = {
    type: string
    label: string
}

export type Connection = {
    id: string
    port: string
}

export type ConnectionFrom = Record<'from', Connection>
export type ConnectionTo = Record<'to', Connection>

export type Connector = ConnectionFrom & ConnectionTo

type Subcircuit = {
    devices: Record<string, Device>
    connectors: Connector[]
}

// Device manifest
// Connection manifest
export type Circuit = {
    devices: Record<string, Device>
    connectors: Connector[]
    subcircuits: Record<string, Subcircuit>
}

export type ConnectorPiece = ConnectionFrom | ConnectionTo

let pendingConnection: ConnectorPiece | null = null

const initialCircuit: Circuit = {
    devices: {},
    connectors: [],
    subcircuits: {},
}

function createGlobalTimeoutManager() {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return {
        start: (callback: () => void, millis: number) => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
                timeoutId = null
                callback()
            }, millis)
        },
        cancel: () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId)
                timeoutId = null
            }
        },
    }
}
const timeoutManager = createGlobalTimeoutManager()

export let circuitStore = writable<Circuit>(initialCircuit)

// potential problem, if 2 connections are received before timeout ends
// (fixed by canceling timer) there is another implementation where you wait
// for the second one asynchronously instead of being time dependent
export function handleAnchorConnection(
    connection: ConnectorPiece,
    timeout = 1000
): false | Connector {
    // if there are no pending anchor connections to handle
    // either because an input or output timeout before recieving its
    // counterpart because you recieved 2 inputs our outputs in a connection
    // event if a pair is made in the UI but not in the global store its a big
    // problem
    if (pendingConnection === null) {
        pendingConnection = connection
        timeoutManager.start(() => {
            pendingConnection = null
            console.warn('Timeout waiting for the second connection')
        }, timeout)
        // meaning the one that gets false will not update the final store.
        return false
    } else {
        timeoutManager.cancel()
        // pendingConnection === null, that means there is already a node
        // connection event sent which is now waiting
        if ('from' in connection === 'from' in pendingConnection) {
            // we received 2 "from" or 2 "to"
            // I hope not because this means there is a big fundamental issue
            console.warn(
                'both parts of connection are the same, ie: 2 inputs or 2 outputs'
            )
        }
        const from = 'from' in connection ? connection : pendingConnection
        const to = 'to' in connection ? connection : pendingConnection
        // from and to are unique types basically this is XOR case
        const connector: Connector = {
            ...from,
            ...to,
        }
        // Alert: updating the local object might create some issues with subscription
        // initialCircuit.connectors.push(connector)
        // console.log(JSON.stringify(circuitStore))

        pendingConnection = null
        return connector
    }
}
