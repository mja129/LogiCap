<script lang="ts">
    import { getRunning } from '@CircuitEngine'
    import { findAnchorTargetClassName, attemptLink } from './linkAnchors'
    import { CircuitStore } from '@CircuitStore'
    import { handleDisconnect } from './Wire.svelte'

    let {
        linked,
        hovering,
        connecting,
        anchorId,
        io = 'output',
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        anchorId: string
        io?: string
    } = $props()

    let wireName = $state('')
    const makeStickyConnectHandler = (anchorClass: string) => {
        function handleStickyConnect(event: any) {
            event.preventDefault()
            event.stopPropagation()
            // console.log('Click After sticky edge')

            wireName = attemptLink(anchorClass, event.target.classList)

            document.removeEventListener('mousedown', handleStickyConnect, true)
        }
        return handleStickyConnect
    }

    function setupStickyConnection(sourceAnchorClass: string) {
        const handleStickyConnect = makeStickyConnectHandler(sourceAnchorClass)
        // Listen for the mouse down with capture to handle sticky connections
        document.addEventListener('mousedown', handleStickyConnect, true)
    }

    function handleMouseUp(e: any) {
        const sourceAnchorClass = findAnchorTargetClassName(e.target.classList)

        // click on yourself after connecting
        if (sourceAnchorClass !== null && sourceAnchorClass === anchorId) {
            setupStickyConnection(sourceAnchorClass)
        } else {
            wireName = attemptLink(anchorId, e.target.classList)
        }

        // Clean up event listener
        document.removeEventListener('mouseup', handleMouseUp, true)
    }

    $effect(() => {
        // we don't listen for mousedown because the 'connecting' prop, signals we have already been clicked on.
        if (connecting) {
            document.addEventListener('mouseup', handleMouseUp, true)
        }
    })
</script>

<div
    class="custom_anchor {(io === 'input' && 'input') || 'output'} {anchorId}"
    class:linked
    class:hovering
    class:connecting
    onmousedowncapture={(e: MouseEvent) => {
        e.preventDefault()
        if (linked && io === 'input' && !getRunning()) {
            // console.log('UNLINKING')
            // make sure we are adding to the end of the list and starting the search from there.
            // Stack order removeConnection(anchorId)
            // now tell the connecting outputnode who you are
            CircuitStore.removeConnection(anchorId)
            $handleDisconnect = true
            // reverse mapping.
        }
    }}
></div>

<style>
    .custom_anchor {
        border: 2px solid black;
        border-radius: 50%;
        height: 12.5px;
        transform: scale(1.4);
        width: 12.5px;
    }
    .linked {
        background-color: black !important;
    }
    .input.connecting {
        /* background-color: var(--lime-red) !important; */
        filter: brightness(180%) !important;
        border: 2px solid black;
    }
    .output.connecting {
        /* background-color: var(--lime-green); */
        filter: brightness(130%) !important;
        border: 2px solid black;
    }
    .input.linked {
        /* border: 1.8px solid red; */
        border: 1.8px solid var(--pitt-blue);
    }
    .output.linked {
        /* border: 1.8px solid green; */
        border: 1.8px solid var(--pitt-yellow);
    }
    :global(.running .input) {
        background-color: var(--pitt-blue) !important;
    }
    :global(.running .input.linked.on) {
        border: 2px solid green !important;
        filter: brightness(85%);
    }
    :global(.running .input.linked.off) {
        border: 2px solid var(--red) !important;
    }

    .input {
        background-color: var(--pitt-blue);
    }
    .output {
        background-color: var(--pitt-yellow);
    }
</style>
