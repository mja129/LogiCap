<script lang="ts">
    import { getContext, onMount } from 'svelte'
    import { registerGraphControls } from '@Util/graphUtils'

    //Did not know about this until trying it, basically this can be used anywhere now to set Zoom or Translation

    import { get, type Readable } from 'svelte/store'

    function isSvelteStore(value: any): value is Readable<any> {
        return value && typeof value.subscribe === 'function'
    }

    function traverse(obj: Record<string, any>): Record<string, any> {
        const output: Record<string, any> = {}
        for (const key in obj) {
            const value = obj[key]
            if (
                key === 'nodes' &&
                typeof value === 'object' &&
                typeof value.getAll === 'function'
            ) {
                const nodesArray = value.getAll() // Obtener todos los nodos
                output[key] = nodesArray.map((node: any) => traverse(node)) // Procesar cada nodo
            } else if (isSvelteStore(value)) {
                const storeValue = get(value)
                output[key] =
                    typeof storeValue === 'object' && storeValue !== null
                        ? traverse(storeValue)
                        : storeValue
                // Si es un objeto anidado, recorrerlo
            } else if (typeof value === 'object' && value !== null) {
                output[key] = traverse(value)
            } else {
                // Para valores primitivos, asignarlos directamente
                output[key] = value
            }
        }
        // console.log("Output después de traverse():", output);
        return output
    }

    function domRectReplacer(_key: string, value: any) {
        if (value instanceof DOMRectReadOnly) {
            return {
                x: value.x,
                y: value.y,
                width: value.width,
                height: value.height,
            }
        }
        return value
    }

    onMount(() => {
        const graph: any = getContext('graph')
        registerGraphControls(
            graph.transforms.scale.set,
            graph.transforms.translation.set
        );


        (window as any).getState = () => {
          const data = traverse(graph);
	        return JSON.stringify(data, domRectReplacer);
        }

        (window as any).getCursor = () => {
            let cur = get(graph.cursor) as any
            return { x: cur.x, y: cur.y }
        }
    })
</script>
