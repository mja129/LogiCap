<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { Svelvet, Minimap, Controls } from 'svelvet'
    import AndGate from './lib/AndGate.svelte'
    import { circuitStore } from './lib/stores/circuitStore'
    import SideMenu from './lib/SideMenu.svelte'
    import SketchyLine from './assets/svg/sketchLineSvg/line_8.svg'
    import AppLogo from './assets/LogiCapLogo.png'

    // import type { CSSColorString } from 'svelvet'
    // import { readable, type Readable } from 'svelte/store'
    // const blackColor: Readable<CSSColorString> = Readable<CSSColorString>("red");

    // in order to implement dragging circuits from the side menu into the main window
    // we need app.svelte to maintain an array or a global store of the elements currently on the canvas
    // this store already exists I guess
    // the list should then be iterated over in an {each} block.
    // <svelte:component this={component}> or we could make a generic component that took params to become a specific type of circuit
    // This pattern is known as a "Factory Pattern" where a component is dynamically instantiated based on parameters or conditions
    // you would probably need a "key'd" each block for one of these options, not sure which tbh

    // Lets just start with on menu click.

    // $inspect(lastLinked_0).with(console.log)
    // $inspect(lastLinked_1).with(console.log)

    // menu design, requirements
    // on dragEnd, if we are dropping onto the canvas
    // add a svelte:component to a list of components
    circuitStore.subscribe((value) => {
        console.log(value.connectors)
    })
</script>

<!-- <div id="app_bar"> -->
<!--     <div class="app_bar_items"> -->
<!--         <img src={AppLogo} alt="app logo" /> -->
<!--     </div> -->
<!--     <img -->
<!--         class="sketch_bar" -->
<!--         src={SketchyLine} -->
<!--         alt="sketched line bottom border for main app bar" -->
<!--     /> -->
<!-- </div> -->

<main>
    <SideMenu />
    <Svelvet theme="LogiCap" TD controls edgeStyle="step" editable={false}>
        <Minimap width={100} corner="NE" slot="minimap" />
        <AndGate nodeStartPos={20} width={80} height={50} />
        <AndGate nodeStartPos={200} width={80} height={50} />
    </Svelvet>
</main>

<style>
    :root {
        --app-bar-height: 50px;
        --main-app-flex-height: calc(100vh - var(--app-bar-height));
    }
    main {
        display: flex;
        flex-direction: row;
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        padding-inline: calc(1.5vw);
        justify-content: center;
        align-items: center;
        /* max-height: 100vh; */
    }

    :global(.svelvet-node) {
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        width: auto !important;
        height: auto !important;
    }
    :global(.svelvet-wrapper) {
        max-height: calc(100% - 3.5vh);
        /* Take up the rest of the space in the flex container*/
        flex: 1;
    }

    #app_bar {
        height: var(--app-bar-height);
        width: 100%;
        background-color: #00bbf9;
    }

    .sketch_bar {
        position: absolute;

        transform: translateY(-7px);
        height: 10px;
        margin-left: 0px;
        min-width: 100%;
    }
    .app_bar_items {
        display: flex;
        flex-direction: row;
    }
    .app_bar_items img {
        margin-left: auto;
        margin-right: 1.2vw;
        margin-top: 2px;
        width: 150px;
    }
</style>
