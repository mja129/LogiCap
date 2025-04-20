<script lang="ts">
    import { Anchor as SvelvetAnchor } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { getRunning } from '@CircuitEngine'
    import { getContext } from 'svelte'

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
    const getRotation: () => number = getContext('rotation')

    function getDirection() {
        if (location[0] === 'left') {
            if (getRotation() === 0) {
                return 'west'
            }
            if (getRotation() === 90) {
                return 'north'
            } else if (getRotation() === 180) {
                return 'east'
            } else if (getRotation() === 270) {
                return 'south'
            }
        } else {
            if (getRotation() === 0) {
                return 'east'
            }
            if (getRotation() === 90) {
                return 'south'
            } else if (getRotation() === 180) {
                return 'west'
            } else if (getRotation() === 270) {
                return 'north'
            }
        }
    }

    // when rotating an input anchor
    // the connection will be lost
    // the only way to retrieve is to full re-render the coorisponding output nodeConnect
    // talk to another node that you know the name of
    // tell its anchor to rerender
    // message needs to be passed above circuit.svelte
    // anchor checks if its name is in the message buffer, if its is, it rendenders and
    // key getRotation() || inputJustRotated
    const globalAnchorUpdateSignal = 'out_nodetype_nodeid'
    $effect(() => {
        if (globalAnchorUpdateSignal === 'this_node') {
        }
    })
</script>

<!--
    class:hovering means -> if the hovering boolean variable is true, apply the class with the same name as the boolean variable
    class:linked={link} -> means apply the linked class if the "link" variable is true
    its done this way because I want to capture the elements that the default svelvet anchor provides
    within the outermost scope of this component
-->

<!-- This property will automatically set the dragged anchor to the first available io that fits on the node you drag your mouse to -->
<!-- nodeConnect={true} -->
{#if io === 'output'}
    {#key getRotation()}
        <div
            style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}
        >
            <SvelvetAnchor
                let:linked
                let:hovering
                let:connecting
                id={anchorId}
                key={anchorId}
                direction={getDirection()}
                input={(io === 'input' && true) || false}
                output={(io === 'output' && true) || false}
                locked={getRunning()}
                {connections}
            >
                <CustomAnchor
                    {io}
                    {connecting}
                    {linked}
                    {anchorId}
                    {hovering}
                />
                <Wire initAncId={anchorId} slot="edge" />
            </SvelvetAnchor>
        </div>
    {/key}
{:else if io === 'input'}
    <div style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}>
        <SvelvetAnchor
            let:linked
            let:hovering
            let:connecting
            id={anchorId}
            key={anchorId}
            direction={getDirection()}
            input={(io === 'input' && true) || false}
            output={(io === 'output' && true) || false}
            locked={getRunning()}
            {connections}
        >
            <CustomAnchor {io} {connecting} {linked} {anchorId} {hovering} />
            <Wire initAncId={anchorId} slot="edge" />
        </SvelvetAnchor>
    </div>
{/if}
