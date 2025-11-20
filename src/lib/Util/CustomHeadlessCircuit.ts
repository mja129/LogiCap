import { HeadlessCircuit, type CircuitOptions } from 'custom_digitaljs'
import { circuitSave } from '@src/App.svelte'

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
    device['net'] = `in${i+1}`
  })
  outputs.sort((a, b) => {
    if (a['position'] && b['position']) {
      return a['position']['y'] - b['position']['y']
    }
    return 0
  })
  outputs.forEach((device: IODevice, i: number) => {
    device['net'] = `out${i+1}`;
  })
  return {'devices': circuitJson['devices'], 'connectors': transformConnections(circuitJson['connectors']), 'subcircuits': circuitJson['subcircuits']}
}

function loadSubcircuits(subcircuits: string[], subjson?: Record<string, Subcircuit>): Record<string, Subcircuit> {
  let subcircuitsJson: Record<string, Subcircuit> = subjson || {}
  subcircuits.forEach((circuit: string) => {
    // need to clone the json since it is modified. is there a more efficient way?
    const subcircuit = circuitSave.getCircuit(circuit);
    if (subcircuit) {
      subcircuitsJson[circuit] = subcircuitParse(JSON.parse(JSON.stringify(subcircuit)));
      loadSubcircuits(subcircuitsJson[circuit]['subcircuits'], subcircuitsJson)
    } else {
      alert(`Subcircuit not found: ${circuit}`)
    }
  })
  return subcircuitsJson
}

function resolveTunnels(devices: Devices, connections: SvelvetConnectors) {
  let ins: Record<string, LogicGate> = {}
  let outs: Record<string, LogicGate[]> = {}
  Object.keys(devices).forEach((key: string) => {
    if (devices[key].type == 'TunnelInput') {
      let celltype = (devices[key] as TunnelInput).celltype
      devices[key].type = 'Repeater'
      let input = devices[key] as LogicGate
      if (celltype in ins) {
        alert('Multiple tunnel inputs with same name')
      }
      ins[celltype] = input
    }
  })
  Object.keys(devices).forEach((key: string) => {
    if (devices[key].type == 'TunnelOutput') {
      let celltype = (devices[key] as TunnelOutput).celltype
      devices[key].type = 'Repeater'
      let output = devices[key] as LogicGate
      if (celltype in outs) {
        outs[celltype].push(output)
      } else {
        outs[celltype] = [output]
      }
    }
  })
  Object.keys(ins).forEach((key: string) => {
    let sourceAnchor: outputAnchorName = 'out__' 
    Object.keys(connections).forEach((connKey: string) => {
      let anchor = connKey as outputAnchorName
      connections[anchor].forEach((conn: ConnectionTuple, index: number) => {
        if (conn[0] == ins[key].label as inputGateName) {
          sourceAnchor = anchor
        }
      })
    })
    connections[`out_${ins[key].label}` as outputAnchorName] = []
    outs[key].forEach((out: LogicGate) => {
      connections[`out_${ins[key].label}` as outputAnchorName].push([out.label, `in_${out.label}`] as ConnectionTuple)
    })
  })
  return { devices, connections }
}

export class CustomHeadlessCircuit extends HeadlessCircuit {
    constructor(data: Circuit, options?: CircuitOptions) {
        // Transform the data before passing it to the parent constructor
        const { devices, connections } = resolveTunnels(structuredClone(data.devices), structuredClone(data.connectors))
        const standardDigitalJsJson = transformConnections(connections)
        const subcircuitsJson = loadSubcircuits(data.subcircuits)
        const digitalCircuit: DefaultCircuit = { devices: devices, connectors: standardDigitalJsJson, subcircuits: subcircuitsJson }
        console.log(digitalCircuit)
        super(digitalCircuit, options)

        // Additional custom logic can go here
        console.log('CustomHeadlessCircuit Initialized')
    }
}
