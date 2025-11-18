import { createEmptyCircuit } from '@CircuitStore'

type SaveDataFormat = {
    main_circuit: SingleSaveDataFormat,
    subcircuits: { [key: string]: SingleSaveDataFormat },
}
type SingleSaveDataFormat = {
    circuit: Circuit
    // add more data as needed
}

function createSingleSave(circuit: Circuit): SingleSaveDataFormat {
    return {
        circuit: circuit
    };
}

export const MAIN_CIRCUIT_NAME = 'main circuit';

export interface CircuitSave {

    setCircuit(name: string, circuit: Circuit): void;
    getCircuit(name: string): Circuit | null;

    createSubcomponent(name: string): void;
    deleteSubcomponent(name: string): void;
    renameSubcomponent(name: string, newName: string): void;
    getSubcomponents(): string[];

    getSaveJson() : string;

}

export function createCircuitSave(circuitSaveJson?: string): CircuitSave {
    let saveData: SaveDataFormat;
    if (circuitSaveJson != null) {
        saveData = JSON.parse(circuitSaveJson);
    } else {
        saveData = {
            main_circuit: createSingleSave(createEmptyCircuit()),
            subcircuits: {},
        }
    }
    let subcomponents: string[] = Object.keys(saveData.subcircuits);

    return {
        setCircuit(name: string, circuit: Circuit) {
            if (name === MAIN_CIRCUIT_NAME) {
                saveData.main_circuit.circuit = circuit;
            } else {
                const subcircuit = saveData.subcircuits[name];
                if (subcircuit != null) {
                    subcircuit.circuit = circuit;
                }
            }
        },
        getCircuit(name: string): Circuit | null {
            if (name === MAIN_CIRCUIT_NAME) {
                return saveData.main_circuit.circuit;
            }
            const subcircuit = saveData.subcircuits[name];
            return subcircuit == null ? null : subcircuit.circuit;
        },
        createSubcomponent(name: string) {
            // update subcircuits json
            if (subcomponents.indexOf(name) != -1) { // already exists
                return;
            }
            subcomponents.push(name);
            saveData.subcircuits[name] = createSingleSave(createEmptyCircuit());
        },
        deleteSubcomponent(name: string) {
            // update subcircuits json
            const index = subcomponents.indexOf(name);
            if (index == -1) { // nothing to remove
                return;
            }
            subcomponents.splice(index, 1);
            delete saveData.subcircuits[name];
        },
        renameSubcomponent(name: string, newName: string) {
            const index = subcomponents.indexOf(name);
            if (index == -1) {
                return;
            }
            subcomponents[index] = newName;
            saveData.subcircuits[newName] = saveData.subcircuits[name];
            delete saveData.subcircuits[name];
            // TODO need to convert data of existing circuits
        },
        getSubcomponents(): string[] {
            return subcomponents;
        },

        getSaveJson(): string {
            return JSON.stringify(saveData);
        }
    }
}
