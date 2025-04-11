<script lang="ts">
    import type { Component } from 'svelte'

    import { CircuitStore, saveCircuit, backupDelete } from '@CircuitStore'
    import {
        toggleSimulation,
        updateNext,
        updateTick,
        getRunning,
        getCurrTick,
        resetCircuit,
    } from '@CircuitEngine'

    // Instructions for gabe
    // Create a div element on line 82 of app.svelte
    // the element should be OUTSIDE the svelvet canvas
    // this element should be a textbox that inputs the current name of the circuit.
    // it should be an 'position: absolute' item, to the left of the minimap on the top left of the screen
    // it should bind to a $state variable so you know the name of the circuit when you save it.
    // use the existing save button. (the one before the trash)
    // replace its listener 'saveCircuit' with the code that you wrote to write the file to the users subsystem

    // make it so that when you hit save in simMenu, it will know the name passed into the texbox element we created above,
    // it will know this by more "props" to the line `let { clearCanvas }: { clearCanvas: Function } = $props()`
    // the prop should probably just be 'currCircuitName' or something like that.
    // make sure to save the file as formatted json, and with a .json extension
    // don't show .json in the circuit label you created. (just append the .json on after they hit save)

    // Loading in a circuit.
    // make a new button in sim-Menu that prompt a user to input a file
    // use the JS api to open the system file picker. restrict the search to ".json" files only
    // find an icon for it!!! https://icones.js.org/ (We literally have access to 400,000.)
    // If you look at app.svelte around line 40 in on mount:
    //
    // loadCircuit() // load circuit from LS into CircuitStore,
    // currentDevicesData = $CircuitStore.devices

    // Get the data from the file and turn it into text. (but it's probably already text after you get it into memory)
    // delete the existing one / clear the screen (for now) (onTrash())
    // run loadCircuit(fileText)
    // It will throw an error if it's not in the right format.
    // Probably should just log, so the app doesn't shit itself if that happens. check out circuitStore/validateSavedCircuit(savedCircuit: any)
    // Check out what the clearCanvas prop does. It basically mutates the device's object in app.svelte from the sim menu remotely. by passing in a function that clears the array in that app.svelte file
    // I would probably just make another one of those that sets on load, and pass it in as a prop, just to keep things consistent, even though there's maybe a more straightforward way.
    // so in app.svelte have an arrow function:
    // Ex: setCanvasDevices = (d: Devices) => (currentDevicesData = d)
    // which you pass into SimMenu via props.
    // then on the load circuit from file button just run load with the file text and setCanvasDevices with $CircuitStore.devices

    import UpdateGatesNextIcon from '~icons/streamline/button-fast-forward-2'
    import PlayTickIcon from '~icons/streamline/button-play'
    import ResetStateIcon from '~icons/streamline/interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload'
    import PauseTickIcon from '~icons/streamline/button-pause-2'
    import UpdateGatesIcon from '~icons/streamline/entertainment-control-button-next-button-television-buttons-movies-skip-next-video-controls'
    import SaveIcon from '~icons/lucide/save'
    import TrashIcon from '~icons/material-symbols/delete-outline'
    // import ButtonNode from '../Circuits/InputOutputNodes/ButtonNode.svelte'

    type Icon = { Component: Component<any>; styles: string; width: number }
    type IconName = string

    type SimMenuModel = Record<IconName, Icon>

    let { clearCanvas }: { clearCanvas: Function } = $props()

    const simMenuModel: SimMenuModel = {
        playTick: {
            Component: PlayTickIcon,
            styles: 'transform:scale(1.8);',
            width: 40,
        },
        pauseTick: {
            Component: PauseTickIcon,
            styles: 'transform:scale(1.8);',
            width: 40,
        },
        updateGates: {
            Component: UpdateGatesIcon,
            styles: 'transform:scale(2);',
            width: 40,
        },
        updateGatesNext: {
            Component: UpdateGatesNextIcon,
            styles: 'transform:scale(2.3);',
            width: 50,
        },
        resetState: {
            Component: ResetStateIcon,
            styles: 'transform:scale(2);',
            width: 40,
        },
        save: {
            Component: SaveIcon,
            styles: 'transform:scale(2.4);',
            width: 30,
        },
        trash: {
            Component: TrashIcon,
            styles: 'transform:scale(2.69);',
            width: 30,
        },
    }

    const toggleRunningClass = () => {
        const appMainTag: Element | null = document.querySelector('#logicap')
        if (!appMainTag) return // impossible

        if (appMainTag.classList.contains('running')) {
            appMainTag.classList.remove('running')
            turnOffLamps()
        } else {
            appMainTag.classList.add('running')
        }
    }

    function turnOffLamps() {
        let circleElement: SVGElement | null
        let lineElement: SVGElement | null
        const lampOffColors: string[] = ['red', 'var(--lime-red)']
        const lamps: NodeListOf<HTMLElement> | null =
            document.querySelectorAll("[id^='N-Lamp']")
        if (lamps === null) {
            return
        }
        lamps.forEach((lamp) => {
            circleElement = lamp.querySelector('circle')
            lineElement = lamp.querySelector('line')
            if (circleElement === null || lineElement === null) return
            circleElement.setAttribute('stroke', lampOffColors[1])
            circleElement.setAttribute('fill', lampOffColors[0])
            lineElement.setAttribute('stroke', lampOffColors[0])
        })
    }

    function toggleRunSim(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        toggleRunningClass()
        toggleSimulation(10)
    }

    function updateGatesNext(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        updateNext()
    }
    function updateGates(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        updateTick()
    }

    function onTrash() {
        backupDelete()

        CircuitStore.reset()

        // clears the currentDevicesData variable in app.svelte
        clearCanvas()
    }

    // const defaultOptions: any =
