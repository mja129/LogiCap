declare module "custom_digitaljs" {
    // interface Graph {
    //     getElements(): Gate[];
    //     getLinks(): Link[];
    //     listenTo(event: string, callback: Function): void;
    // }

    // interface Gate {
    //     get(attribute: 'graph'): Graph; // For the 'graph' attribute, return a Graph
    //     get(attribute: string): any;     // For other attributes, return a generic value
    //     isLink(): boolean;
    // }

    // interface Link {
    //     get(attribute: string): any;
    //     isLink(): boolean;
    //     previous(attribute: string): any;
    // }

    // Typescript interfaces' don't have a runtime and 
    // there won't be any code emitted for them
    export interface BaseEngine {
        _graph: any;
        _queue: Map<any, any>;
        _pq: any;  // Assuming this is a priority queue type (you can import the exact type if necessary)
        _tick: number;
        _cells: any;
        _monitorChecks: Map<any, any>;
        _alarms: Map<any, any>;
        _alarmQueue: Map<any, any>;

        // Methods
        _addGate(graph: any, gate: any): void;
        _addLink(graph: any, link: any): void;
        _addGraph(graph: any): void;
        _removeGate(graph: any, gate: any): void;
        _removeLink(graph: any, link: any): void;
        _changeLinkSource(graph: any, link: any, src: any, prevSrc: any): void;
        _changeLinkTarget(graph: any, link: any, end: any, prevEnd: any): void;
        _changeLinkWarning(graph: any, link: any, warn: any, prevWarn: any): void;

        // this function is extended from backbone I likely
        // backbone has to do with events
        listenTo(graph: any, event: string, callback: Function): void;
    };



    export interface SynchEngine extends BaseEngine {
        new(graph: any, { cells: any }): SynchEngine;

        // Specific properties for SynchEngine
        _queue: Map<any, any>;
        _pq: any;
        _tick: number;
        _cells: any;
        _monitorChecks: Map<any, any>;
        _alarms: Map<any, any>;
        _alarmQueue: Map<any, any>;


        // this type might be wrong
        get hasPendingEvents(): any[];
        get tick(): number;
        shutdown(): void;
        // Methods specific to SynchEngine
        _updateSubcircuit(gate: Gate, sigs: any, prevSigs?: any): void;
        _addGate(graph: any, gate: Gate): void;
        _addGraph(graph: any): void;
        _enqueue(gate: Gate): void;
        updateGatesNext(): Promise<number>;
        // probably also important
        updateGates(): Promise<number>;
        // this looks important
        synchronize(): Promise<void>;
        start(): void;
        startFast(): void;
        stop(): Promise<any>;
        get interval(): number;
        set interval(ms: number);
        get running(): boolean;
        observeGraph(graph: any): void;
        unobserveGraph(graph: any): Function;
        monitor(gate: Gate, port: string, callback: Function, options: { triggerValues: any, stopOnTrigger: boolean, oneShot: boolean }): { gate: Gate, callback: Function };
        unmonitor(monitorId: any): void;
        alarm(tick: number, callback: Function, options: { stopOnAlarm: boolean }): void;
        unalarm(alarmId: any): void;
        _checkMonitors(): void;
    };


    type CircuitOptions = {
        cellsNamespace?: Record<string, any> | null;
        engine?: SyncEngine; // Engine is of type SyncEngine constructor
        engineOptions?: Record<string, any>; // Engine options as a key-value object
    };

    // i think Path is some kind of flat representation of the graph
    type Path = any;
    type JsonCircuit = any;
    // some kinda of ascii display/ type/language of/for represenation of gates?
    type Display3vl = any;


    // since the engines.mjs files is used to import a bunch of engines
    // we need to make its namespace
    declare namespace engines {
        export { SynchEngine, BrowserSynchEngine, WorkerEngine };
    }
    export class SynchEngine implements SynchEngine {
        // constructor();
        constructor(graph: any, { cells: any });
        // No need to redeclare methods here since they're in the interface
    }
    export class HeadlessCircuit {
        constructor(data: JsonCircuit, options?: CircuitOptions);
        // Add method and property signatures here
        toJSON(): string;
        updateGatesNext(opts?): string;
        getLabelIndex(): Path;
        makeLabelIndex(): Path;
        addDisplay(display: Display3vl);
        shutdown(): void;
        hasWarnings(): boolean;
        // not sure what this returns sync engine
        updateGatesNext(opts: any): Promise<number>;
        updateGates(opts: any): Promise<number>;
        synchronize(): Promise<void>;
        get hasPendingEvents(): any[];
        get tick(): number;
        startFast(): void;
        start(): void;
        stop(): Promise<any>;
        // I dont this this is implemented in sync engine
        startFast(): any;
        // probably number but could be range?
        get interval(): any;
        set interval(ms: number);
        getInputCells(): any[];
        getOutputCells(): any[];
        // not 100% sure what sig is
        setInput(name: string, sig: any): void;

        // return type is this.graph.getCell(name).getOutput(sig)
        getOutput(name: string): any;

        // return this.getLabelIndex(path).wires[name];
        findWireByLabel(name: string, path?: Path): any;

        // return this.getLabelIndex(path).devices[name];
        findDeviceByLabel(name: string, path?: Path): any;

        // return this.getLabelIndex([]).inputs[name];
        findInputByNet(name: string): any;

        // return this.getLabelIndex([]).outputs[name];
        findOutputByNet(name: string): any;

        // Event related functions, callbacks, listeners, monitor

        waitForWire(wire, trigger: any): Promise<any>; // trigger: Vector3vl
        waitFor(cell: any, port: any, trigger: any): Promise<any>;
        monitorWire(wire: any, callback: Function, options?: any)

        // likely a promise is returned here
        monitor(cell: any, port: any, callback: Function, options?: any): any;

        unmonitor(monitorId: any): void;
        observeGraph(path?: Path): void;
        unobserveGraph(path?: Path): void;
        alarm(tick: number, callback: Function, options?: any);
        unalarm(alarmId: any); // probably string or int


    }
}

declare module "svelte-drag-and-drop-actions" {
    export function asDraggable(node: HTMLElement, options?: any): {
        destroy(): void;
        update(options?: any): void;
    };
}