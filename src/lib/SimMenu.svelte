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
        currentTick,
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
        <ResetStateIcon width={40} />
    </button>
    <button on:click={updateGatesNext}>
        <UpdateGatesNextIcon style="transform:scale(2);" width={50} />
    </button>
    <button
        on:click={runSimulation}
        style="display:flex;align-items: center;padding-block:1px;"
    >
        <div>
            {#if true}
                <!-- content here -->
                <PlayTickIcon width={40} />
            {:else}
                <PauseTickIcon width={35} />
            {/if}
        </div>
        <p id="tickNumber">{$currentTick}</p>
    </button>
    <button on:click={updateGates}>
        <UpdateGatesIcon width={40} />
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
        border: 3px solid black;
        border-radius: 5px;
        font-size: 1.8rem;
        padding-inline: 5px;
        margin-block: 4px;
    }
    .menuRunButtons button {
        padding: 8px;
        margin-inline: 5px;
        border-radius: 5px;
        max-height: 70px;
    }
</style>
