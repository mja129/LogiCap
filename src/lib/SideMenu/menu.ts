import andIcon from '../../assets/icons/circuits/And.webp'
import bufferIcon from '../../assets/icons/circuits/Buffer.webp'
import orIcon from '../../assets/icons/circuits/Or.webp'
import norIcon from '../../assets/icons/circuits/Nor.webp'

import xorIcon from '../../assets/icons/circuits/Xor.webp'
import xnorIcon from '../../assets/icons/circuits/Xnor.webp'
import nandIcon from '../../assets/icons/circuits/Nand.webp'
import notIcon from '../../assets/icons/circuits/Not.webp'

export type menuJsonElement = { name: string, icon: string }
type menuJsonGroupElements = Record<"groupElements", Array<menuJsonElement>>
type menuJsonItem = Record<"svg", string | undefined> & menuJsonGroupElements
type menuJsonType = Record<string, menuJsonItem>
// This maybe should be just a json file but I want it to be in this folder and that is maybe problematic
export const menuJsonData: menuJsonType = {
    "Logic Gates": {
        "svg": undefined,
        "groupElements": [
            { name: "And", icon: andIcon },
            { name: "Nand", icon: nandIcon },
            { name: "Or", icon: orIcon },
            { name: "Nor", icon: norIcon },
            { name: "Xor", icon: xorIcon },
            { name: "Xnor", icon: xnorIcon },
            { name: "Not", icon: notIcon },
            { name: "Repeater", icon: bufferIcon }
        ]
    },
    "Arithmetic": {
        "svg": undefined,
        "groupElements": [
            { name: "And", icon: andIcon },
            { name: "Or", icon: andIcon },
            { name: "Nor", icon: andIcon },
            { name: "Not", icon: andIcon },
            { name: "Xor", icon: andIcon },
            { name: "Nand", icon: andIcon },
            { name: "Repeater", icon: andIcon },
            { name: "Xnor", icon: andIcon }
        ]
    },
    "Multiplexers": {
        "svg": undefined,
        "groupElements": [
            { name: "And", icon: andIcon },
            { name: "Or", icon: andIcon },
            { name: "Nor", icon: andIcon },
            { name: "Not", icon: andIcon },
            { name: "Xor", icon: andIcon },
            { name: "Nand", icon: andIcon },
            { name: "Repeater", icon: andIcon },
            { name: "Xnor", icon: andIcon }
        ]
    },
    "Memory": {
        "svg": undefined,
        "groupElements": [
            { name: "And", icon: andIcon },
            { name: "Or", icon: andIcon },
            { name: "Nor", icon: andIcon },
            { name: "Not", icon: andIcon },
            { name: "Xor", icon: andIcon },
            { name: "Nand", icon: andIcon },
            { name: "Repeater", icon: andIcon },
            { name: "Xnor", icon: andIcon }
        ]
    },
    "Utils": {
        "svg": undefined,
        "groupElements": [
            { name: "And", icon: andIcon },
            { name: "Or", icon: andIcon },
            { name: "Nor", icon: andIcon },
            { name: "Not", icon: andIcon },
            { name: "Xor", icon: andIcon },
            { name: "Nand", icon: andIcon },
            { name: "Repeater", icon: andIcon },
            { name: "Xnor", icon: andIcon }
        ]
    }
}
