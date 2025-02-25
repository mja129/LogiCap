<script lang="ts">
    import {
        handleLinkAnchorConnection,
        handleUnlinkAnchorConnection,
    } from './stores/circuitStore'
    import type {
        ConnectorFrom,
        ConnectorTo,
        ConnectorPiece,
        Connector,
    } from './stores/circuitStore'

    let {
        linked = $bindable(),
        hovering,
        connecting,
        portName,
        nodeId,
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        portName: string
        nodeId: string
    } = $props()

    let io = portName.startsWith('input') ? 'input' : 'output'

    function createConnectionJson(
        nodeId: string,
        port: string
    ): ConnectorPiece {
        const connection = {
            id: nodeId,
            port: port,
        }

        if (port.startsWith('input')) {
            return { to: connection } as ConnectorTo
        } else {
            return { from: connection } as ConnectorFrom
        }
    }
    // ASSUMPTION: Input can only ever have 1 thing connected to it, but an output can be outputting to multiple inputs
    // I will NOT make this assumption in the handling of unlinking below; but this change is maybe needed.
    $effect(() => {
        if (linked && (io === 'input' || io === 'output')) {
            const triggeredAnchor = createConnectionJson(nodeId, portName)
            handleLinkAnchorConnection(triggeredAnchor)
        } else if (!linked) {
            const triggeredAnchor = createConnectionJson(nodeId, portName)
            handleUnlinkAnchorConnection(triggeredAnchor)
        }
    })
    // TODO, may need to listen to onUnmount
    // I think on disconnect has a default event from svelvet, try that out also this effect may set state to false many times, but honestly nah.
</script>

<div
    class="custom_anchor {io === 'input' ? 'input' : 'output'}"
    class:linked
    class:hovering
    class:connecting
></div>

<style>
    .custom_anchor {
        border-radius: 50%;
        height: 10px;
        width: 10px;
    }
    .linked {
        background-color: purple !important;
        border: 1px solid black;
    }
    .hovering {
        border: 2px solid black;
    }

    .input {
        background-color: red;
    }
    .output {
        background-color: green;
    }
</style>
