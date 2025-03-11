<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { Svelvet, Minimap } from 'svelvet'
    import type { Component } from 'svelte'

    import AndGate from './lib/AndGate.svelte'

    import { circuitStore } from './lib/stores/circuitStore'
    import SideMenu from './lib/SideMenu/SideMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    import { HeadlessCircuit, engines as Engines } from 'custom_digitaljs'
    import sampleCircuit from './assets/CircuitJsonSampleData/testcircuit.json'
    import { on } from 'svelte/events'
    import TestEngine from './lib/TestEngine.svelte'
    import ButtonNodeSignal from './lib/ButtonNodeSignal.svelte'

    let element: HTMLElement | null = null

    // localStorage.clear()
    // import type { CSSColorString } from 'svelvet'
    // import { readable, type Readable } from 'svelte/store'
    // const blackColor: Readable<CSSColorString> = Readable<CSSColorString>("red");

    // in order to implement dragging circuits from the side menu into the main window
    // we need app.svelte to maintain an array or a global store of the elements currently on the canvas
    // this store already exists I guess
    // the list should then be iterated over in an {each} block.
    // <svelte:component this={component}> or we could make a generic component that took params to become a specific type of circuit
    // This pattern is known as a "Factory Pattern" where a component is dynamically instantiated based on parameters or conditions
    // you would probably need a "key'd" each block for one of these options, not sure which tbh

    // Lets just start with on menu click.

    // $inspect(lastLinked_0).with(console.log)
    // $inspect(lastLinked_1).with(console.log)

    // menu design, requirements
    // on dragEnd, if we are dropping onto the canvas
    // add a svelte:component to a list of components

    // current error is coming from here /Users/shmul/LogSim-Project/custom_digitaljs/node_modules/3vl/dist/index.d.ts

    // custom_digitaljs/src/engines/synch.mjs
    // let engine = new Engines.SynchEngine([], { cells: '' })
    let currentCircuit = new HeadlessCircuit(sampleCircuit)
    let newDevice: Device
    // console.log(currentCircuit.start())
    // this happens on every connection
    // ON change of global JSON circuit DATA, Run this.
    function generateNonce(length: number = 16): string {
        const charset =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return Array.from(
            values,
            (byte) => charset[byte % charset.length]
        ).join('')
    }
    const newGateCircuitStore = () => {
        const nodeId = `And_${generateNonce()}`
        circuitStore.update((currentCircuit) => {
            // Add the new device with a unique ID, e.g., 'newDeviceId'
            newDevice = {
                type: 'And',
                label: nodeId,
            }
            currentCircuit.devices[nodeId] = newDevice
            // Add the new connector
            // currentCircuit.connectors.push(newConnector)
            console.log(currentCircuit)

            // Return the updated circuit
            return currentCircuit
        })
        return nodeId
    }
    circuitStore.subscribe((value: Circuit) => {
        // console.log(value.connectors)
        // for some reason updateGatesNext() throws an error but, updateGates() works
        // console.log(currentCircuit.updateGates())
        console.log(currentCircuit.getLabelIndex())
    })

    const nodeList: { name: string }[] = $state([])

    function createGateOnCanvas(e: any) {
        const newNodeId = newGateCircuitStore()
        const gateType = e.gateType

        nodeList.push({ name: newNodeId })
        // add the node from the global store.
    }
</script>

<!-- <div id="app_bar"> -->
<!--     <div class="app_bar_items"> -->
<!--         <img src={AppLogo} alt="app logo" /> -->
<!--     </div> -->
<!--     <img -->
<!--         class="sketch_bar" -->
<!--         src={SketchyLine} -->
<!--         alt="sketched line bottom border for main app bar" -->
<!--     /> -->
<!-- </div> -->

<main>
    <SideMenu createCanvasNode={createGateOnCanvas} />
    <!-- svelte-ignore svelte_component_deprecated -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <Svelvet theme="LogiCap" disableSelection={false} controls>
        <Minimap width={100} corner="NE" slot="minimap" />
        {#each nodeList as svelvetNode}
            <!-- isFirstNode={nodeList.length === 1} -->
            <!-- svelte-ignore svelte_component_deprecated -->
            <svelte:component
                this={ButtonNodeSignal}
                width={80}
                nodeId={svelvetNode.name}
                height={50}
                nodeStartPos={200}
            />
            <!-- content here -->
        {/each}
        <!-- <AndGate nodeStartPos={20} width={80} height={50} />
        <AndGate nodeStartPos={200} width={80} height={50} />
        <AndGate nodeStartPos={200} width={80} height={50} /> -->
    </Svelvet>
    <TestEngine></TestEngine>
</main>

<style>
    :root {
        --app-bar-height: 50px;
        --main-app-flex-height: calc(100vh - var(--app-bar-height));
    }
    main {
        display: flex;
        flex-direction: row;
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        padding-inline: calc(1.5vw);
        justify-content: center;
        align-items: center;
        /* max-height: 100vh; */
    }

    :global(.svelvet-node) {
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: auto !important;
        height: auto !important;
    }
    /* :global(.svelvet-wrapper) {
        border-radius: 20px;
        outline: 10px solid black;
    }
    :global(.svelvet-wrapper:focus-visible) {
        border-radius: 20px !important;
        outline: 10px solid black !important;
    }
    :global(.svelvet-wrapper:focus) {
        border-radius: 20px !important;
        outline: 10px solid black !important;
    } */
    /* Take up the rest of the space in the flex container*/
    /* :global(.svelvet-wrapper) {
        max-height: calc(100% - 3.5vh);
        flex: 1;
    } */
</style>
