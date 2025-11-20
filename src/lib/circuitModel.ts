import { type Component, type ComponentProps } from 'svelte'

import { writable, type Writable } from 'svelte/store'

import andIcon from '@icons/circuits/And.webp'
import bufferIcon from '@icons/circuits/Buffer.webp'
import orIcon from '@icons/circuits/Or.webp'
import norIcon from '@icons/circuits/Nor.webp'

import xorIcon from '@icons/circuits/Xor.webp'
import xnorIcon from '@icons/circuits/Xnor.webp'
import nandIcon from '@icons/circuits/Nand.webp'
import notIcon from '@icons/circuits/Not.webp'
import outputIcon from '@icons/circuits/outputIcon.png'
import inputIcon from '@icons/circuits/inputIcon.png'

import LogicGate from '@Circuits/LogicGates/LogicGate.svelte'
import SingleIoLogic from '@Circuits/LogicGates/SingleIoLogic.svelte'
import Lamp from '@Circuits/InputOutputNodes/Lamp.svelte'
import ButtonNode from '@Circuits/InputOutputNodes/ButtonNode.svelte'
import Subcomponent from '@Circuits/Subcomponent.svelte'
import TunnelInput from '@Circuits/Tunnels/TunnelInput.svelte'
import TunnelOutput from '@Circuits/Tunnels/TunnelOutput.svelte'

// Types that represent the different groups
// as well as each node group based off of if they are handled in the same file.
// or their grouping in the menu
export type NodeMenuGroups = 'Logic Gates' | 'Input/Output' | 'Tunnels' | 'Subcomponents' | 'GhostElement'

export type dualInputLogicTypes = 'And' | 'Nand' | 'Or' | 'Nor' | 'Xor' | 'Xnor'
export type singleIoLogicTypes = 'Repeater' | 'Not'
export type tunnelTypes = 'TunnelInput' | 'TunnelOutput'
export type logicGateTypes = singleIoLogicTypes | dualInputLogicTypes | tunnelTypes

export type ioNodeTypes = 'Button' | 'Lamp'
export type allNodeTypes = logicGateTypes | ioNodeTypes | tunnelTypes | 'Subcircuit'

// types for the structure of the menu
// this object is also used when dragging and dropping from SideMenuGroupItems.svelte
export type menuJsonElement = {
    name: string
    nodeType: allNodeTypes
    icon: string
}
type menuJsonGroupElements = Record<'groupElements', Array<menuJsonElement>>
type menuJsonItem = Record<'svg', string | undefined> & menuJsonGroupElements
export type menuJsonType = Record<NodeMenuGroups, menuJsonItem>

// all possible props for all component groups.
// a component group probably has different logic/ a different json for digitalJS
type LogicGateProps = ComponentProps<typeof LogicGate>
type OutputResultNodeProps = ComponentProps<typeof Lamp>
type ButtonInputNodeProps = ComponentProps<typeof ButtonNode>
type SubcomponentProps = ComponentProps<typeof Subcomponent>
type TunnelInputProps = ComponentProps<typeof TunnelInput>
type TunnelOutputProps = ComponentProps<typeof TunnelOutput>

// needed in SimNode.svelte
// So far we don't need to worry about initializing SimNode, with specific props.
// when we do we will get them from SideMenuGroupItems.svelte and then spread them in App.svelte

// I swear I suck at typescript.
// the nodes need 'nodeID' but I don't want to pass it into nodeProps on SimNode init in app.svelte.
// I want to pass it as props of SimNode and then pass it through to the component myself.
export type AllNodePropsWithoutId =
    | Omit<LogicGateProps, 'nodeId'>
    | Omit<OutputResultNodeProps, 'nodeId'>
    | Omit<ButtonInputNodeProps, 'nodeId'>
    | Omit<SubcomponentProps, 'nodeId'>
    | Omit<TunnelInputProps, 'nodeId'>
    | Omit<TunnelOutputProps, 'nodeId'>

// add back in nodeId
export type AllNodeProps = AllNodePropsWithoutId & Record<'nodeId', string>

// This maybe should be just a json file but I want it to be in this folder and that is maybe problematic
export const menuJsonData: Writable<menuJsonType> = writable({
    'Logic Gates': {
        svg: undefined,
        groupElements: [
            { name: 'And', nodeType: 'And', icon: andIcon },
            { name: 'Nand', nodeType: 'Nand', icon: nandIcon },
            { name: 'Or', nodeType: 'Or', icon: orIcon },
            { name: 'Nor', nodeType: 'Nor', icon: norIcon },
            { name: 'Xor', nodeType: 'Xor', icon: xorIcon },
            { name: 'Xnor', nodeType: 'Xnor', icon: xnorIcon },
            { name: 'Not', nodeType: 'Not', icon: notIcon },
            { name: 'Repeater', nodeType: 'Repeater', icon: bufferIcon },
        ],
    },
    'Input/Output': {
        svg: undefined,
        groupElements: [
            { name: 'Lamp', nodeType: 'Lamp', icon: outputIcon },
            { name: 'Button', nodeType: 'Button', icon: inputIcon },
        ],
    },
    'Tunnels': {
        svg: undefined,
        groupElements: [
            // TODO give these their own icons
            { name: 'Tunnel Input', nodeType: 'TunnelInput', icon: outputIcon },
            { name: 'Tunnel Output', nodeType: 'TunnelOutput', icon: outputIcon },
        ],
    },
    'Subcomponents': {
        svg: undefined,
        groupElements: [],
    },
    GhostElement: {
        svg: undefined,
        groupElements: [],
    },
})

// This function is here as opposed to inside of SimNode.svelte
// This is in order to simplify the process of adding a new component

// 1. Add item to the menu
// 2. add the component name and type to its group in the menuJsonData
// 3. create the component
// 4. add the component prop type to AllNodeProps
// 5. add it to the switch statement below.
// If your component has specific required props: this may be an issue, lmk. 
// this function is used to getComponent when dropping and create the correct component.
export function getComponent(type: allNodeTypes) : Component<AllNodeProps> {
    switch (type) {
        case 'And':
        case 'Nor':
        case 'Xor':
        case 'Xnor':
        case 'Or':
        case 'Nand':
            return LogicGate
        case 'Repeater':
        case 'Not':
            return SingleIoLogic
        case 'Button':
            return ButtonNode
        case 'Lamp':
            return Lamp
        case 'Subcircuit':
            return Subcomponent
        case 'TunnelInput':
            return TunnelInput
        case 'TunnelOutput':
            return TunnelOutput
    }
}
