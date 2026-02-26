import { circuitSave } from '@src/App.svelte'
import type { SingleSaveDataFormat } from '../circuitSave'

// These functions should use eachother.
//
// export a function map from this function, then depending on the type, create this json in app.svelte
function makeLamp(
    nodeName: string,
    options?: {
        bits: number
        net: string
        label: string
        order: number
        inputs: number
        outputs: number
        position?: { x: number; y: number }
        rotation?: number
    }
): Lamp {
    return {
        type: 'Lamp',
        net: nodeName,
        inputs: options?.inputs || 1,
        outputs: options?.outputs || 0,
        order: options?.order || 0,
        bits: options?.bits || 1,
        label: options?.label || nodeName,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation
        }),
    }
}

function makeButton(
    nodeName: string,
    options?: {
        bits?: number
        net?: string
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Button {
    return {
        type: 'Button',
        label: options?.label || nodeName,
        net: options?.net || nodeName,
        bits: options?.bits || 1,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation
        }),
    }
}

function makeLogicNode(
    type: string,
    nodeName: string,
    options?: { position?: { x: number; y: number }, rotation?: number }
): LogicGate {
    return {
        type,
        label: nodeName,
        inputs: 2,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
            ...(options?.rotation && {
                rotation: options.rotation
            }),
        }),
    }
}

// Mux really only needs two things:
// bits.in (bit-width of inputs/outputs) 
// bits.sel (bit-width of selector input, which determines number of inputs)
function makeMux(
    nodeName: string,
    options?: {
        bits?: { in: number, sel: number}
        position?: { x: number; y: number }
        rotation?: number
    }
): Mux {
    return {
        type: 'Mux',
        label: nodeName,
        bits : { 
            in: options?.bits?.in || 1,
            sel: options?.bits?.sel || 1      
        },
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation
        }),
    }
}

//Hard coded encoder JSON
//Note: ONLY ONE UNDERSCORE ALLOWED!!!
const ENCODER_TEST: SingleSaveDataFormat = {
    circuit: {
        devices: {
            Button_enc0: {
                "type": "Button",
                "label": "Button_enc0",
                "net": "Button_enc0",
                "bits": 1,
                "position": {
                    "x": 0,
                    "y": 0
                }
            },
            Lamp_enc0: {
                "type": "Lamp",
                "net": "Lamp_enc0",
                "inputs": 1,
                "outputs": 0,
                "order": 0,
                "bits": 1,
                "label": "Lamp_enc0",
                "position": {
                    "x": 200,
                    "y": 0
                }
            }
        },
        connectors: {
            "out_Button_enc0": [
            [
                "Lamp_enc0",
                "in_Lamp_enc0"
            ]
            ]
      },
      subcircuits: [],
      wireManipulations: {
        "out_Button_enc0-in_Lamp_enc0": "step"
      }
    },
    zoom: 1,
    translation: { x: 0, y: 0}
}

//ENCODER
function makeEncoder(
    nodeName: string,
    options?: { position?: { x: number; y: number }, rotation?: number }
): Subcomponent {
    //Inject hardcoded circuit template if not already present
    circuitSave.createSubcomponent("Encoder");
    circuitSave.setCircuit("Encoder", ENCODER_TEST);

    return {
        type: 'Subcircuit',
        label: nodeName,
        inputs: 1,
        outputs: 1,
        celltype: "Encoder",
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
            ...(options?.rotation && {
                rotation: options.rotation
            }),
        }),
    }
}

function makeSubcomponentNode(
    nodeName: string,
    celltype: string,
    inputs: number,
    outputs: number,
    options?: { position?: { x: number; y: number }, rotation?: number }
): Subcomponent {
    return {
        type: 'Subcircuit',
        label: nodeName,
        inputs,
        outputs,
        celltype,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
            ...(options?.rotation && {
                rotation: options.rotation
            }),
        }),
    }
}

function makeTunnelInput(
    nodeName: string,
    celltype: string,
    options?: { position?: { x: number; y: number }, rotation?: number }
): TunnelInput {
    return {
        type: 'TunnelInput',
        label: nodeName,
        celltype,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
            ...(options?.rotation && {
                rotation: options.rotation
            }),
        }),
    }
}

function makeTunnelOutput(
    nodeName: string,
    celltype: string,
    options?: { position?: { x: number; y: number }, rotation?: number }
): TunnelOutput {
    return {
        type: 'TunnelOutput',
        label: nodeName,
        celltype,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
            ...(options?.rotation && {
                rotation: options.rotation
            }),
        }),
    }
}

function makeClock(
    nodeName: string,
    options?: {
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Clock {
    return {
        type: 'Clock',
        label: options?.label || nodeName,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation
        }),
    }
}

export const deviceJsonFactoryMap: Record<
    string,
    (nodeName: string, options?: any) => Device
> = {
    Button: makeButton,
    Lamp: makeLamp,
    And: (nodeName, options?) =>
        makeLogicNode('And', nodeName, ...(options ? [options] : [])),
    Nand: (nodeName, options?) =>
        makeLogicNode('Nand', nodeName, ...(options ? [options] : [])),
    Or: (nodeName, options?) =>
        makeLogicNode('Or', nodeName, ...(options ? [options] : [])),
    Nor: (nodeName, options?) =>
        makeLogicNode('Nor', nodeName, ...(options ? [options] : [])),
    Xor: (nodeName, options?) =>
        makeLogicNode('Xor', nodeName, ...(options ? [options] : [])),
    Xnor: (nodeName, options?) =>
        makeLogicNode('Xnor', nodeName, ...(options ? [options] : [])),
    Not: (nodeName, options?) =>
        makeLogicNode('Not', nodeName, ...(options ? [options] : [])),
    Repeater: (nodeName, options?) =>
        makeLogicNode('Repeater', nodeName, ...(options ? [options] : [])),
    Mux: makeMux,
    Encoder: makeEncoder,
    Subcircuit: (nodeName, options?) => 
        makeSubcomponentNode(nodeName, options.celltype as string, options.inputs as number, options.outputs as number, ...(options ? [options] : [])), 
    TunnelInput: (nodeName, options?) =>
        makeTunnelInput(nodeName, options.celltype as string, ...(options ? [options] : [])),
    TunnelOutput: (nodeName, options?) =>
        makeTunnelOutput(nodeName, options.celltype as string, ...(options ? [options] : [])),
    Clock: (nodeName, options?) =>
        makeClock(nodeName, ...(options ? [options] : [])),
}

// // Example usage
// const defaultAnd = deviceFactoryMap["And"]("andGate");
// const defaultButton = deviceFactoryMap["Button"]("button1");
// const defaultLamp = deviceFactoryMap["Lamp"]("lamp1");
