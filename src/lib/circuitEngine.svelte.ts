import { CircuitStore } from '@CircuitStore'
import { Vector3vl } from '3vl'
import { writable, get, type Writable } from 'svelte/store';
import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit';
import { circuitSave, canvasTransform, currentCircuit } from '@src/App.svelte';
import { buildPortMap, compileCircuitConnections } from './CircuitParts/WireNetting';

//Two Vectors, both 1 bit, one is on (1) and off (0)
let oneBit: Vector3vl = Vector3vl.ones(1);
let zeroBit: Vector3vl = Vector3vl.zeros(1);

export let CircuitEngine: Writable<CustomHeadlessCircuit | null> = writable<CustomHeadlessCircuit | null>(null); //The null might be a little schizo

// this is why we want circuitEngine.svelte.ts
let running: boolean = $state(false)
export let monitoredWires: Set<string> = new Set() //For reupping on change

export const getRunning = () => running

// Naurr
export let wireSignals = writable<Record<string, number>>({}); //Wire signal store

let currentTick = $state(0)
export const getCurrTick = () => currentTick

let tickRate = $state(1000) // ms between ticks, lower = faster
export const getTickRate = () => tickRate
export const setTickRate = (hz: number) => { tickRate = hz }

export let tickSignal: Writable<number> = writable(0); // Used to trigger updates in components that subscribe to tickSignal whenever the tick changes

Object.defineProperty(CustomHeadlessCircuit.prototype, "running", {
    get() {
        //console.warn("Overriding `running` getter at runtime.");
        //This was here to prevent some weird error of it failing to access running
        //Its safe as HeadlessCircuit always returns false anyways but this may not be needed anymore?
        return false;
    }
});
/*
    Possibly better way to do this, for now im just reattaching all monitors
    Need to also destroy old monitors in case
*/

/*
    Creating a utility for compiling and saving. This will be called on every tab departure, including delete
*/
export function compileAndSaveCircuit(circuitName: string) {
    const wireCanvas = document.querySelector('.wire-canvas') as SVGSVGElement;
    if (!wireCanvas) return;

    const rect = wireCanvas.getBoundingClientRect();
    const transform = get(canvasTransform);
    const portMap = buildPortMap(rect, transform);
    const segments = get(CircuitStore).wireSegments;
    const compiledConnectors = compileCircuitConnections(segments, portMap);

    // Keep CircuitStore in sync
    CircuitStore.update(c => { c.connectors = compiledConnectors; return c; });

    // Persist into circuitSave so loadSubcircuits() finds it later
    const saved = circuitSave.getCircuit(circuitName);
    if (saved) {
        saved.circuit.connectors = compiledConnectors;
        circuitSave.setCircuit(circuitName, saved);
    }
}

/*
    Toggles running
*/
export function toggleSimulation() {

    if (!running) {
        console.log("Simulation Started")
        // compile whatever tab is currently open
        const activeCircuit = get(currentCircuit);
        compileAndSaveCircuit(activeCircuit);

        // if we're a subcircuit, compile in run that subcircuit instead of the main circuit
        // we might not need this?
        const isMain = activeCircuit === circuitSave.getMainCircuitName();
        const stateToRun = isMain
            ? get(CircuitStore)
            : circuitSave.getCircuit(activeCircuit)?.circuit;

        if (!stateToRun) {
            console.warn("Nothing to run");
            return;
        }

        // just-in-time netlist compilation
        // finding the canvas
        const wireCanvas = document.querySelector('.wire-canvas') as SVGSVGElement;
        const finalCircuitState = get(CircuitStore);

        if(wireCanvas) {
            console.log("Compiling circuit nets...");
            const rect = wireCanvas.getBoundingClientRect();
            const transform = get(canvasTransform);

            // building a map of all anchors
            const portMap = buildPortMap(rect, transform);

            // debug port map
            console.log("PORT MAP: ", portMap);

            // compiling wires into logical connections
            const currentSegments = get(CircuitStore).wireSegments;
            const newLogicalConnections = compileCircuitConnections(currentSegments, portMap);

            console.log("COMPILED CONNECTORS: ", newLogicalConnections);

            // updating store before passing to digitalJS
            // sometimes javascript is pretty...
            CircuitStore.update(circuit =>  {
                circuit.connectors = newLogicalConnections;
                return circuit;
            });

            finalCircuitState.connectors = newLogicalConnections;

        } else {
            console.warn("Could not wire-canvas to compile nets")
        }

        running = true;
        /*
        if (get(CircuitEngine) === null) {
            console.log(get(CircuitStore));
            CircuitEngine.set(new CustomHeadlessCircuit(get(CircuitStore)))
        }
        */
        CircuitEngine.set(new CustomHeadlessCircuit(finalCircuitState))
        start()
    }
    else {
        console.log("Simulation Stopped")
        // reset on pause, is not necessarily a move.
        CircuitEngine.set(null)
        currentTick = 0
        running = false;

    }
}

