<script lang="ts">
    import { Node } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import SimulationNodeAnchor from '../CustomAnchors/SimulationNodeAnchor.svelte'

    // these are different
    import notGate from '../../assets/svg/notgate.svg'
    import repeaterGate from '../../assets/svg/repeater.svg'
    import type { logicGateTypes, singleIoLogicTypes } from '../circuitModel'

    type SingleLogicGateAnchors = 'in' | 'out'
    const singleIoGateAnchorOffests: Record<
        SingleLogicGateAnchors,
        [number, number]
    > = {
        in: [-15, 38.7],
        out: [100, 38],
    }

    const circuitSvgs: Record<singleIoLogicTypes, string> = {
        Not: notGate,
        Repeater: repeaterGate,
    }

    let {
        width = 80,
        height = 50,
        gateType = 'Not',
        position = undefined,
        connections = [],
        nodeId,
    }: {
        width: number
        height: number
        gateType?: logicGateTypes
        position?: { x: number; y: number } | undefined
        connections: any
        nodeId: string
    } = $props()

    // Define a new device
</script>

<Node
    drop={position !== undefined ? false : 'cursor'}
    {connections}
    {position}
    id={nodeId}
>
    <img
        src={circuitSvgs[gateType as singleIoLogicTypes]}
        alt={`${gateType} logic gate`}
        {width}
        {height}
    />
    <SimulationNodeAnchor
        location={['left', 'mid']}
        id={nodeId}
        io="input"
        offset={singleIoGateAnchorOffests['in']}
    />
    <SimulationNodeAnchor
        location={['right', 'mid']}
        id={nodeId}
        io="output"
        offset={singleIoGateAnchorOffests['out']}
    />
</Node>
