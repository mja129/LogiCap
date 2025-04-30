<script lang="ts">
    import { getContext, onMount } from 'svelte';
    import { registerGraphControls } from '@Util/graphUtils'
    

    //Did not know about this until trying it, basically this can be used anywhere now to set Zoom or Translation
    onMount(() => {
      const graph: any = getContext('graph');
      registerGraphControls(graph.transforms.scale.set, graph.transforms.translation.set);
    });
  </script>