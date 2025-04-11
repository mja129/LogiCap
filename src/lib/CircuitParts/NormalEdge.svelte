<script lang="ts">
    import { onMount } from 'svelte'
    import { getWireIdFromDOM } from './wireUtils'

    let edgeWrapper: SVGPathElement | null = $state(null)

    let {
        initAncId,
        currentPath,
        wireActive = $bindable(),
        monitorWire,
    }: {
        initAncId: string
        currentPath: string
        wireActive: number
        monitorWire: Function
    } = $props()

    onMount(() => {
        let [wireId, domWireId] = getWireIdFromDOM(edgeWrapper, initAncId)
        monitorWire(wireId)
    })
</script>

<path
    bind:this={edgeWrapper}
    class={wireActive === -1
        ? 'hit-area'
        : wireActive === 1
          ? 'hit-area on'
          : 'hit-area off'}
    d={currentPath}
/>

<style>
    path {
        stroke: black;
        stroke-width: 7px !important;
    }
    .on {
        stroke: green !important;
        /* background-color: red; */
    }
    .off {
        stroke: red !important;
    }
</style>
