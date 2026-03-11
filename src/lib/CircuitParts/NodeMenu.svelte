<script lang="ts">
    import type { Snippet } from 'svelte'
    let { children }: { children: Snippet } = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="node-menu" onclick={(e) => e.stopPropagation()}>
    {@render children()}
</div>

<style>
    .node-menu {
        position: absolute;
        top: -70px;
        left: 0;
        z-index: 100;
        background: var(--lightblue, #2a2a2a);
        border: 2px solid black;
        border-radius: 6px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 150px;
        color: white;
        font-size: 13px;
    }
    .node-menu input {
        width: 60px;
        margin-left: 4px;
    }
    .node-menu button {
        cursor: pointer;
        padding: 2px 8px;
    }
</style>
