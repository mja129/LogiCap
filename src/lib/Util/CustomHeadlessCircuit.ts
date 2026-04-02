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

/*  Modify given circuitJson into format DigitalJS will understand
  * This entails:
  * - Changing all Buttons to be type 'Input' and Lamps to 'Output'
  * - Sorting the ins/outs by y position and giving them port ids in sorted order.
  *   This ensures they show up on the subcomponent node as they show in the subcircuit,
  *   assuming that all inputs are on the left and all outputs are on the right.
  * TODO: more in depth anchor placement. Will involve some serious refactoring of Subcomponent.svelte
  */
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
  let { devices, connections } = resolveTunnels(circuitJson['devices'], circuitJson['connectors'])
  return {'devices': devices, 'connectors': transformConnections(connections), 'subcircuits': circuitJson['subcircuits']}
}

// Load a set of subcircuits, and all of their subcircuits recursively
function loadSubcircuits(subcircuits: string[], subjson?: Record<string, Subcircuit>): Record<string, Subcircuit> {
  let subcircuitsJson: Record<string, Subcircuit> = subjson || {}
  subcircuits.forEach((circuit: string) => {
    // need to clone the json since it is modified. is there a more efficient way?
    const subcircuit = circuitSave.getCircuit(circuit)?.circuit;
    if (subcircuit) {
      subcircuitsJson[circuit] = subcircuitParse(JSON.parse(JSON.stringify(subcircuit)));
      loadSubcircuits(subcircuitsJson[circuit]['subcircuits'], subcircuitsJson)
    } else {
      alert(`Subcircuit not found: ${circuit}`)
    }
  })
  return subcircuitsJson
}

/*  Funky bit of BS-ery to hook up tunnel inputs to their outputs.
  * Jank as HELL!
  * Essentially, replaces all tunnels with repeaters on the backend and adds an invisible wire from
  * every input to all its outputs.
  *
  * Worth noting that while celltype is an actual digitalJS property of subcircuits,
  * it is completely useless to the backend on a repeater. It's only used for tunnels
  * because it was an extraneous property that was already hooked into the frontend.
  */
function resolveTunnels(devices: Devices, connections: SvelvetConnectors) {
  let ins: Record<string, LogicGate> = {}
  let outs: Record<string, LogicGate[]> = {}
  Object.keys(devices).forEach((key: string) => {
    if (devices[key].type == 'TunnelInput') {
      let celltype = (devices[key] as TunnelInput).celltype
      devices[key].type = 'Repeater'
      let input = devices[key] as LogicGate
      // celltype already being a key means there are duped inputs.
      // Can't imagine an elegant way to handle this, so yell at the user it is
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
  // Add connection from every input to all outputs with same celltype
  Object.keys(ins).forEach((key: string) => {
    connections[`out_${ins[key].label}` as outputAnchorName] = []
    if (key in outs) {
      outs[key].forEach((out: LogicGate) => {
        connections[`out_${ins[key].label}` as outputAnchorName].push([out.label, `in_${out.label}`] as ConnectionTuple)
      })
    }
  })
  return { devices, connections }
}

function resolveConstants(devices: Devices): void {
    Object.keys(devices).forEach(key => {
        if (devices[key].type === 'Power') {
            (devices[key] as any).type = 'Constant';
            (devices[key] as any).constant = '1';
        } else if (devices[key].type === 'Ground') {
            (devices[key] as any).type = 'Constant';
            (devices[key] as any).constant = '0';
        }
    });
}

function buildAdderSubcircuit(bits: number): Subcircuit {
    return {
        devices: {
            in1_port: { type: 'Input', bits, net: 'in1', order: 0 } as any,
            in2_port: { type: 'Input', bits, net: 'in2', order: 1 } as any,
            cin_port: { type: 'Input', bits: 1, net: 'cin', order: 2 } as any,
            sum_port: { type: 'Output', bits, net: 'out', order: 0 } as any,
            cout_port: { type: 'Output', bits: 1, net: 'cout', order: 1 } as any,
            add1: { type: 'Addition', label: 'add1', bits: { in1: bits, in2: bits, out: bits + 1 } } as any,
            zext: { type: 'ZeroExtend', label: 'zext', extend: { input: 1, output: bits + 1 } } as any,
            add2: { type: 'Addition', label: 'add2', bits: { in1: bits + 1, in2: bits + 1, out: bits + 1 } } as any,
            slice_sum: { type: 'BusSlice', label: 'slice_sum', slice: { first: 0, count: bits, total: bits + 1 } } as any,
            slice_cout: { type: 'BusSlice', label: 'slice_cout', slice: { first: bits, count: 1, total: bits + 1 } } as any,
        } as Devices,
        connectors: [
            { from: { id: 'in1_port', port: 'out' }, to: { id: 'add1', port: 'in1' }, name: 'w_in1' },
            { from: { id: 'in2_port', port: 'out' }, to: { id: 'add1', port: 'in2' }, name: 'w_in2' },
            { from: { id: 'cin_port', port: 'out' }, to: { id: 'zext', port: 'in' }, name: 'w_cin' },
            { from: { id: 'add1', port: 'out' }, to: { id: 'add2', port: 'in1' }, name: 'w_partial' },
            { from: { id: 'zext', port: 'out' }, to: { id: 'add2', port: 'in2' }, name: 'w_cin_ext' },
            { from: { id: 'add2', port: 'out' }, to: { id: 'slice_sum', port: 'in' }, name: 'w_full1' },
            { from: { id: 'add2', port: 'out' }, to: { id: 'slice_cout', port: 'in' }, name: 'w_full2' },
            { from: { id: 'slice_sum', port: 'out' }, to: { id: 'sum_port', port: 'in' }, name: 'w_sum_out' },
            { from: { id: 'slice_cout', port: 'out' }, to: { id: 'cout_port', port: 'in' }, name: 'w_cout_out' },
        ],
        subcircuits: [],
    };
}

function injectAdderSubcircuits(devices: Devices, subcircuitsJson: Record<string, Subcircuit>): void {
    Object.keys(devices).forEach(key => {
        const device = devices[key];
        if (device.type === 'Addition') {
            const bits = (device as Addition).bits.in1;
            const subcircuitKey = `_adder_${bits}`;
            if (!subcircuitsJson[subcircuitKey]) {
                subcircuitsJson[subcircuitKey] = buildAdderSubcircuit(bits);
            }
            devices[key] = {
                type: 'Subcircuit',
                label: device.label,
                celltype: subcircuitKey,
                inputs: 3,
                outputs: 2,
                ...(device.position && { position: device.position }),
                ...(device.rotation && { rotation: device.rotation }),
            } as any;
        }
    });
}

export class CustomHeadlessCircuit extends HeadlessCircuit {
    constructor(data: Circuit, options?: CircuitOptions) {
        // Transform the data before passing it to the parent constructor
        const clonedDevices = structuredClone(data.devices)
        resolveConstants(clonedDevices)
        const { devices, connections } = resolveTunnels(clonedDevices, structuredClone(data.connectors))
        const subcircuitsJson = loadSubcircuits(data.subcircuits)
        injectAdderSubcircuits(devices, subcircuitsJson)
        const standardDigitalJsJson = transformConnections(connections)
        const digitalCircuit: DefaultCircuit = { devices: devices, connectors: standardDigitalJsJson, subcircuits: subcircuitsJson }
        console.log('COMPILED CIRCUIT:', digitalCircuit)
        super(digitalCircuit, options)

        // Additional custom logic can go here
        console.log('CustomHeadlessCircuit Initialized')
    }
}