/*
    Basically how other non headless circuits run like in engines.mjs
*/

function start() {
    if (running === false) return;
    
    const currEngine = get(CircuitEngine);
    if (!currEngine) return;

    // Calculating the new logic frame
    currEngine.updateGates();
    currentTick = currEngine.tick;

    const currentStates: Record<string, number> = {};
    
    // Grab the map of logical connections that were already (hopefully) built when start was selected
    // eg: { "out_Mux_123": [ ["Lamp_456", "in_Lamp_456"] ] }
    const connectorsMap = get(CircuitStore).connectors;
    
    // Loop through every single connection
    for (const [sourceAnchor, targets] of Object.entries(connectorsMap)) {
        for (const target of targets as [string, string][]) {
            const targetDeviceId = target[0]; // e.g., "Lamp_456"
            const targetAnchorId = target[1]; // e.g., "in_Lamp_456"

            // DigitalJS uniquely names its wires by combining the source and target ports
            const wireName = `${sourceAnchor}-${targetAnchorId}`;
            
            // Using the existing function to find the live Backbone wire model
            const wire = findWireInEngine(currEngine, wireName);
            
            if (wire && wire.attributes && wire.attributes.signal) {
                // Extract the 1 or 0 safely
                const sig = wire.attributes.signal;
                const logicValue = (sig._avec[0] === sig._bvec[0]) ? sig._avec[0] : 0;
                
                // map the signal directly to the receiving Component's ID
                currentStates[targetDeviceId] = logicValue;
            }
        }
    }
    
    // 4. Instantly broadcast all new wire states to the Svelte components (Lamp)
    wireSignals.set(currentStates);
    tickSignal.set(currentTick);
    setTimeout(() => start(), tickRate);
}

export function resetCircuit() {
    CircuitEngine.set(null)
    currentTick = 0
    running = false;
}

export function findWireInEngine(
    digitalJsCircuit: CustomHeadlessCircuit,
    wireId: string
) {
    let currWire = digitalJsCircuit?.findWireByLabel(wireId)
    if (!currWire) {
        console.warn(
            'Wire not created yet on headless circuit creation or update'
        )
        return null
    }
    return currWire
}

/*
    Adds to monitorList
*/
// export function addMonitor(wireId: string) {
//     if (!monitoredWires.has(wireId)) {
//         monitoredWires.add(wireId);
//         wireMonitoring(wireId);
//     }
// }

/*
    This is just to make less annoying by passing in id instead of a wire object
*/

export function onWireChange(wire: any) {
    let logicValue: number
    if (wire.attributes.signal) {
        if (
            wire.attributes.signal._avec[0] ==
            wire.attributes.signal._bvec[0]
        ) {
            logicValue = wire.attributes.signal._avec[0]
        } else {
            logicValue = -1
        }
        // console.log(
        //     `${wireId} has changed signal to ${logicValue} at tick ${tick}`
        // )
        return logicValue
    }
    return -1
}


/*
    These are all just wrappers for the baseline updateGate functions
*/

export function updateTick() {
    if (CircuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    const currEngine: CustomHeadlessCircuit | null = get(CircuitEngine)
    if (currEngine === null) {
        console.log("impossible");
        return
    }
    currEngine.updateGates();
    currentTick = currEngine.tick;
}

export function updateNext() {
    if (CircuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    const currEngine: CustomHeadlessCircuit | null = get(CircuitEngine)
    if (currEngine === null) {
        console.log("impossible");
        return
    }
    currEngine.updateGatesNext();
    currentTick = currEngine.tick;
}


/*
Flips 1 bit inputs and takes their name as a string
*/

// Update your inputSetter to trigger the debug:
export function inputSetter(inputName: string) {
    let currentSig: number;
    if (CircuitEngine == null) {
        console.log("Circuit is null")
        return;
    }

    const currEngine: CustomHeadlessCircuit | null = get(CircuitEngine)
    if (currEngine === null) {
        console.log("impossible");
        return
    }
    currentSig = currEngine.getLabelIndex().devices[inputName].attributes.outputSignals.out._avec[0];
    if (currentSig == 1) {
        currEngine.setInput(inputName, zeroBit);
    }
    else {
        currEngine.setInput(inputName, oneBit);
    }
}
