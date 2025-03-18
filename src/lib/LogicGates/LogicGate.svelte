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
        nodeStartPos,
        gateType = 'And',
        nodeId,
    }: {
        width: number
        height: number
        nodeStartPos: number
        gateType?: logicGateTypes
        nodeId: string
    } = $props()

    const circuitSvg = circuitSvgs[gateType as dualInputLogicTypes]

    // Define a new device
</script>

<Node drop={'cursor'} id={nodeId}>
    <img src={circuitSvg} alt={`${gateType} logic gate`} {width} {height} />
    <SimulationNodeAnchor
        location={['left', 'bot']}
        id={nodeId}
        io="input"
        offset={[-7.5, 68.5]}
    />
    <SimulationNodeAnchor
        location={['left', 'top']}
        id={nodeId}
        io="input"
        offset={[-7.5, 7.5]}
    />
    <SimulationNodeAnchor
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        offset={[100, 37.58]}
    />
</Node>
