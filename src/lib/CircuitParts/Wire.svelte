<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Edge } from 'svelvet'
    import type { Action } from 'svelte/action'

    import { CustomHeadlessCircuit } from '@Util/CustomHeadlessCircuit'

    import {
        CircuitEngine,
        onWireChange,
        findWireInEngine,
    } from '@CircuitEngine'

    import { setAnchor, getWireIdFromDOM, setLamp } from './wireUtils.ts'
    import { createDragWire } from './manipulateWire.ts'
    import CustomEdge from './CustomEdge.svelte'

    let {
        initAncId,
    }: {
        initAncId: string
    } = $props()

    // used for finding the html element with the connectionID
</script>

<!-- I need this custom element (even though I don't want the extra nexting) because I need to track changes in 'Path' actively-->
<Edge let:path let:destroy let:hovering>
    <CustomEdge {initAncId} currentPath={path} />
</Edge>
