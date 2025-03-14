<script lang="ts">
    import { Edge } from 'svelvet'

    let { edgeId = 'defaultEdgeName' }: { edgeId?: string } = $props()
</script>

<Edge let:path let:destroy edgeClick={() => alert('Edge clicked')}>
    <path d={path} />
    <button on:click={destroy} slot="label">
        <p>Custom Label</p>
    </button>
</Edge>

<style>
    path {
        stroke: rgb(246, 231, 20);
        stroke-width: 4px;
    }
</style>
