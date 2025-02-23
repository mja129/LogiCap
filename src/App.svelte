<script lang="ts">
    // import Graph from './lib/Graph.svelte';
    import { Svelvet, Node, Anchor, Minimap } from 'svelvet';
    import AndGate from './lib/AndGate.svelte';
    import type { CSSColorString } from 'svelvet';
    // import the type and the actual object
    import { readable, type Readable } from 'svelte/store';
    // const blackColor: Readable<CSSColorString> = Readable<CSSColorString>("red");
    const blackColor: Readable<CSSColorString> = readable("red");

</script>

<main>
    <h1> Svelvet Graph</h1>
    <div id="TopBar"></div>
    <div id=""></div>
    <div id="graph">
        <Svelvet theme="LogiCap">
            <Minimap width="{100}" corner="NE" mapColor="blue" slot="minimap" />
            <Node id="And_Node_1" drop="cursor">
                <AndGate width={80} height={50} />
                <div class="input-1">
                    <Anchor direction="west" input bgColor=red multiple={false} />
                </div>
                <div class="input-2">
                    <Anchor direction="west" input bgColor=red multiple={false}/>
                </div>
                <div class="output-1">
                    <Anchor direction="east" bgColor=green multiple={false}/>
                </div>
            </Node>
            <Node id="And_Node_2" drop="cursor">
                <AndGate width={80} height={50} />
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
        </Svelvet>
    </div>

</main>

<style>
    main {
        
    }
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
