import { getDOMParent } from './wireUtils.ts'
interface Point {
    x: number
    y: number
}
const SVG_NS = 'http://www.w3.org/2000/svg'

const manipulationElementClassNames = [
    '.handle1',
    '.handle2',
    '.end_point1',
    '.end_point2',
    '#controlPoint1',
    '#controlPoint2'
];

const manipulationElementNames = manipulationElementClassNames.map(className => className.substring(1));

/**
 * Generic helper to create an SVG element with specified attributes.
 * Does NOT append the element to the DOM.
 * @param tagName The SVG tag name (e.g., 'line', 'circle').
 * @param attributes An object mapping attribute names to string values.
 * @returns The created SVG element.
 */
function createSVGElement<K extends keyof SVGElementTagNameMap>(
    tagName: K,
    attributes: { [key: string]: string }
): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tagName)
    for (const key in attributes) {
        // Ensure the property belongs to the object and not its prototype chain
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
            element.setAttribute(key, attributes[key])
        }
    }
    return element
}

/**
 * Creates an SVG <line> element with specified start/end points and class.
 * Does NOT append the element to the DOM.
 * @param p1 Start point {x, y} of the line.
 * @param p2 End point {x, y} of the line.
 * @param className Optional CSS class name (defaults to 'control-line').
 * @returns The created SVGLineElement.
 */
export function createHandleLine(
    p1: Point,
    p2: Point,
    reqClass: string,
    className: string = 'control-line'
): SVGLineElement {
    if (isNaN(p1?.x) || isNaN(p1?.y) || isNaN(p2?.x) || isNaN(p2?.y)) {
        console.error(
            'Invalid coordinates provided to createHandleLine:',
            p1,
            p2
        )
        // Return a default/empty line or throw error? Returning default for now.
        return createSVGElement('line', {
            class: reqClass+" "+className,
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '0',
        })
    }
    return createSVGElement('line', {
        class: reqClass+" "+className,
        x1: p1.x.toString(),
        y1: p1.y.toString(),
        x2: p2.x.toString(),
        y2: p2.y.toString(),
    })
}

/**
 * Creates an SVG <circle> element with specified center, radius, and class.
 * Typically used for non-draggable end points.
 * Does NOT append the element to the DOM.
 * @param center The center point {x, y} of the circle.
 * @param radius The radius of the circle (defaults to 6).
 * @param className Optional CSS class name (defaults to 'end-point').
 * @returns The created SVGCircleElement.
 */
export function createEndPointCircle(
    center: Point,
    reqClass: string,
    radius: number = 6,
    className: string = 'end-point'
): SVGCircleElement {
    if (isNaN(center?.x) || isNaN(center?.y) || isNaN(radius)) {
        console.error(
            'Invalid parameters provided to createEndPointCircle:',
            center,
            radius
        )
        return createSVGElement('circle', {
            class: reqClass+" "+className,
            cx: '0',
            cy: '0',
            r: '6',
        })
    }
    return createSVGElement('circle', {
        class: reqClass+" "+className,
        cx: center.x.toString(),
        cy: center.y.toString(),
        r: radius.toString(),
    })
}

/**
 * Creates an SVG <circle> element intended for draggable control points.
 * Includes default radius, class, and styles useful for interaction.
 * Does NOT append the element to the DOM.
 * @param center The center point {x, y} of the circle.
 * @param radius The radius of the circle (defaults to 8).
 * @param className Optional CSS class name (defaults to 'control-point').
 * @returns The created SVGCircleElement.
 */
export function createControlPointCircle(
    center: Point,
    id: string,
    radius: number = 8,
    className: string = 'control-point',
): SVGCircleElement {
    if (isNaN(center?.x) || isNaN(center?.y) || isNaN(radius)) {
        console.error(
            'Invalid parameters provided to createControlPointCircle:',
            center,
            radius
        )
        return createSVGElement('circle', {
            class: className,
            cx: '0',
            cy: '0',
            r: '50',
        })
    }
    const circle = createSVGElement('circle', {
        class: className,
        id,
        cx: center.x.toString(),
        cy: center.y.toString(),
        r: radius.toString(),
    })
    // Add styles/attributes often useful for draggable SVG elements
    circle.style.touchAction = 'none' // Prevents scrolling on touch devices when dragging
    return circle
}

