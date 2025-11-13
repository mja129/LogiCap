export function setAnchor(port: string, nodeId: string, wireChange: number) {
    const anchorClassName = '.' + port + "_" + nodeId


    const anchorElement: HTMLElement | null = document.querySelector(`${anchorClassName}`)

    console.assert(anchorElement !== null, 'could not find Anchor class when setting anchor colors while running')
    if (anchorElement === null) return

    const hasClass = (anchor: HTMLElement, className: string) => anchor.classList.contains(className)
    const isOff = (anchor: HTMLElement) => hasClass(anchor, 'on')
    const isOn = (anchor: HTMLElement) => hasClass(anchor, 'off')

    const getAnchorStates = (anchor: HTMLElement) => [isOn(anchor), isOff(anchor)]

    const [anchorWasOn, anchorWasOff] = getAnchorStates(anchorElement)

    // only sets if something changed.
    // will this code even rerun if change from 1 -> 1
    // yes on run and rerun circuit.
    if (wireChange === 1 && anchorWasOn) {
        // make sure that if we are on, that we 
        anchorElement.classList.remove('off')
        anchorElement.classList.add('on')
    }
    else if (wireChange === 0 && anchorWasOff) {
        anchorElement.classList.remove('on')
        anchorElement.classList.add('off')
    }
    else if (wireChange === -1) {
        anchorElement.classList.remove('on')
        anchorElement.classList.remove('off')
    }
    else if (!anchorWasOn && !anchorWasOff) {
        // on or off have not been set before, for this anchor
        anchorElement.classList.add(wireChange === 1 ? 'on' : 'off')
    }
}

export function getDOMParent(edgeWrapper: SVGPathElement | null) {
    console.assert(
        edgeWrapper !== null,
        "A wire was mounted with an empty edgeWrapper binding, maybe it hasn't loaded yet"
    )
    return edgeWrapper?.parentElement
}
// ⭐️  Good Comment ⭐️
// edge-wrapper is a child element of the DOM element that we are looking for
// svelvet generates a sibling of edge-wrapper, with an id that looks something like this
// A-in2_Nand_R6ecBvquImEbPYoo/N-Nand_R6ecBvquImEbPYoo+A-out_Button_NqRwJIgwMnCkcvwZ/N-Button_NqRwJIgwMnCkcvwZ-target
// The element we are looking for has the attribute -> value pairing role="presentation"
// There are probably less than 5 sibling nodes for edge-wrapper, so the iteration is really no concern: O(>5)
export function getDOMSiblings(edgeWrapper: SVGPathElement | null) {
    const parentElement = getDOMParent(edgeWrapper)
    // these case is so impossible, I think it needs to be the rooot-most element
    console.assert(
        parentElement,
        'edge Wrapper is not null but edgeWrapper binding has no parentElement'
    )

    return edgeWrapper?.parentElement?.childNodes ?? null;
}

// helper function for getWireIdFromDOM
const inputAncIdFromEleId = (edgeId: string) => {
    const startInputId = edgeId.indexOf('-') + 1
    const endInputId = edgeId.indexOf('/')
    return edgeId.substring(startInputId, endInputId)
}

export function getSvelvetEdgeEle(edgeWrapper: SVGPathElement | null) {

    const siblings = getDOMSiblings(edgeWrapper) as NodeListOf<HTMLElement>

    // okay  this is super ugly
    const edge: HTMLElement | null =
        (siblings &&
            Array.from(siblings)
                .find((ele) => ele.role === 'presentation') || null)

    return edge
}

export function getWireIdFromDOM(
    edgeWrapper: SVGPathElement | null,
    sourceAncId: string
): [string, string] {
    const edgeId = getSvelvetEdgeEle(edgeWrapper)?.getAttribute('id')

    if (!edgeId) throw new Error('No ID found on the edgeNode')

    // we could also get initId from the class itself.
    // I don't this this keeps a strict input-output ordering.
    const wireId = sourceAncId + '-' + inputAncIdFromEleId(edgeId)
    return [wireId, edgeId]
}


