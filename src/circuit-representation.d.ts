// DIGITAL JS CircuitJson Input Types.

type Device = {
    type: string
    label: string
}

type LinkData = {
    id: string
    port: string
}

type ConnectorFrom = Record<'from', LinkData>
type ConnectorTo = Record<'to', LinkData>
type ConnectorPiece = ConnectorTo | ConnectorFrom

type Connector = ConnectorFrom & ConnectorTo

type Subcircuit = {
    devices: Record<string, Device>
    connectors: Connector[]
}

// Device manifest
// Connection manifest
type Circuit = {
    devices: Record<string, Device>
    connectors: Connector[]
    subcircuits: Record<string, Subcircuit>
}