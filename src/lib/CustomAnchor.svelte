<script lang="ts">
    // import type { Anchor } from 'svelvet'
    import { Anchor, generateInput, generateOutput } from 'svelvet'
    import CircuitAnchor from './CircuitAnchor.svelte'
    type LocationY = 'top' | 'bot' | 'mid'
    type LocationX = 'left' | 'right' | 'center'
    type LocationTuple = [LocationX, LocationY]
    let connections: any = $state()
    let {
        location = ['left', 'top'],
        id,
        io,
    }: {
        location: LocationTuple
        id: string
        io: 'input' | 'output'
    } = $props()

    type Inputs = {
        inputParent: string
    }
    const initialData: Inputs = {
        inputParent: '',
    }
    // set inputParent at some point during the svelte file execution
    const inputs = generateInput(initialData)
    const processor = (inputs: Inputs) => inputs.inputParent
    const output = generateOutput(inputs, processor)
</script>

<!-- This property will automatically set the dragged anchor to the first available io that fits on the node you drag your mouse to -->
<!-- nodeConnect={true} -->
<div class="{location[0]} {location[1]}">
    <Anchor
        let:linked={link}
        let:hovering
        let:connecting
        id={`${id}_${io}_${location[0]}_${location[1]}`}
        direction={location[0] === 'left' ? 'west' : 'east'}
        input={io === 'input'}
        output={io === 'output'}
        multiple={false}
    >
        <CircuitAnchor {io} {connecting} linked={link} {hovering} />
    </Anchor>
</div>

<style>
    .top {
        position: absolute;
        top: 21.5%;
    }
    .bot {
        position: absolute;
        top: 58%;
    }
    .mid {
        position: absolute;
        top: 40%;
    }
    .left {
        position: absolute;
        left: 7.5%;
    }
    .right {
        position: absolute;
        right: 10%;
    }
    .center {
        left: calc((100% / 2) - 10px);
    }
    .custom_anchor {
        border-radius: 50%;
        height: 10px;
        width: 10px;
    }
</style>
