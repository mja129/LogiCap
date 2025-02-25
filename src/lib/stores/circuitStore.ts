import { writable } from 'svelte/store'

export type Device = {
    type: string
    label: string
}

export type Connector = {
    from: {
        id: string
        port: string
    }
    to: {
        id: string
        port: string
    }
}

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

const initialCircuit: Circuit = {
    devices: {},
    connectors: [],
    subcircuits: {},
}

export const circuitStore = writable<Circuit>(initialCircuit)
