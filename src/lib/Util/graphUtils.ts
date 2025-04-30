// graphUtils.ts
export let setScale = (val:number) => {};
export let setTranslation = (val: { x: number; y: number }) => {};

//Some Function Bridging

export function registerGraphControls(realScale: (val: number) => void, realTranslation: (val: { x: number; y: number }) => void) {
    setScale = realScale;
    setTranslation = realTranslation;
}