/**
 * Parses the 'd' attribute of a cubic Bezier path string.
 * Expects the format "M x0 y0 C x1 y1, x2 y2, x3 y3".
 * Handles optional whitespace, decimals, and negative numbers.
 * @param d The 'd' attribute string.
 * @returns An object with points p0, p1, p2, p3, or null if parsing fails.
 */
function parseCubicBezierD(
    d: string | null
): { p0: Point; p1: Point; p2: Point; p3: Point } | null {
    // Added check for null or empty string
    if (!d || typeof d !== 'string' || d.trim() === '') {
        console.warn('parseCubicBezierD received invalid input:', d)
        return null
    }

    let parsePath = '';
    const startIndex = d.indexOf('M');
    parsePath = d.substring(startIndex + 1).replace('C', '')

    const match = parsePath.split(' ').reduce<string[]>((acc, val) => {
        val = val.trim();
        if (val !== '') {
            if (val.endsWith(',')) {
                val = val.slice(0, -1);
            }
            acc.push(val);
        }
        return acc;
    }, []);


    try {
        // match[0] is the full matched string. Captures start at index 1.
        const points = {
            p0: { x: parseFloat(match[0]), y: parseFloat(match[1]) }, // Start Point
            p1: { x: parseFloat(match[2]), y: parseFloat(match[3]) }, // Control Point 1
            p2: { x: parseFloat(match[4]), y: parseFloat(match[5]) }, // Control Point 2
            p3: { x: parseFloat(match[6]), y: parseFloat(match[7]) }, // End Point
        }
        // Check for NaN results from parseFloat which indicates invalid number format within the string
        if (
            isNaN(points.p0.x) ||
            isNaN(points.p0.y) ||
            isNaN(points.p1.x) ||
            isNaN(points.p1.y) ||
            isNaN(points.p2.x) ||
            isNaN(points.p2.y) ||
            isNaN(points.p3.x) ||
            isNaN(points.p3.y)
        ) {
            console.error('Parsed coordinates resulted in NaN:', d, points)
            return null
        }
        return points
    } catch (e) {
        console.error('Error parsing numbers from path data:', d, e)
        return null
    }
}

/**
 * Sets the positions of handle lines and control/end point circles
 * based on the coordinates parsed from a Bezier curve's 'd' attribute string.
 *
 * @param dAttribute The 'd' attribute string from the main SVG path element (e.g., "M 100 200 C ...").
 * @param elementsToUpdate An object containing references to the SVG elements to be positioned.
 * @returns True if initialization was successful, false otherwise.
 */

export function toolsOn(svg: SVGPathElement) {
    const domParent = getDOMParent(svg);

    if (!domParent) throw new Error('Wire is not god');
    
    manipulationElementClassNames.forEach(className => {
        const element = domParent.querySelector(className) as SVGElement;
        if (element && element.style?.display === "none") {
            element.style.display = ''
        }
    })
}
export function toolsOff(svg: SVGPathElement) {
    const domParent = getDOMParent(svg);

    if (!domParent) throw new Error('Wire is not god');
    
    manipulationElementClassNames.forEach(className => {
        const element = domParent.querySelector(className) as SVGElement;
        if (element) {
            element.style.display = 'none';
        }
    })
}
export function toggleManipulationTools(svg: SVGPathElement) {
    const domParent = getDOMParent(svg);

    if (!domParent) throw new Error('Wire is not god');
    
    manipulationElementClassNames.forEach(className => {
        const element = domParent.querySelector(className) as SVGElement;
        if (element) {
            element.style.display = element.style.display === 'none' ? '' : 'none';
        }
    })
}


