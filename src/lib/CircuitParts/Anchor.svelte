<script lang="ts" module>
    export let anchorSignalQ: Writable<Array<string>> = writable([])
    // export let signalQ: Writable<
    //     Array<[outputAnchorName, Record<string, boolean>]>
    // > = writable([])
</script>

<script lang="ts">
    import { Anchor as SvelvetAnchor, type Direction } from 'svelvet'
    import CustomAnchor from './CustomAnchor.svelte'
    import Wire from './Wire.svelte'
    import { getRunning } from '@CircuitEngine'
    import { getContext, onMount } from 'svelte'
    import { signalQ } from '@src/lib/Circuit.svelte'
    import { get, writable, type Writable } from 'svelte/store'
    import { findOutputAnchor } from '../circuitStore'

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

    // number that represents the current rotation of the wire relative to the anchor
    // NSEW
    let customDirection: number | undefined = $state()
    // const rotationNode: Writable<string> = getContext('rotationNode')
    // const hasRotated: Writable<boolean> = getContext('hasRotated')

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

    let updateTrigger = $state(false)

    // gets remotly flipped by input anchors, causes out anchor to renrender when rotating wires around the anchors. (NSEW)
    let wirePosTrigger = $state(false)

    // an output anchor, this is important for rotations

    // if you rotate a linked input anchor you need to do some convoluted stuff to get the output anchor to rerender.
    // console.log(io + '' + connections + '' + id)
    // $inspect($signalQ).with(console.warn)
    let isProcessing = false

    // listen for a global mouse up event, to consume the queue, and cause
    // output rerender when something happens to its coorisponding input node.
    function consumeQupdate() {
        console.log('tried consume mouseup')
        if ($anchorSignalQ.includes(anchorId)) {
            // console.log('tried to consume from wire rotate' + anchorId)

            console.log('anchor rotate consume')
            setTimeout(() => {
                updateTrigger = !updateTrigger
                anchorSignalQ.update((currQ) => {
                    // push the associated input
                    // currQ.push()
                    return currQ.filter((signal) => signal !== anchorId)
                })
            }, 300)
        }
        if ($signalQ.includes(anchorId) && !isProcessing) {
            isProcessing = true
            // so this timeout is basically black magic
            setTimeout(() => {
                updateTrigger = !updateTrigger
                signalQ.update((currQ) => {
                    // push the associated input
                    // currQ.push()
                    return currQ.filter((signal) => signal !== anchorId)
                })
                isProcessing = false
            }, 1)
        }
    }
    function handleNodeRotate(e: MouseEvent) {
        // console.log('global mouse up ')

        consumeQupdate()
        // Delay the trigger slightly, as before
    }

    onMount(() => {
        window.addEventListener('mouseup', handleNodeRotate, {
            capture: true,
        })
        // if (rotateCursorActive) {
        //     window.addEventListener('mousedown', handleAnchorRotate, {
        //         capture: true,
        //     })
        // }

        return () => {
            window.removeEventListener('mouseup', handleNodeRotate, {
                capture: true,
            })
            // if (rotateCursorActive) {
            //     window.removeEventListener('mousedown', handleAnchorRotate, {
            //         capture: true,
            //     })
            // }
        }
    })
    $inspect(customDirection).with(console.log)
    let rotateCursorActive = false
    // we can only have this effect if we didn't just change rotation
    $effect(() => {})
</script>

<!--
    class:hovering means -> if the hovering boolean variable is true, apply the class with the same name as the boolean variable
    class:linked={link} -> means apply the linked class if the "link" variable is true
    its done this way because I want to capture the elements that the default svelvet anchor provides
    within the outermost scope of this component
-->

{#snippet anchor()}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- <button onclick={() => (customDirection = customDirection)}>{io}</button> -->
    <div
        onmousedowncapture={(e: MouseEvent) => {
            e.preventDefault()
            if (rotateCursorActive) {
                e.stopPropagation()

                // start with default value based off current position
                // then move the value independently of the rotation of the node
                if (!customDirection) {
                    // console.log('NOT CUSTOM DIR')
                    customDirection = ($rotation + 90) % 360
                } else {
                    customDirection = (customDirection + 90) % 360
                }
                customDirection = customDirection
                // console.log($anchorSignalQ, customDirection)
            }
        }}
        style={`position:absolute;left: ${offset[0]}%; top: ${offset[1]}%;`}
    >
        <SvelvetAnchor
            let:linked
            let:hovering
            let:connecting
            id={anchorId}
            key={anchorId}
            direction={(customDirection &&
                (getDirection(customDirection) as Direction)) ||
                (direction as Direction)}
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

<!-- {#key direction} -->
<!--     {@render anchor()} -->
<!-- {/key} -->

{#key $rotation || customDirection}
    {#if io === 'input'}
        {@render anchor()}
    {:else}
        {#key updateTrigger}
            {@render anchor()}
        {/key}
    {/if}
{/key}
