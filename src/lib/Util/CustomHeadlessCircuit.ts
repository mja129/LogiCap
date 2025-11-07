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

function subcircuitParse(circuitJson: any): Subcircuit {
  circuitJson['devices'] = circuitJson['devices'] as Record<string, Device>
  var inputs: IODevice[] = []
  var outputs: IODevice[] = []
  Object.keys(circuitJson['devices']).forEach(key => {
    var device = circuitJson['devices'][key]
    if (device['type'] == 'Button') {
      device['type'] = 'Input'
      inputs.push(device)
    } else if (device['type'] == 'Lamp') {
      device['type'] = 'Output'
      outputs.push(device)
    }
  })
  inputs.sort((a, b) => {
    if (a['position'] && b['position']) {
      return a['position']['y'] - b['position']['y']
    }
    return 0
  })
  inputs.forEach((device: IODevice, i: number) => {
    device['net'] = 'in' + (i != 0 ? i : '' as string)
  })
  outputs.sort((a, b) => {
    if (a['position'] && b['position']) {
      return a['position']['y'] - b['position']['y']
    }
    return 0
  })
  outputs.forEach((device: IODevice, i: number) => {
    device['net'] = 'out' + (i != 0 ? i : '' as string)
  })
  return {'devices': circuitJson['devices'], 'connectors': transformConnections(circuitJson['connectors'])}
}

function loadSubcircuits(subcircuits: string[]): Record<string, Subcircuit> {
  let subcircuitsJson: Record<string, Subcircuit> = {}
  subcircuits.forEach((circuit: string) => {
    var circ = localStorage.getItem(circuit)
    if (circ) {
      subcircuitsJson[circuit] = subcircuitParse(JSON.parse(circ))
    } else {alert(`Subcircuit not found: ${circuit}`)}
  })
  return subcircuitsJson
}

export class CustomHeadlessCircuit extends HeadlessCircuit {
    constructor(data: Circuit, options?: CircuitOptions) {
        // Transform the data before passing it to the parent constructor
        const standardDigitalJsJson = transformConnections(data.connectors)
        const subcircuitsJson = loadSubcircuits(data.subcircuits)
        const digitalCircuit: DefaultCircuit = { devices: data.devices, connectors: standardDigitalJsJson, subcircuits: subcircuitsJson }
        super(digitalCircuit, options)

        // Additional custom logic can go here
        console.log('CustomHeadlessCircuit Initialized')
    }
}
