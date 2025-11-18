<script lang="ts" module>
    import subcomponentIcon from '@icons/circuits/outputIcon.png'
    import type { menuJsonElement, menuJsonType } from '@CircuitModel'
    import { circuitSave } from '@src/App.svelte'

    export function refreshSideMenu(): void {
        menuJsonData.update(old => {
            return {
                'Logic Gates': { ...old['Logic Gates'] },
                'Input/Output': { ...old['Input/Output'] },
                'Subcomponents': {
                    svg: old.Subcomponents.svg,
                    groupElements: [
                        ...(circuitSave.getSubcomponents().map((subcircuit: string) => {
                            return { name: subcircuit, nodeType: 'Subcircuit', icon: subcomponentIcon} as menuJsonElement;
                        })),
                    ]
                },
                GhostElement: { ...old.GhostElement }
            } as menuJsonType;
        })
    }
</script>

<!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 -->
<script lang="ts">
    import SideMenuHeader from './SideMenuHeader.svelte'
    import SideMenuGroupItems from './SideMenuGroupItems.svelte'

    import {
        menuJsonData,
        type NodeMenuGroups,
    } from '@CircuitModel'

    import SketchyLineWiggle from '@assets/svg/sketchLineSvg/line_26.svg'

    import SketchyLine_15 from '@assets/svg/sketchLineSvg/line_15.svg'
    import SketchyLine_23 from '@assets/svg/sketchLineSvg/line_23.svg'
    import SketchyLine_24 from '@assets/svg/sketchLineSvg/line_24.svg'
    import SketchyLine_25 from '@assets/svg/sketchLineSvg/line_25.svg'
    import SketchyLine_27 from '@assets/svg/sketchLineSvg/line_27.svg'
    import SketchyLine_17 from '@assets/svg/sketchLineSvg/line_17.svg'
    import SketchyLine_19 from '@assets/svg/sketchLineSvg/line_19.svg'
    import SketchyLine_21 from '@assets/svg/sketchLineSvg/line_21.svg'
    import SketchyLine_29 from '@assets/svg/sketchLineSvg/line_29.svg'
    import { onMount } from 'svelte'

    // function passed down from app.svelte that will run after circuit is dropped on the canvas
    // passed further down to the SideMenuGroupItems.svelte
    let {
        createCanvasDevice,
    }: {
        createCanvasDevice: (e: MouseEvent & { gateType: string, celltype?: string }) => void
    } = $props()

    // import CollapseIcon from '../assets/icons/collapse.webp'
    const sketchyLinesMap: any = {
        line_15: SketchyLine_15,
        line_23: SketchyLine_23,
        line_24: SketchyLine_24,
        line_25: SketchyLine_25,
        line_27: SketchyLine_27,
        line_17: SketchyLine_17,
        line_19: SketchyLine_19,
        line_21: SketchyLine_21,
        line_29: SketchyLine_29,
    }

    // just a selection of ones I want for the random line under the menu items.

    const menuEntries = $derived(Object.entries($menuJsonData))
    const menuGroupNames = $derived(Object.keys($menuJsonData))

    const randomLineSelectionGroup = [15, 23, 24, 25, 27, 17, 19, 21, 29]

    // svg shouldn't be here.
    function rng(maxInt: number): number {
        return Math.floor(Math.random() * maxInt) + 1
    }

    let randomLineSelectionStore = localStorage.getItem(
        'randomLineSelectionStore'
    )

    function getSvgLineFileName(selection: number): string {
        return sketchyLinesMap[`line_${selection}`]
    }

    // IGNORE THIS CODE, if you want. its very useless.
    if (randomLineSelectionStore === null) {
        const selections: number[] = menuGroupNames.map((groupName: string) => {
            // index of possible lines to select
            const randNum = rng(randomLineSelectionGroup.length - 1)
            // number of the svg in the assets/sketchLineSvg folder.
            const selection: number = randomLineSelectionGroup[randNum]

            const svgImport = getSvgLineFileName(selection)
            $menuJsonData[groupName as NodeMenuGroups]['svg'] = svgImport

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
            const currentMenuGroup = menuGroupNames[index]
            const svgImport = getSvgLineFileName(parseInt(selection, 10))
            if (currentMenuGroup !== undefined) {
                $menuJsonData[currentMenuGroup as NodeMenuGroups]['svg'] = svgImport
            }
        })
    }

    // this could also be "instance" data for each component but this is simpler
    // if we did it the other way, we would need a $bindable() prop in groupItems
    // because the animations have to be done in this component
    let showSubMenu: boolean[] = $state(Array(menuGroupNames.length).fill(true))

    function getAnimationStyle(showMenuMap: boolean[], index: number) {
        if (!showMenuMap[index]) {
            return 'transition: max-height .4s ease-out; max-height:75px'
        } else {
            return 'transition: max-height .4s ease-in; max-height:405px'
        }
    }

    onMount(() => {
        // TODO ideally we do not have to do this
        // this is mainly done to pull subcomponents
        refreshSideMenu();
    })
</script>

