<script lang="ts">
    import { Node } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'
    import andGate from '../../assets/svg/andgate.svg'
    import nandGate from '../../assets/svg/nandgate.svg'
    import orGate from '../../assets/svg/orgate.svg'
    import norGate from '../../assets/svg/norgate.svg'
    import xorGate from '../../assets/svg/xorgate.svg'
    import xnorGate from '../../assets/svg/xnorgate.svg'
    import type { dualInputLogicTypes, logicGateTypes } from '../circuitModel'

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
        canvasClicked = false,
        position = undefined,
        nodeId,
    }: {
        width: number
        height: number
        gateType?: logicGateTypes
        canvasClicked: boolean
        nodeId: string
        position?: { x: number; y: number } | undefined
    } = $props()

    const circuitSvg = circuitSvgs[gateType as dualInputLogicTypes]
</script>

<!-- Position property only works if cursor is set to false. -->
<Node drop={position !== undefined ? false : 'cursor'} id={nodeId} {position}>
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
    />
</Node>