export function createDragWire(svg: SVGPathElement, pathUpdate: string = "") {
    // const svg: HTMLElement | null = document.getElementById(wireId)
    // const startPoint = document.getElementById('startPoint')
    // const endPoint = document.getElementById('endPoint')
    // const controlPoint1 = document.getElementById('controlPoint1')
    // const controlPoint2 = document.getElementById('controlPoint2')
    // const handle1 = document.getElementById('handle1')
    // const handle2 = document.getElementById('handle2')
    // console.log('tried to create drag wire again')

    const updatePoints = ( pathUpdate !== "" && parseCubicBezierD(pathUpdate) ) || null
    let initPoints = svg.getAttribute('d') && parseCubicBezierD(svg.getAttribute('d'))


    if (!initPoints) return console.log('unable to parse path'), null

    if (updatePoints) {
        // console.info(`P0-DIFF +${initPoints.p0.x-updatePoints}, ${initPoints.p0.x}`)
        // console.info(`p0-X: +${updatePoints.p0.x}, ${initPoints.p0.x}`)
        // console.info(`p3-X:+${updatePoints.p3.x}, ${initPoints.p3.x}`)
        //
        // console.info(`p0-Y: +${updatePoints.p0.y}, ${initPoints.p0.y}`)
        // console.info(`p3-Y:+${updatePoints.p3.y}, ${initPoints.p3.y}`)
        //
        //  console.info(updatePoints.p3.x, initPoints.p3.x )
        const vectorP0 = {
            x: updatePoints.p0.x - initPoints.p0.x,
            y: updatePoints.p0.y - initPoints.p0.y
        };

        const vectorP1 = {
            x: updatePoints.p1.x - initPoints.p1.x,
            y: updatePoints.p1.y - initPoints.p1.y
        };
        console.log('Vector:', vectorP0, vectorP1);
    }

    const domParent = getDOMParent(svg);
    if (!domParent) throw new Error('Wire is not god');
    

    // const existingElements = (Array.from(domParent.childNodes).map(element => Array.from((element as SVGElement)?.classList)))
    const existingElements = new Map<string, SVGElement | null>(
        manipulationElementClassNames.map(className => [className.substring(1), (domParent.querySelector(className) as SVGElement) || null] )
    );

    
    let elementsMap = new Map<string, SVGElement>([
        [manipulationElementNames[0], existingElements.get(manipulationElementNames[0]) || createHandleLine(initPoints.p0, initPoints.p1, 'handle1')],
        [manipulationElementNames[1], existingElements.get(manipulationElementNames[1]) || createHandleLine(initPoints.p3, initPoints.p2, 'handle2')],
        [manipulationElementNames[2], existingElements.get(manipulationElementNames[2]) || createEndPointCircle(updatePoints?.p0 || initPoints.p0, "end_point1")],
        [manipulationElementNames[3], existingElements.get(manipulationElementNames[3]) || createEndPointCircle(updatePoints?.p3 || initPoints.p3, "end_point2")],
        [manipulationElementNames[4], existingElements.get(manipulationElementNames[4]) || createControlPointCircle(updatePoints?.p1 || initPoints.p1, "controlPoint1")],
        [manipulationElementNames[5], existingElements.get(manipulationElementNames[5]) || createControlPointCircle(updatePoints?.p2 || initPoints.p2, "controlPoint2")],
    ]);




    
    // This is the code that takes the path from svelvet and sets the control points to dynamically update accordingly.
    const endPoint1 = elementsMap.get(manipulationElementNames[2]) as SVGCircleElement;
    const controlPoint1 = elementsMap.get(manipulationElementNames[4]) as SVGCircleElement;
    const controlPoint2 = elementsMap.get(manipulationElementNames[5]) as SVGCircleElement;

    if (endPoint1) {
        const oldX1 = endPoint1.getAttribute('cx');
        const oldY1 = endPoint1.getAttribute('cy');
        // console.log(`End Point 1 - Old Position: (${oldX1}, ${oldY1})`);
    
        const newX1 = updatePoints?.p0.x.toString() || initPoints.p0.x.toString();
        const newY1 = updatePoints?.p0.y.toString() || initPoints.p0.y.toString();
        
        endPoint1.setAttribute('cx', newX1);
        endPoint1.setAttribute('cy', newY1);
    
        const deltaX1 = parseFloat(newX1) - parseFloat(oldX1 || "");
        const deltaY1 = parseFloat(newY1) - parseFloat(oldY1 || "");


        const moveControlX = controlPoint1?.setAttribute('cx', String((parseFloat(controlPoint1.getAttribute('cx') ||'0')) + deltaX1))
        const moveControlY =controlPoint1?.setAttribute('cy', String((parseFloat(controlPoint1.getAttribute('cy') || '0')) + deltaY1 ))
        // console.log(`End Point 1 - Position Delta: (${deltaX1}, ${deltaY1})`);
    }
    
    const endPoint2 = elementsMap.get(manipulationElementNames[3]) as SVGCircleElement;
    if (endPoint2) {
        const oldX2 = endPoint2.getAttribute('cx');
        const oldY2 = endPoint2.getAttribute('cy');
        // console.log(`End Point 2 - Old Position: (${oldX2}, ${oldY2})`);
    
        const newX2 = updatePoints?.p3.x.toString() || initPoints.p3.x.toString();
        const newY2 = updatePoints?.p3.y.toString() || initPoints.p3.y.toString();
        
        endPoint2.setAttribute('cx', newX2);
        endPoint2.setAttribute('cy', newY2);
    
        const deltaX2 = parseFloat(newX2) - parseFloat(oldX2 || "");
        const deltaY2 = parseFloat(newY2) - parseFloat(oldY2 || "");

        const moveControlX = controlPoint2?.setAttribute('cx', String((parseFloat(controlPoint2.getAttribute('cx') ||'0')) + deltaX2))
        const moveControlY =controlPoint2?.setAttribute('cy', String((parseFloat(controlPoint2.getAttribute('cy') || '0')) + deltaY2 ))

        // get controlPoint2 and offset it acoording to the "delta"
        // console.log(`End Point 2 - Position Delta: (${deltaX2}, ${deltaY2})`);
    }
    // console.log(elementsMap)
    //


    /// !!! TODO , this is totally invalid and creating extra elements.
    for (const elementName of manipulationElementNames) {
        // if (existingElements.has(elementName)) {
        //     console.count('appended '+ elementName + "once for one wire, only set on the first time")
            domParent.appendChild(elementsMap.get(elementName) as SVGElement);
            // existingElements.set(elementName, newElement);
        // }
    }

    let selectedElement: SVGCircleElement | null = null
    let offset = { x: 0, y: 0 }

    interface Point {
        x: number
        y: number
    }

    // Store points data for easier updates
    let points = {
        p0: {
            x: parseFloat(elementsMap.get('end_point1')?.getAttribute('cx')!),
            y: parseFloat(elementsMap.get('end_point1')?.getAttribute('cy')!),
        },
        p1: {
            x: parseFloat(
                elementsMap.get('controlPoint1')?.getAttribute('cx')!
            ),
            y: parseFloat(
                elementsMap.get('controlPoint1')?.getAttribute('cy')!
            ),
        },
        p2: {
            x: parseFloat(
                elementsMap.get('controlPoint2')?.getAttribute('cx')!
            ),
            y: parseFloat(
                elementsMap.get('controlPoint2')?.getAttribute('cy')!
            ),
        },
        p3: {
            x: parseFloat(elementsMap.get('end_point2')?.getAttribute('cx')!),
            y: parseFloat(elementsMap.get('end_point2')?.getAttribute('cy')!),
        },
    }

    function updatePathAndHandles() {
        // Update Bezier curve path data string
        const d = `M ${points.p0.x} ${points.p0.y} C ${points.p1.x} ${points.p1.y}, ${points.p2.x} ${points.p2.y}, ${points.p3.x} ${points.p3.y}`

        svg.setAttribute('d', d)

        // Update handle lines
        if (!elementsMap.get('handle1') || !elementsMap.get('handle2'))
            return (
                console.warn('no handles on the edge you tried to update'), null
            )

        elementsMap.get("handle1")?.setAttribute('x1', points.p0.x.toString())
        elementsMap.get("handle1")?.setAttribute('y1', points.p0.y.toString())
        elementsMap.get("handle1")?.setAttribute('x2', points.p1.x.toString())
        elementsMap.get("handle1")?.setAttribute('y2', points.p1.y.toString())

        elementsMap.get("handle2")?.setAttribute('x1', points.p3.x.toString())
        elementsMap.get("handle2")?.setAttribute('y1', points.p3.y.toString())
        elementsMap.get("handle2")?.setAttribute('x2', points.p2.x.toString())
        elementsMap.get("handle2")?.setAttribute('y2', points.p2.y.toString())
    }

    function getMousePosition(evt: MouseEvent | TouchEvent): Point | null {
        if (!svg)
            return console.warn('no svg found on get mouse position'), null

        const CTM = (svg as SVGPathElement).getScreenCTM()
        if (!CTM) return { x: 0, y: 0 } // Should not happen in modern browsers

        // Check if it's a touch event
        const clientX =
            (evt as MouseEvent).clientX ??
            (evt as TouchEvent).touches?.[0]?.clientX
        const clientY =
            (evt as MouseEvent).clientY ??
            (evt as TouchEvent).touches?.[0]?.clientY

        if (clientX === undefined || clientY === undefined) {
            console.warn('Could not get clientX/Y from event:', evt)
            return null // Or return last known position?
        }

        return {
            x: (clientX - CTM.e) / CTM.a,
            y: (clientY - CTM.f) / CTM.d,
        }
    }

    function startDrag(evt: MouseEvent | TouchEvent) {
        // Prevent default behavior (like text selection)
        if (evt.type === 'mousedown') {
            evt.preventDefault()
        }

        if ((evt.target as SVGElement).classList.contains('control-point')) {
            selectedElement = evt.target as SVGCircleElement
            const mousePos = getMousePosition(evt)
            if (!mousePos) return // Exit if coordinates couldn't be determined

            // Calculate offset between mouse click and circle center
            offset.x =
                mousePos.x - parseFloat(selectedElement.getAttribute('cx')!)
            offset.y =
                mousePos.y - parseFloat(selectedElement.getAttribute('cy')!)

            // Add listeners for dragging and stopping drag to the whole document
            // This ensures dragging continues even if mouse leaves the circle/SVG
            document.addEventListener('mousemove', drag)
            document.addEventListener('touchmove', drag, { passive: false }) // passive: false to allow preventDefault
            document.addEventListener('mouseup', endDrag)
            document.addEventListener('touchend', endDrag)
            document.addEventListener('mouseleave', endDrag) // Optional: Stop drag if mouse leaves browser window
        }
    }

    function drag(evt: MouseEvent | TouchEvent) {
        if (selectedElement) {
            // Prevent default only for touchmove to avoid scrolling etc.
            if (evt.type === 'touchmove') {
                evt.preventDefault()
            }

            const mousePos = getMousePosition(evt)
            if (!mousePos) return // Exit if coordinates couldn't be determined

            const newX = (mousePos.x - offset.x)
            const newY = (mousePos.y - offset.y)

            // Update the visual circle position
            selectedElement.setAttribute('cx', newX.toString())
            selectedElement.setAttribute('cy', newY.toString())

            // Update the corresponding point in our data structure
            if (selectedElement.id === 'controlPoint1') {
                points.p1.x = newX
                points.p1.y = newY
            } else if (selectedElement.id === 'controlPoint2') {
                points.p2.x = newX
                points.p2.y = newY
            }
            else {
                console.warn('reached error')
            }

            // Update the path and handle lines based on the new point data
            updatePathAndHandles()
        }
    }

    function endDrag(evt: MouseEvent | TouchEvent) {
        if (selectedElement) {
            // Remove dragging listeners from the document
            document.removeEventListener('mousemove', drag)
            document.removeEventListener('touchmove', drag)
            document.removeEventListener('mouseup', endDrag)
            document.removeEventListener('touchend', endDrag)
            document.removeEventListener('mouseleave', endDrag)

            selectedElement = null
        }
    }

    // Attach initial event listeners for starting the drag
    elementsMap.get("controlPoint1")?.addEventListener('mousedown', startDrag)
    elementsMap.get("controlPoint2")?.addEventListener('mousedown', startDrag)
    // add touch event listeners

    // initial draw
    updatePathAndHandles()
}
