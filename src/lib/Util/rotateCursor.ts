function createElementUnderMouse(querySelector: string, elementToCreate: HTMLElement) {
    document.querySelector(querySelector)?.addEventListener('mousemove', function (this: Element, event: Event) {
        const mouseEvent = event as MouseEvent;
        const element = elementToCreate.cloneNode(true) as HTMLElement;
        element.style.position = 'absolute';
        element.style.left = `${mouseEvent.pageX}px`;
        element.style.top = `${mouseEvent.pageY}px`;
        document.body.appendChild(element);
    });
}
