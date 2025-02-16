declare module "svelte-drag-and-drop-actions" {
    export function asDraggable(node: HTMLElement, options?: any): {
        destroy(): void;
        update(options?: any): void;
    };
}