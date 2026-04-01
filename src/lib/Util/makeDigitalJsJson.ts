import { circuitSave } from '@src/App.svelte'
import type { SingleSaveDataFormat } from '../circuitSave'

//Hardcoded Encoder Circuits
import { encoderMap } from './encoderCircuits'

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

//Priority Encoder
function makeEncoder(
    nodeName: string,
    options?: { selbits?:number, position?: { x: number; y: number }, rotation?: number }
): Subcomponent {
    //Inject hardcoded circuit based on selbits
    const selbits = options!.selbits
    const encoderType = options!.celltype

    circuitSave.createSubcomponent(encoderType);
    circuitSave.setCircuit(encoderType, encoderMap[encoderType]);

    return {
        type: 'Subcircuit',
        label: nodeName,
        inputs: 2 ** selbits, //2^bits
        outputs: selbits + 1, //1 for valid bit
        celltype: encoderType, //used to determine which Encoder_# to use so different types don't overwrite each other
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

// D Flip-Flop with all control ports enabled
// All polarities default to true (active-high / rising-edge)
function makeDff(
    nodeName: string,
    options?: {
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Dff {
    return {
        type: 'Dff',
        label: options?.label || nodeName,
        bits: 1,
        polarity: {
            clock: true,
        },
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation,
        }),
    }
}

function makeDisplay7(
    nodeName: string,
    options?: {
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Display7 {
    return {
        type: 'Display7',
        label: options?.label || nodeName,
        bits: 8,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation,
        }),
    }
}

function makeAddition(
    nodeName: string,
    options?: {
        bits?: { in1: number; in2: number; out: number }
        signed?: { in1?: boolean; in2?: boolean }
        position?: { x: number; y: number }
        rotation?: number
    }
): Addition {
    return {
        type: 'Addition',
        label: nodeName,
        bits: {
            in1: options?.bits?.in1 || 8,
            in2: options?.bits?.in2 || 8,
            out: options?.bits?.out || 8,
        },
        ...(options?.signed && { signed: options.signed }),
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation,
        }),
    }
}

function makePower(
    nodeName: string,
    options?: {
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Power {
    return {
        type: 'Power',
        label: options?.label || nodeName,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation,
        }),
    }
}

function makeGround(
    nodeName: string,
    options?: {
        label?: string
        position?: { x: number; y: number }
        rotation?: number
    }
): Ground {
    return {
        type: 'Ground',
        label: options?.label || nodeName,
        ...(options?.position && {
            position: {
                x: options.position.x,
                y: options.position.y,
            },
        }),
        ...(options?.rotation && {
            rotation: options.rotation,
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
    Dff: makeDff,
    Addition: makeAddition,
    Display7: makeDisplay7,
    Power: makePower,
    Ground: makeGround,
}

// // Example usage
// const defaultAnd = deviceFactoryMap["And"]("andGate");
// const defaultButton = deviceFactoryMap["Button"]("button1");
// const defaultLamp = deviceFactoryMap["Lamp"]("lamp1");
