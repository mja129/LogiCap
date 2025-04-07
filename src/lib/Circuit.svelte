<script lang="ts">
    import { Node } from 'svelvet'
    import type { Component } from 'svelte'
    import {
        getComponent,
        type AllNodeProps,
        type AllNodePropsWithoutId,
        type allNodeTypes,
    } from '@CircuitModel'

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
    let nodeRotation: number = $state(0)

    const hoverAllAnchors = () => {
        // Wire glitch on dev mode fix
        const hoverAnchor = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
        })
        const allAnchors: NodeListOf<HTMLElement> =
            document.querySelectorAll('.anchor-wrapper')

        allAnchors.forEach((anc: HTMLElement) => {
            anc.dispatchEvent(hoverAnchor)
        })
    }
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
        id={nodeId}
    >
        <div
            onclick={async (e: MouseEvent) => {
                const clickedEle = e.target as HTMLElement
                if (
                    !clickedEle ||
                    (clickedEle.nodeName !== 'IMG' &&
                        clickedEle.nodeName !== 'svg')
                ) {
                    console.warn('Did not click on node image base')
                    return
                }
                nodeRotation = (nodeRotation + 90) % 360
            }}
            style="transform:rotate({nodeRotation}deg)"
        >
            <MyComponent rotation={nodeRotation} {nodeId} {...nodeProps} />
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
