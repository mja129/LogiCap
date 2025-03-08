<script>
    import { onMount } from 'svelte'
    import MoonIcon from '~icons/flowbite/moon-outline'
    import SunIcon from '~icons/flowbite/sun-outline'

    // Check local storage for saved theme preference
    let darkModeActive = false

    onMount(() => {
        darkModeActive = localStorage.getItem('theme') === 'dark'
        updateTheme()
    })

    function toggleDarkMode() {
        darkModeActive = !darkModeActive
        localStorage.setItem('theme', darkModeActive ? 'dark' : 'light')
        updateTheme()
    }

    function updateTheme() {
        if (darkModeActive) {
            document.body.className = 'dark'
        } else {
            document.body.className = 'light'
        }
    }

    // set this variable's initial value based off of the users dark mode system presets.
</script>

<div class="side_menu_header">
    <h2>
        <span class="l_cap">L</span><span class="o_cap">o</span><span
            class="g_cap">g</span
        ><span class="i_cap">i</span><span class="c_cap">c</span><span
            class="a_cap"
            style="margin-left:4px;">A</span
        ><span class="p_cap">P</span>
    </h2>
    {#if darkModeActive}
        <SunIcon
            onclick={toggleDarkMode}
            style="color:var(--neon-purple); width:28px;height:28px;margin-top: 5px;margin-right: -8px;"
        />
    {:else}
        <MoonIcon
            onclick={toggleDarkMode}
            style="color:grey !important; width:28px;height:28px;margin-top: 5px;margin-right: -8px;"
        />
    {/if}
    <!-- <img -->
    <!--     src={CollapseIcon} -->
    <!--     alt="used for collapsing the side menubar and making the simulator take up the whole screen" -->
    <!-- /> -->
</div>

<style>
    /* span { */
    /*     /* font-family: 'vcr', sans-serif; */
    /* } */

    /* https://codepen.io/gayane-gasparyan/pen/vYmYMeV */
    /* .side_menu_header img:nth-child(2) {
        height: 12px;
        margin-block: -6px;
        width: 1500px;
    } */
    /* :global(.dark .side_menu_header) {
        background-color: var(--dark-blue);
    }
    :global(.light .side_menu_header) {
        background-color: var(--cream);
    } */
    .side_menu_header {
        /* margin-top: -11px; */
        padding-inline: 10px;
        display: flex;
        justify-content: space-between;
        /* margin-bottom: var(--side-menu-spacing); */
    }
    /* .side_menu_header img {
        width: 65px;
        height: 55px;
        margin-right: -11px;
        margin-top: 4px;
    } */

    h2 span:nth-child(6n) {
        color: var(--blue);
    }
    h2 span:nth-child(7n) {
        color: var(--dark-blue);
    }
    /* h2 span:nth-child(4n + 2) { */
    /*     color: var(--pink); */
    /* } */
    /* h2 span:nth-child(4n + 3) { */
    /*     color: var(--yellow); */
    /* } */
    /* h2 span:nth-child(4n + 4) { */
    /*     color: var(--blue); */
    /* } */
    :global(.dark h2) {
        -webkit-text-stroke: 2px white;
    }
    :global(.light h2) {
        -webkit-text-stroke: 2px black;
    }
    h2 {
        font-size: 3.8rem;
        text-align: left;
        padding: 0;
        margin-bottom: 3px;
        color: transparent;
    }
</style>
