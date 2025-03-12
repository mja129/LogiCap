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

type LinkData = {
    id: string
    port: string
}

type ConnectorFrom = Record<'from', LinkData>
type ConnectorTo = Record<'to', LinkData>
type ConnectorPiece = ConnectorTo | ConnectorFrom

type Connector = ConnectorFrom & ConnectorTo
type DeviceRecord = Record<string, Device>

type Subcircuit = {
    devices: DeviceRecord
    connectors: Connector[]
}

// Device manifest
// Connection manifest
type Circuit = {
    devices: DeviceRecord
    connectors: Connector[]
    subcircuits: Record<string, Subcircuit>
}