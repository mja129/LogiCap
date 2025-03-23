<script lang="ts">
    import { lastConnected } from '../circuitEngine.svelte'
    import { circuitStore } from '../circuitStore'
    import { connectingEdge } from '../circuitStore'

    let {
        linked,
        hovering,
        connecting,
        portName,
        nodeId,
        anchorId,
        io = 'input',
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        portName: string
        nodeId: string
        anchorId: string
        io?: string
    } = $props()
</script>
