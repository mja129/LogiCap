<script lang="ts" module>
    import { writable, type Writable } from 'svelte/store'

    export let signalQ: Writable<Array<string>> = writable([])
</script>

<script lang="ts">
    import { Anchor as SvelvetAnchor, type Direction } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { getRunning } from '@CircuitEngine'
    import { getContext } from 'svelte'
    import { findOutputAnchor } from '@CircuitStore'

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
    const rotation: Writable<number> = getContext('rotation')
    const rotationNode: Writable<string> = getContext('rotationNode')
    const hasRotated: Writable<boolean> = getContext('hasRotated')

    console.log($hasRotated)

    function getDirection(rotation: number) {
        if (location[0] === 'left') {
            if (rotation === 0) {
                return 'west'
            }
            if (rotation === 90) {
                return 'north'
            } else if (rotation === 180) {
                return 'east'
            } else if (rotation === 270) {
                return 'south'
            }
        } else {
            if (rotation === 0) {
                return 'east'
            }
            if (rotation === 90) {
                return 'south'
            } else if (rotation === 180) {
                return 'west'
            } else if (rotation === 270) {
                return 'north'
            }
        }
    }
    let direction = $derived(getDirection($rotation))

    // when rotating an input anchor
    // the connection will be lost
    // the only way to retrieve is to full re-render the coorisponding output nodeConnect
    // talk to another node that you know the name of
    // tell its anchor to rerender
    // message needs to be passed above circuit.svelte
    // anchor checks if its name is in the message buffer, if its is, it rendenders and
    // key getRotation() || inputJustRotated

    // if any linked input gets rotated
    // its output must be relinked
    // you can have 1 output going into both inputs
    // you can have 2 outputs to 2 inputs
    // you can have only 1 connected
    // you can have none of them connected

    // so if I listen on the anchor level its a bit racey
    // and I might need to trigger two output rerenders
    // so make a global event q

    let outputUpdateTrigger = $state(false)

    // an output anchor, this is important for rotations
    let linkedToInput: outputAnchorName | '' | undefined = ''

    // if you rotate a linked input anchor you need to do some convoluted stuff to get the output anchor to rerender.
    $effect(() => {
        // if ($signalQ.includes(linkedToInput as string)) {
        //     linkedToInput = ''
        //     return
        // }

        if (id === $rotationNode && $hasRotated) {
            if ($rotation || $rotation === 0) {
                if (io === 'input') {
                    linkedToInput = findOutputAnchor(anchorId)
                    // console.log(linkedToInput)

                    // the input anchor is unlinked "likely".
                    if (linkedToInput === undefined) {
                        console.log('didnt send signal')
                        linkedToInput = ''
                        return
                    }

                    signalQ.update((currQ) => {
                        return [...currQ, linkedToInput as string]
                    })
                    console.log('signal sent')
                }
                // search $circuitStore.connections for the 1 or 2 corrisponding outputs
                // add to a globalStoreQueue
                // if io
            }
        }

        if (io === 'output' && $signalQ.includes(anchorId)) {
            console.log('consume signal')
            // console.log($signalQ)
            outputUpdateTrigger = !outputUpdateTrigger
            // signal was handled
            signalQ.update((currQ) => {
                return currQ.filter((id) => id !== anchorId)
            })
        }
    })
    console.log(io + '' + connections)
</script>

<!--
    class:hovering means -> if the hovering boolean variable is true, apply the class with the same name as the boolean variable
    class:linked={link} -> means apply the linked class if the "link" variable is true
    its done this way because I want to capture the elements that the default svelvet anchor provides
    within the outermost scope of this component
-->

{#snippet anchor()}
    <div style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}>
        <SvelvetAnchor
            let:linked
            let:hovering
            let:connecting
            id={anchorId}
            key={anchorId}
            direction={direction as Direction}
            output={(io === 'output' && true) || false}
            input={(io === 'input' && true) || false}
            locked={getRunning()}
            {connections}
        >
            <CustomAnchor {io} {connecting} {linked} {anchorId} {hovering} />
            <Wire initAncId={anchorId} slot="edge" />
        </SvelvetAnchor>
    </div>
{/snippet}
<!-- This property will automatically set the dragged anchor to the first available io that fits on the node you drag your mouse to -->
<!-- nodeConnect={true} -->
<!-- key block triggers a full component rerender when the 'key' value changes-->
{#if io === 'output'}
    {#key outputUpdateTrigger || $rotation || direction}
        {@render anchor()}
    {/key}
{:else}
    {#key $rotation}
        {@render anchor()}
    {/key}
{/if}
