<script lang="ts">
    import { Anchor } from 'svelvet'
    import OutputAnchor from './OutputAnchor.svelte'
    import Wire from './Wire.svelte'
    import { circuitStore, connectingEdge } from '../circuitStore'
    import { get } from 'svelte/store'

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

    function onWireChange(
        wireId: string,
        wire: any,
        tick: number,
        changeWireValue: () => {}
    ) {
        let logicValue: number
        if (wire.attributes.signal) {
            if (
                wire.attributes.signal._avec[0] ==
                wire.attributes.signal._bvec[0]
            ) {
                logicValue = wire.attributes.signal._avec[0]
            } else {
                logicValue = -1
            }
            // console.log(
            //     `${wireId} has changed signal to ${logicValue} at tick ${tick}`
            // )
            changeWireValue()
        }
    }

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

    // if this was a variable that had 1 per anchor, that kept track of what every anchor's last
    // connection was, then I could know what the wire should be from either of the nodes, but then I need
    //

    // an input and output anchor should have the same id.
    // starts as null, only once
    // if connecting don't change
    // if not connecting
    //
    let connectionName: any = $state()

    // $inspect(connectingMirror).with(console.warn)
    // console.warn($savedConnections[anchorId])
    // $inspect($savedConnections).with(console.warn)

    // only for loading in saved
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
        direction={location[0] === 'left' ? 'west' : 'east'}
        input={io === 'input'}
        output={io === 'output'}
        connections={anchorId in get(circuitStore).connectors
            ? get(circuitStore).connectors[anchorId as outputAnchorName]
            : undefined}
    >
        <OutputAnchor
            {io}
            {connecting}
            {linked}
            {portName}
            nodeId={id}
            {anchorId}
            {hovering}
            bind:connectionWireId={connectionName}
        />
        <Wire wireId={connectionName} initId={anchorId} slot="edge" />
    </Anchor>
</div>
