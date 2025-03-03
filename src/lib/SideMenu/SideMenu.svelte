<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { onMount } from 'svelte'
    import SketchyLine_wiggle from '../../assets/svg/sketchLineSvg/line_26.svg'
    // import CollapseIcon from '../assets/icons/collapse.webp'

    import SideMenuHeader from './SideMenuHeader.svelte'
    import SideMenuGroupItems from './SideMenuGroupItems.svelte'

    // just a selection of ones I want for the random line under the menu items.
    const randomLineSelectionGroup = [15, 23, 24, 25, 27, 17, 19, 21, 29]

    type MenuGroupNames =
        | 'Gates'
        | 'Arithmetic'
        | 'Multiplexers'
        | 'Memory'
        | 'Utils'

    type MenuItemData = { svg: string | undefined; groupElements: string[] }
    type MenuItem = Record<MenuGroupNames, MenuItemData>
    type MenuItemJson = MenuItem & MenuItem

    // svg shouldn't be here.
    const menuJson: MenuItemJson = {
        Gates: {
            svg: undefined,
            groupElements: [
                'And',
                'Or',
                'Nor',
                'Not',
                'Xor',
                'Nand',
                'Repeater',
                'Xnor',
            ],
        },
        Arithmetic: {
            svg: undefined,
            groupElements: [
                'And',
                'Or',
                'Nor',
                'Not',
                'Xor',
                'Nand',
                'Repeater',
                'Xnor',
            ],
        },

        Multiplexers: {
            svg: undefined,
            groupElements: [
                'And',
                'Or',
                'Nor',
                'Not',
                'Xor',
                'Nand',
                'Repeater',
                'Xnor',
            ],
        },
        Memory: {
            svg: undefined,
            groupElements: [
                'And',
                'Or',
                'Nor',
                'Not',
                'Xor',
                'Nand',
                'Repeater',
                'Xnor',
            ],
        },
        Utils: {
            svg: undefined,
            groupElements: [
                'And',
                'Or',
                'Nor',
                'Not',
                'Xor',
                'Nand',
                'Repeater',
                'Xnor',
            ],
        },
    }

    function rng(maxInt: number): number {
        return Math.floor(Math.random() * maxInt) + 1
    }
    // this function is overengineered, it could/should be 2, this is more efficient tho, besides splice, but the array is quite small also
    // Assigns a random line to the menu. lol
    let randomLineSelectionStore = localStorage.getItem(
        'randomLineSelectionStore'
    )

    if (randomLineSelectionStore === null) {
        const selections = new Array<number>()
        Object.keys(menuJson).map(async (groupName: string) => {
            const randNum = rng(randomLineSelectionGroup.length - 1)
            const selection = randomLineSelectionGroup[randNum]
            const svgImport = `/src/assets/svg/sketchLineSvg/line_${selection}.svg`
            menuJson[groupName as MenuGroupNames]['svg'] = svgImport
            randomLineSelectionGroup.splice(randNum, 1)

            // add to localStorageCache
            selections.push(selection)
            console.log(menuJson)
            // return { groupName, svgImport }
        })
        localStorage.setItem(
            'randomLineSelectionStore',
            JSON.stringify(selections)
        )
    } else {
        const chosenLinesJson: string[] = JSON.parse(randomLineSelectionStore)
        const menuJsonKeys = Object.keys(menuJson)
        chosenLinesJson.forEach((selection: string, index: number) => {
            const currentMenuGroup: MenuGroupNames = menuJsonKeys[
                index
            ] as MenuGroupNames
            const svgImport = `/src/assets/svg/sketchLineSvg/line_${selection}.svg`
            menuJson[currentMenuGroup]['svg'] = svgImport
        })
    }

    // this could also be "instance" data but this is simpler
    let showSubMenu: boolean[] = $state([true, true, true])
    // click on menu item
    // vs
    // drag menu item and drop on svelvet canvas
    function handleMenuAction() {
        console.log('menuActionHande')
    }
</script>

