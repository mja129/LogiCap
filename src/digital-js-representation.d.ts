// DIGITAL JS CircuitJson Input Types.

type Button = {
    type: "Button"
    label: string
    net: string
    order?: number
    bits: number
}

type Lamp = {
    type: "Lamp"
    net: string
    order: number
    bits: number
    inputs: number
    outputs: number
    label: string
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

type ConnectorFrom = Record<'from', LinkData>
type ConnectorTo = Record<'to', LinkData>
type ConnectorPiece = ConnectorTo | ConnectorFrom

type Connector = ConnectorFrom & ConnectorTo


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
