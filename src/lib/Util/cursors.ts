export function rejectMoveClick(e: MouseEvent, successFn: Function) {
    e.preventDefault()
    // e.stopImmediatePropagation()

    let isDragging = false
    const startX = e.clientX
    const startY = e.clientY
    const dragThreshold = 5 // Allow for small movements while clicking

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const distanceX = moveEvent.clientX - startX
        const distanceY = moveEvent.clientY - startY
        // euclidian distance
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        if (distance > dragThreshold) {
            isDragging = true
            cleanup()
        }
    }

    const handleMouseUp = () => {
        if (!isDragging) successFn(e)
        cleanup()
    }

    function cleanup() {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
}
    // the lamp needs this hack because it only has an input node
    // theoretically it works for all but its not very declarative.
    // I just noticed that the edit wired dont delete themselves with this rerender solution
    // no its the input anchor on all of them that does that.
export function rerenderInputAnchorHack(ancId: string) {
        // Wire glitch on dev mode fix

        const down = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: false,
        })
        const up = new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: false,
        })
        const anc: HTMLElement | null = document.querySelector(`.${ancId}`)

        if (!anc) return console.warn('no element of the specified ID'), null

        anc.dispatchEvent(down)
        anc.dispatchEvent(up)
    }
