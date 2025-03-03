<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import { onMount } from 'svelte'
    import SketchyLineWiggle from '../../assets/svg/sketchLineSvg/line_26.svg'
    // import SketchyLineWiggle from '../SketchLines/line_26.svelte'
    // import SketchyLineStandard from '../SketchLines/line_29.svelte'

    // import CollapseIcon from '../assets/icons/collapse.webp'

    import SideMenuHeader from './SideMenuHeader.svelte'
    import SideMenuGroupItems from './SideMenuGroupItems.svelte'
    import { menuJsonData } from './menu.ts'

    // just a selection of ones I want for the random line under the menu items.

    type MenuGroupName =
        | 'Gates'
        | 'Arithmetic'
        | 'Multiplexers'
        | 'Memory'
        | 'Utils'

    type MenuItemData = { svg: string | undefined; groupElements: string[] }
    // Record = one key pair, type shit
    type MenuItem = Record<MenuGroupName, MenuItemData>
    type MenuJson = MenuItem & MenuItem

    const menuJson: MenuJson = menuJsonData as MenuJson
    const menuGroupNames = Object.keys(menuJson)

    const randomLineSelectionGroup = [15, 23, 24, 25, 27, 17, 19, 21, 29]

    // svg shouldn't be here.
    function rng(maxInt: number): number {
        return Math.floor(Math.random() * maxInt) + 1
    }
    let randomLineSelectionStore = localStorage.getItem(
        'randomLineSelectionStore'
    )

    function getSvgLineFileName(selection: number): string {
        return `/src/assets/svg/sketchLineSvg/line_${selection}.svg`
    }

    // IGNORE THIS CODE, if you want. its very useless.
    if (randomLineSelectionStore === null) {
        const selections: number[] = menuGroupNames.map((groupName: string) => {
            // index of possible lines to select
            const randNum = rng(randomLineSelectionGroup.length - 1)
            // number of the svg in the assets/sketchLineSvg folder.
            const selection: number = randomLineSelectionGroup[randNum]

            const svgImport = getSvgLineFileName(selection)
            menuJson[groupName as MenuGroupName]['svg'] = svgImport

            // remove this number from the selection list.
            // Don't pick any duplicates.
            randomLineSelectionGroup.splice(randNum, 1)
            // add to localStorageCache
            return selection
        })
        localStorage.setItem(
            'randomLineSelectionStore',
            JSON.stringify(selections)
        )
    } else {
        // set lines from local storage
        const chosenLinesJson: string[] = JSON.parse(randomLineSelectionStore)
        chosenLinesJson.forEach((selection: string, index: number) => {
            const currentMenuGroup = menuGroupNames[index] as MenuGroupName
            const svgImport = getSvgLineFileName(parseInt(selection, 10))
            menuJson[currentMenuGroup]['svg'] = svgImport
        })
    }

    // this could also be "instance" data but this is simpler
    // SHOULD ONLY ONE BE OPEN AT A TIME?
    let showSubMenu: boolean[] = Array(menuGroupNames.length).fill(true)
    // console.log(showSubMenu)
    // click on menu item
    // vs
    // drag menu item and drop on svelvet canvas
    // showAnimation = 'transition: min-height 1s ease'
</script>

<nav class="side_menu" aria-label="Side Menu">
    <!-- Use <ul> and <li> for list items -->
    <div style="position: relative;z-index:40;background-color: var(--cream);">
        <SideMenuHeader />

        <!-- style="height:19px;width:90%;margin-left:2.5%" -->
        <img
            class="wiggle_bar"
            src={SketchyLineWiggle}
            alt="sketched line bottom border for main app bar"
        />
    </div>
    <ul>
        <!-- Use <li> for each menu item -->
        {#each menuGroupNames as groupName, index}
            <li
                id="menu_group_{index}"
                style={showSubMenu[index]
                    ? 'transition: max-height .4s ease-out; max-height:75px'
                    : 'transition: max-height .4s ease-in; max-height:800px'}
            >
                <!-- Use a more descriptive clickable element -->
                <div class="menu_group_section">
                    <button
                        onmousedown={() => {
                            showSubMenu[index] = !showSubMenu[index]
                        }}
                        ><span style="margin-left:5%;">{groupName}</span
                        ></button
                    >
                    <!-- style={showSubMenu ? 'display:none' : 'display:block'} -->

                    <img
                        class="sketch_bar"
                        src={menuJson[groupName as MenuGroupName].svg}
                        alt="sketched line bottom border for main app bar section {groupName}"
                    />
                </div>
                <SideMenuGroupItems
                    zIndex={index}
                    showSubMenu={showSubMenu[index]}
                />
            </li>
        {/each}

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
        /* Update, this is an absolute BANGER, try updating it, see how well the menu responds changing this varaible!*/
        --side-menu-spacing: 10px;
        --side-menu-first-child-extra-space: 0px;
        /* --side-menu-header-spacing: 20px; */
    }

    /* NOTE: 'nav.side_menu' is not needed because the css is component scoped anyways
        I added it because I thought the css was a too much in this file. and its a bit easier to understand.
    */

    /*   Hide scrollbar but still scroll safari   */
    nav.side_menu::-webkit-scrollbar {
        display: none;
    }
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
        /* translate: height 5s; */

        /* Hide scrollbar but still scroll crome+firefox   */
        overflow: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
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
        background-color: var(--cream);
        /* margin-block: var(--side-menu-spacing); */
        height: 8px;
    }

    .wiggle_bar {
        height: 19px;
        width: 100%;

        margin-top: -7px;
        /* margin-bottom: var(--side-menu-spacing); */
    }

    nav.side_menu button {
        /* border-radius: 30px; */
        padding-block: calc(var(--side-menu-spacing) + 10px);
        /* margin-block: var(--side-menu-spacing); */
        padding-left: 15px;
        border: unset;
        outline: unset;
        background-color: var(--cream);
        color: black;
        font-size: 3ex;
        width: 100%;
        text-align: left;
        /* margin-top: 5px; */
        /* padding-top: 10px; */
    }
    .menu_group_section {
        position: relative;
        z-index: 40;
    }
    nav.side_menu .menu_group_section:hover,
    nav.side_menu .menu_group_section:hover img,
    nav.side_menu button:hover {
        /* background-color: #7925dc; */
        background-color: var(--dark-cream);
    }

    /* nav.side_menu li:first-child > button { */
    /*     padding-top: 10px; */
    /* } */
    /* li:first-child::before:hover { */
    /*     background-color: #c971ca; */
    /* } */
    /* and the spacing on the lines to the first child of the menu group list of items */
    /* nav.side_menu ul > li:first-child { */
    /*     /* padding-inline: 2px; */
    /*     margin-top: calc( */
    /*         var(--side-menu-spacing) + var(--side-menu-first-child-extra-space) */
    /*     ); */
    /* } */

    nav.side_menu ul > li {
        /* padding-inline: 4px; */
        /* Lowkey weird the centering that the preforms, try toggling it.*/
        text-align: center;
    }

    /* @keyframes subMenuToggle { */
    /*     height: 0px; */
    /* } */
</style>
