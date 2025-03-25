<script lang="ts">
    import { Anchor as SvelvetAnchor } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { circuitStore, connectingEdge } from '../circuitStore'
    import { get } from 'svelte/store'
    import { onMount } from 'svelte'

    type LocationY = 'top' | 'bot' | 'mid'
    type LocationX = 'left' | 'right' | 'center'
    type LocationTuple = [LocationX, LocationY]
    type portNames = `in${number}` | 'out' | 'in' | ''

    let {
        location = ['left', 'top'],
        id,
        io,
        offset = [],
        connections,
    }: {
        location: LocationTuple
        id: string
        io: 'input' | 'output'
        offset?: [number, number] | []
        connections?: any
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

    // $inspect(connectingMirror).with(console.warn)
    // console.warn($savedConnections[anchorId])
    // $inspect($savedConnections).with(console.warn)

    // only for loading in saved

    // the lookup can be made much faster with an interted map
    // InNodeId : {outputlinkname, selfInputIndex in ouput mapping array}

    // onMount(() => {
    //     if (io === 'input') {
    //         console.log('mounted input anchor')
    //     }
    // })

    // could be undefined
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
    <SvelvetAnchor
        let:linked
        let:hovering
        let:connecting
        id={anchorId}
        key={anchorId}
        direction={location[0] === 'left' ? 'west' : 'east'}
        input={(io === 'input' && true) || false}
        output={(io === 'output' && true) || false}
        {connections}
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
        <Wire initId={anchorId} slot="edge" />
    </SvelvetAnchor>
</div>
