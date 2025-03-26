import { addConnection } from '../circuitStore'
import { get } from 'svelte/store'


// look in the dom element classList for a class matching 'in' | 'in{number}' | 'out'
export function findAnchorTargetClassName(targetClassList: string[]): string | null {
    // console.log(targetClassList);

    // Check if any class name matches the patterns
    const matchingClass = [...targetClassList].find((className: string) =>
        /^(in\d+|in_|out_)/.test(className)
    );

    return matchingClass || null;
}


// I tried to make this function shorter, instead I made it longer and kinda tryHard
// This is the best function in the whole app 👀
function checkAnchorRelation(anchor1: string, anchor2: string): 'good_in_to_out' | 'good_out_to_in' | 'bad_dual_input' | 'bad_dual_output' | "bad" {

    const checkAnchor: Function = (anchor: string, anchorType: string) => anchor.startsWith(anchorType)
    const checkInput: Function = (anchor: string) => checkAnchor(anchor, 'in')
    const checkOutput: Function = (anchor: string) => checkAnchor(anchor, 'out')

    const getTup = (anchor: string) => ({ isInput: checkInput(anchor), isOutput: checkOutput(anchor) })

    const { a1, a2 } = { "a1": getTup(anchor1), "a2": getTup(anchor2) };
    // console.log(a1, a2);

    if (a1.isInput && a2.isOutput)
        return 'good_in_to_out'
    else if (a2.isInput && a1.isOutput)
        return 'good_out_to_in'
    else if (a1.isInput && a2.isInput)
        return 'bad_dual_input'

    return 'bad_dual_output'
}

function matchAnchors(sourceClass: string, destClass: string): { fromOutputId: string, toInputId: string } {
    // console.log(sourceClass, destClass)
    const [sourcePort, ,] = sourceClass.split('_')

    const fromOutputId = (sourcePort.startsWith('out') && sourceClass) || (destClass);
    // console.log("sourcePort.startsWith('in'): " + sourcePort.startsWith('in'));
    const toInputId = sourcePort.startsWith('in') ? sourceClass : destClass;
    return { fromOutputId, toInputId };
}

// might not even need to make wire id, this function is a stupid wrapper on addConnection
function pushConnectionToCircuitStore(sourceClass: string, destClass: string) {
    const makeWireId = (fromId: string, toId: string): string => fromId + '-' + toId

    // dest is output if THIS port is an input port
    const { fromOutputId, toInputId } = matchAnchors(sourceClass, destClass)
    // addLinking(<outputAnchorName>fromOutputId, <inputAnchorName>toInputId)
    console.log("adding connection", fromOutputId, toInputId)
    addConnection(fromOutputId as outputAnchorName, toInputId as inputAnchorName)

    return makeWireId(fromOutputId, toInputId)
}

// this fn is way too big
export function checkLink(
    destClassList: string[],
    sourceClassName: string
) {
    const destClassName: string | null = findAnchorTargetClassName(destClassList)

    if (destClassName === null) return 'bad_invalid_drop'

    /// destClassList is probably a DOMToken list so it needs to be destructured
    const destAnchorLinked = [...destClassList].find((classItem) => classItem === 'linked')

    // this could be a boolean but its kinda nice bc:
    // if it was a bool I would probably name it destIsInput
    // if you do it like this ... I feel the nesting of 'checkInput(destClassName)' 
    // is natural and better than isInputDest


    const validate: string = checkAnchorRelation(sourceClassName, destClassName)

    if (validate.startsWith('bad')) return validate

    const checkInput = (a: string) => a.startsWith('in')
    // destination cannot be a node that is already linked, but only if the destination is an ouput node.
    if (destAnchorLinked && checkInput(destClassName)) {
        // cannot connect to an input that is already linked
        return 'bad_input_already_linked'
    }
    else if (destAnchorLinked && !checkInput(sourceClassName)) {
        return 'good_output_multi_wires'
    }

    return `${validate}-${destClassName}`
}


export function attemptLink(sourceClassName: string, destClassList: string[]) {
    // No longer connecting nodes, connection has succeeded

    const statusMsg = checkLink(
        destClassList,
        sourceClassName
    )

    console.log(statusMsg);

    if (statusMsg.startsWith('bad')) {
        return statusMsg
    }


    const destClassName = findAnchorTargetClassName(destClassList) as string


    const wireName: string = pushConnectionToCircuitStore(
        sourceClassName,
        destClassName
    )


    return wireName

}





