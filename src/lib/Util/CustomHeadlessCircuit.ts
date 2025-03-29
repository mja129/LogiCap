import { HeadlessCircuit, type CircuitOptions } from 'custom_digitaljs'

function transformConnections(data: SvelvetConnectors): Connector[] {
    let connectorsDigital: Connector[] = new Array<Connector>()
    Object.keys(data).forEach((outKey: string) => {
        const [outKind, outGate, outUUID] = outKey.split('_')

        data[outKey as outputAnchorName].forEach(([inputNodeId, inputAnchorId]) => {
            const connectionJson = {
                from: { id: `${outGate}_${outUUID}`, port: outKind },
                name: `${outKey}-${inputAnchorId}`,
                to: { id: inputNodeId, port: inputAnchorId.split("_")[0] },
            }
            connectorsDigital.push(connectionJson)
        })
    })
    return connectorsDigital

    // Apply transformations to the incoming JSON data as needed
    // Example transformation: Add or modify fields in the data structure
    // data.transformedField = 'newValue' // Add custom field if needed
    // return data
}

export class CustomHeadlessCircuit extends HeadlessCircuit {
    constructor(data: Circuit, options?: CircuitOptions) {
        // Transform the data before passing it to the parent constructor
        const standardDigitalJsJson = transformConnections(data.connectors)
        const digitalCircuit: DefaultCircuit = { devices: data.devices, connectors: standardDigitalJsJson, subcircuits: data.subcircuits }
        super(digitalCircuit, options)

        // Additional custom logic can go here
        console.log('CustomHeadlessCircuit Initialized')
    }
}
