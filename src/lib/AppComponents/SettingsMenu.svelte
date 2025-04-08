<!-- I like doing this global store here because of the locality -->
<script module lang="ts">
    import { writable, type Writable } from 'svelte/store'
    export let settingsStore: Writable<any> = writable({
        wireType: 'bezier',
        theme: 'light',
    })
</script>

<script>
    import SettingsIcon from '~icons/streamline/button-fast-forward-2'
    // modal menu that lets you toggle the wire type.
    // change the theme
    // let settingsVisible = false
    let show = $state(false)
    // $inspect($settingsStore).with(console.log)
</script>

<button class="launch-button" onclick={() => (show = !show)}>
    <SettingsIcon />
</button>
{#if show}
    <div class="modal">
        <h2>Settings</h2>

        <div style="display:flex;justify-content:center;align-items:center;">
            <p style="margin-right:auto">Default Wires:</p>

            <!-- Icons under the option would be cool -->
            <select id="wire-type-select" bind:value={$settingsStore.wireType}>
                <option value="bezier">Bezier</option>
                <option value="step">Step</option>
                <option value="straight">Straight</option>
            </select>
        </div>

        <div>
            <p>Theme:</p>
            <select id="theme-select" bind:value={$settingsStore.theme}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>

        <button onclick={() => (show = false)}>Close</button>
    </div>
{/if}

<style>
    :root {
        --settings-menu-spacing: 5px;
    }
    .launch-button {
        position: absolute;
        background-color: gray;
        padding: var(--settings-menu-spacing);
        right: 10px;
        bottom: 10px;
        z-index: 20;
        /* width: 20px; */
        /* height: 20px; */
    }
    .modal {
        border: 5px solid black;
        border-radius: 10px;
        padding: 10px;
        background: var(--lightblue);
        z-index: 20;
        width: 200px;
        position: absolute;
        top: 45%;
        left: calc(50% + 100px);
        transform: translate(-50%, -50%);
    }
    .modal div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal div p {
        margin-right: auto;
    }
    .modal select {
        width: 40%;
    }
    .modal button {
        /* float is a magic property and the conditions for it working are determined by a higher power.*/
        margin-top: calc(var(--settings-menu-spacing) + 2px);
        float: right;
    }
</style>
