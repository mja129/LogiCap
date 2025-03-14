<script lang="ts">
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import { circuitStore } from './circuitStore.ts'
    //import sampleCircuit from '../assets/CircuitJsonSampleData/testcircuit.json'
    import { Vector3vl } from "3vl"

    let oneBit: Vector3vl;
    let zeroBit: Vector3vl

    oneBit = Vector3vl.make(1, 1);
    zeroBit = Vector3vl.make(1, 0);

    Object.defineProperty(HeadlessCircuit.prototype, "running", {
    get() {
        //console.warn("Overriding `running` getter at runtime.");
        return false;
    }
});
    
    //Sort of hacky way to just remake a circuit each time it updates
    //For now doesnt work when attempting to simulate anything because json is messed up

    let circuitData;
    let circuit: HeadlessCircuit;
    
    $: circuitData = $circuitStore; 
    


    $: if (circuitData) {
        circuit = new HeadlessCircuit(circuitData);
    }


    
    //let currentCircuit = new HeadlessCircuit(sampleCircuit); //Test clock->not->output
    let running = false;
    
    //For key listener
    function updateRunning()
    {
        running = !running;
        console.log(`Simulation running: ${running}`);
        if(running)
        {
           startSim();
        }
    }
    
    //Logs the bit values of the input and output signals
    /*
    function logValues()
    {
        let cells = currentCircuit.getLabelIndex()
        let devices = cells.devices;
        let bitValues: Record<string, any> = {};
        Object.entries(devices).forEach(device => // Loop through the array
        {  
            let dev = device[1] as any;
            //console.log(device);
            if (dev.attributes?.inputSignals?.in) // Ensure "in" exists
            {  
                let _avec = dev.attributes.inputSignals.in._avec?.["0"];  // Current value
                let _bvec = dev.attributes.inputSignals.in._bvec?.["0"];  // Buffered value?
                bitValues[dev.attributes.label + " Input Sig"] = { _avec, _bvec };
            }
            if (dev.attributes?.outputSignals?.out) // Ensure "out" exists
            {  
                let _avec = dev.attributes.outputSignals.out._avec?.["0"];  // Current value
                let _bvec = dev.attributes.outputSignals.out._bvec?.["0"];  // Buffered value?
                bitValues[dev.attributes.label + " Output Sig"] = { _avec, _bvec };
            }
        });
        return JSON.stringify(bitValues, null, 2);
    
    }
    */
    
    function startSim()
    {
        if (running) {
            circuit.updateGates();
            setTimeout(startSim, 10);
        }
    }
    
    function wireMonitoring(wire: any, tick:number)
    {
        let logicValue: number;
        //console.log(wire)
        if(wire[1].attributes.signal)
        {
            logicValue = wire[1].attributes.signal._avec[0] & wire[1].attributes.signal._bvec[0];
            console.log(`${wire[0]} has changed signal to ${logicValue} at tick ${tick}`);
        }
    }
    
    //Possibly better way to do this, as this basically is what .start() does
    //But i want to be able to log values as it runs
    //Just a keylistener for R
    window.addEventListener("keydown", (event) => {
        if (event.key === "r") {
            updateRunning();
        }
        if (event.key === "ArrowRight")
        {
            circuit.updateGates();
        }
        if (event.key === "ArrowUp")
        {
            circuit.updateGatesNext();
        }
        //Temp testing stuff disabled

        if (event.key === "ArrowLeft")
        {
            circuit = new HeadlessCircuit(circuitData);
            console.log(circuit.getLabelIndex());
            let wires = circuit.getLabelIndex().wires
    
            Object.entries(wires).forEach(wire => {
                circuit.monitorWire(circuit.findWireByLabel(wire[0]), (tick: number) => wireMonitoring(wire, tick));
             });
        }
        if (event.key == "ArrowDown")
        {
            inputSetter();
        }

    });


    function inputSetter()
    {
        let userInput: string | null;
        userInput = prompt("Enter a value:");
        if(userInput == null)
        {
            userInput = "";
        }
        //console.log("oneBit size:", oneBit.bits);
        circuit.setInput(userInput, oneBit);
    }
    /* 
    let wires = currentCircuit.getLabelIndex().wires
    
    Object.entries(wires).forEach(wire => {
        currentCircuit.monitorWire(currentCircuit.findWireByLabel(wire[0]), (tick: number) => wireMonitoring(wire, tick));
    });
    */
    
    </script>