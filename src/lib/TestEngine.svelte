<script lang="ts">
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import { circuitStore } from './circuitStore.js'
    //import sampleCircuit from '../assets/CircuitJsonSampleData/testcircuit.json'
    import { Vector3vl } from '3vl'

    let oneBit: Vector3vl
    let zeroBit: Vector3vl

    //Two Vectors, both 1 bit, one is on (1) and off (0)
    oneBit = Vector3vl.ones(1)
    zeroBit = Vector3vl.zeros(1)

    Object.defineProperty(HeadlessCircuit.prototype, 'running', {
        get() {
            //console.warn("Overriding `running` getter at runtime.");
            //This was here to prevent some weird error of it failing to access running
            //Its safe as HeadlessCircuit always returns false anyways but this may not be needed anymore?
            return false
        },
    })

    //Possibly still hacky but it works, and now the json is fixed thanks Sean
    // ❤️

    let circuitData
    let circuit: HeadlessCircuit

    $: circuitData = $circuitStore

    $: if (circuitData) {
        circuit = new HeadlessCircuit(circuitData)
    }

    //Old test circuit let currentCircuit = new HeadlessCircuit(sampleCircuit); //Test clock->not->output
    let running = false

    //For key listener
    function updateRunning() {
        running = !running
        console.log(`Simulation running: ${running}`)
        if (running) {
            startSim()
        }
    }

    /*
    Basically how other non headless circuits run like in engines.mjs
*/
    function startSim() {
        if (running) {
            circuit.updateGates()
            setTimeout(startSim, 10)
        }
    }

    /*
    callback function for the monitorWire
    Prints the current  of avec and bvec compared, according to how 3v1 decides 1 and 1 is 1, 0 and 0 is 0, 1 and 0 is invalid 'x', tick, and wirename
*/
    export function wireMonitoring(wire: any, tick: number) {
        let logicValue: string
        //console.log(wire)
        if (wire[1].attributes.signal) {
            if (
                wire[1].attributes.signal._avec[0] ==
                wire[1].attributes.signal._bvec[0]
            ) {
                logicValue = wire[1].attributes.signal._avec[0]
            } else {
                logicValue = 'x'
            }
            console.log(
                `${wire[0]} has changed signal to ${logicValue} at tick ${tick}`
            )
            return logicValue
        }
    }

    //Possibly better way to do this, as this basically is what .start() does
    //But i want to be able to log values as it runs
    //Just a keylistener for R
    window.addEventListener('keydown', (event) => {
        /*
        Runs simulation at 10ms per tick
    */
        if (event.key === 'r') {
            updateRunning()
        }
        /*
        Moves one tick forward in the simulation
    */
        if (event.key === 'ArrowRight') {
            circuit.updateGates()
        }
        /*
        Moves one event forward (next signal change) in the simulation
    */
        if (event.key === 'ArrowUp') {
            circuit.updateGatesNext()
        }

        /*
        This is just until we actually have a good listener system setup
        Currently just creates a circuit based on the data from circuitStore and adds wire listeners for it
        Calling this more than once will create more listeners, so once we actually make this some system
        will need to be in place to unmonitor all the wires first, probably unmonitor from DigitalJS
    */
        if (event.key === 'ArrowLeft') {
            circuit = new HeadlessCircuit(circuitData)
            console.log(circuit.getLabelIndex())
            let wires = circuit.getLabelIndex().wires

            Object.entries(wires).forEach((wire) => {
                circuit.monitorWire(
                    circuit.findWireByLabel(wire[0]),
                    (tick: number) => wireMonitoring(wire, tick)
                )
            })
        }
        /*
        Temporary way to choose an input to change its state.
    */
        if (event.key == 'ArrowDown') {
            inputSetter()
        }
    })

    /*
    Brings up a prompt where you can paste the label of an input like a button
    It will then flip this input
*/
    function inputSetter() {
        let userInput: string | null
        userInput = prompt('Enter a value:')
        if (userInput == null) {
            userInput = ''
        }
        //console.log("oneBit size:", oneBit.bits);
        let currentSig: number
        currentSig =
            circuit.getLabelIndex().devices[userInput].attributes.outputSignals
                .out._avec[0]
        if (currentSig == 1) {
            circuit.setInput(userInput, zeroBit)
        } else {
            circuit.setInput(userInput, oneBit)
        }
    }
</script>
