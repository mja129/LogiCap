<!-- https://codepen.io/designcouch/pen/eYaZKg -->
<script lang="ts">
    // export let switchOn: boolean = false
    let {
        signalOn = $bindable(),
        toggleButton,
    }: { signalOn: boolean; toggleButton: (e: MouseEvent) => void } = $props()

    // $effect(() => {
    //     console.log(switchOn)
    // })
</script>

<input
    bind:checked={signalOn}
    onclickcapture={toggleButton}
    type="checkbox"
    id="light-switch"
/>
<div
    style="--scale: {0.5}; --label-width: 200px; --label-height: 300px; --switch-width: 100px; --switch-height: 150px; --screw-size: 16px;"
    class="scale-wrapper"
>
    <label for="light-switch" id="light-switch-label">
        <div class="screw"></div>
        <div class="switch"></div>
        <div class="screw"></div>
    </label>
</div>

<style>
    #light-switch-label {
        position: relative;
        display: block;

        width: calc(var(--scale) * var(--label-width));
        height: calc(var(--scale) * var(--label-height));

        margin: 0 auto;
        z-index: 1;

        background-color: #fff4d3;
        border-radius: 10px;
    }

    .switch {
        cursor: pointer;

        width: calc(var(--scale) * var(--switch-width));
        height: calc(var(--scale) * var(--switch-height));
        position: absolute;
        top: 50%;
        left: 50%;

        margin-top: calc(-0.5 * var(--scale) * var(--switch-height));
        margin-left: calc(-0.5 * var(--scale) * var(--switch-width));

        background: #fffaea;
        border-radius: 5px;
        overflow: hidden;

        box-shadow:
            0 10px 10px -5px rgba(233, 219, 176, 0),
            0 0 0 1px rgba(0, 0, 0, 0.1),
            0 0 0 4px #fff4d3,
            0 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .switch::before {
        content: 'ON';
        position: absolute;
        display: block;

        top: calc(var(--scale) * 5px);
        left: 0;

        width: calc(var(--scale) * var(--switch-width));
        height: calc(var(--scale) * 70px);
        line-height: calc(var(--scale) * 70px);

        text-align: center;
        background: #efe0b1;
        color: #bfa371;
        border-radius: 5px 5px 0 0;
    }

    .switch::after {
        content: 'OFF';
        position: absolute;
        display: block;

        bottom: calc(var(--scale) * 5px);
        left: 0;

        width: calc(var(--scale) * var(--switch-width));
        height: calc(var(--scale) * 75px);
        line-height: calc(var(--scale) * 75px);

        text-align: center;
        background: #fff4d3;
        color: #a4441a;
        text-shadow: 0 0 3px #ff4e00;
        border-radius: 0 0 5px 5px;
    }

    .screw {
        position: absolute;

        width: calc(var(--scale) * var(--screw-size));
        height: calc(var(--scale) * var(--screw-size));
        left: 50%;
        margin-left: calc(-0.5 * var(--scale) * var(--screw-size));
        border-radius: 100%;

        background: #e3d4a5;
        box-shadow: inset 0 2px 0 rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    .screw::before {
        content: '';
        position: absolute;
        width: calc(var(--scale) * 2px);
        height: 100%;
        left: 50%;
        margin-left: -1px;
        background: rgba(0, 0, 0, 0.2);
    }

    .screw:first-of-type {
        top: calc(var(--scale) * 30px);
    }

    .screw:last-of-type {
        bottom: calc(var(--scale) * 30px);
    }
    input[type='checkbox'] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }
    input[type='checkbox']:checked + .scale-wrapper label#light-switch-label {
        box-shadow: 0 2px 2px #d0b57b;
    }

    input[type='checkbox']:checked
        + .scale-wrapper
        label#light-switch-label
        .switch {
        box-shadow:
            0 10px 10px -5px rgba(233, 219, 176, 1),
            0 0 0 1px rgba(0, 0, 0, 0.1),
            0 0 0 4px #fff4d3,
            0 0 0 5px rgba(0, 0, 0, 0.1);
    }

    input[type='checkbox']:checked
        + .scale-wrapper
        label#light-switch-label
        .switch::before {
        height: calc(var(--scale) * 75px);
        top: 0;
        line-height: calc(var(--scale) * 75px);
        background: #fff4d3;
        color: #64bf60;
        text-shadow: 0 0 3px #38ff2e;
    }

    input[type='checkbox']:checked
        + .scale-wrapper
        label#light-switch-label
        .switch::after {
        height: calc(var(--scale) * 70px);
        bottom: calc(var(--scale) * 5px);
        line-height: calc(var(--scale) * 70px);
        background: #fffaea;
        box-shadow: 0 5px 0 #d0b57b;
        color: #d7bf95;
        text-shadow: none;
    }
</style>
