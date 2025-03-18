<script lang="ts">
    import UpdateGatesNextIcon from '~icons/streamline/button-fast-forward-2'
    import PlayTickIcon from '~icons/streamline/button-play'
    import UpdateGatesIcon from '~icons/streamline/interface-arrows-synchronize-arrows-loading-load-sync-synchronize-arrow-reload'
    import PauseTickIcon from '~icons/streamline/button-pause-2'
    import ResetStateIcon from '~icons/streamline/entertainment-control-button-next-button-television-buttons-movies-skip-next-video-controls'
    import {
        toggleSimulation,
        updateNext,
        updateTick,
        getRunning,
        getCurrTick,
    } from './circuitEngine.svelte'

    let { simulationPlaying = false }: { simulationPlaying?: boolean } =
        $props()

    function runSimulation(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
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
</script>

<div class="menuRunButtons">
    <button>
        <ResetStateIcon style="transform:scale(1.5);" width={40} />
    </button>
    <button onclick={updateGatesNext}>
        <UpdateGatesNextIcon style="transform:scale(2);" width={50} />
    </button>
    <button
        onclick={runSimulation}
        style="display:flex;align-items: center;padding-block:1px;"
    >
        <div style="margin-left: -4px">
            {#if getRunning()}
                <!-- content here -->
                <PauseTickIcon style="transform:scale(1.5);" width={40} />
            {:else}
                <PlayTickIcon style="transform:scale(1.5);" width={40} />
            {/if}
        </div>
        <p
            style={getRunning() ? 'border-color:green' : 'border-color:red'}
            id="tickNumber"
        >
            {getCurrTick()}
        </p>
    </button>
    <button onclick={updateGates}>
        <UpdateGatesIcon style="transform:scale(1.5);" width={40} />
    </button>
</div>

<style>
    .menuRunButtons {
        position: absolute;
        /*    the side menu width should be 22.5% of the main app flexbox */
        left: calc(22.5% + 15px);
        top: 15px;
        z-index: 300;
        display: flex;
        align-items: stretch;
        padding-inline: 5px;
        padding-block: 7px;
        justify-content: space-between;
        background-color: lightblue;
        border-radius: 5px;
        border: 3px solid black;
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
        margin-inline: 5px;
        border-radius: 5px;
        max-height: 70px;
    }
</style>
