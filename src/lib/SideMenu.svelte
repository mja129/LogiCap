<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script>
    // import SketchyLine from '../assets/svg/sketchLineSvg/line_15.svg'
    // import SketchyLine from '../assets/svg/sketchLineSvg/line_23.svg'
    import SketchyLine from '../assets/svg/sketchLineSvg/line_26.svg'

    let showSubMenu = false
    // click on menu item
    // vs
    // drag menu item and drop on svelvet canvas
    function handleMenuAction() {
        console.log('menuActionHande')
    }
</script>

<nav class="side_menu" aria-label="Side Menu">
    <!-- Use <ul> and <li> for list items -->
    <div class="side_menu_header">
        <h2>
            <span class="l_cap">L</span><span class="o_cap">o</span><span
                class="g_cap">g</span
            ><span class="i_cap">i</span><span class="c_cap">C</span><span
                class="a_cap">a</span
            ><span class="p_cap">p</span>
        </h2>
        <img
            class="sketch_bar"
            src={SketchyLine}
            alt="sketched line bottom border for main app bar"
        />
    </div>
    <ul>
        <!-- Use <li> for each menu item -->
        <li>
            <!-- Use a more descriptive clickable element -->
            <button on:click={() => (showSubMenu = !showSubMenu)}>Gates</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
            <!-- style={showSubMenu ? 'display:none' : 'display:block'} -->
            <ol
                class="blue-bg"
                style={showSubMenu ? 'display:none' : 'display:grid'}
            >
                <li>Not</li>
                <li>Repeater</li>
                <li>And</li>
                <li>Nand</li>
                <li>Or</li>
                <li>Nor</li>
                <li>Xor</li>
                <li>Xnor</li>
            </ol>
        </li>
        <li>
            <button on:click={handleMenuAction}>Arithmetic</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
            <ol
                class="pink-bg"
                style={showSubMenu ? 'display:none' : 'display:grid'}
            >
                <li>Not</li>
                <li>Repeater</li>
                <li>And</li>
                <li>Nand</li>
                <li>Or</li>
                <li>Nor</li>
                <li>Xor</li>
                <li>Xnor</li>
            </ol>
        </li>
        <li>
            <button on:click={handleMenuAction}>Multiplexers</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Memory</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Utils?</button>
            <!-- Clock source: Clock -->
            <!-- Outputs: out (1-bit) -->
            <!-- Button input: Button -->
            <!-- Outputs: out (1-bit) -->
            <!-- Lamp output: Lamp -->
            <!-- Inputs: in (1-bit) -->
            <!-- Number input: NumEntry -->
            <!-- Attributes: bits (natural number), numbase (string) -->
            <!-- Outputs: out (bits-bit) -->
            <!-- Number output: NumDisplay -->
            <!-- Attributes: bits (natural number), numbase (string) -->
            <!-- Inputs: in (bits-bit) -->
            <!---->
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Bus</button>
        </li>
        <!-- Add more items as necessary -->
    </ul>
</nav>

<style>
    span {
        font-family: 'vcr', sans-serif;
    }

    h2 span:nth-child(4n + 1) {
        /* Your styles here */
        color: #00f5d4;
    }
    h2 span:nth-child(4n + 2) {
        /* Your styles here */
        color: #f15bb5;
    }
    h2 span:nth-child(4n + 3) {
        /* Your styles here */
        color: #fee440;
    }
    h2 span:nth-child(4n + 4) {
        /* Your styles here */
        color: #00bbf9;
    }

    .pink-bg li {
        background-color: #f15bb5;
    }
    .blue-bg li {
        background-color: #00bbf9;
    }
    /* https://codepen.io/gayane-gasparyan/pen/vYmYMeV */
    h2 {
        -webkit-text-stroke: 1px black;
        font-size: 2.8rem;
        text-align: left;
        padding: 0;
        margin-top: -12px;
        margin-bottom: 3px;
        color: transparent;
        font-family: 'vcr', sans-serif;
    }
    .side_menu_header img:first-child {
        width: 150px;
    }
    .side_menu_header img:nth-child(2) {
        height: 12px;
        margin-block: -6px;
        width: 1500px;
    }
    .side_menu_header {
        padding: 10px;
    }
    /* ul { */
    /* } */
    li {
        justify-content: center;
    }
    .side_menu li img {
        /* transform: translateY(-20px); */
        min-width: calc(100% + 5px);
        margin-inline: -4px;
        height: 8px;
    }

    li:first-child > button {
        padding-top: 10px;
    }
    ol {
        list-style-type: none;
        /* margin-left: 40px; */

        /* Grid Fallback */
        /* display: flex;
        flex-wrap: wrap; */

        /* Supports Grid */
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        /* grid-auto-rows: minmax(100px, auto); */
        grid-gap: 10px;
        padding-inline: 10px;
    }

    ol li {
        z-index: 2;
        background-color: #00bbf9;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;

        border: 3px solid 3px;
        box-shadow: 4px 4px 0px 0px #000000;
        border-radius: 3px;
    }
    @keyframes slide-in {
        from {
            height: 300px;
        }

        to {
            max-height: 0px;
        }
    }
    /* li:first-child::before:hover { */
    /*     background-color: #c971ca; */
    /* } */
    li:not(:first-child) {
        /* margin-top: 10px; */
        /* padding-inline: 2px; */
    }
    ul > li {
        padding-inline: 4px;
    }
    button {
        border-radius: 30px;
        padding-block: 8px;
        padding-left: 15px;
        border: unset;
        outline: unset;
        background-color: #9b5de5;
        color: black;
        font-size: 3ex;
        width: 100%;
        text-align: left;
    }

    button:hover {
        /* background-color: #7925dc; */
        background-color: #8a41e1;
    }
    .side_menu {
        /* width: 30%; */
        flex: 0 0 22.5%;
        height: 100%;
        background-color: #9b5de5;
        margin-right: 1.5vw;
        /* In order for the main canvas to render centered when the menu goes
         * away, the main container must have a padding-inline property set
         * when you set this, the padding will cause the side menu to render
         * 1.5vw units away from the left edge of the screen, this offests that
         Probably the only other alternative would be to use javascript to take
         away some css after the menu goes away
         */
        margin-left: -1.5vw;

        border: 3px solid 3px;
        box-shadow: 0px 4px 0px 4px #000000;
        border-radius: 3px;
    }
    /* @keyframes subMenuToggle { */
    /*     height: 0px; */
    /* } */
</style>
