function decodeSvgUrl(dataUrl: string): string {
    if (dataUrl.startsWith('data:image/svg+xml,')) {
        return decodeURIComponent(
            dataUrl.replace('data:image/svg+xml,', '')
        )
    }
    throw new Error('svg format does not match expected format')
}

export function parseSvg(circuitSvg: string): HTMLElement {
    const parser = new DOMParser()
    let parsedSvgDoc: Document
    try {
        parsedSvgDoc = parser.parseFromString(
            decodeSvgUrl(circuitSvg),
            'image/svg+xml'
        )
    } catch (error) {
        // this shouldnt error.
        console.error('Error parsing SVG:', error)
        // Provide a fallback or default SVG here
        parsedSvgDoc = parser.parseFromString(
            '<svg xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">SVG Error</text></svg>',
                'image/svg+xml'
        )
    }
    return parsedSvgDoc.documentElement
}

export function makeEmptySvgEle(): SVGElement {
    const SVG_NS = 'http://www.w3.org/2000/svg'

    const circuitSvgEle = document.createElementNS(SVG_NS, 'svg')

    return circuitSvgEle
}

export function getViewbox(parsedSvg: HTMLElement): string {
    let svgViewbox: string
    if (parsedSvg.hasAttribute('viewBox')) {
        // not checking for empty attribute but that doesn't seem necessary
        svgViewbox = parsedSvg.getAttribute('viewBox') as string
    } else {
        // this fallback is unlikely because of of the cehck decodeSvgUrl() does
        console.warn('svg passed in does not have a view box attribute')
        svgViewbox = '10 100 490 312'
    }
    return svgViewbox
}
