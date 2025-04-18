<script lang="ts">
    // fitView={true}
    import AddTab from '~icons/material-symbols/tab-new-right-outline-rounded'
    import { CircuitStore, loadCircuit, saveCircuit } from '@CircuitStore'

    let {
        clearDeviceData,
        setDeviceData,
    }: { clearDeviceData: Function; setDeviceData: Function } = $props()

    const initTab = localStorage.getItem('currActiveTab') || 'init_circuit'
    let currentTab = $state(initTab)

    let activeTabList = $state(
        (localStorage.getItem('activeTabList') &&
            JSON.parse(localStorage.getItem('activeTabList') || '')) || [
            initTab,
        ]
    )

    // variables for incline renaming
    let editingTab = $state<string | null>(null)
    let tabNewName = $state<string>('')

    async function backupTab(currentTab: string) {
        await saveCircuit()

        // load circuitStoreSave into tab save
        const newSave = localStorage.getItem('circuitStoreSave')
        if (!newSave) {
            console.log(
                "empty after trying to save, not possible I don't think"
            )
            return
        }
        localStorage.setItem(currentTab, newSave)
    }
    async function handleTabClick(tabName: string) {
        // saveCircuit()
        if (editingTab === tabName) return
        if (currentTab === tabName) {
            return null
        }

        // save circuit to get the current positions saved.
        await backupTab(currentTab)

        clearDeviceData()
        CircuitStore.reset()

        let loadedCircuit = localStorage.getItem(tabName)

        if (!loadedCircuit) {
            // this code doesn't make a lot of sense to me.
            // setting it to an empty json object causes issues.
            loadedCircuit = ''
            localStorage.setItem(tabName, loadedCircuit)
        }

        // load the tab into circuitStore
        localStorage.setItem('circuitStoreSave', loadedCircuit)
        // load circuitStore into $CircuitStore
        loadCircuit()
        // set current devices
        // currentDevicesData = $CircuitStore.devices
        setDeviceData($CircuitStore.devices)

        // sideEffects
        currentTab = tabName
        localStorage.setItem('currActiveTab', tabName)
    }
    function makeNewTab() {
        // // Sort activeTabList
        // activeTabList = activeTabList.sort((a, b) => a.localeCompare(b));

        // const currActiveTabList = localStorage.getItem('activeTabList')
        // if (!currActiveTabList)
        //     console.log('activeTabList is not set in localStorage'), null
        // Extract numbers from 'unnamed_circuit_\d+' and find the first gap
        const unnamedNumbers = activeTabList
            .map((tab: string) => {
                // unnamed_circuit is implied 0th pos
                if (tab === 'unnamed_circuit') {
                    return 0
                }
                const match = tab.match(/^unnamed_circuit_(\d+)$/)
                return match ? parseInt(match[1]) : null
            })
            .filter((num: number) => num !== null)
            .sort((a: number, b: number) => a - b)

        // I don't love this logic, I think it could be made simpler, how much of an edge case is it really?
        // I am pretty sure its accurate though
        if (unnamedNumbers.length === 0 || unnamedNumbers[0] !== 0) {
            activeTabList.push(`unnamed_circuit`)
            localStorage.setItem('activeTabList', JSON.stringify(activeTabList))
            return
        }

        let nextNumber = 1
        for (const num of unnamedNumbers) {
            if (num > nextNumber) {
                break
            }
            nextNumber = num + 1
        }

        // Add the new unnamed circuit with the next available number
        activeTabList.push(`unnamed_circuit_${nextNumber}`)
        localStorage.setItem('activeTabList', JSON.stringify(activeTabList))

        // assume that they will always be sequential.
        // add the last one to
        // let activeTabList = $state(['Tab1_circuitStoreSave'])
    }

    function deleteTab(index: number): void {
        if (activeTabList.length <= 1) {
            alert('Cannot delete the last tab.')
            return
        }
        // Get the tab name of the tab being deleted.
        const deletedTab = activeTabList[index]
        // Remove just the one tab using its index.
        activeTabList = activeTabList.filter(
            (_: string, i: number): boolean => i !== index
        )
        localStorage.setItem('activeTabList', JSON.stringify(activeTabList))
        localStorage.removeItem(deletedTab)

        // If the deleted tab is the current tab, switch to the first remaining tab.
        if (currentTab === deletedTab) {
            const newActiveTab = activeTabList[0]
            currentTab = newActiveTab
            localStorage.setItem('currActiveTab', newActiveTab)
            let loadedCircuit = localStorage.getItem(newActiveTab) || ''
            localStorage.setItem('circuitStoreSave', loadedCircuit)
            loadCircuit()
            setDeviceData($CircuitStore.devices)
        }
    }

    function startEditing(tabName: string) {
        editingTab = tabName
        tabNewName = tabName // Initialize the new name with the current tab name
    }

    function cancelEditing(): void {
        editingTab = null // Cancel editing mode
        tabNewName = '' // Clear the new name input
    }

    function commitRename(): void {
        if (!editingTab) return
        const trimmedName = tabNewName.trim()
        if (!trimmedName) return
        if (activeTabList.includes(trimmedName) && trimmedName !== editingTab) {
            alert('Tab name already exists! Please choose a different name.')
            return
        }
        // update the tab name in list and localStorage
        activeTabList = activeTabList.map((name: string) =>
            name === editingTab ? trimmedName : name
        )
        localStorage.setItem('activeTabList', JSON.stringify(activeTabList))

        // rename associated to stored content if exists
        const tabContent = localStorage.getItem(editingTab)
        if (tabContent !== null) {
            localStorage.removeItem(editingTab) // Remove old name
            localStorage.setItem(trimmedName, tabContent) // Set new name with content
        }
        // update current tab if necessary
        if (currentTab === editingTab) {
            currentTab = trimmedName
            localStorage.setItem('currActiveTab', trimmedName)
        }
        editingTab = null
        tabNewName = ''
    }
</script>

<div class="tabs">
    <div class="scrollable-tabs">
        {#each activeTabList as tabName, index (tabName + index)}
            <div class="tab-item">
                {#if editingTab === tabName}
                    <input
                        type="text"
                        bind:value={tabNewName}
                        onkeydown={(e: KeyboardEvent) => {
                            if (e.key === 'Enter') commitRename()
                            else if (e.key === 'Escape') cancelEditing()
                        }}
                        onblur={commitRename}
                        autofocus
                    />
                {:else}
                    <button
                        type="button"
                        class="tab-title"
                        onclick={async () => await handleTabClick(tabName)}
                        ondblclick={() => startEditing(tabName)}
                    >
                        {tabName}
                    </button>
                {/if}
                <button
                    type="button"
                    class="delete-btn"
                    onclick={(e: MouseEvent) => {
                        e.stopPropagation()
                        deleteTab(index)
                    }}
                    title="Delete Tab"
                >
                    ×
                </button>
            </div>
        {/each}
    </div>
    <button type="button" class="new-tab-btn" onclick={() => makeNewTab()}>
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
        border: none;
        font-size: 14px; /* Adjust text size as needed */
        text-align: center; /* Keep text centered */
    }
    .tab-title:hover {
        color: red;
        background-color: black;
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
