<script lang="ts">
    import { get } from 'svelte/store'

    import { CircuitStore } from '@CircuitStore'
    import type { dualInputLogicTypes, logicGateTypes } from '@CircuitModel'

    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import andGate from '@assets/svg/andgate.svg'
    import nandGate from '@assets/svg/nandgate.svg'
    import orGate from '@assets/svg/orgate.svg'
    import norGate from '@assets/svg/norgate.svg'
    import xorGate from '@assets/svg/xorgate.svg'
    import xnorGate from '@assets/svg/xnorgate.svg'
    // import { transform } from 'custom_digitaljs'

    type LogicGateAnchors = 'in1' | 'in2' | 'out'
    const logicGateAnchorOffsets: Record<LogicGateAnchors, [number, number]> = {
        in1: [-7.5, 68.5],
        in2: [-7.5, 7.5],
        out: [100, 37.58],
    }

    const circuitSvgs: Record<dualInputLogicTypes, string> = {
        And: andGate,
        Nand: nandGate,
        Or: orGate,
        Nor: norGate,
        Xor: xorGate,
        Xnor: xnorGate,
    }

    let {
        width = 80,
        height = 50,
        gateType = 'And',
        nodeId,
        rotation = $bindable(),
    }: {
        width?: number
        height?: number
        gateType?: logicGateTypes
        nodeId: string
        rotation?: number
    } = $props()

    const circuitSvg = circuitSvgs[gateType as dualInputLogicTypes]

    // $inspect($savedConnections).with(console.log)
</script>

<!-- Position property only works if cursor is set to false. -->
<img src={circuitSvg} alt={`${gateType} logic gate`} {width} {height} />

<SimulationNodeAnchor
    location={['left', 'bot']}
    id={nodeId}
    io="input"
    offset={logicGateAnchorOffsets['in2']}
/>
<SimulationNodeAnchor
    location={['left', 'top']}
    id={nodeId}
    io="input"
    offset={logicGateAnchorOffsets['in1']}
/>
<!-- This code solves a problem that there were two ways to solve, 
Rotating the node via the svelvet rotation property on a node, only works dynamically if you rerender
the entire node, this sucessfully reloads the wires too, but because of the way position: works, the node 
ends up snapping back after we rerender it like that. 

the position data is only used for reloading saved nodes
So when you refresh the page, 
Or load from a file
Or go to a new tab

the only problem with rerendering the entire node is that position is defined when triggering the rotation
and rerendering the entire node

We could just unset position on node rotation.
-->
{#key rotation}
    <SimulationNodeAnchor
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        offset={logicGateAnchorOffsets['out']}
        connections={get(CircuitStore).connectors[
            ('out_' + nodeId) as outputAnchorName
        ]}
    />
{/key}

<style>
    /* div { */
    /*     transform: rotate(10deg); */
    /* } */
</style>
