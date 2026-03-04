import { writable } from 'svelte/store'

export const wireMode = writable(0);
export const cancelDrawSignal = writable(0);
export const selectedWireIds = writable<Set<string>>(new Set());
