<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { registerGraphControls } from '@Util/graphUtils'
    import { get } from 'svelte/store'
    

    //Did not know about this until trying it, basically this can be used anywhere now to set Zoom or Translation
    onMount(() => {
      const graph: any = getContext('graph');
      registerGraphControls(graph.transforms.scale.set, graph.transforms.translation.set);
      (window as any).getCursor = () => {
            let cur = get(graph.cursor) as any
            return { x: cur.x, y: cur.y }
        }
    });
  </script>
