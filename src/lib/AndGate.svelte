<script lang="ts">
    import image from './svg/andgate.svg'
    import { Node, Anchor, generateOutput } from 'svelvet'
    export let width: number = 80
    export let height: number = 50
    import CustomAnchor from './CustomAnchor.svelte'
    import { circuitStore } from './stores/circuitStore'
    import type { Device } from './stores/circuitStore'

    // Define a new device

    // If a node is deleted, the number will continue to increment
    // the purpose of this is just so all of them have a semi-recognizable unique ID
    // So this code will be important but not in this current format I think
    // Probably should sync with a svelte global store as well.
    const lastID_num: string | null = localStorage.getItem('and_node_num')
    let nextNum: number = 1
    if (lastID_num === null) {
        localStorage.setItem('and_node_num', '1')
    } else {
        nextNum = parseInt(lastID_num, 10) + 1
        nextNum++
        localStorage.setItem('and_node_num', nextNum.toString())
    }
    const nodeId = `And_${nextNum}`
    localStorage.setItem(`And_Gate_Node_${nextNum}`, nextNum.toString())
    // console.log(storedValue)
    // const store = readable(storedValue ? JSON.parse(storedValue) : initialValue)
    const newDevice: Device = {
        type: 'And',
        label: nodeId,
    }

    // Define a connector that connects the output of an existing device to this new device
    // define connector on node connection
    // const newConnector: Connector = {
    //     from: {
    //         id: 'someExistingDeviceId',
    //         port: 'output',
    //     },
    //     to: {
    //         id: 'newDeviceId', // The ID we're assigning to our new device
    //         port: 'input1',
    //     },
    // }

    // Update the store
    circuitStore.update((currentCircuit) => {
        // Add the new device with a unique ID, e.g., 'newDeviceId'
        currentCircuit.devices[nodeId] = newDevice

        // Add the new connector
        // currentCircuit.connectors.push(newConnector)

        // Return the updated circuit
        return currentCircuit
    })
</script>

<Node let:selected id={nodeId} drop="cursor">
    <img src={image} alt="AND Gate" {width} {height} />
    <CustomAnchor location={['left', 'bot']} id={nodeId} io="input" />
    <CustomAnchor location={['left', 'top']} id={nodeId} io="input" />
    <CustomAnchor location={['right', 'mid']} id={nodeId} io="output" />
</Node>

<style>
    /* .input-1 { */
    /*     position: absolute; */
    /*     top: 14.5%; */
    /*     left: 7.5%; */
    /* } */
    /* .input-2 { */
    /*     position: absolute; */
    /*     top: 51.5%; */
    /*     left: 7.5%; */
    /* } */
    /* .output-1 { */
    /*     position: absolute; */
    /*     top: 35%; */
    /*     right: 10%; */
    /* } */
</style>
