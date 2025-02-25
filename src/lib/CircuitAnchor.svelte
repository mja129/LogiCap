<script lang="ts">
    // import type { Anchor } from 'svelvet'
    import { Anchor, generateInput, generateOutput } from 'svelvet'
    import CircuitAnchor from './CircuitAnchor.svelte'
    import CustomAnchor from './CustomAnchor.svelte'
    type LocationY = 'top' | 'bot' | 'mid'
    type LocationX = 'left' | 'right' | 'center'
    type LocationTuple = [LocationX, LocationY]
    type port_names = `input${number}` | 'output' | ''
    let {
        location = ['left', 'top'],
        id,
        io,
    }: {
        location: LocationTuple
        id: string
        io: 'input' | 'output'
    } = $props()

    // TODO: this should be done with a map and in a more generic way
    // Typescript could do some styff.
    let portName: port_names = ''
    if (location[0] == 'left') {
        if (location[1] == 'top') {
            portName = 'input1'
        } else if (location[1] == 'bot') {
            portName = 'input2'
        }
    } else if (location[0] == 'right') {
        portName = 'output'
    }
    const anchorId = `${id}_${portName}`

    let link = $state()
    function updateLinkState(newValue: boolean) {
        link = newValue
    }

    // get state of linked node from child via closure function
    // if we could get rid of circuit anchor that might be cool too honestly.
    // set inputParent at some point during the svelte file execution
</script>

<!--
    class:hovering means -> if the hovering boolean variable is true, apply the class with the same name as the boolean variable
    class:linked={link} -> means apply the linked class if the "link" variable is true
    its done this way because I want to capture the elements that the default svelvet anchor provides
    within the outermost scope of this component
-->

<!-- This property will automatically set the dragged anchor to the first available io that fits on the node you drag your mouse to -->
<!-- nodeConnect={true} -->
<div class="{location[0]} {location[1]}">
    <Anchor
        let:linked
        let:hovering
        let:connecting
        id={anchorId}
        direction={location[0] === 'left' ? 'west' : 'east'}
        input={io === 'input'}
        output={io === 'output'}
        multiple={false}
    >
        <CustomAnchor {connecting} {linked} {portName} nodeId={id} {hovering} />
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
</style>
