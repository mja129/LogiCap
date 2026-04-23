<script lang="ts" module>
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { getRunning } from '@CircuitEngine'
    import { CircuitStore } from '@CircuitStore'

    // Output anchor exits east, centered vertically on the 66x66 node
    const anchorPosition = { x: 91, y: 33 };

    const BIT_OPTIONS = [1, 2, 4, 8, 16] as const;
</script>

<script lang="ts">
    import { onMount, getContext, type Snippet } from 'svelte'

    let {
        nodeId,
        bits: initialBits = 8,
        value: initialValue = 0,
    }: {
        nodeId: string
        bits?: number
        value?: number
    } = $props()

    // Live state — updated by the menu
    let bits: number = $state(initialBits)
    let value: number = $state(initialValue)

    // Menu input buffers
    let menuBits: number = $state(initialBits)
    let menuValueStr: string = $state(String(initialValue))
    let menuBase: 'dec' | 'hex' | 'bin' = $state('dec')
    let valueError: string = $state('')

    const registerMenu = getContext<(s: Snippet) => void>('registerMenu')

    onMount(() => {
        registerMenu(constantMenu)
    })

    // Clamp a value to [0, maxValue]
    function clamp(v: number, max: number): number {
        return Math.max(0, Math.min(max, Math.floor(v)))
    }

    function parseValue(str: string, base: 'dec' | 'hex' | 'bin'): number {
        const s = str.trim()
        if (base === 'hex' && /^[0-9a-fA-F]+$/.test(s)) return parseInt(s, 16)
        if (base === 'bin' && /^[01]+$/.test(s))         return parseInt(s, 2)
        if (base === 'dec' && /^[0-9]+$/.test(s))        return parseInt(s, 10)
        return NaN
    }

    function applyChanges() {
        const parsed = parseValue(menuValueStr, menuBase)
        if (isNaN(parsed)) {
            valueError = `Invalid ${menuBase} value`
            return
        }
        valueError = ''
        const newMax = Math.pow(2, menuBits) - 1
        const clamped = clamp(parsed, newMax)
        bits = menuBits
        value = clamped

        // Persist into the circuit store so save/reload preserves the values
        CircuitStore.update(circuit => {
            const device = circuit.devices[nodeId] as any
            if (device) {
                device.bits = bits
                device.value = value
            }
            return circuit
        })
    }

    let color = $derived({
        fill: getRunning() ? '#1a6b3a' : '#2a2a2a',
        stroke: getRunning() ? 'var(--lime-green)' : 'lightgray',
        text: getRunning() ? '#00f5d4' : '#cccccc',
    })
</script>

<svg
    width="66"
    height="66"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible; display: block;"
>
    // Node body
    <rect
        x="0"
        y="0"
        width="66"
        height="66"
        fill="black"
        stroke={color.stroke}
        stroke-width="2"
    />


    <!-- Bit width label -->
    <text
        x="33"
        y="28"
        fill={color.text}
        font-size="15"
        font-family="monospace"
        text-anchor="middle"
    >{bits} bit</text>

    <!-- Displayed value -->
    <text
        x="33"
        y="48"
        fill={color.stroke}
        font-size="13"
        font-family="monospace"
        font-weight="bold"
        text-anchor="middle"
    >{menuValueStr}</text>

    <!-- Output wire stub -->
    <line
        x1="66"
        y1="33"
        x2="88"
        y2="33"
        stroke={color.stroke}
        stroke-width="4"
    />
</svg>

{#snippet constantMenu()}
    <label style="display:flex; align-items:center; gap:6px;">
        Bits:
        <select bind:value={menuBits} style="background:#1a1a1a; color:white; border:1px solid #555; border-radius:3px; padding:2px 4px;">
            {#each BIT_OPTIONS as opt}
                <option value={opt}>{opt}</option>
            {/each}
        </select>
    </label>
    <label style="display:flex; align-items:center; gap:6px;">
        Value:
        <input
            type="text"
            bind:value={menuValueStr}
            style="width:60px; {valueError ? 'border-color:red;' : ''}"
        />
        <select bind:value={menuBase} style="background:#1a1a1a; color:white; border:1px solid #555; border-radius:3px; padding:2px 4px;">
            <option value="dec">Dec</option>
            <option value="hex">Hex</option>
            <option value="bin">Bin</option>
        </select>
    </label>
    {#if valueError}
        <span style="color:red; font-size:11px;">{valueError}</span>
    {/if}
    <button onclick={applyChanges}>Apply</button>
{/snippet}

<SimulationNodeAnchor
    io="output"
    ioId=""
    id={nodeId}
    side="east"
    position={anchorPosition}
/>

<style>
    :global(.svelvet-node) {
        width: 0 !important;
        height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
    }
</style>
