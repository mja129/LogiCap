// export a function map from this function, then depending on the type, create this json in app.svelte
function makeLamp(nodeName: string, options?: {
    bits: number,
    net: string,
    label: string,
    order: number,
    inputs: number,
    outputs: number
}): Lamp {
    return {

        type: "Lamp",
        net: nodeName,
        inputs: options?.inputs || 1,
        outputs: options?.outputs || 0,
        order: options?.order || 0,
        bits: options?.bits || 1,
        label: options?.label || nodeName
    }
};

function makeButton(nodeName: string, options?: { bits: number, net: string, label: string }): Button {
    return {

        type: "Button",
        label: options?.label || nodeName,
        net: options?.net || nodeName,
        bits: options?.bits || 1,

    };
}

function makeLogicNode(type: string, nodeName: string): LogicGate {
    return {

        type,
        label: nodeName,
        inputs: 2,
        position: {
            x: 0,
            y: 0
        }

    };
}

export const deviceFactoryMap: Record<string, (nodeName: string, options?: any) => Device> = {
    Button: makeButton,
    Lamp: makeLamp,
    And: (nodeName) => makeLogicNode("And", nodeName),
    Nand: (nodeName) => makeLogicNode("Nand", nodeName),
    Or: (nodeName) => makeLogicNode("Or", nodeName),
    Nor: (nodeName) => makeLogicNode("Nor", nodeName),
    Xor: (nodeName) => makeLogicNode("Xor", nodeName),
    Xnor: (nodeName) => makeLogicNode("Xnor", nodeName),
    Not: (nodeName) => makeLogicNode("Not", nodeName),
    Repeater: (nodeName) => makeLogicNode("Repeater", nodeName),
};


// // Example usage
// const defaultAnd = deviceFactoryMap["And"]("andGate");
// const defaultButton = deviceFactoryMap["Button"]("button1");
// const defaultLamp = deviceFactoryMap["Lamp"]("lamp1");
