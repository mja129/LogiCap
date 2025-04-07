<script lang="ts">
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    // import Switch from './Switch.svelte'

    let {
        width = 80,
        height = 50,
        nodeId,
        rotation = $bindable(),
    }: {
        width?: number
        height?: number
        nodeId: string
        rotation?: number
    } = $props()

    const lampOffset: [number, number] = [-5, 35.43]

    // const a = $derived((rotation: number) => {
    //     rerenderInputAnchorHack()
    // })

    // the lamp needs this hack because it only has an input node
    // theoretically it works for all but its not very declarative.
    // I just noticed that the edit wired dont delete themselves with this rerender solution
    // no its the input anchor on all of them that does that.
    const rerenderInputAnchorHack = () => {
        // Wire glitch on dev mode fix
        console.log('hovered')

        const down = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: false,
        })
        const up = new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: false,
        })
        const anc: HTMLElement | null = document.querySelector(`.in_${nodeId}`)

        console.log(nodeId)
        if (!anc) return console.warn('no element of the specified ID'), null

        anc.dispatchEvent(down)
        anc.dispatchEvent(up)
    }

    $effect(() => {
        // this if statement is weird bc effect is weird.
        // this code will run whenever rotation changes.
        if (rotation || rotation === 0) {
            rerenderInputAnchorHack()
        }
    })
</script>

<div class="button_fix">
    <svg
        width="85"
        height="65"
        viewBox="-12 0 95 100"
        xmlns="http://www.w3.org/2000/svg"
        class={'LampSVG'}
    >
        <line
            x1="-50"
            x2="5"
            y1="45"
            y2="45"
            stroke={'lightgray'}
            stroke-width="8"
        />

        <!-- Circle -->
        <circle
            cx="50"
            cy="50"
            r="45"
            fill={'lightgray'}
            stroke={'gray'}
            stroke-width="7"
        />
    </svg>
</div>

<SimulationNodeAnchor
    offset={lampOffset}
    location={['left', 'mid']}
    id={nodeId}
    io="input"
/>

<style>
    .button_fix {
        min-width: 85px !important;
    }
</style>
