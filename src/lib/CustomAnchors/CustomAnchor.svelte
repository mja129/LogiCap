<!-- <script context="module"> -->
<!--     let persistedState = 0 -->
<!-- </script> -->
<!---->
<script lang="ts">
    import { lastConnected } from '../circuitEngine.svelte.ts'
    import { circuitStore, removeConnection } from '../circuitStore.ts'
    import {
        findAnchorTargetClassName,
        attemptLink,
    } from './linkAnchors.svelte.ts'
    import { connectingEdge } from '../circuitStore.ts'

    let {
        linked,
        hovering,
        connecting,
        portName,
        nodeId,
        anchorId,
        io = 'output',
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        portName: string
        nodeId: string
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
        $connectingEdge = true
        if (connecting) {
            document.addEventListener('mouseup', handleMouseUp, true)
        }
    })

    // TODO, may need to listen to onUnmount
    // I think on disconnect has a default event from svelvet, try that out also this effect may set state to false many times, but honestly nah.
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="custom_anchor {(io === 'input' && 'input') || 'output'} {anchorId}"
    class:linked
    class:hovering
    class:connecting
    onmousedowncapture={(e: MouseEvent) => {
        e.preventDefault()
        // there is a niche bug here
        // click on linked anchor while dragging sticky.
        if (linked && io === 'input') {
            console.log('UNLINKING')
            // make sure we are adding to the end of the list and starting the search from there.
            // Stack order
            removeConnection(anchorId)
            // now tell the connecting outputnode who you are
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
