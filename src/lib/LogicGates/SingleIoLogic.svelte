<script lang="ts">
    import { Node } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import LogicGateAnchor from '../SvelvetUtils/LogicGateAnchor.svelte'

    // these are different
    import notGate from '../../assets/svg/notgate.svg'
    import repeaterGate from '../../assets/svg/repeater.svg'
    import type { logicGateTypes, singleIoLogicTypes } from '../nodeModal'

    const circuitSvgs: Record<singleIoLogicTypes, string> = {
        Not: notGate,
        Repeater: repeaterGate,
    }

    let {
        width = 80,
        height = 50,
        nodeStartPos,
        gateType = 'Not',
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
        src={circuitSvgs[gateType as singleIoLogicTypes]}
        alt={`${gateType} logic gate`}
        {width}
        {height}
    />
    <LogicGateAnchor
        location={['left', 'mid']}
        id={nodeId}
        io="input"
        offset={[0, 40]}
    />
    <LogicGateAnchor
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        offset={[78, 40]}
    />
</Node>
