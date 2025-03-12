<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { Svelvet, Minimap } from 'svelvet'
    import type { Component } from 'svelte'

    import { circuitStore } from './lib/circuitStore'
    import SideMenu from './lib/SideMenu/SideMenu.svelte'
    // engines as just to call it with uppercase 'Engines'

    import TestEngine from './lib/TestEngine.svelte'
    import SimNode from './lib/SimNode.svelte'
    import type { dualInputLogicTypes, logicGateTypes } from './lib/nodeModal'
    import { deviceFactoryMap } from './lib/makeDigitalJsJson'

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
    // create new node in the global store for circuitStore digital js backend.
    const newGateCircuitStore = (gateType: string) => {
        const nodeName: string = `${gateType}_${generateNonce()}`
        circuitStore.update((currentCircuit) => {
            // Add the new device with a unique ID, e.g., 'newDeviceId'
            // get function from map
            const newDevice: Device = deviceFactoryMap[gateType](nodeName)
            currentCircuit.devices[nodeName] = newDevice
            // Add the new connector
            // currentCircuit.connectors.push(newConnector)

            // Return the updated circuit
            return currentCircuit
        })
        return nodeName
    }

    const nodeList: { name: string; gateType: logicGateTypes }[] = $state([])

    // called on "drop"
    function createGateOnCanvas(e: any) {
        const gateType: logicGateTypes = e.gateType as logicGateTypes
        const newNodeId = newGateCircuitStore(gateType)

        // create the node on the canvas
        // make sure to delete when node is deleted.
        nodeList.push({ name: newNodeId, gateType: gateType })
        // add the node from the global store.
    }

    let currCircuit: any = $state(null)
    circuitStore.subscribe((currentCircuit) => {
        console.log(currentCircuit)
        currCircuit = currentCircuit
    })
</script>

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
            <SimNode
                gateType={svelvetNode.gateType}
                nodeProps={{
                    gateType: svelvetNode.gateType as dualInputLogicTypes,
                    width: 80,
                    height: 50,
                    nodeId: svelvetNode.name,
                    nodeStartPos: 200,
                    // Add any other specific props your node components need
                }}
            />
            <!-- content here -->
        {/each}
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
        padding-left: calc(1.5vw);
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
    :global(
        .svelvet-wrapper,
        .svelvet-wrapper:focus-visible,
        .svelvet-wrapper:active,
        .svelvet-wrapper:focus
    ) {
        /* border-radius: 20px; */
        outline: none !important;
        border: none !important;
        box-shadow: unset !important;
    }
    :global(.svelvet-wrapper) {
        /* max-height: calc(100% - 3.5vh); */
        flex: 1;
    }
</style>
