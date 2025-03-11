<script lang="ts">
    import { Node, Anchor, generateOutput } from 'svelvet'
    // export let width: number = 80
    // export let height: number = 50
    import LogicGateAnchor from './LogicGateAnchor.svelte'
    import image from '../assets/svg/andgate.svg'

    let {
        width = 80,
        height = 50,
        nodeStartPos,
        nodeId,
        isFirstNode,
    }: {
        width: number
        height: number
        nodeStartPos: number
        nodeId: string
        isFirstNode: boolean
    } = $props()

    // Define a new device
</script>

<Node drop={isFirstNode ? 'center' : 'cursor'} id={nodeId}>
    <img src={image} alt="AND Gate" {width} {height} />
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
