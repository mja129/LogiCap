const DEVMODE = import.meta.env.DEV

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

// at what percentage of 10! do we start to worry about hash collisions
export function generateNonce(length: number = 10): string {
    const charset =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(
        values,
        (byte) => charset[byte % charset.length]
    ).join('')
}
