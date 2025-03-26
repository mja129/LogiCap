<script lang="ts">
    import { Command } from "cmdk-sv";
    import { onMount } from 'svelte';

    let isMenuOpen = false; // local state for toggle menu visibility
    let search = ''; 

    let pages: string[] = [];
    $: page = pages[pages.length - 1];

    // Push a new page onto the stack.
    function changePage(newPage: string) {
      pages = [...pages, newPage];
      search = "";
    }

    // Pop the last page (go back one level).
    function goBack() {
      if (pages.length > 0) {
        pages = pages.slice(0, -1);
        search = "";
      }
    }

    // top-level items
    const topItems = [
      { id: "gates", label: "Gates" },
      { id: "inputs", label: "Inputs/Outputs" }
    ];

    // Data for each group:
    const gates = [
      { id: "and", label: "AND Gate" },
      { id: "or", label: "OR Gate" },
      { id: "not", label: "NOT Gate" }
    ];

    const inputs = [
      { id: "button", label: "Button" },
      { id: "lamp", label: "Lamp" }
    ];

    // menu toggle function
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      if (!isMenuOpen) {
        pages = [];
        search = "";
      }
    }
    
    // global key listen. Set to h for the moment 
    onMount(() =>{
      window.addEventListener("keydown", (event) => {
          console.log(`Key pressed: ${event.key}`);
          if (event.key === "h") {
              console.log("Menu toggle triggered");
              toggleMenu();
          }
      });
    });

     // Handlers for selecting an item.
  function handleGateSelect(gateId: string) {
    console.log("Selected gate:", gateId);
    // Custom logic: add gate to your simulation, etc.
   
  }

  function handleInputSelect(inputId: string) {
    console.log("Selected input:", inputId);
    // Custom logic: add input/output component, etc.
   
  }

  // Reactive arrays for filtering.
  $: filteredTopItems = topItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );
  $: filteredGates = gates.filter(gate =>
    gate.label.toLowerCase().includes(search.toLowerCase())
  );
  $: filteredInputs = inputs.filter(input =>
    input.label.toLowerCase().includes(search.toLowerCase())
  );

</script>

{#if isMenuOpen}
  <div class="menu">
    <Command.Root filter={() => 1}>
      <Command.Input bind:value={search} placeholder="Search..." />

        <Command.List>
          {#if !page}
            <!-- Top-level list; key the list so it re-renders when search changes -->
            <Command.List key={"top" + search}>
              {#each filteredTopItems as item (item.id)}
                <Command.Item
                  onSelect={() => changePage(item.id)}>
                  {item.label}
                </Command.Item>
              {/each}
            </Command.List>
          {:else if page === "gates"}
            <!-- Nested page for Gates -->
            <Command.List key={"gates" + search}>
              <Command.Group heading="Gates">
                {#each filteredGates as gate (gate.id)}
                  <Command.Item
                    onSelect={() => handleGateSelect(gate.id)}>
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
              <Command.List key={"inputs" + search}>
                <Command.Group heading="Inputs/Outputs">
                  {#each filteredInputs as input (input.id)}
                    <Command.Item
                      onSelect={() => handleInputSelect(input.id)}>
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
{/if}


<style>
    .menu {
        position: fixed;
        bottom: 1rem; /* Adjust the distance from the bottom */
        right: 1rem;  /* Adjust the distance from the right */
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        width: 300px;
        padding: 16px;
        z-index: 10;
    }
</style>