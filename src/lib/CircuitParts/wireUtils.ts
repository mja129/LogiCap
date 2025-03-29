// extend the default svg element.
// the 'declare global' makes it so that we are extending rather than overriding the Type
// More javascripty way is with object.assign
//
// // I wonder what's the more TS way to do this.
// ANS: The More TS way to do this ⬇️
// class SVGLamp extends SVGElement {
//     setLampColors(this: SVGElement, [mainColor, accentColor]: [string, string]): void {
// }
// Except it did not work
declare global {
    interface SVGElement {
        setLampColors(this: SVGElement, [main, accent]: [string, string]): void
    }
}

// how much overhead is this, I think not a lot tbh.
Object.assign(SVGElement.prototype, {
    setLampColors,
})

function setLampColors(this: SVGElement, [mainColor, accentColor]: [string, string]): void {
    const circleElement: SVGElement | null = this.querySelector('circle')
    const lineElement: SVGElement | null = this.querySelector('line')

    // condition should be flipped because assert only returns on false
    console.assert(
        circleElement !== null && lineElement !== null,
        'likely tried to call custom svg method on the wrong element'
    )

    if (circleElement === null || lineElement === null) return

    circleElement.setAttribute('stroke', accentColor)
    circleElement.setAttribute('fill', mainColor)
    lineElement.setAttribute('stroke', mainColor)
}


// gets lamp element and sets the svg properties, a very convoluted, but also kind of nice way.
export function setLamp(connectedTo: string, wireChange: number) {
    const lampOnColors: [string, string] = ['green', 'var(--lime-green)']
    const lampOffColors: [string, string] = ['red', 'var(--lime-red)']

    const getLampSvgEle: Function = () => (document.querySelector(`#N-${connectedTo} svg.LampSVG`))
    let currLampSvg: SVGElement | null = getLampSvgEle()
    if (currLampSvg === null) return

    // extend the default SVGElement, isnt that kinda sorta cool
    currLampSvg.setLampColors(
        (wireChange === 1 && lampOnColors) || lampOffColors
    )
}

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

// ⭐️  Good Comment ⭐️
// edge-wrapper is a child element of the DOM element that we are looking for
// svelvet generates a sibling of edge-wrapper, with an id that looks something like this
// A-in2_Nand_R6ecBvquImEbPYoo/N-Nand_R6ecBvquImEbPYoo+A-out_Button_NqRwJIgwMnCkcvwZ/N-Button_NqRwJIgwMnCkcvwZ-target
// The element we are looking for has the attribute -> value pairing role="presentation"
// There are probably less than 5 sibling nodes for edge-wrapper, so the iteration is really no concern O(>5)
function getDOMSiblings(edgeWrapper: SVGPathElement | null) {
    console.assert(
        edgeWrapper !== null,
        "A wire was mounted with an empty edgeWrapper binding, maybe it hasn't loaded yet"
    )
    // these case is so impossible, I think it needs to be the rooot-most element
    console.assert(
        edgeWrapper?.parentElement !== null,
        'edge Wrapper is not null but edgeWrapper binding has no parentElement'
    )
    if (
        edgeWrapper === null ||
        edgeWrapper.parentElement === null ||
        edgeWrapper.parentElement.childNodes === null
    ) {
        return null
    }

    return edgeWrapper.parentElement.childNodes
}

// helper function for getWireIdFromDOM
const inputAncIdFromEleId = (edgeId: string) => {
    const startInputId = edgeId.indexOf('-') + 1
    const endInputId = edgeId.indexOf('/')
    return edgeId.substring(startInputId, endInputId)
}

export function getWireIdFromDOM(
    edgeWrapper: SVGPathElement | null,
    sourceAncId: string
): string | null {
    const siblings = getDOMSiblings(edgeWrapper) as NodeListOf<HTMLElement>

    // okay  this is super ugly
    const edgeId: string | null =
        (siblings &&
            Array.from(siblings)
                .find((ele) => ele.role === 'presentation')
                ?.getAttribute('id')) ||
        null

    console.assert(edgeId !== null, 'No ID found on the edgeNode')
    if (!edgeId) return null

    // we could also get initId from the class itself.
    // I don't this this keeps a strict input-output ordering.
    const wireId = sourceAncId + '-' + inputAncIdFromEleId(edgeId)
    return wireId
}
