<script lang="ts">
    import { Node } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import LogicGateAnchor from './LogicGateAnchor.svelte'
    import andGate from '../assets/svg/andgate.svg'
    import nandGate from '../assets/svg/nandgate.svg'
    import orGate from '../assets/svg/orgate.svg'
    import norGate from '../assets/svg/norgate.svg'
    import xorGate from '../assets/svg/xorgate.svg'
    import xnorGate from '../assets/svg/xnorgate.svg'

    // these are different
    import notGate from '../assets/svg/notgate.svg'
    import repeaterGate from '../assets/svg/repeater.svg'

    const circuitSvgs: Record<logicGateTypes, string> = {
        and: andGate,
        nand: nandGate,
        or: orGate,
        nor: norGate,
        xor: xorGate,
        xnor: xnorGate,
        not: notGate,
        repeater: repeaterGate,
    }

    let {
        width = 80,
        height = 50,
        nodeStartPos,
        gateType = 'and',
        nodeId,
    }: {
        width: number
        height: number
        nodeStartPos: number
        gateType?: logicGateTypes
        nodeId: string
    } = $props()

    // Define a new device
</script>

<Node drop={'cursor'} id={nodeId}>
    <img
        src={circuitSvgs[gateType]}
        alt={`${gateType} logic gate`}
        {width}
        {height}
    />
    <LogicGateAnchor
        location={['left', 'bot']}
        id={nodeId}
        io="input"
        offset={[7.5, 58]}
    />
    <LogicGateAnchor
        location={['left', 'top']}
        id={nodeId}
        io="input"
        offset={[7.5, 21.5]}
    />
    <LogicGateAnchor
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        offset={[78, 40]}
    />
</Node>
