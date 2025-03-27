<script lang="ts">
    import { Command } from "cmdk-sv";
    import { onMount, afterUpdate } from 'svelte';

    let isMenuOpen = false; // local state for toggle menu visibility
    let search = ""; 
    let searchFlag = "";

    let pages: string[] = [];
    $: page = pages[pages.length - 1];

    // menu toggle function
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      if (!isMenuOpen) {
        pages = [];
        search = "";
      }
    }

    // Push a new page onto the stack.
    function changePage(newPage: string) {
      pages = [...pages, newPage];
      search = "";
      searchFlag = "";
    }

    // Pop the last page (go back one level).
    function goBack() {
      if (pages.length > 0) {
        pages = pages.slice(0, -1);
        search = "";
        searchFlag = "";
      }
    }

    // update searchFlag on changes
    $: if (search !== searchFlag) {
      searchFlag = search; // Update flag whenever search changes
    }

    // Focus the native input element after menu updates
    afterUpdate(() => {
      if (isMenuOpen) {
        // Dynamically locate the input field inside the Command.Input component
        const realInput = document.querySelector(".cmdk-input");
        if (realInput instanceof HTMLInputElement) {
          realInput.focus(); // Explicitly call focus on the native input
        }
      }
    });

    // top-level items:
    const topItems = [
      { id: "gates", label: "Gates" },
      { id: "inputs", label: "Inputs/Outputs" }
    ];

    // Data for gate group:
    const gates = [
      { id: "and", label: "AND Gate", nodeType: "And" },
      { id: "or", label: "OR Gate",  nodeType: "Or" },
      { id: "not", label: "NOT Gate", nodeType: "Not" }
    ];

    // Data for input group:
    const inputs = [
      { id: "button", label: "Button", nodeType: "Button" },
      { id: "lamp", label: "Lamp", nodeType: "Lamp" }
    ];
    
    // global key listen. Set to - for the moment 
    onMount(() =>{
      window.addEventListener("keydown", (event) => {
          console.log(`Key pressed: ${event.key}`);
          if (event.key === "-") {
              console.log("Menu toggle triggered");
              event.preventDefault(); // prevents - from being typed when you use press to toggle menu
              toggleMenu();
          }
      });
    });

    export let createCanvasNode: (node: {gateType: string}) => void;

    // Handlers for selecting items.
    function handleSelect(nodeType: string) {
      createCanvasNode({ gateType: nodeType });
    }

</script>

<main>
  <button on:click={toggleMenu} class="menu-toggle-button">Toggle Menu</button>

  {#if isMenuOpen}
    {#key `${page}:${searchFlag}`}
      <div class="menu">
        <Command.Root filter={() => 1}>
          <Command.Input class="cmdk-input" bind:value={search} placeholder="Search..." />

            <Command.List>
              {#if !page}
                <!-- Top-level list; key the list so it re-renders when search changes -->
                <Command.List>
                  {#each topItems.filter(item =>
                    item.label.toLowerCase().startsWith(search.toLowerCase())
                  ) as item (item.id)}    
                    <Command.Item
                      onSelect={() => changePage(item.id)}>
                      {item.label}
                    </Command.Item>
                  {/each}
                </Command.List>
              {:else if page === "gates"}
                <!-- Nested page for Gates -->
                <Command.List>
                  <Command.Group heading="Gates">
                    {#each gates.filter(gate =>
                      gate.label.toLowerCase().startsWith(search.toLowerCase())
                    ) as gate (gate.id)}
                    
                      <Command.Item onSelect={() => handleSelect(gate.nodeType)}>
                        {gate.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                  <Command.Item onSelect={goBack}>
                    ← Back
                  </Command.Item>
                </Command.List>
              {:else if page === "inputs"}
                  <!-- Nested page for Inputs/Outputs -->
                  <Command.List>
                    <Command.Group heading="Inputs/Outputs">
                      {#each inputs.filter(input =>
                        input.label.toLowerCase().startsWith(search.toLowerCase())
                      ) as input (input.id)}
          
                        <Command.Item onSelect={() => handleSelect(input.nodeType)}>
                          {input.label}
                        </Command.Item>
                      {/each}
                    </Command.Group>
                    <Command.Item onSelect={goBack}>
                      ← Back
                    </Command.Item>
                  </Command.List>
              {/if}
            </Command.List>  
        </Command.Root>
      </div>
    {/key}
  {/if}
</main>

<style>
    .menu-toggle-button {
    position: absolute;
    top: 7rem; /* Adjust to position it under the minimap */
    right: 0.5rem;
    padding: 1px 19px;
    background-color: lightblue;
    color: black;
    border-color: black;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .menu {
      position: fixed;
      bottom: 1rem; /* Adjust the distance from the bottom */
      right: 1rem;  /* Adjust the distance from the right */
      background-color: white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      width: 175px;
      padding: 16px;
      z-index: 10;
      border-color: black;
  }
</style>