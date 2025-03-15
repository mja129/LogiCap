import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
import { circuitStore } from './circuitStore.ts'
import { Vector3vl } from '3vl'
import { writable, get, type Writable } from 'svelte/store';

//Two Vectors, both 1 bit, one is on (1) and off (0)
let oneBit: Vector3vl = Vector3vl.ones(1);
let zeroBit: Vector3vl = Vector3vl.zeros(1);

export let circuitEngine: HeadlessCircuit | null = null; //The null might be a little schizo
export let running: boolean = false;
export let monitoredWires: Set<string> = new Set() //For reupping on change
export let currentTick = writable<number>(0) //This is legit just for the display, if theres a better way to do this tell me
export let wireSignals = writable<Record<string, number>>({}); //Wire signal store


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
circuitStore.subscribe((jsonData) => {
    circuitEngine = new HeadlessCircuit(jsonData);
    monitoredWires.forEach(wire => {
        wireMonitoring(wire);
    });
});


/*
    Toggles running
*/
export function toggleSimulation(tickRate: number) {
    if (!running) {
        console.log("Simulation Started")
        running = true;
        start(tickRate)
    }
    else {
        console.log("Simulation Stopped")
        running = false;
    }


}

/*
    Basically how other non headless circuits run like in engines.mjs
*/
function start(tickRate: number) {
    if (running == false) {
        return;
    }
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    circuitEngine.updateGates()
    currentTick.set(circuitEngine.tick);
    setTimeout(() => start(tickRate), tickRate);
}

/*
    Adds to monitorList
*/
export function addMonitor(wireId: string) {
    if (!monitoredWires.has(wireId)) {
        monitoredWires.add(wireId);
        wireMonitoring(wireId);
    }
}

/*
    This is just to make less annoying by passing in id instead of a wire object
*/

export function wireMonitoring(wireId: string) {
    if (circuitEngine == null) {
        return;
    }
    let curWir: any = circuitEngine.findWireByLabel(wireId);
    circuitEngine.monitorWire(curWir,
        (tick: number) => wireCallback(wireId, curWir, tick)
    )
}

/*
    Essentially the same as before
    Updates Signal store
*/
function wireCallback(wireId: string, wire: any, tick: number) {
    let logicValue: number
    let signalList: Record<string, number>;
    if (wire.attributes.signal) {
        if (wire.attributes.signal._avec[0] == wire.attributes.signal._bvec[0]) {
            logicValue = wire.attributes.signal._avec[0]
        }
        else {
            logicValue = -1
        }
        console.log(`${wireId} has changed signal to ${logicValue} at tick ${tick}`);
        signalList = get(wireSignals)
        signalList[wireId] = logicValue
        wireSignals.set(signalList)
    }
}

/*
    These are all just wrappers for the baseline updateGate functions
*/

export function updateTick() {
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    circuitEngine.updateGates();
    currentTick.set(circuitEngine.tick);
}

export function updateNext() {
    if (circuitEngine == null) {
        console.log("Circuit is null")
        return;
    }
    circuitEngine.updateGatesNext();
    currentTick.set(circuitEngine.tick);
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
    currentSig = circuitEngine.getLabelIndex().devices[inputName].attributes.outputSignals.out._avec[0];
    if (currentSig == 1) {
        circuitEngine.setInput(inputName, zeroBit);
    }
    else {
        circuitEngine.setInput(inputName, oneBit);
    }
}
