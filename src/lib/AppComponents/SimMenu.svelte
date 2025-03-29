<script lang="ts">
    import type { Component } from 'svelte'

    import { resetCircuitStore, saveCircuit, backupDelete } from '@CircuitStore'
    import {
        toggleSimulation,
        updateNext,
        updateTick,
        getRunning,
        getCurrTick,
        resetCircuit,
    } from '@CircuitEngine'

    import UpdateGatesNextIcon from '~icons/streamline/button-fast-forward-2'
    import PlayTickIcon from '~icons/streamline/button-play'
    import ResetStateIcon from '~icons/streamline/interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload'
    import PauseTickIcon from '~icons/streamline/button-pause-2'
    import UpdateGatesIcon from '~icons/streamline/entertainment-control-button-next-button-television-buttons-movies-skip-next-video-controls'
    import SaveIcon from '~icons/lucide/save'
    import TrashIcon from '~icons/material-symbols/delete-outline'

    type Icon = { Component: Component<any>; styles: string; width: number }
    type IconName = string

    type SimMenuModel = Record<IconName, Icon>

    let { clearCanvas }: { clearCanvas: Function } = $props()

    // if I could make this a snippet map that would be cool.
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
            width: 40,
        },
        trash: {
            Component: TrashIcon,
            styles: 'transform:scale(2.69);',
            width: 40,
        },
    }

    const toggleRunningClass = () => {
        const appMainTag: Element | null =
            document.querySelector('main#joplysim')
        if (!appMainTag) return // impossible

        if (appMainTag.classList.contains('running')) {
            appMainTag.classList.remove('running')
        } else {
            appMainTag.classList.add('running')
        }
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

        resetCircuitStore()

        // clears the currentDevicesData variable in app.svelte
        clearCanvas()
    }

    // const defaultOptions: any =
</script>

{#snippet simIcon(iconProps: Icon)}
    <iconProps.Component style={iconProps.styles} width={iconProps.width} />
{/snippet}

{#snippet simMenuBtn(
    iconProps: Icon,
    onClickFn: Function,
    btnStyles: string = '',
    vlStyles: string = '',
    includeVL: boolean = true
)}
    {#if includeVL}
        <span style={vlStyles} class="vl"></span>
    {/if}
    <button style={btnStyles} onclick={() => onClickFn()}>
        {@render simIcon(iconProps)}
    </button>
{/snippet}

{#snippet playPauseSection()}
    <button
        onclick={toggleRunSim}
        style="display:flex;align-items: center;padding-block:1px;"
    >
        <div style="margin-left: -8px">
            {#if getRunning()}
                <!-- content here -->
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
    {@render playPauseSection()}
    {@render simMenuBtn(simMenuModel['updateGates'], updateGates)}
    {@render simMenuBtn(simMenuModel['updateGatesNext'], updateGatesNext)}

    {@render simMenuBtn(simMenuModel['resetState'], resetCircuit)}
    {@render simMenuBtn(
        simMenuModel['save'],
        saveCircuit,
        '',
        'margin-right: 7px',
        true
    )}
    {@render simMenuBtn(
        simMenuModel['trash'],
        onTrash,
        'margin-left: -6px',
        '',
        false
    )}
</div>

<style>
    .menuRunButtons {
        position: absolute;
        /*    the side menu width should be 22.5% of the main app flexbox */
        transform: scale(0.75);
        left: calc(22.5% - 38px);
        top: 2px;
        z-index: 300;
        display: flex;
        align-items: stretch;
        padding-inline: 5px;
        padding-block: 0px;
        justify-content: space-evenly;
        background-color: lightblue;
        border-radius: 5px;
        border: 3px solid black;
    }

    .vl {
        border: 1px solid black;
        border-radius: 4px;
        background-color: lightblue;
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
        background-color: lightblue;
    }
    :global(.menuRunButtons button:hover svg) {
        color: red;
    }
</style>
