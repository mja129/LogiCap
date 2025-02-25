<script lang="ts">
    let {
        linked,
        hovering,
        connecting,
        io,
        onLinkChanged,
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        io: string
        onLinkChanged: (isConnected: boolean) => void
    } = $props()

    // dispatch a message.
    // use the function we passed in to update the value from the parent
    // kinda a scope reacharound type thing, I wish it could be different.
    // to figure out how to make it different one must have a very good understanding of the let: directive present in the default anchor component, and possibly some binding rune.
    $effect(() => {
        onLinkChanged(linked)
        // $inspect(linked).with(console.log)
    })
    // TODO, may need to listen to onUnmount
    // I think on disconnect has a default event from svelvet, try that out also this effect may set state to false many times, but honestly nah.
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
