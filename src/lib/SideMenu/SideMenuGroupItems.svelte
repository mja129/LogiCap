<script lang="ts">
    import AndIcon from '../../assets/icons/circuits/And.webp'
    import BufferIcon from '../../assets/icons/circuits/Buffer.webp'
    import OrIcon from '../../assets/icons/circuits/Or.webp'
    import NorIcon from '../../assets/icons/circuits/Nor.webp'

    import XorIcon from '../../assets/icons/circuits/Xor.webp'
    import XnorIcon from '../../assets/icons/circuits/Xnor.webp'
    import NandIcon from '../../assets/icons/circuits/Nand.webp'
    import NotIcon from '../../assets/icons/circuits/Not.webp'
    import { onDestroy, onMount } from 'svelte'
    import { menuJsonData } from './menu.ts'
    import type { menuJsonElement } from './menu.ts'
    import { circuitStore } from '../stores/circuitStore'

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
    let {
        zIndex = 0,
        createCanvasNode,
        subMenuHeader = 'Logic Gates',
    }: {
        showSubMenu?: boolean
        zIndex: number
        createCanvasNode: (e: any) => void
        subMenuHeader?: string
    } = $props()

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

    interface GateItem {
        gateType: string
        label: string
        image: string
    }

    // why this?
    // yeah this should be replaced with the menu.ts
    // depending in the title prop passed in, use that json representation
    const menuItems: Array<menuJsonElement> =
        menuJsonData[subMenuHeader]['groupElements']

    let draggingItem: menuJsonElement | null = null
    let ghostElement: HTMLElement | null = null

    function createGhost(
        item: menuJsonElement,
        pageX: number,
        pageY: number
    ): void {
        ghostElement = document.createElement('div')
        ghostElement.className = 'drag-ghost'
        ghostElement.style.position = 'fixed'
        ghostElement.style.pointerEvents = 'none'
        ghostElement.style.left = pageX + 'px'
        ghostElement.style.top = pageY + 'px'
        ghostElement.style.zIndex = '200'
        ghostElement.style.transform = 'translate(-50%, -50%)'

        const img = document.createElement('img')
        img.src = item.icon
        img.alt = item.name.toLowerCase() + 'drag gate ghost'
        img.style.width = '82px'
        img.style.opacity = '0.7'
        ghostElement.appendChild(img)

        document.body.appendChild(ghostElement)
    }

    function updateGhostPosition(pageX: number, pageY: number): void {
        if (ghostElement) {
            ghostElement.style.left = pageX + 'px'
            ghostElement.style.top = pageY + 'px'
        }
    }

    function removeGhost(): void {
        if (ghostElement) {
            ghostElement.remove()
            ghostElement = null
        }
    }

    function handleMouseDown(item: menuJsonElement, event: MouseEvent): void {
        event.preventDefault()
        draggingItem = item
        createGhost(item, event.pageX, event.pageY)
    }

    function handleMouseMove(event: MouseEvent): void {
        if (ghostElement) {
            updateGhostPosition(event.pageX, event.pageY)
        }
    }

    function handleGlobalClick(event: MouseEvent): void {
        if (draggingItem && ghostElement) {
            const dropTarget = document.elementFromPoint(
                event.clientX,
                event.clientY
            )
            updateGhostPosition(event.pageX, event.pageY)

            const droppedOnCanvas =
                dropTarget?.classList.contains('svelvet-wrapper')

            if (droppedOnCanvas) {
                let e: any = {
                    gateType: draggingItem.name.toLowerCase(),
                }
                // const svelvetCanvas: HTMLElement | null =
                //     document.querySelector('.svelvet-wrapper')

                // const bgWrapper: HTMLElement | null = document.querySelector(
                //     '.background-wrapper'
                // )
                // const graphWrapper: HTMLElement | null = document.querySelector(
                //     '.svelvet-graph-wrapper'
                // )

                createCanvasNode(e)
            }

            draggingItem = null
            removeGhost()
            event.stopPropagation()
        }
    }

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('click', handleGlobalClick)
    })

    onDestroy(() => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleGlobalClick)
        removeGhost()
    })
    // This component really shouldn't be an ordered list that's so stupid

    // Group items should be in an each block, images need to be passed from an
    // array or json object
    // style={showSubMenu ? 'display: none' : 'display: grid'}
</script>

<ol style={`z-index:${zIndex};`} class="side_menu_group" id="section_{zIndex}">
    {#each menuItems as item}
        <li>
            <button
                class="gate-button"
                onmousedown={(event) => handleMouseDown(item, event)}
                style="background:none; border:none; padding:0; cursor:pointer;"
            >
                <img src={item.icon} alt="{item.name} logic gate, hand-drawn" />
                {item.name}
            </button>
        </li>
    {/each}
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
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
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
    img {
        width: 82px;
        margin-bottom: -6px;
        margin-top: 3px;
    }
    :global(.light .side_menu_group, .light .side_menu_group li) {
        background-color: var(--side-menu-bg);
        color: black;
    }

    :global(.dark .drag-ghost img) {
        filter: invert(100%);
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
