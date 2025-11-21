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

export function createCircuitSave(circuitSaveJson?: string): CircuitSave {
    let saveData: SaveDataFormat;
    if (circuitSaveJson != null) {
        saveData = JSON.parse(circuitSaveJson);
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

        setSaveJson(saveJson: string) {
            // TODO validation
            saveData = JSON.parse(saveJson);
            subcomponents.set(Object.keys(saveData.subcircuits));
        },
        getSaveJson(): string {
            return JSON.stringify(saveData);
        }
    }
}
