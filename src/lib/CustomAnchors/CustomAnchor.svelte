<script lang="ts">
    import {
        handleLinkAnchorConnection,
        handleUnlinkAnchorConnection,
        toggleMouseClickHack,
    } from '../circuitStore'

    let {
        linked,
        hovering,
        connecting,
        portName,
        nodeId,
        io = 'input',
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        portName: string
        nodeId: string
        io?: string
    } = $props()

    console.log(portName)

    function createConnectionJson(
        nodeId: string,
        port: string
    ): ConnectorPiece {
        const connection = {
            id: nodeId,
            port: port,
        }

        // IMPORTANT part of the code for creating the connection.
        if (port.startsWith('in')) {
            return { to: connection } as ConnectorTo
        } else {
            return { from: connection } as ConnectorFrom
        }
    }

    // ASSUMPTION: Input can only ever have 1 thing connected to it, but an output can be outputting to multiple inputs
    // I will NOT make this assumption in the handling of unlinking below; but this change is maybe needed.
    // using derived here would be great if that worked. $derived.by()
    function link(nodeId: string, portName: string) {
        const triggeredAnchor = createConnectionJson(nodeId, portName)
        return handleLinkAnchorConnection(triggeredAnchor)
    }
    function unlink(nodeId: string, portName: string) {
        const triggeredAnchor = createConnectionJson(nodeId, portName)
        return handleUnlinkAnchorConnection(triggeredAnchor)
    }
    $effect(() => {
        // if (connecting && io === 'input') {
        //     // create event listener
        //     const handleMouseUp = (e: any) => {
        //         const droppedOnCanvas =
        //             e?.target.classList.contains('svelvet-wrapper')
        //         console.log(droppedOnCanvas)
        //     }
        //     document.addEventListener('mouseup', handleMouseUp)
        // }
        if (linked && (io === 'input' || io === 'output')) {
            link(nodeId, portName)
        } else if (!linked) {
            unlink(nodeId, portName)
            // console.log(io)
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
        border: 2px solid black;
        border-radius: 50%;
        height: 10px;
        width: 10px;
    }
    .linked {
        background-color: black !important;
    }
    .input.connecting {
        background-color: var(--lime-red) !important;
        border: 2px solid black;
    }
    .output.connecting {
        background-color: var(--lime-green);
        border: 2px solid black;
    }
    .input.linked {
        border: 1px solid var(--red);
    }
    .output.linked {
        border: 1px solid green;
    }

    .input {
        background-color: red;
        background-color: var(--red);
    }
    .output {
        background-color: green;
    }
</style>
