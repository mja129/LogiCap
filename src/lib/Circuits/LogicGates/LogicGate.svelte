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
    }: {
        width?: number
        height?: number
        gateType?: logicGateTypes
        nodeId: string
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
<SimulationNodeAnchor
    location={['right', 'mid']}
    id={nodeId}
    io="output"
    offset={logicGateAnchorOffsets['out']}
    connections={get(CircuitStore).connectors[
        ('out_' + nodeId) as outputAnchorName
    ]}
/>
