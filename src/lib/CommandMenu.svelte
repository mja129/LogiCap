<script lang="ts">
    import { Command } from "cmdk-sv";
    import { menuJsonData, type NodeMenuGroups, type menuJsonElement, type allNodeTypes } from './circuitModel.ts';
    import { onMount, afterUpdate, onDestroy } from 'svelte';

    let isMenuOpen = false; // local state for toggle menu visibility
    let search = ""; 
    let searchFlag = "";
    let ghostElement: HTMLElement | null = null;
    let dragging = false;
    let activeNodeType: allNodeTypes | null = null;
    
    let pages: NodeMenuGroups[] = [];
    $: page = pages.length > 0 ? pages[pages.length - 1] : undefined; // current page based on stack

    // menu toggle function
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      if (!isMenuOpen) {
        pages = [];
        search = "";
        activeNodeType = null;
        dragging = false;
      }
    }

    // Push a new page onto the stack.
    function changePage(newPage: NodeMenuGroups) {
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
    const topItems = Object.keys(menuJsonData).filter(group => group !== "GhostElement").map(group => ({ id: group, label: group }));

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

    export let createCanvasNode: (node: {gateType: string; x: number; y: number }) => void;

    function createGhost(item: menuJsonElement) {
      if (ghostElement) return; // Avoid creating multiple ghost elements
      ghostElement = document.createElement("div");
      ghostElement.className = "drag-ghost";
      ghostElement.style.position = "fixed";
      ghostElement.style.pointerEvents = "none"; // Make it unclickable
      ghostElement.style.left = `0px`;
      ghostElement.style.top = `0px`;
      ghostElement.style.zIndex = "1000";

      // Add the item's icon to the ghost
      const img = document.createElement("img");
      img.src = item.icon;
      img.alt = item.name;
      img.style.width = "40px";
      img.style.opacity = "0.7";

      ghostElement.appendChild(img);
      document.body.appendChild(ghostElement);

      // Update the ghost position with mouse movement
      window.addEventListener("mousemove", updateGhostPosition);
    }

    function updateGhostPosition(event: MouseEvent) {
      if (ghostElement) {
        ghostElement.style.left = `${event.pageX}px`;
        ghostElement.style.top = `${event.pageY}px`;
      }
    }

    function removeGhost() {
      if (ghostElement) {
        ghostElement.remove();
        ghostElement = null;
      }
      window.removeEventListener("mousemove", updateGhostPosition);
      dragging = false;
    }

    // Start dragging interaction
    function handleDragStart(nodeType: allNodeTypes, item: menuJsonElement) {
      if (!dragging) {
        activeNodeType = nodeType; // Set active node type
        createGhost(item); // Attach ghost
        dragging = true; // Enable dragging state
        console.log(`Dragging started for: ${nodeType}`);
      }

    }

    // Handle drop to create the node
    function handleDrop(event: MouseEvent) {
      if (dragging && activeNodeType) {
        const cursorPosition = { x: event.pageX, y: event.pageY };
        console.log(`Creating node at position: ${cursorPosition.x}, ${cursorPosition.y}`);
        createCanvasNode({ gateType: activeNodeType, ...cursorPosition }); // Spawn the node
        activeNodeType = null; // Clear active node type
        removeGhost(); // Cleanup ghost
      }
    }

    // Prevent repeated node creation on "Enter" or click
    function handleInteraction(nodeType: allNodeTypes, item: menuJsonElement) {
      if (!dragging) {
        handleDragStart(nodeType, item); // Start drag interaction
      }
    }


    // Attach global event listeners
    onMount(() => {
      window.addEventListener("mouseup", handleDrop); // Listen for drop events
      window.addEventListener("mousemove", updateGhostPosition); // Track mouse movement
    });

    // Remove global event listeners
    onDestroy(() => {
      window.removeEventListener("mouseup", handleDrop);
      window.removeEventListener("mousemove", updateGhostPosition);
      removeGhost(); // Ensure ghost cleanup
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Backspace" && !search) {
        if (pages.length > 0) {
          event.preventDefault();
          goBack();
        }
      }
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
                      onSelect={() => changePage(item.id as NodeMenuGroups)}
                      class="menu-item"
                    >
                      {item.label}
                    </Command.Item>
                  {/each}
                </Command.List>
              {:else}
                <!-- Subpage Menu -->
                <Command.List>
                  <Command.Group heading={page}>
                    {#each menuJsonData[page as NodeMenuGroups].groupElements.filter((el: menuJsonElement) =>
                      el.name.toLowerCase().startsWith(search.toLowerCase())
                    ) as element (element.nodeType)}
                      <Command.Item
                        onSelect={() => handleInteraction(element.nodeType, element)} 
                        class="menu-item"
                      >
                        {element.name}
                        <img src={element.icon} alt="{element.name}" class="menu-item-icon" />
                      </Command.Item>
                    {/each}                    
                  </Command.Group>
                  <Command.Item onSelect={goBack} class="menu-item">← Back</Command.Item>
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

  :global(.menu-item-icon) {
    width: 20px; /* Set image width */
    height: auto; /* Maintain aspect ratio */
    margin-left: 10px; /* Add spacing between text and image */
  }

  :global(.menu-item) {
    display: flex; /* Align text and image in a row */
    justify-content: space-between; /* Push the image to the right */
    align-items: center; /* Vertically align text and image */
    cursor: pointer;
  }

  :global(.menu-item:hover) {
  background-color: #f0f0f0;
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

  .drag-ghost {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
    transform: scale(1.3);
    opacity: 0.8;
  }

</style>