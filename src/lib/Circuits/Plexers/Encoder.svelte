<script lang="ts" module>
    import { get } from 'svelte/store'
    import { CircuitStore } from '@CircuitStore'
    import SimulationNodeAnchor from '@CircuitParts/Anchor.svelte'
</script>

<script lang="ts">
    let {
        nodeId,
        inputs,
        outputs
    }: {
        nodeId: string
        inputs: number
        outputs: number
    } = $props()

    //calculate size, alignment from number of inputs/outputs
    const width = 99;
    const height = 33  + (22 * inputs);

    const inputPositions  = Array.from({ length: inputs  }, (_, i) => ({
        x: 11,
        y: 11 + i * 22
    }));
    const outputPositions = Array.from({ length: outputs }, (_, i) => ({
        x: 77,
        y: 11 + i * 44
    }));

</script>

<!-- SVG of the Encoder -->
<svg
    width={width}
    height={height}
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="max-width:unset; overflow:visible;"
>
    <!-- Box -->
    <rect
        x="11" y="-5"
        width = "66"
        height = {height}
        stroke="lightgray"
        stroke-width="2"
    />

    <!-- 0 Label -->
    <text
        x="21"
        y="12"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    >
        0
    </text>
    <!-- V-bit Label -->
    <text
        x="58"
        y="11"
        text-anchor="start"
        dominant-baseline="middle"
        font-size="25"
        fill="white"
    >
        V
    </text>
    <!-- Pri Label -->
    <text
        x="28"
        y=50%
        text-anchor="start"
        dominant-baseline="middle"
        font-size="30"
        fill="white"
    >
        Pri
    </text>
</svg>

<!-- Dynamically add/offset inputs and outputs depending on selbits, similar to subcomp -->
<!-- Inputs Nodes -->
{#each inputPositions as pos, index}
    <SimulationNodeAnchor
        io="input"
        ioId={(index + 1).toString()}
        id={nodeId}
        position={pos}
    />
{/each}

<!-- Output Nodes -->
{#each outputPositions as pos, index}
    <SimulationNodeAnchor
        io="output"
        ioId={(index + 1).toString()}
        id={nodeId}
        connections={get(CircuitStore).connectors[
            (`out${index+1}_` + nodeId) as outputAnchorName
        ]}
        position={pos}
    />
{/each}
