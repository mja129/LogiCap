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