<nav class="side_menu noselect" aria-label="Side Menu">
    <!-- Use <ul> and <li> for list items -->
    <div class="side_menu_header">
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
        {#each menuEntries as [key, value], index (key)}
            <li
                id="menu_group_{index}"
                style={getAnimationStyle(showSubMenu, index)}
            >
                <!-- Use a more descriptive clickable element -->
                <div class="menu_group_section">
                    <button
                        onmousedown={() => {
                            showSubMenu[index] = !showSubMenu[index]
                        }}
                        ><span style="margin-left:5%;">{key}</span
                        ></button
                    >
                    <!-- style={showSubMenu ? 'display:none' : 'display:block'} -->

                    <img
                        class="sketch_bar"
                        src={value.svg}
                        alt="sketched line bottom border for main app bar section {key}"
                    />
                </div>
                <SideMenuGroupItems
                    {createCanvasDevice}
                    zIndex={index}
                    subMenuHeader={key}
                />
            </li>
        {/each}
    </ul>
</nav>

<style>
    /* <!-- https://coolors.co/palette/9b5de5-f15bb5-fee440-00bbf9-00f5d4 --> */
    /* https://colors.artyclick.com/color-names-dictionary/color-names/bright-lime-green-color */
    :root {
        /* --side-menu-spacing is important, I reasoned through it, and there are a lot of places here to add spacing and a lot of states
            the css variable is very good/useful here.
            - The lines are the main element which creates spacing
            - when the submenu is open, the bottom of the submenu must have 'margin-bottom; var(--side-menu-spacing)'
        */
        /* Update, this is an absolute BANGER, try updating it, see how well the menu responds changing this varaible!*/
        --side-menu-spacing: 10px;
        /* --side-menu-header-spacing: 20px; */

        --side-menu-bg-dark: #242652;
        --side-menu-bg: var(--cream);
        /* Light mode defaults */
    }
    :global(.light .side_menu) {
        background-color: var(--side-menu-bg);
        /* color: black; */
    }
    :global(.dark .side_menu) {
        background-color: var(--side-menu-bg-dark);
        /* color: white; */
    }

    :global(.dark .side_menu button) {
        background-color: var(--side-menu-bg-dark);
        color: white;
    }
    :global(.light .side_menu button) {
        background-color: var(--side-menu-bg);
        color: black;
    }
    :global(.dark .side_menu .sketch_bar) {
        background-color: white !important;
        filter: invert(100%);
    }
    :global(.dark .side_menu .wiggle_bar) {
        filter: invert(100%);
    }
    :global(.light .side_menu button:hover) {
        background-color: var(--dark-cream);
    }
    :global(.dark .side_menu button:hover) {
        background-color: var(--neon-purple);
    }

    /* Header including line, vs the "SideMenuHeader Component which does not
     * include the line for some reason" */
    .side_menu_header {
        position: relative;
        z-index: 40;
        background-color: inherit;
    }

    /*   Hide scrollbar but still scroll safari   */
    nav.side_menu::-webkit-scrollbar {
        display: none;
    }
    nav.side_menu {
        /* width: 30%; */
        flex: 0 0 22.5%;
        height: 100%;
        margin-right: 6px;
        /* In order for the main canvas to render centered when the menu goes
         * away, the main container must have a padding-inline property set
         * when you set this, the padding will cause the side menu to render
         * 1.5vw units away from the left edge of the screen, this offests that
         Probably the only other alternative would be to use javascript to take
         away some css after the menu goes away
         */
        margin-left: -1.5vw;

        border: 3px solid 3px;
        box-shadow: 0px 6px 0px 6px #000000;
        /* translate: height 5s; */

        /* Hide scrollbar but still scroll crome+firefox   */
        overflow: hidden;
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
        background-color: var(--side-menu-bg);
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
        font-size: 3ex;
        width: 100%;
        text-align: left;
    }
    .menu_group_section {
        padding-top: 8px;
        position: relative;
        z-index: 40;
    }

    nav.side_menu ul > li {
        /* padding-inline: 4px; */
        /* Lowkey weird the centering that the preforms, try toggling it.*/
        text-align: center;
    }

    :global(.light nav.side_menu ul > li:last-child button:after) {
        background-color: var(--side-menu-bg);
    }
    :global(.dark nav.side_menu ul > li:last-child button:after) {
        background-color: var(--side-menu-bg-dark);
    }
    nav.side_menu ul > li:last-child button:after {
        /* padding-inline: 4px; */
        /* Lowkey weird the centering that the preforms, try toggling it.*/

        content: '';
        visibility: visible;
        display: block;
        position: absolute;
        width: 100%;
        height: 70px;
        top: 2px;
        left: 0px;
    }
    :global(.dark nav.side_menu ul > li:last-child button:hover) {
        background-color: var(--side-menu-bg-dark);
    }
    :global(.light nav.side_menu ul > li:last-child button:hover) {
        background-color: var(--side-menu-bg);
    }
    nav.side_menu ul > li:last-child img {
        /* padding-inline: 4px; */
        /* Lowkey weird the centering that the preforms, try toggling it.*/
        display: none;
    }
</style>
