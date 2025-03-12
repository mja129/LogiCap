<script lang="ts">
    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import { circuitStore } from './circuitStore'
    import sampleCircuit from '../assets/CircuitJsonSampleData/testcircuit.json'

    //Sort of hacky way to just remake a circuit each time it updates
    //For now doesnt work when attempting to simulate anything because json is messed up
    /*
let circuitData;
let circuit;

$: circuitData = $circuitStore; 

$: if (circuitData) {
    circuit = new HeadlessCircuit(circuitData);
    console.log("Created Headless Circut:", circuit);
}
*/

    let currentCircuit = new HeadlessCircuit(sampleCircuit) //Test clock->not->output
    let running = false
    let intervalId: any = null
    let previousJSON = ''

    //For key listener
    function updateRunning() {
        running = !running
        console.log(`Simulation running: ${running}`)
        if (running) {
            runFunction()
        } else {
            clearInterval(intervalId)
        }
    }

    //Logs the bit values of the input and output signals
    function logValues() {
        let cells = currentCircuit.getLabelIndex()
        let devices = cells.devices
        let bitValues: Record<string, any> = {}
        Object.entries(devices).forEach(
            (
                device // Loop through the array
            ) => {
                let dev = device[1] as any
                //console.log(device);
                if (dev.attributes?.inputSignals?.in) {
                    // Ensure "in" exists
                    let _avec = dev.attributes.inputSignals.in._avec?.['0'] // Current value
                    let _bvec = dev.attributes.inputSignals.in._bvec?.['0'] // Buffered value?
                    bitValues[dev.attributes.label + ' Input Sig'] = {
                        _avec,
                        _bvec,
                    }
                }
                if (dev.attributes?.outputSignals?.out) {
                    // Ensure "out" exists
                    let _avec = dev.attributes.outputSignals.out._avec?.['0'] // Current value
                    let _bvec = dev.attributes.outputSignals.out._bvec?.['0'] // Buffered value?
                    bitValues[dev.attributes.label + ' Output Sig'] = {
                        _avec,
                        _bvec,
                    }
                }
            }
        )
        return JSON.stringify(bitValues, null, 2)
    }

    //Possibly better way to do this, as this basically is what .start() does
    //But i want to be able to log values as it runs
    function runFunction() {
        ;(intervalId = setInterval(() => {
            if (!running) {
                return
            }
            currentCircuit.updateGates() //This moves the simulation by 1 tick
            let currentJSON = logValues()
            if (currentJSON != previousJSON) {
                //Only log changes
                console.log(`Tick: ${currentCircuit.tick}`)
                console.log(currentJSON)
            }
            previousJSON = currentJSON
        })),
            10
    }
    //Just a keylistener for R
    window.addEventListener('keydown', (event) => {
        if (event.key === 'r') {
            updateRunning()
        }
    })
</script>
