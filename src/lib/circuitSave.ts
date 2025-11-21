import { createEmptyCircuit } from '@CircuitStore'
import { get, type Readable, writable, type Writable } from 'svelte/store'
import type { XYPair } from 'svelvet'

type SaveDataFormat = {
    main_circuit: SingleSaveDataFormat & { display_name: string },
    subcircuits: { [key: string]: SingleSaveDataFormat },
}
export type SingleSaveDataFormat = {
    circuit: Circuit,
    zoom: number,
    translation: XYPair,
}

export interface CircuitSave {

    setMainCircuitName(name: string): void;
    getMainCircuitName(): string;

    setCircuit(name: string, save: SingleSaveDataFormat): void;
    getCircuit(name: string): SingleSaveDataFormat | null;

    createSubcomponent(name: string): void;
    deleteSubcomponent(name: string): void;
    renameSubcomponent(name: string, newName: string): void;
    getSubcomponents(): Readable<string[]>;
    fixSubcomponentAnchors(name: string): void;

    setSaveJson(saveJson: string): void;
    getSaveJson(): string;

}

function createEmptySingleSave() : SingleSaveDataFormat {
    return {
        circuit: createEmptyCircuit(),
        zoom: 1,
        translation: { x: 0, y: 0 }
    }
}

function parseSaveData(data: string) : SaveDataFormat {
    let saveData: SaveDataFormat = JSON.parse(data);
    // handle missing entries
    const allSingleSaves = [
        ...Object.keys(saveData.subcircuits).map((key) => saveData.subcircuits[key]),
        saveData.main_circuit
    ];
    for (const singleSave of allSingleSaves) {
        if (singleSave.circuit === undefined) {
            throw Error("Save missing circuit entry!");
        }
        if (singleSave.zoom === undefined) {
            singleSave.zoom = 1;
        }
        if (singleSave.translation === undefined) {
            singleSave.translation = { x: 0, y: 0 };
        }
    }
    return saveData;
}

export function createCircuitSave(circuitSaveJson?: string): CircuitSave {
    let saveData: SaveDataFormat;
    if (circuitSaveJson != null) {
        saveData = parseSaveData(circuitSaveJson);
    } else {
        saveData = {
            main_circuit: {
                ...createEmptySingleSave(),
                display_name: 'Main Circuit'
            },
            subcircuits: {},
        }
    }
    let subcomponents: Writable<string[]> = writable(Object.keys(saveData.subcircuits));

    return {
        setMainCircuitName(name: string) {
            saveData.main_circuit.display_name = name;
        },
        getMainCircuitName():string {
            return saveData.main_circuit.display_name;
        },

        setCircuit(name: string, save: SingleSaveDataFormat) {
            if (name === saveData.main_circuit.display_name) {
                saveData.main_circuit = {
                    ...save,
                    display_name: saveData.main_circuit.display_name
                };
            } else if (name in saveData.subcircuits) {
                saveData.subcircuits[name] = save;
            }
        },
        getCircuit(name: string): SingleSaveDataFormat | null {
            if (name === saveData.main_circuit.display_name) {
                return saveData.main_circuit;
            }
            const subcircuit = saveData.subcircuits[name];
            return subcircuit == null ? null : subcircuit;
        },

        createSubcomponent(name: string) {
            // update subcircuits json
            if (get(subcomponents).indexOf(name) != -1) { // already exists
                return;
            }
            saveData.subcircuits[name] = createEmptySingleSave();
            subcomponents.update((current) => {
                current.push(name);
                return current;
            });
        },
        deleteSubcomponent(name: string) {
            // update subcircuits json
            const index = get(subcomponents).indexOf(name);
            if (index == -1) { // nothing to remove
                return;
            }
            delete saveData.subcircuits[name];
            subcomponents.update((current) => {
                current.splice(index, 1);
                return current;
            });
        },
        renameSubcomponent(name: string, newName: string) {
            const index = get(subcomponents).indexOf(name);
            if (index == -1) {
                return;
            }
            saveData.subcircuits[newName] = saveData.subcircuits[name];
            delete saveData.subcircuits[name];
            // TODO need to convert data of existing circuits
            subcomponents.update((current) => {
               current[index] = newName;
               return current;
            });
        },
        getSubcomponents(): Readable<string[]> {
            return subcomponents;
        },
        fixSubcomponentAnchors(name: string): void {
            if (name === saveData.main_circuit.display_name) {
                return
            }
            let save = this.getCircuit(name)
            if (!save) return
            let circuit = save.circuit
            let inputs = 0
            let outputs = 0
            for (const deviceKey in circuit.devices) {
                if (deviceKey in circuit.devices) {
                    let device = circuit.devices[deviceKey]
                    if (device.type == 'Button') {
                        inputs++
                    }
                    if (device.type == 'Lamp') {
                        outputs++
                    }
                }
            }
            let allCircuits = [this.getMainCircuitName(), ...get(this.getSubcomponents())]
            for (let circName of allCircuits) {
                if (circName == name) { continue }
                let otherSave = this.getCircuit(circName)
                if (!otherSave) { continue }
                let circ = otherSave.circuit
                if (circ.subcircuits.indexOf(name) == -1) { continue }
                for (const deviceKey in circ.devices) {
                    console.log('FUCK')
                    if (deviceKey in circ.devices && circ.devices[deviceKey].type == 'Subcircuit' && (circ.devices[deviceKey] as Subcomponent).celltype == name) {
                        console.log('FOUND DEVICE')
                        let subcomp = circ.devices[deviceKey] as Subcomponent
                        subcomp.inputs = inputs
                        subcomp.outputs = outputs
                        circ.devices[deviceKey] = subcomp
                        for (let connKey in circ.connectors) {
                            if (connKey.split('_')[2] == subcomp.label.split('_')[1] && parseInt(connKey.split('_')[0][3]) > outputs) {
                                // If this entry describes an output of this subcomponent, and its id is too high, delete it
                                delete circ.connectors[connKey as outputAnchorName]
                            } else {
                              // Otherwise, see if this output connects to an input of this subcomponent,
                              // and delete all connections that do
                              let toDel = []
                              for (const [index, connTup] of circ.connectors[connKey as outputAnchorName].entries()) {
                                  if (connTup[0] == subcomp.label && parseInt(connTup[1].split('_')[0][2]) > inputs) { toDel.push(index) }
                              }
                              console.log(connKey, toDel)
                              toDel.sort((a, b) => b - a)
                              for (let i of toDel) { circ.connectors[connKey as outputAnchorName].splice(i, 1) }
                            }
                        }
                    }
                }
            }
        },

        setSaveJson(saveJson: string) {
            saveData = parseSaveData(saveJson);
            subcomponents.set(Object.keys(saveData.subcircuits));
        },
        getSaveJson(): string {
            return JSON.stringify(saveData);
        }
    }
}
