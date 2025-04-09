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
</script>

<div class="tabs">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    {#each activeTabList as tabName (tabName)}
        <p
            style={currentTab === tabName ? 'background-color: pink' : ''}
            onclick={async () => await handleTabClick(tabName)}
        >
            {tabName}
        </p>
    {/each}
    <button
        style="border: unset; width: 30px; float: left;background-color:transparent;margin-left:-3px;margin-right: 4px;"
        onclick={() => makeNewTab()}
    >
        <AddTab
            style="display: block; margin: 0 auto; height: 100%; width: 100%;"
        />
    </button>
</div>

<style>
    .tabs {
        position: absolute;
        right: calc(120px);
        top: 8px;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background-color: var(--lightblue);
        border-radius: 5px;
        border: 3px solid black;

        padding-block: 5px;
    }
    .tabs > * {
        margin-left: 3px;
    }
    .tabs p {
        padding-inline: 12px;
        padding-block: 2px;
        border-radius: 25px;
    }
    .tabs p:hover {
        color: red;
        background-color: black;
    }
</style>
