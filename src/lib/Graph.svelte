<script>
    import { Svelvet, Node, Anchor } from 'svelvet';
    import AndGate from './AndGate.svelte';

    let nodes = [
        { id: 1, position: { x: 100, y: 100 }},
        { id: 2, position: { x: 500, y: 100 }}
    ]


</script>

<Svelvet>
    {#each nodes as node}
        <Node {...node}>
            <AndGate width={80} height = {50} />
            <div class="input-1">
                <Anchor direction="west" input bgColor=red multiple={false} />
            </div>
            <div class="input-2">
                <Anchor direction="west" input bgColor=red multiple={false}/>
            </div>
            <div class="output-1">
                <Anchor direction="east" output bgColor=green multiple={false}/>
            </div>

        </Node>
    {/each}
</Svelvet>


<style>
    :global(.svelvet-node) {
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: auto !important;
        height: auto !important;
    }
    .input-1 {
        position: absolute;
        top: 14.5%;
        left: 7.5%;
    }
    .input-2 {
        position: absolute;
        top: 51.5%;
        left: 7.5%;
    }
    .output-1 {
        position: absolute;
        top: 35%;
        right: 10%
    }
</style>