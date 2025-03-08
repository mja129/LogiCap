<script lang="ts">
    import AndIcon from '../../assets/icons/circuits/And.webp'
    import BufferIcon from '../../assets/icons/circuits/Buffer.webp'
    import OrIcon from '../../assets/icons/circuits/Or.webp'
    import NorIcon from '../../assets/icons/circuits/Nor.webp'

    import XorIcon from '../../assets/icons/circuits/Xor.webp'
    import XnorIcon from '../../assets/icons/circuits/Xnor.webp'
    import NandIcon from '../../assets/icons/circuits/Nand.webp'
    import NotIcon from '../../assets/icons/circuits/Not.webp'
    import { onMount } from 'svelte'

    // Add A drag / mousedown listener to here.
    // make a mouseup listener inside of the mousedown listener and see which
    // html element you dropped the element on
    // Maybe svelte drag drop actions, has something for this.
    // Tell the global store like it is in AndGate.svelte right now
    // Don't worry about actually rendering them in the canvas for now. just
    // make them here after dropping a menu item.
    // Don't let this confuse you but we will probably need
    // <svelte:component this={globalStore.circuitList}> to do this in app.svelte

    // this will be a required prop but it is optional right now.
    let { showSubMenu, zIndex = 0 }: { showSubMenu?: boolean; zIndex: number } =
        $props()

    let sectionHeight: number = $state(0)

    // document.addEventListener('DOMContentLoaded', () => {
    //     const head: HTMLElement | null = document.querySelector(
    //         `#section_${zIndex}`
    //     )
    //     if (head) {
    //         sectionHeight = head.offsetHeight
    //         // sectionHeight = head.clientHeight
    //         // console.log(sectionHeight)
    //     }
    // })

    // This component really shouldn't be an ordered list that's so stupid

    // Group items should be in an each block, images need to be passed from an
    // array or json object
    // style={showSubMenu ? 'display: none' : 'display: grid'}
</script>

<ol style={`z-index:${zIndex};`} class="side_menu_group" id="section_{zIndex}">
    <li>
        <!--Should be figure and figcaption html elements I think -->
        <img
            style="width: 82px;margin-top: 3px;"
            src={NotIcon}
            alt="And logic gate, hand-drawn"
        />
        Not
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={BufferIcon}
            alt="And logic gate, hand-drawn"
        />
        Repeater
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={AndIcon}
            alt="And logic gate, hand-drawn"
        />
        And
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={NandIcon}
            alt="And logic gate, hand-drawn"
        />
        Nand
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={OrIcon}
            alt="And logic gate, hand-drawn"
        />
        Or
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={NorIcon}
            alt="And logic gate, hand-drawn"
        />
        Nor
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={XorIcon}
            alt="And logic gate, hand-drawn"
        />
        Xor
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={XnorIcon}
            alt="And logic gate, hand-drawn"
        />
        Xnor
    </li>
</ol>

<style>
    .side_menu_group {
        position: relative;
        list-style-type: none;
        /* transform: translateY(-300px); */
        /* margin-left: 40px; */

        /* Grid Fallback */
        /* display: flex;
        flex-wrap: wrap; */

        /* Supports Grid */
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
        /* grid-auto-rows: minmax(100px, auto); */
        grid-gap: 10px;
        padding-inline: 10px;
        padding-top: calc(var(--side-menu-spacing));
        /* margin-top: -10px; */
        /* Roughly centered relative to the next title same as * .9 right?*/
        /* needs to account for the outline's on hover, because outline does not take up space, so it will overlap. */
        padding-bottom: 4px;

        /*    hide scrollbars     */
    }
    :global(.light .side_menu_group, .light .side_menu_group li) {
        background-color: var(--side-menu-bg);
        color: black;
    }
    :global(.dark .side_menu_group, .dark .side_menu_group li) {
        background-color: var(--side-menu-bg-dark);
        color: white;
    }

    :global(.dark .side_menu_group li img) {
        filter: invert(100%);
    }

    .side_menu_group li {
        /* z-index: -2; */
        /* background-color: var(--blue); */
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        border-radius: 20px;
        border: 2px solid black;
        /* box-shadow: 4px 4px 0px 0px #000000; */
    }

    .side_menu_group li:hover {
        border: 2px solid transparent;
        outline: 4px solid red;
    }
</style>
