import { get } from 'svelte/store'
import type { CircuitSave } from '@lib/circuitSave'

/**
 * Checks whether a subcircuit celltype is used on any canvas other than the one being edited.
 * Used to determine whether it's safe to delete an encoder subcircuit from memory.
 *
 * @param celltype - The subcircuit celltype to search for (e.g., "Encoder_1")
 * @param excludeCircuit - The name of the current canvas to skip
 * @param circuitSave - The circuit save object to search through
 * @returns true if the celltype is found on any other canvas, false if it's safe to remove
 */
export function isSubUsedElsewhere(celltype: string, excludeCircuit: string, circuitSave: CircuitSave): boolean {
    const allCircuits = [circuitSave.getMainCircuitName(), ...get(circuitSave.getSubcomponents())];
    for (const circName of allCircuits) {
        if (circName === excludeCircuit) continue;
        const circ = circuitSave.getCircuit(circName)?.circuit;
        if (!circ) continue;
        for (const deviceId in circ.devices) {
            const device = circ.devices[deviceId];
            if (device.type === 'Subcircuit' && (device as Subcomponent).celltype === celltype) {
                return true;
            }
        }
    }
    return false;
}