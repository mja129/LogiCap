<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
    import { GRID_SIZE } from '@src/lib/grid'

    const ANCHOR_SPACING = 2 * GRID_SIZE  // 44px between anchors — even multiple keeps grid alignment
    const WIDTH = 6 * GRID_SIZE           // 132px — MUST be an even multiple of GRID_SIZE
                                          // so width/2 is a multiple of GRID_SIZE after Svelvet center-snaps
</script>

<script lang="ts">
    let {
        nodeId,
        celltype,
        inputs,
        outputs
    }: {
        gateType?: 'Subcircuit'
        nodeId: string
        celltype: string
        inputs: number
        outputs: number
    } = $props();

    // Height: enough rows for the larger side, plus one row of padding top+bottom
    const height = (Math.max(inputs, outputs) + 1) * ANCHOR_SPACING;

    // Center each group vertically, snapping start Y to the nearest grid unit
    const HALF_GRID = GRID_SIZE / 2;
    const inputStartY  = GRID_SIZE;
    const outputStartY = GRID_SIZE;

    // Mirror the LogicGate convention: inputs hang one grid unit left of origin,
    // outputs sit one grid unit left of the right edge (to match the wire endpoint)
    const inputPositions  = Array.from({ length: inputs  }, (_, i) => ({
        x: -GRID_SIZE + HALF_GRID,
        y: inputStartY  + i * ANCHOR_SPACING + HALF_GRID
    }));
    const outputPositions = Array.from({ length: outputs }, (_, i) => ({
        x: WIDTH + HALF_GRID,
        y: outputStartY + i * ANCHOR_SPACING + HALF_GRID
    }));
</script>

<svg
    width={WIDTH}
    height={height}
    viewBox="0 0 {WIDTH} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <rect x="0" y={GRID_SIZE} width={WIDTH} height={height - GRID_SIZE * 3} fill="black" />
    <text
        x="50%"
        y="37%"
        text-anchor="middle"
        dominant-baseline="middle"
        textLength="{WIDTH * 0.8}px"
        lengthAdjust="spacingAndGlyphs"
        font-size="150%"
        fill="white"
    >
        {celltype}
    </text>
</svg>

{#each inputPositions as pos, index}
    <SimulationNodeAnchor
        io="input"
        ioId={(index + 1).toString()}
        id={nodeId}
        side="west"
        position={pos}
    />
{/each}

{#each outputPositions as pos, index}
    <SimulationNodeAnchor
        io="output"
        ioId={(index + 1).toString()}
        id={nodeId}
        connections={get(CircuitStore).connectors[
            (`out${index + 1}_` + nodeId) as outputAnchorName
        ]}
        side="east"
        position={pos}
    />
{/each}
