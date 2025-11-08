<!-- I like doing this global store here because of the locality -->
<script module lang="ts">
    import { writable, type Writable } from 'svelte/store'
    export let settingsStore: Writable<any> = writable({
        wireType: localStorage.getItem('wireType') || 'step',
        theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
        useTapUpdate: JSON.parse(
            localStorage.getItem('useTapUpdate') || 'true'
        ),
        useCarry: JSON.parse(localStorage.getItem('useCarry') || 'true'),
    })
</script>

<script>
    import SettingsIcon from '~icons/material-symbols/settings-outline'
    // modal menu that lets you toggle the wire type.
    // change the theme
    // let settingsVisible = false
    let show = $state(false)
    // $inspect($settingsStore).with(console.log)

    let hasKitty = $state(false)
    settingsStore.subscribe((currStore) => {
        localStorage.setItem('wireType', currStore.wireType)
    })
    $effect(() => {
        localStorage.setItem('useCarry', $settingsStore.useCarry)
        localStorage.setItem('useTapUpdate', $settingsStore.useTapUpdate)
    })
    let activeWireType = $state($settingsStore.wireType)
</script>

<div
    class="wireTypeSelect"
    style="display: flex;flex-direction:column;align-items:flex-end;"
>
    <button
        class="wire-btn wire-bez"
        class:activeType={$settingsStore.wireType === 'bezier'}
        onclick={() => {
            $settingsStore.wireType = 'bezier'
        }}
    >
        Curve
    </button>
    <button
        class="wire-btn wire-step"
        class:activeType={$settingsStore.wireType === 'step'}
        onclick={() => {
            $settingsStore.wireType = 'step'
        }}
    >
        Step
    </button>
    <button
        class="wire-btn wire-str"
        class:activeType={$settingsStore.wireType === 'straight'}
        onclick={() => {
            $settingsStore.wireType = 'straight'
        }}
    >
        Straight
    </button>
</div>

<button class="launch-button" onclick={() => (show = !show)}>
    <SettingsIcon height={30} width={30} />
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

        <div
            style="display: flex;flex-direction: column;align-items:flex-start;margin-bottom:-5px"
        >
            <label style="display:flex;align-items:center">
                <input
                    style="margin-right:5px;margin-top:2px"
                    type="checkbox"
                    bind:checked={$settingsStore.useTapUpdate}
                />
                Tap Anchor to Update Wire Type
            </label>
            <label style="display:flex;align-items:center">
                <input
                    style="margin-right:5px;margin-top:2px"
                    type="checkbox"
                    bind:checked={$settingsStore.useCarry}
                />Carry Over Wire types
            </label>
        </div>

        <div
            style="display:flex;flex-direction: row;justify-content: space-between;width: 100%;margin-bottom:-25px;margin-top:5px;"
        >
            <button
                class="kittyBtn"
                onclick={() => {
                    const kittyElement: HTMLElement | null =
                        document.querySelector('#kitty')
                    // if the kitty has not been spawned before.
                    if (kittyElement) {
                        if (hasKitty) {
                            kittyElement.style.display = 'none'
                            // kittyElement.remove()
                            hasKitty = false
                        } else {
                            kittyElement.style.display = 'unset'
                            hasKitty = true
                        }
                    } else {
                        // create the element for the first time

                        // This function is injected into the code via, index.html
                        // @ts-ignore
                        herekittykittykitty('Furnando')
                        hasKitty = true
                    }
                }}>{hasKitty ? 'Despawn Kitty' : 'KITTY'}</button
            >
            <button
                class="closeBtn"
                onclick={(e: MouseEvent) => {
                    e.stopPropagation()
                    show = false
                }}>Close Menu</button
            >
        </div>
        <br />
    </div>
{/if}

<style>
    :root {
        --settings-menu-spacing: 5px;
    }
    .wire-btn {
        cursor: pointer;
    }
    .wire-btn:hover:not(.activeType) {
        color: var(--pitt-yellow);
    }
    .activeType {
        color: red;
    }
    .wireTypeSelect {
        position: absolute;
        right: 10px;
        bottom: 50px;
        z-index: 20;
    }
    .wireTypeSelect button {
        background-color: transparent;
        border: none;
        outline: none;
    }
    .launch-button {
        cursor: pointer;
        border-width: 4px;
        border-radius: 999px;
        position: absolute;
        background-color: var(--lightblue);
        transform: scale(0.8);
        padding: var(--settings-menu-spacing);
        right: 0px;
        bottom: 0px;
        z-index: 20;
        /* width: 20px; */
        /* height: 20px; */
    }
    .modal {
        border: 5px solid black;
        border-radius: 10px;
        padding: 10px;
        background: var(--lightblue);
        width: 300px;
        z-index: 20;
        position: absolute;
        top: 45%;
        left: calc(50% + 100px);
        transform: translate(-50%, -50%);
    }
    .modal h2 {
        font-size: 2rem !important;
        color: black;
        -webkit-text-stroke: unset;
        transform: translateY(-13px);
        margin-bottom: -20px;
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
    .kittyBtn {
        /* float is a magic property and the conditions for it working are determined by a higher power.*/
        padding: 2px;
        margin-top: calc(var(--settings-menu-spacing) + 2px);
    }
    .closeBtn {
        margin-top: calc(var(--settings-menu-spacing) + 2px);
        margin-right: -4px;
        padding-inline: 3px;
    }
</style>
