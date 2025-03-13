<script lang="ts">
    import {
        Anchor,
        generateInput,
        generateOutput,
        type CSSColorString,
    } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    type LocationY = 'top' | 'bot' | 'mid'
    type LocationX = 'left' | 'right' | 'center'
    type LocationTuple = [LocationX, LocationY]
    type portNames = `in${number}` | 'out' | 'in' | ''
    let {
        location = ['left', 'top'],
        id,
        io,
        offset = [],
    }: {
        location: LocationTuple
        id: string
        io: 'input' | 'output'
        offset?: [number, number] | []
    } = $props()

    // TODO: deciding the port name should be done with a map and in a more generic way instead of an if statement.
    // Typescript could do some styff.

    // I wonder why this gives a ts warning?
    // svelte-ignore non_reactive_update
    let portName: portNames = ''
    if (location[0] == 'left') {
        if (location[1] == 'top') {
            portName = 'in1'
        } else if (location[1] == 'bot') {
            portName = 'in2'
        } else if (location[1] == 'mid') {
            portName = 'in'
        }
    } else if (location[0] == 'right') {
        portName = 'out'
    }
    const anchorId = `${portName}_${id}`

    // get state of linked node from child via closure function
    // I would like to make this and CustomAnchor one file, especially because all of the connection logic is in the child
    // But I cant get the let:linked into the outtermost scope of this file, Im not quite sure why.
    // to figure out how to make this one component, I need to figure out how the 'let:' directive works
</script>

<!--
    class:hovering means -> if the hovering boolean variable is true, apply the class with the same name as the boolean variable
    class:linked={link} -> means apply the linked class if the "link" variable is true
    its done this way because I want to capture the elements that the default svelvet anchor provides
    within the outermost scope of this component
-->

<!-- This property will automatically set the dragged anchor to the first available io that fits on the node you drag your mouse to -->
<!-- nodeConnect={true} -->
<div style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}>
    <Anchor
        let:linked
        let:hovering
        let:connecting
        id={anchorId}
        key={anchorId}
        connections={[]}
        direction={location[0] === 'left' ? 'west' : 'east'}
        input={io === 'input'}
        output={io === 'output'}
    >
        <CustomAnchor
            {io}
            {connecting}
            {linked}
            {portName}
            nodeId={id}
            {anchorId}
            {hovering}
        />
    </Anchor>
</div>
