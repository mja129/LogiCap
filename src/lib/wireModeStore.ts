import { writable, type Writable } from 'svelte/store'

export const wireMode = writable(0);
export const cancelDrawSignal = writable(0);
export const selectedWireIds = writable<Set<string>>(new Set());
export const selectedNodeIds = writable<Set<string>>(new Set());

// Maps nodeId → svelvet position store, so the dragging node can move all selected nodes together
export const nodePositionRegistry = writable<Map<string, Writable<{ x: number; y: number }>>>(new Map());
