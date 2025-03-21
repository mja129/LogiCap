<script lang="ts">
    import { lastConnected } from '../circuitEngine.svelte'
    import { handleLinkAnchorConnection, removeLinking } from '../circuitStore'

    let {
        linked,
        hovering,
        connecting,
        connectingMirror = $bindable(),
        portName,
        nodeId,
        anchorId,
        io = 'input',
    }: {
        linked: boolean
        hovering: boolean
        connecting: boolean
        connectingMirror: boolean
        portName: string
        nodeId: string
        anchorId: string
        io?: string
    } = $props()

    function createConnectionJson(
        nodeId: string,
        port: string
    ): ConnectorPiece {
        const connection = {
            id: nodeId,
            port: port,
        }

        // IMPORTANT part of the code for creating the connection.
        if (port.startsWith('in')) {
            return { to: connection } as ConnectorTo
        } else {
            return { from: connection } as ConnectorFrom
        }
    }

    // ASSUMPTION: Input can only ever have 1 thing connected to it, but an output can be outputting to multiple inputs
    // I will NOT make this assumption in the handling of unlinking below; but this change is maybe needed.
    // using derived here would be great if that worked. $derived.by()
    // function link(nodeId: string, portName: string) {
    //     const triggeredAnchor = createConnectionJson(nodeId, portName)
    //     return handleLinkAnchorConnection(triggeredAnchor)
    // }

    function findAnchorTargetClassName(
        targetClassList: string[]
    ): string | null {
        const classListArray: string[] = Array.from(targetClassList)

        // Check if any class name matches the patterns
        const matchingClasses = classListArray.filter((className) => {
            return /^(in\d+|in_|out_)/.test(className)
        })
        if (matchingClasses.length === 0) {
            return null
        } else if (matchingClasses.length === 1) {
            return matchingClasses[0]
        } else {
            console.log(
                'Impossible, 2 or more classes in the target anchor are matched'
            )
            return matchingClasses[0]
        }
    }

    function checkIOMatch(anchor1: string, anchor2: string): string {
        if (
            anchor1.substring(0, 2) === 'in' &&
            anchor2.substring(0, 2) == 'in'
        ) {
            return 'bad_dual_input'
        } else if (
            anchor1.substring(0, 3) === 'out' &&
            anchor2.substring(0, 3) == 'out'
        ) {
            return 'bad_dual_output'
        } else {
            return 'good'
        }
    }

    function createGlobalConnection(sourceClass: string, destClass: string) {
        const [port, nodeType, uuid] = sourceClass.split('_')
        const [portD, nodeTypeD, uuidD] = destClass.split('_')

        // side effects
		//*gs Type Casting?
        const sourceConnectionJson: ConnectorFrom = createConnectionJson(
            `${nodeType}_${uuid}`,
            port
        )
		//*gs Type Casting?
        const destConnectionJson: ConnectorTo = createConnectionJson(
            `${nodeTypeD}_${uuidD}`,
            portD
        )

        // make sure that it is in the right order, From -> to
        let wireId: string | null = null
		//* Type Connector
        let connector: Connector = null
        wireId = destClass + '-' + sourceClass
        if (port.startsWith('in')) {
            connector = {
                ...destConnectionJson,
                ...sourceConnectionJson,
                name: `${wireId}`,
            }
        } else {
            wireId = sourceClass + '-' + destClass
            connector = {
                ...sourceConnectionJson,
                ...destConnectionJson,
                name: `${wireId}`,
            }
        }
        // nodeMap[nodeName] = connectionMap[outputAnchorName]
        // side effects
        return {
            name: wireId,
            connection: connector,
        }
    }

    function checkDestLinked(
        eventClassList: string[],
        sourceClassName: string | null
    ) {
        const destClassName: string | null =
            findAnchorTargetClassName(eventClassList)
        // @ts-ignore
        const destAnchorLinked = eventClassList.contains('linked')

        if (sourceClassName === null) {
            console.warn(
                'sourceClassName is for a linking is null, this should be impossible'
            )
            return 'impossible'
        }

        let validLinking = 'bad'
        if (destClassName !== null) {
            validLinking = checkIOMatch(sourceClassName, destClassName)
            if (destAnchorLinked && destClassName.substring(0, 2) === 'in') {
                // fires when destination is an input and is already linked
                // console.warn(
                //     `trying to connect to an input that has already been connected to: bad_input_already_linked`
                // )
                validLinking = 'bad_input_already_linked'
            } else if (
                destAnchorLinked &&
                destClassName.substring(0, 3) === 'out'
            ) {
                // fires when destination is an output and is already linked.
                validLinking = 'good_multiple_outputs'
            } else if (validLinking === 'good') {
                // fires on valid linking
                validLinking = 'good'
            } else if (validLinking !== 'good') {
                // fires when both are input or both are output
                // console.warn(
                //     `attempted to link two anchors of the same type: linking invalid: ${validLinking}`
                // )
                validLinking = validLinking // this doesn't do anything, but its more explicit.
            }
        } else {
            // console.warn('dropped edge on canvas most likely')
            return 'bad_invalid_drop'
        }

        if (validLinking.startsWith('good')) {
            // update bound prop saying if an edge is a connecting edge or a connected edge
            // this is important because we need to know that it was made.
            connectingMirror = false
            // console.log(
            //     `valid linking from ${sourceClassName} to ${destClassName}`
            // )
            const wire: { name: string; connection: Connector } =
                createGlobalConnection(sourceClassName, destClassName)

            // side effects
            $lastConnected = wire.name
            handleLinkAnchorConnection(wire.connection)
        }
        return validLinking
    }
    const makeStickyConnectHandler = (anchorClass: string) => {
        function handleStickyConnect(event: any) {
            event.preventDefault()
            event.stopPropagation()
            // console.log('Click After sticky edge')

            const validateLinking = checkDestLinked(
                event.target.classList,
                anchorClass
            )

            document.removeEventListener('mousedown', handleStickyConnect, true)
        }
        return handleStickyConnect
    }
    $effect(() => {
        // Create event listener for mouse down with useCapture
        if (connecting) {
            if (io === 'input') {
                // console.log('Started connecting an input')
            }
            const handleMouseUp = (e: any) => {
                // anchor dropped on source.
                // create a click listener
                const sourceAnchorClass: string | null =
                    findAnchorTargetClassName(e.target.classList)
                // source is the same as destination, handle sticky.
                if (
                    sourceAnchorClass != null &&
                    sourceAnchorClass === anchorId
                ) {
                    // console.log('dropped on source sticky edge')

                    const handleStickyConnect: (event: any) => void =
                        makeStickyConnectHandler(sourceAnchorClass)

                    document.addEventListener(
                        'mousedown',
                        handleStickyConnect,
                        true
                    ) // create a on click useCapture click listener, on that listener, run findAnchorTargetClass(e.target.classList) name on the click target
                } else if (sourceAnchorClass !== null) {
                    const validateLinking = checkDestLinked(
                        e.target.classList, // where mouse up happened
                        anchorId // the node that created these listeners.
                    )
                } else {
                    // not dropped on an anchor, probably the canvas
                    // console.warn('invalid drop location, no linking created.')
                }

                document.removeEventListener('mouseup', handleMouseUp, true)
                return sourceAnchorClass
            }
            document.addEventListener('mouseup', handleMouseUp, true)
        }
    })

    // TODO, may need to listen to onUnmount
    // I think on disconnect has a default event from svelvet, try that out also this effect may set state to false many times, but honestly nah.
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="custom_anchor {io === 'input' ? 'input' : 'output'} {anchorId}"
    class:linked
    class:hovering
    class:connecting
    onmousedowncapture={() => {
        if (linked && io === 'input') {
            // make sure we are adding to the end of the list and starting the search from there.
            // Stack order
            removeLinking(nodeId)
        }
    }}
></div>

<style>
    .custom_anchor {
        border: 2px solid black;
        border-radius: 50%;
        height: 12.5px;
        width: 12.5px;
    }
    .linked {
        background-color: black !important;
    }
    .input.connecting {
        background-color: var(--lime-red) !important;
        border: 2px solid black;
    }
    .output.connecting {
        background-color: var(--lime-green);
        border: 2px solid black;
    }
    .input.linked {
        border: 1px solid var(--red);
    }
    .output.linked {
        border: 1px solid green;
    }

    .input {
        background-color: red;
        background-color: var(--red);
    }
    .output {
        background-color: green;
    }
</style>
