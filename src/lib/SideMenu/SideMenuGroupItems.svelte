<script lang="ts">
    import AndIcon from '../../assets/icons/circuits/And.webp'
    import BufferIcon from '../../assets/icons/circuits/Buffer.webp'
    import OrIcon from '../../assets/icons/circuits/Or.webp'
    import NorIcon from '../../assets/icons/circuits/Nor.webp'

    import XorIcon from '../../assets/icons/circuits/Xor.webp'
    import XnorIcon from '../../assets/icons/circuits/Xnor.webp'
    import NandIcon from '../../assets/icons/circuits/Nand.webp'
    import NotIcon from '../../assets/icons/circuits/Not.webp'

    // this will be a required prop but it is optional right now.
    let { showSubMenu }: { showSubMenu?: boolean } = $props()

    // This component really shouldn't be an ordered list that's so stupid
</script>

<ol class="dark-cream-bg" style={showSubMenu ? 'display:none' : 'display:grid'}>
    <li>
        <img
            style="width: 82px;margin-top: 3px;"
            src={NotIcon}
            alt="And logic gate, hand-drawn"
        />
        Not
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={BufferIcon}
            alt="And logic gate, hand-drawn"
        />
        Repeater
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={AndIcon}
            alt="And logic gate, hand-drawn"
        />
        And
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={NandIcon}
            alt="And logic gate, hand-drawn"
        />
        Nand
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={OrIcon}
            alt="And logic gate, hand-drawn"
        />
        Or
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={NorIcon}
            alt="And logic gate, hand-drawn"
        />
        Nor
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={XorIcon}
            alt="And logic gate, hand-drawn"
        />
        Xor
    </li>
    <li>
        <img
            style="width: 82px;margin-bottom:-6px;margin-top: 3px;"
            src={XnorIcon}
            alt="And logic gate, hand-drawn"
        />
        Xnor
    </li>
</ol>

<style>
    ol {
        list-style-type: none;
        /* margin-left: 40px; */

        /* Grid Fallback */
        /* display: flex;
        flex-wrap: wrap; */

        /* Supports Grid */
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
        /* grid-auto-rows: minmax(100px, auto); */
        grid-gap: 10px;
        padding-inline: 10px;
        margin-top: calc(var(--side-menu-spacing) * 1.5);
        /* Roughly centered relative to the next title */
        margin-bottom: calc(var(--side-menu-spacing) / 1.1);
        /* margin-block: var(--side-menu-spacing); */
    }

    ol li {
        z-index: 2;
        background-color: var(--blue);
        color: black;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        /* height: 30px; */
        background-color: var(--cream);

        border-radius: 20px;
        border: 2px solid navy;
        /* box-shadow: 4px 4px 0px 0px #000000; */
    }

    ol li:hover {
        border: 2px solid transparent;
        outline: 4px solid red;
    }
    /* ol li > img { */
    /* } */
</style>