<nav class="side_menu" aria-label="Side Menu">
    <!-- Use <ul> and <li> for list items -->
    <SideMenuHeader />

    <!-- style="height:19px;width:90%;margin-left:2.5%" -->
    <img
        class="wiggle_bar"
        src={SketchyLine_wiggle}
        style=""
        alt="sketched line bottom border for main app bar"
    />
    <ul>
        <!-- Use <li> for each menu item -->
        <li>
            <!-- Use a more descriptive clickable element -->
            <button
                onmousedown={() => {
                    showSubMenu[0] = !showSubMenu[0]
                }}>Gates</button
            >
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->
            <!-- style={showSubMenu ? 'display:none' : 'display:block'} -->

            <img
                class="sketch_bar"
                src={menuJson['Gates'].svg}
                alt="sketched line bottom border for main app bar"
            />
            <SideMenuGroupItems showSubMenu={showSubMenu[0]} />
        </li>
        <li>
            <button
                onmousedown={() => {
                    showSubMenu[1] = !showSubMenu[1]
                }}>Arithmetic</button
            >
            <!-- <img -->
            <!--     class="sketch_bar" -->
            <!--     src={SketchyLine} -->
            <!--     alt="sketched line bottom border for main app bar" -->
            <!-- /> -->

            <img
                class="sketch_bar"
                src={menuJson['Arithmetic'].svg}
                alt="sketched line bottom border for main app bar"
            />
            <SideMenuGroupItems showSubMenu={showSubMenu[1]} />
        </li>
        <li>
            <button
                onmousedown={() => {
                    showSubMenu[1] = !showSubMenu[1]
                }}>Multiplexers</button
            >
            <img
                class="sketch_bar"
                src={menuJson['Multiplexers'].svg}
                alt="sketched line bottom border for main app bar"
            />
        </li>
        <li>
            <button
                onmousedown={() => {
                    showSubMenu[1] = !showSubMenu[1]
                }}>Memory</button
            >
            <img
                class="sketch_bar"
                src={menuJson['Memory'].svg}
                alt="sketched line bottom border for main app bar"
            />
        </li>
        <li>
            <button
                onmousedown={() => {
                    showSubMenu[0] = !showSubMenu[0]
                }}>Utils</button
            >
            <img
                class="sketch_bar"
                src={menuJson['Utils'].svg}
                alt="sketched line bottom border for main app bar"
            />
        </li>
        <li>
            <!-- <button on:click={handleMenuAction}>Bus</button> -->
        </li>
        <!-- Add more items as necessary -->
    </ul>
</nav>

<style>
    /* <!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 --> */
    :root {
        --purple: #9b5de5;
        --lilac: #b0b5ed;
        --dark-purple: #8a41e1;
        --cyan: #00f5d4;
        --pink: #f15bb5;
        --pastel-pink: #fce6f3;
        --pastel-cyan: #d7fef9;
        /* --pastel-purple: #e5d6f8; */
        --pastel-purple: #e1d3f8;
        --pastel-blue: #d7f5ff;
        --pastel-green: #d5f0c1;
        --yellow: #fee440;
        --blue: #00bbf9;
        /*    The dark blue is hella out of place      */
        --dark-blue: #007095;
        --cream: #fff0dc;
        --dark-cream: #ffdbac;

        /* --side-menu-spacing is important, I reasoned through it, and there are a lot of places here to add spacing and a lot of states
            the css variable is very good/useful here.
            - The lines are the main element which creates spacing
            - when the submenu is open, the bottom of the submenu must have 'margin-bottom; var(--side-menu-spacing)'
        */
        --side-menu-spacing: 25px;
        /* --side-menu-header-spacing: 20px; */
    }

    /* NOTE: 'nav.side_menu' is not needed because the css is component scoped anyways
        I added it because I thought the css was a too much in this file. and its a bit easier to understand.
    */

    nav.side_menu {
        /* width: 30%; */
        flex: 0 0 22.5%;
        height: 100%;
        background-color: var(--cream);
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

    /* All list element decedents of .side_menu class */
    nav.side_menu li {
        justify-content: center;
    }

    /* Direct child image decendant of li*/
    /* The sketched line*/
    .sketch_bar {
        /* transform: translateY(-20px); */
        min-width: calc(100% + 5px);
        margin-inline: -4px;
        margin-block: var(--side-menu-spacing);
        height: 8px;
    }

    .wiggle_bar {
        height: 19px;
        width: 100%;

        margin-top: -7px;
        /* margin-bottom: var(--side-menu-spacing); */
    }

    nav.side_menu button {
        border-radius: 30px;
        padding-block: 10px;
        padding-left: 15px;
        border: unset;
        outline: unset;
        background-color: var(--cream);
        color: black;
        font-size: 3ex;
        width: 95%;
        text-align: left;
        /* margin-top: 5px; */
        /* padding-top: 10px; */
    }

    nav.side_menu button:hover {
        /* background-color: #7925dc; */
        background-color: var(--dark-cream);
    }

    /* nav.side_menu li:first-child > button { */
    /*     padding-top: 10px; */
    /* } */
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
    /* and the spacing on the lines to the first child of the menu group list of items */
    ul > li:first-child {
        /* padding-inline: 2px; */
        margin-top: var(--side-menu-spacing);
    }

    ul > li {
        padding-inline: 4px;
        text-align: center;
    }

    /* @keyframes subMenuToggle { */
    /*     height: 0px; */
    /* } */
</style>
