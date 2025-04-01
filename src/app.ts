const DEVMODE = import.meta.env.DEV

console.log("IS DEVMODE: "+DEVMODE)

// at what percentage of 10! (10 factorial) do we start to worry about hash collisions
export function generateNonce(length: number = 10): string {
    const charset =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(
        values,
        (byte) => charset[byte % charset.length]
    ).join('')
}



export function captureCurrentZoom() {

    const graphWrapper: HTMLElement | null = document?.querySelector(
        'div.svelvet-graph-wrapper'
    )    

    if (!graphWrapper) return

    const { transform } = graphWrapper.style

    const regex = /scale\((.+)\)/;
    const match = transform.match(regex);

    if (!match || !match[1]) return (console.warn('scale property not found on graph-wrapper'), null)

    // first regex capture group (after 0th)
    const scaleValue: number = parseFloat(match[1])

    if (isNaN(scaleValue)) {
        throw new Error('Scale value is not a valid integer.')
    }

    localStorage.setItem('SavedScale', scaleValue.toString())
}

// fix the teleport bug, (one of them)
// fix wire linking issues on dev mode.
export function fixSvelvetBugs() {

    const clickCanvas = () => {

        const svelvetCanvas = document.querySelector('.svelvet-wrapper')
        if (svelvetCanvas) {
            // Create a MouseEvent with additional options
            const event = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
            })

            // Dispatch the event on the canvas
            svelvetCanvas.dispatchEvent(event)
            const eventUp = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
            })
            svelvetCanvas.dispatchEvent(eventUp)
        }
    }

    const hoverAllAnchors = () => {
        // Wire glitch on dev mode fix
        const hoverAnchor = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
        })
        const allAnchors: NodeListOf<HTMLElement> =
            document.querySelectorAll('.anchor-wrapper')

        allAnchors.forEach((anc: HTMLElement) => {
            anc.dispatchEvent(hoverAnchor)
        })
    }
    document.addEventListener('DOMContentLoaded', () => {
        clickCanvas()

        if (!DEVMODE) return

        hoverAllAnchors()
    })
}