</script>

{#snippet simIcon({ ...iconProps })}
    <iconProps.Component style={iconProps.styles} width={iconProps.width} />
{/snippet}

<!-- Render  -->
{#snippet simMenuBtn(
    iconProps: Icon,
    onClickFn: Function,
    btnStyles: string = ''
)}
    <button style={btnStyles} onclick={() => onClickFn()} width={iconProps.width}>
        {@render simIcon(iconProps)}
    </button>
{/snippet}

{#snippet playPauseSection(simToggle: Function)}
    <button
        onclick={() => simToggle()}
        style="display:flex;align-items: center;padding-block:1px;"
    >
        <div style="margin-left: -8px">
            {#if getRunning()}
                {@render simIcon(simMenuModel['pauseTick'])}
            {:else}
                {@render simIcon(simMenuModel['playTick'])}
            {/if}
        </div>
        <p
            style={getRunning() ? 'border-color:green' : 'border-color:red'}
            id="tickNumber"
        >
            {getCurrTick()}
        </p>
    </button>
{/snippet}

<div class="menuRunButtons">
    {@render playPauseSection(toggleRunSim)}
    <span class="vl"></span>
    {@render simMenuBtn(simMenuModel['updateGates'], updateGates)}
    <span class="vl"></span>
    {@render simMenuBtn(simMenuModel['updateGatesNext'], updateGatesNext)}

    <span class="vl"></span>
    {@render simMenuBtn(simMenuModel['resetState'], resetCircuit)}
    <span style="margin-right: 7px" class="vl"></span>
    {@render simMenuBtn(simMenuModel['save'], saveCircuit)}
	<span style="margin-right: 7px" class="vl"></span>
    {@render simMenuBtn(simMenuModel['trash'], onTrash, 'margin-left: -6px')}
</div>

<style>
    .menuRunButtons {
        position: absolute;
        /*    the side menu width should be 22.5% of the main app flexbox */
        transform: scale(0.75);
        left: calc(22.5% - 45px);
        top: 2px;
        z-index: 300;
        display: flex;
        align-items: stretch;
        padding-inline: 5px;
        padding-block: 0px;
        justify-content: space-evenly;
        background-color: var(--lightblue);
        border-radius: 5px;
        border: 3px solid black;
    }

    .vl {
        border: 1px solid black;
        border-radius: 4px;
        background-color: var(--lightblue);
        width: 5px;
        margin-block: 4px;
    }
    .menuRunButtons p {
        background-color: white;
        text-align: right;
        border: 3px solid black;
        border-radius: 5px;
        font-size: 1.8rem;
        padding-inline: 5px;
        min-width: 80px;
        margin-block: 4px;
    }
    .menuRunButtons button {
        padding: 8px;
        margin-inline: 0px;
        max-height: 70px;
        border: none;
        background-color: var(--lightblue);
    }
    :global(.menuRunButtons button:hover svg) {
        color: red;
    }
</style>
