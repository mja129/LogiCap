<script>
    // import SketchyLine from '../assets/svg/sketchLineSvg/line_15.svg'
    // import SketchyLine from '../assets/svg/sketchLineSvg/line_23.svg'
    import SketchyLine from '../assets/svg/sketchLineSvg/line_26.svg'
    import AppLogo from '../assets/LogiCapLogo.png'

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
        <img src={AppLogo} alt="app logo" />
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
            <button on:click={handleMenuAction}>Plexers</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Logic Gates</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Logic Gates</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <li>
            <button on:click={handleMenuAction}>Logic Gates</button>
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
        </li>
        <!-- Add more items as necessary -->
    </ul>
</nav>

<style>
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
    /* li:first-child::before:hover { */
    /*     background-color: #c971ca; */
    /* } */
    li:not(:first-child) {
        /* margin-top: 10px; */
        /* padding-inline: 2px; */
    }
    li {
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
    }
</style>
