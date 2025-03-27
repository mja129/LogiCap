<!-- <script module> -->
<!--     let persistedState = 0 -->
<!-- </script> -->
<!---->
<script lang="ts">
    import { getRunning } from '@CircuitEngine'
    import { findAnchorTargetClassName, attemptLink } from './linkAnchors'
    import { removeConnection } from '@CircuitStore'

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

    const makeStickyConnectHandler = (anchorClass: string) => {
        function handleStickyConnect(event: any) {
            event.preventDefault()
            event.stopPropagation()
            // console.log('Click After sticky edge')

            const statusMsg = attemptLink(anchorClass, event.target.classList)

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
            const statusMsg = attemptLink(anchorId, e.target.classList)
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
        // there is a niche bug here
        // click on linked anchor while dragging sticky.
        if (!getRunning() && linked && io === 'input') {
            console.log('UNLINKING')
            // make sure we are adding to the end of the list and starting the search from there.
            // Stack order removeConnection(anchorId)
            // now tell the connecting outputnode who you are
            removeConnection(anchorId)
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
    /* added dynamically in wire.svelte */
    :global(.running .input) {
        background-color: var(--pitt-blue) !important;
    }
    :global(.running .output) {
        /* background-color: var(--pitt-yellow) !important; */
    }
    :global(.running .input.on, .running .output.on) {
        border: 2px solid green !important;
        filter: brightness(85%);
    }
    :global(.running .input.off, .running .output.off) {
        border: 2px solid var(--red) !important;
    }

    .input {
        background-color: red;
        background-color: var(--pitt-blue);
    }
    .output {
        background-color: var(--pitt-yellow);
    }
</style>
