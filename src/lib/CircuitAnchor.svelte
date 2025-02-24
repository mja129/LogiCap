<script lang="ts">
    let {
        linked,
        hovering,
        connecting,
        io,
    }: { linked: boolean; hovering: boolean; connecting: boolean; io: string } =
        $props()

    // dispatch a message.
    function dispatch(type: string) {}
</script>

<div
    class="custom_anchor {io === 'input' ? 'input' : 'output'}"
    class:linked
    class:hovering
    class:connecting
></div>

<style>
    .custom_anchor {
        border-radius: 50%;
        height: 10px;
        width: 10px;
    }
    .linked {
        background-color: purple !important;
        border: 1px solid black;
    }
    .hovering {
        border: 2px solid black;
    }

    .input {
        background-color: red;
    }
    .output {
        background-color: green;
    }
</style>
