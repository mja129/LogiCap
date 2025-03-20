// DIGITAL JS CircuitJson Input Types.

type Button = {
    type: "Button"
    label: string
    net: string
    order?: number
    bits: number
    position?: {
        x: number
        y: number
    }
}

type Lamp = {
    type: "Lamp"
    net: string
    order: number
    bits: number
    inputs: number
    outputs: number
    label: string
    position?: {
        x: number
        y: number
    }
}

type LogicGate = {
    type: string
    label: string
    inputs: number
    position?: {
        x: number
        y: number
    }
}

type Device = Button | Lamp | LogicGate
type DeviceRecord = Record<string, Device>

// DIGITALJS link node connection types

// id coorisponds to the device uuid/nodeName/nodeId. This is also the key in the DeviceRecord type
// port, I do not fully understand, but it's working via a bit of logic in SimulationNodeAnchor
type LinkData = {
    id: string
    port: string
}


// We need some way to transform digital js json representation into this, for loading in pre-existing circuits.
// connections: svelvet type
// Array<[nodeId, anchorId] | nodeId>default:"[]"
// Used to specify Node connections ahead of time. Array of tuples representing a
// node/anchor pair or of nodeIds themselves. IDs can be strings or numbers. When
// specifying nodeIds only, connections are spread evenly across the input anchors
// of the target.

type ConnectorFrom = Record<'from', LinkData>
type ConnectorTo = Record<'to', LinkData>
type ConnectorPiece = ConnectorTo | ConnectorFrom
type ConnectorName = Record<'name', string>

type Connector = ConnectorFrom & ConnectorTo & ConnectorName


// DIGITALJS Subcircuit Type
type Subcircuit = {
    devices: DeviceRecord
    connectors: Connector[]
}


// DIGITAL JS Circuit Input Json Type
// Device manifest
// Connection manifest
type Circuit = {
    devices: DeviceRecord
    connectors: Connector[]
    subcircuits: Record<string, Subcircuit>
}
