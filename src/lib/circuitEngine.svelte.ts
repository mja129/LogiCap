import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
import { circuitStore } from './circuitStore.ts'
import { Vector3vl } from '3vl'
import { writable, get, type Writable } from 'svelte/store';

//Two Vectors, both 1 bit, one is on (1) and off (0)
let oneBit: Vector3vl = Vector3vl.ones(1);
let zeroBit: Vector3vl = Vector3vl.zeros(1);

export let circuitEngine: Writable<HeadlessCircuit | null> = writable<HeadlessCircuit | null>(null); //The null might be a little schizo

// this is why we want circuitEngine.svelte.ts
let running: boolean = $state(false)
export let monitoredWires: Set<string> = new Set() //For reupping on change
export let lastConnected: Writable<string> = writable("First Connection")

export const getRunning = () => running

// Naurr
export let wireSignals = writable<Record<string, number>>({}); //Wire signal store

let currentTick = $state(0) //This is legit just for the display, if theres a better way to do this tell me
export const getCurrTick = () => currentTick

Object.defineProperty(HeadlessCircuit.prototype, "running", {
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
// circuitStore.subscribe((jsonData) => {
//     circuitEngine = new HeadlessCircuit(jsonData);
//     monitoredWires.forEach(wire => {
//         wireMonitoring(wire);
//     });
// });


/*
    Toggles running
*/
export function toggleSimulation(tickRate: number) {
    if (!running) {
        console.log("Simulation Started")
        running = true;
        if (get(circuitEngine) === null) {
            console.log(get(circuitStore));
            circuitEngine.set(new HeadlessCircuit(get(circuitStore)))
            // circuitStore.subscribe((currCircuit) => {
            //     circuitEngine = new HeadlessCircuit()
            // })
        }
        start(tickRate)
    }
    else {
        console.log("Simulation Stopped")
        // reset on pause, is not necessarily a move.
        circuitEngine.set(null)
        currentTick = 0
        running = false;
    }
}

/*
    Basically how other non headless circuits run like in engines.mjs
*/
function start(tickRate: number) {
    // you shouldn't ever run this function when running is false.
    if (running === false) {
        return;
    }
    const currEngine: HeadlessCircuit | null = get(circuitEngine)
    if (currEngine === null) {
        console.log("impossible");
        return
    }
    currEngine.updateGates()
    currentTick = currEngine.tick;
    setTimeout(() => start(tickRate), tickRate);
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

export function onWireChange(wireId: string, wire: any, tick: number) {
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
        console.log(
            `${wireId} has changed signal to ${logicValue} at tick ${tick}`
        )
        return logicValue
    }
    return -1
}

export function wireMonitoring(wireId: string) {
    // circuitEngine = new HeadlessCircuit(get(circuitStore))
    // if (wireListener !== undefined) {
    //     circuitEngine.unmonitor(wireId)
    // }
    // if false we either didnt add the wire to the headless circuit
    // in the queue but not in headless circuit
    // add it to a list of things that will update when headless circuit does.
    // in headless circuit.
    // await findWireByLabel being true.
    // subscribe to changes in the queue.
    // subscribe to changes in global headless circuit.
    return null
}

/*
    These are all just wrappers for the baseline updateGate functions
*/

export function updateTick() {
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    const currEngine: HeadlessCircuit | null = get(circuitEngine)
    if (currEngine === null) {
        console.log("impossible");
        return
    }
    currEngine.updateGates();
    currentTick = currEngine.tick;
}

export function updateNext() {
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    const currEngine: HeadlessCircuit | null = get(circuitEngine)
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
export function inputSetter(inputName: string) {
    let currentSig: number;
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }

    const currEngine: HeadlessCircuit | null = get(circuitEngine)
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
