<script lang="ts">
    import { circuitStore, handleAnchorConnection } from './stores/circuitStore'
    import type {
        ConnectionFrom,
        ConnectionTo,
        ConnectorPiece,
        Connector,
    } from './stores/circuitStore'

    let {
        linked,
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

    // dispatch a message.
    // use the function we passed in to update the value from the parent
    // kinda a scope reacharound type thing, I wish it could be different.
    // to figure out how to make it different one must have a very good understanding of the let: directive present in the default anchor component, and possibly some binding rune.

    function createToJson(nodeId: string, port: string) {
        const connectorJson: ConnectionTo = {
            to: {
                id: nodeId,
                port: port,
            },
        }
        return connectorJson
    }

    function createConnectionJson(
        nodeId: string,
        port: string
    ): ConnectorPiece {
        const connection = {
            id: nodeId,
            port: port,
        }

        if (port.startsWith('input')) {
            return { to: connection } as ConnectionTo
        } else {
            return { from: connection } as ConnectionFrom
        }
    }
    $effect(() => {
        if (linked && (io == 'input' || io == 'output')) {
            const newConnection = createConnectionJson(nodeId, portName)
            const isSecond: false | Connector =
                handleAnchorConnection(newConnection)
            if (isSecond !== false) {
                circuitStore.update((currCir) => {
                    currCir.connectors.push(isSecond)
                    return currCir
                })
            }
        } else if (!linked) {
            // const newConnection = createConnectionJson(nodeId, portName)
            // // const isSecond: false | Connector =
            // //     handleAnchorConnection(newConnection)
            // // if (isSecond !== false) {
            // //     circuitStore.update((currCir) => {
            // //         currCir.connectors.push(isSecond)
            // //         return currCir
            // //     })
            // // }
        }
        // $inspect(linked).with(console.log)
    })
    circuitStore.subscribe((value) => {
        console.log(JSON.stringify(value.connectors))
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
