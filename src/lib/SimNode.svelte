<script lang="ts">
    import {
        getComponent,
        type AllNodeProps,
        type allNodeTypes,
    } from './nodeModal'

    let {
        gateType,
        nodeProps,
    }: { gateType: allNodeTypes; nodeProps: AllNodeProps } = $props()

    // Separate gateType from the rest of the props

    // Create a function to get the component based on type

    // Use $derived for reactive value
    // do I even need this?
    let nodeComponent = $derived(getComponent(gateType))
</script>

{#if nodeComponent}
    <!-- svelte-ignore svelte_component_deprecated -->
    <svelte:component this={nodeComponent} {...nodeProps} />
{:else}
    <!-- Optional fallback -->
    <div>Unknown gate type: {gateType}</div>
{/if}
