<script lang="ts" module>
    export let signalQ: Writable<Array<string>> = writable([])
    // export let signalQ: Writable<
    //     Array<[outputAnchorName, Record<string, boolean>]>
    // > = writable([])
</script>

<script lang="ts">
    import { Node } from 'svelvet'
    import { rerenderInputAnchorHack } from '@src/lib/Util/cursors'
    import { setContext, type Component } from 'svelte'
    import {
        getComponent,
        type AllNodeProps,
        type AllNodePropsWithoutId,
        type allNodeTypes,
    } from '@CircuitModel'
    import { rejectMoveClick } from './Util/cursors'
    import { get, writable, type Writable } from 'svelte/store'

    import { CircuitStore, findOutputAnchor } from '@CircuitStore'
    import { getRunning } from './circuitEngine.svelte'

    // props that all nodes have in common.
    interface SimNodeProps {
        nodeId: string
        gateType: allNodeTypes
        position: { x: number; y: number } | undefined
        nodeProps: AllNodePropsWithoutId
    }
    // type should be only props that are not shared.

    // data: T[]
    // children: Snippet
    // row: Snippet<[T]>
    let { nodeId, gateType, position, nodeProps }: SimNodeProps = $props()

    // Separate gateType from the rest of the props

    // Create a function to get the component based on type

    // Use $derived for reactive value
    // do I even need this derived? Nah
    let nodeComponent = $derived(getComponent(gateType))

    // this is a writable store but not global state.
    // passed down to the anchors using the 'useContext api'
    // take the value from the store if it exists.
    let rotation: Writable<number> = writable(
        $CircuitStore.devices[nodeId].rotation || 0
    )
    let rotatedNodeName: Writable<string> = writable(nodeId)
    let outputUpdate: Writable<boolean> = writable(false)

    const nodeAction = (e: MouseEvent) => {
        const clickedEle = e.target as HTMLElement
        // console.log(e.target)
        if (!clickedEle) {
            console.warn('no event target on node click')
        } else if (
            clickedEle.nodeName !== 'IMG' &&
            clickedEle.parentNode?.nodeName !== 'svg'
        ) {
            console.warn(
                'not a part of the node to preform a node action, in this case "rotate" '
            )
        } else {
            $rotation = ($rotation + 90) % 360

            // this should be very impossible
            if (!(nodeId in $CircuitStore.devices)) return null

            $CircuitStore.devices[nodeId].rotation = $rotation
            $CircuitStore = $CircuitStore
        }
    }
    // #TODO tell the nodes NSEW. when changing direction
    // this solution is better. just need to fine tune it a bit.
    // its hacky but our data persists, vs with a {key } block we have rerender
    setContext('rotation', rotation)
    setContext('rotationNode', rotatedNodeName)
    setContext('outputUpdate', outputUpdate)

    $effect(() => {
        // this if statement is weird bc effect is weird.
        // this code will run whenever rotation changes.
        // if ($rotation || $rotation === 0) {
        //     if (nodeId.startsWith('Lamp')) {
        //         rerenderInputAnchorHack('in_' + nodeId)
        //         return
        //     }
        //
        //     rerenderInputAnchorHack('out_' + nodeId)
        //     rerenderInputAnchorHack('in1_' + nodeId)
        //     rerenderInputAnchorHack('in2_' + nodeId)
        //     const outputConnections =
        //         get(CircuitStore).connectors[
        //             ('out_' + nodeId) as outputAnchorName
        //         ]
        //     // if this is an input, trigger 0,2 output nodes to rerender
        //     // push the output node names into
        //
        //     // console.log(linkedToOutput_2?.substring(4), linkedToOutput_1)
        //
        //     // if (outputConnections && outputConnections.length > 0) {
        //     //     outputConnections.forEach(([_, inAnc]) => {
        //     //         // console.warn(inAnc)
        //     //         rerenderInputAnchorHack(inAnc)
        //     //     })
        //     // }
        // }
    })
</script>

<!-- I added this here because I kept changing the SvelvetNode properties in all
of the different components now I just need to do it here -->
{#snippet wrapInSvelvetNode(MyComponent: Component<AllNodeProps>)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- Wow finally somewhere where key block solves a problem-->
    <Node
        drop={position !== undefined ? false : 'cursor'}
        {position}
        editable={false}
        id={nodeId}
        let:selected
        let:node    
    >
        <div class:selected={selected} 
            onmousedowncapture={(e: MouseEvent) => {
                if (!getRunning()) {
                    // $hasRotated = true
                    // e.stopPropagation()
                    rejectMoveClick(e, nodeAction)
                    // we should pass down anchor names on a node

                    // NSEW rerendering signal send to (output) anchors from other nodes
                    let anchors = [
                        findOutputAnchor(`in1_${nodeId}`),
                        findOutputAnchor(`in2_${nodeId}`),
                    ].filter(Boolean) as string[]

                    // if ((!e.target) instanceof Element) return

                    // const clickedAnchorClass = [...e.target?.classList].find(
                    //     (className) =>
                    //         (className.startsWith('in') ||
                    //             className.startsWith('out')) &&
                    //         className.includes('_') &&
                    //         className !== 'input' &&
                    //         className !== 'output'
                    // )
                    // if (!clickedAnchorClass) return null

                    // console.log(gateType)
                    if (
                        gateType === 'Lamp' ||
                        gateType === 'Repeater' ||
                        gateType === 'Not'
                    ) {
                        anchors = [findOutputAnchor(`in_${nodeId}`)].filter(
                            Boolean
                        ) as string[]
                    }

                    signalQ.update((curr) => [...curr, ...anchors])

                    // console.log($signalQ)
                }
            }}
            style="transform:rotate({$rotation}deg)"
        >
            <MyComponent {nodeId} {...nodeProps} />
        </div>

    </Node>
{/snippet}

{#if nodeComponent}
    <!-- svelte-ignore svelte_component_deprecated -->
    {@render wrapInSvelvetNode(nodeComponent)}
{:else}
    <!-- Optional fallback -->
    <div>Unknown gate type: {gateType}</div>
{/if}

<style>
    /* only for logic gates */
    /* add outline and gray color on light mode */
    /* warning, if you want to edit node properties directly, you should probably go into the svg files and set certain classes. 
        otherwise the css will mess with some of the nodes.
    */
    /* if you want this css to not impact a certain node. I would put a specific class on that node and add a :not() pseudoselector to this css rule */
    :global(.light .svelvet-node svg) {
        /* to change the color from black to literally anything use the link below */
        /* https://isotropic.co/tool/hex-color-to-css-filter/ */
        /* filter: drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) */
        /*     drop-shadow(1px 1px 0px black) drop-shadow(-1px 1px 0px black); */
        /* white + black */
        filter: drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white)
            drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)
            drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black)
            drop-shadow(0 -1px 0 black) drop-shadow(0 1px 0 black);
    }
    :global(.dark .svelvet-node svg) {
        filter: unset;
    }

    /* Give some visual indication if gate is selected */
    .selected {
        background-color: blue;
    }
</style>
