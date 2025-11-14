<script lang="ts" module>
    import AddTab from '~icons/material-symbols/tab-new-right-outline-rounded'
    import { CircuitStore, loadCircuit, saveCircuit } from '@CircuitStore'
    import { createSubcomponent, deleteSubcomponent, getSubcomponents } from '@src/App.svelte'
    import { refreshSideMenu } from '@AppComponents/SideMenu/SideMenu.svelte'

    const primaryTabName = 'primary circuit';
</script>

<script lang="ts">
    import { renameSubcomponent } from '@src/App.svelte'

    let {
        clearDeviceData,
        setDeviceData,
    }: {
        clearDeviceData: Function
        setDeviceData: Function
    } = $props();

    let currentTabs: string[] = $derived(getSubcomponents());
    let currentTab: string = $state(localStorage.getItem('currActiveTab') || primaryTabName);

    function createTab(): void {
        const nextTabId = getSubcomponents()
            .map((tab: string) => {
                const match = tab.match(/^sub_(\d+)$/);
                return match ? parseInt(match[1]) : null;
            })
            .filter((num: number | null) => num !== null)
            .reduce((a, b) => a > b ? a : b, 0) + 1;
        createSubcomponent(`sub_${nextTabId}`);
        refreshSideMenu();
    }

    async function deleteTab(tabName: string): Promise<void> {
        if (!currentTabs.includes(tabName)) {
            alert(`Subcomponent '${tabName}' not found!`);
            return;
        }

        // if the deleted tab is the current tab, switch to the primary tab
        if (currentTab === tabName) {
            // TODO need to await?
            await setCurrentTab(primaryTabName);
        }

        // delete the subcomponent
        deleteSubcomponent(tabName);
        refreshSideMenu();
    }

    // TODO this function (or what it does) should be somewhere else
    async function setCurrentTab(tabName: string): Promise<void> {
        if (currentTab === tabName) { // no need to do anything
            return;
        }

        // ensure new circuit exists
        let loadedCircuit = localStorage.getItem(tabName);
        if (loadedCircuit === null) {
            alert(`Subcomponent '${tabName}' not found!`);
            return;
        }

        // save the circuit
        await saveCircuit();
        const newSave = localStorage.getItem('circuitStoreSave');
        if (!newSave) {
            console.log("Empty after trying to save (this should not happen!)");
            return;
        }
        localStorage.setItem(currentTab, newSave);

        // load the new circuit
        localStorage.setItem('circuitStoreSave', loadedCircuit)
        loadCircuit();
        setDeviceData($CircuitStore.devices);

        // ready to go, update current tab
        currentTab = tabName
        localStorage.setItem('currActiveTab', tabName)
    }

    // tab being edited
    let editingTab = $state<string | null>(null);
    // new name for tab being edited
    let tabNewName = $state<string>('');

    function startEditing(tabName: string) {
        editingTab = tabName;
        tabNewName = tabName;
    }

    function cancelEditing(): void {
        editingTab = null;
        tabNewName = '';
    }

    function commitRename(): void {
        if (!editingTab) {
            alert("There is no tab being edited! ");
            return;
        }

        const newTabName = tabNewName.trim();
        if (!newTabName) {
            return;
        }

        if (currentTabs.includes(newTabName)) { // this tab already exists
            if (editingTab === newTabName) { // the user kept the tab name the same
                cancelEditing();
            } else {
                alert('Subcomponent name already exists! Please choose a different name.');
            }
            return;
        }

        // update subcomponent
        renameSubcomponent(editingTab, newTabName);
        refreshSideMenu();

        // update current tab if necessary
        if (editingTab === currentTab) {
            currentTab = newTabName;
            localStorage.setItem('currActiveTab', newTabName);
        }

        // reset for next rename
        cancelEditing();
    }

</script>

<div class="tabs">
    <div class="scrollable-tabs">
        <div class="tab-item">
            <button
                type="button"
                class="tab-title {currentTab === primaryTabName ? 'tab-selected' : ''}"
                onclick={async () => await setCurrentTab(primaryTabName)}
            >
                {primaryTabName}
            </button>
        </div>
        {#each currentTabs as tabName, index (tabName + index)}
            <div class="tab-item {currentTab === tabName ? 'tab-selected' : ''}">
                {#if editingTab === tabName}
                    <input
                        type="text"
                        bind:value={tabNewName}
                        onkeydown={(event: KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                commitRename();
                            } else if (event.key === 'Escape') {
                                cancelEditing();
                            }
                        }}
                        onblur={cancelEditing}
                    /> 
                {:else}
                    <button
                        type="button"
                        class="tab-title"
                        onclick={async () => await setCurrentTab(tabName)}
                        ondblclick={() => startEditing(tabName)}
                    >
                        {tabName}
                    </button>
                {/if}
                <button
                    type="button"
                    class="delete-btn"
                    onclick={() => deleteTab(tabName)}
                    title="Delete Tab"
                >
                    ×
                </button>
            </div>
        {/each}
    </div>
    <button type="button" class="new-tab-btn" onclick={createTab}>
        <AddTab />
    </button>
</div>

<style>
    .tabs {
        position: absolute;
        right: calc(120px);
        top: 8px;
        z-index: 20;
        display: flex; /* Use flexbox for alignment */
        align-items: center;
        background-color: var(--lightblue);
        border-radius: 5px;
        border: 3px solid black;
        padding: 5px;
    }
    .scrollable-tabs {
        display: flex;
        overflow-x: auto;
        /* Dynamically resize based on number of tabs but max out at 3 tabs wide */
        max-width: calc(
            3 * 130px + 2 * 8px
        ); /* Up to 3 tabs (150px width, 8px margin) */
        /* Hide scrollbar */
        -ms-overflow-style: none; /* For Internet Explorer and Edge */
        scrollbar-width: none; /* For Firefox */
    }
    .scrollable-tabs::-webkit-scrollbar {
        display: none; /* For Chrome, Safari, and Opera */
    }
    .tab-item {
        display: flex;
        align-items: center;
        margin-right: 8px; /* Spacing between tabs */
        white-space: nowrap;
        flex: none; /* Prevent the tabs from shrinking */
    }
    .tab-title {
        padding: 4px 12px; /* Padding adjusts the "clickable" area */
        border-radius: 25px;
        cursor: pointer;
        background-color: var(--lightblue);
        border: 2px solid black;
        font-size: 14px; /* Adjust text size as needed */
        text-align: center; /* Keep text centered */
    }
    .tab-title:hover, .tab-selected {
        filter: brightness(90%);
    }
    .delete-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        margin-left: 4px;
        font-size: 16px;
        color: #900;
    }
    .delete-btn:hover {
        color: red;
    }
    .new-tab-btn {
        flex-shrink: 0; /* Prevent shrinking */
        margin-left: auto; /* Push the button to the far right */
        border: none;
        width: 30px;
        height: 30px;
        background-color: transparent;
    }
    .new-tab-btn :global(svg) {
        display: block;
        margin: auto;
        height: 100%;
        width: 100%;
    }
    input[type='text'] {
        border-radius: 25px;
        padding: 4px 12px;
        border: 1px solid #ccc;
        outline: none;
        width: auto; /* Allow input to size based on its content */
        box-sizing: border-box;
    }
</style>
