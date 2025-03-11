import andIcon from '../assets/icons/circuits/And.webp'
import bufferIcon from '../assets/icons/circuits/Buffer.webp'
import orIcon from '../assets/icons/circuits/Or.webp'
import norIcon from '../assets/icons/circuits/Nor.webp'

import xorIcon from '../assets/icons/circuits/Xor.webp'
import xnorIcon from '../assets/icons/circuits/Xnor.webp'
import nandIcon from '../assets/icons/circuits/Nand.webp'
import notIcon from '../assets/icons/circuits/Not.webp'
import outputIcon from '../assets/icons/circuits/outputIcon.png'
import inputIcon from '../assets/icons/circuits/inputIcon.png'

import AndGate from './LogicGates/LogicGate.svelte'
import SingleIoLogic from './LogicGates/SingleIoLogic.svelte'
import OutputResultNode from './InputOutputNodes/OutputResultNode.svelte'
import ButtonInputNode from './InputOutputNodes/ButtonInputNode.svelte'

import { type ComponentProps } from 'svelte'

// Types that represent the different groups
// as well as each node group based off of if they are handled in the same file.
// or their grouping in the menu
export type NodeMenuGroups = "Logic Gates" | "Input/Output"

export type dualInputLogicTypes = 'and' | 'nand' | 'or' | 'nor' | 'xor' | 'xnor'
export type singleIoLogicTypes = 'repeater' | 'not'
export type logicGateTypes = singleIoLogicTypes | dualInputLogicTypes

export type ioNodeTypes = "input" | "output"
export type allNodeTypes = logicGateTypes | ioNodeTypes

// types for the structure of the menu
// this object is also used when dragging and dropping from SideMenuGroupItems.svelte
export type menuJsonElement = { name: string, nodeType: allNodeTypes, icon: string }
type menuJsonGroupElements = Record<"groupElements", Array<menuJsonElement>>
type menuJsonItem = Record<"svg", string | undefined> & menuJsonGroupElements
export type menuJsonType = Record<NodeMenuGroups, menuJsonItem>

// all possible props for all component groups.
// a component group probably has different logic/ a different json for digitalJS
type AndGateProps = ComponentProps<typeof AndGate>
type OutputResultNodeProps = ComponentProps<typeof OutputResultNode>
type ButtonInputNodeProps = ComponentProps<typeof ButtonInputNode>

// needed in SimNode.svelte
export type AllNodeProps =
    | AndGateProps
    | OutputResultNodeProps
    | ButtonInputNodeProps

// This maybe should be just a json file but I want it to be in this folder and that is maybe problematic
export const menuJsonData: menuJsonType = {
    "Logic Gates": {
        "svg": undefined,
        "groupElements": [
            { name: "And", nodeType: "and", icon: andIcon },
            { name: "Nand", nodeType: "nand", icon: nandIcon },
            { name: "Or", nodeType: "or", icon: orIcon },
            { name: "Nor", nodeType: "nor", icon: norIcon },
            { name: "Xor", nodeType: "xor", icon: xorIcon },
            { name: "Xnor", nodeType: "xnor", icon: xnorIcon },
            { name: "Not", nodeType: "not", icon: notIcon },
            { name: "Repeater", nodeType: "repeater", icon: bufferIcon }
        ]
    },
    "Input/Output": {
        "svg": undefined,
        "groupElements": [
            { name: "Output", nodeType: "output", icon: outputIcon },
            { name: "Input", nodeType: "input", icon: inputIcon },
        ]
    }
}

// This function is here as opposed to inside of SimNode.svelte
// This is in order to simplify the process of adding a new component

// 1. Add item to the menu
// 2. add the component name and type to its group in the menuJsonData
// 3. create the component
// 4. add the component prop type to AllNodeProps
// 5. add it to the switch statement below.
// this function is used to getComponent when dropping and create the correct component.
export function getComponent(type: allNodeTypes) {
    switch (type) {
        case 'and':
        case 'nor':
        case 'xor':
        case 'xnor':
        case 'or':
        case 'nand':
            return AndGate
        case 'repeater':
        case 'not':
            return SingleIoLogic
        case 'input':
            return ButtonInputNode
        case 'output':
            return OutputResultNode
        default:
            return null
    }
}