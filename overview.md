# Overview
## A quick and dirty summary of how this whole thing... like... works

Here's the whole file tree, with (what I think is) the important stuff linked below:

logicap! :P\
├── LICENSE\
├── README.md\
├── [custom_digitaljs](#custom_digitaljs)\
├── custom_svelvet_edge\
│   ├── Edge.svelte\
│   └── Edge.svelte.d.ts\
├── index.html\
├── node_modules\
├── overview.md\
├── package-lock.json\
├── package.json\
├── public\
│   ├── Fonts\
│   ├── favicons\
│   ├── logicap.png\
│   ├── logicap.webp\
│   └── metaImage.png\
├── src\
│   ├── [App.svelte](#appsvelte)\
│   ├── app.css\
│   ├── app.ts\
│   ├── assets\
│   ├── lib\
│   │   ├── [AppComponents](#appcomponents)\
│   │   │   ├── SettingsMenu.svelte\
│   │   │   ├── SideMenu\
│   │   │   │   ├── SideMenu.svelte\
│   │   │   │   ├── SideMenuGroupItems.svelte\
│   │   │   │   └── SideMenuHeader.svelte\
│   │   │   ├── SimMenu.svelte\
│   │   │   └── TabMenu.svelte\
│   │   ├── [Circuit.svelte](#circuitsvelte)\
│   │   ├── [CircuitParts](#circuitparts)\
│   │   │   ├── Anchor.svelte\
│   │   │   ├── CustomAnchor.svelte\
│   │   │   ├── CustomEdge.svelte\
│   │   │   ├── NormalEdge.svelte\
│   │   │   ├── Wire.svelte\
│   │   │   ├── linkAnchors.ts\
│   │   │   ├── manipulateWire.ts\
│   │   │   └── wireUtils.ts\
│   │   ├── [Circuits](#circuits)\
│   │   │   ├── InputOutputNodes\
│   │   │   │   ├── ButtonNode.svelte\
│   │   │   │   ├── Lamp.svelte\
│   │   │   │   └── Switch.svelte\
│   │   │   ├── LogicGates\
│   │   │   │   ├── LogicGate.svelte\
│   │   │   │   └── SingleIoLogic.svelte\
│   │   │   ├── Subcomponent.svelte\
│   │   │   └── Tunnels\
│   │   │       ├── TunnelInput.svelte\
│   │   │       └── TunnelOutput.svelte\
│   │   ├── CommandMenu.svelte\
│   │   ├── Util\
│   │   │   ├── [CustomHeadlessCircuit.ts](#customheadlesscircuitts)\
│   │   │   ├── cursors.ts\
│   │   │   ├── fileUtils.ts\
│   │   │   ├── graphUtils.ts\
│   │   │   ├── [makeDigitalJsJson.ts](#makedigitaljsjsonts)\
│   │   │   ├── parseSvg.ts\
│   │   │   └── rotateCursor.ts\
│   │   ├── ZoomThing.svelte\
│   │   ├── [circuitEngine.svelte.ts](#circuitenginesveltets)\
│   │   ├── [circuitModel.ts](#circuitmodelts)\
│   │   ├── [circuitSave.ts](#circuitsavets)\
│   │   └── [circuitStore.ts](#circuitstorets)\
│   ├── main.ts\
│   ├── types\
│   │   ├── [digital-js-representation.d.ts](#digital-js-representationdts)\
│   │   ├── global.d.ts\
│   │   └── svelvet-save.d.ts\
│   └── vite-env.d.ts\
├── svelte.config.ts\
├── tsconfig.app.json\
├── tsconfig.json\
├── tsconfig.node.json\
├── unfinished_assets\
│   └── newIconOption.png\
└── vite.config.ts\

# custom_digitaljs

The custom port of the digitalJS library, housed so beautifully inside our repository lol.\
We attempted to get back to the latest, unmodified version last semester and couldn't get it to work. It exists for a reason I promise.\
Although, this does mean it's probably reasonably possible to add a new component to the library itself. Would have to look into that though.

# App.svelte

The maestro of the whole operation. A huge amount of stuff occurs here and I lack both the knowledge and fortitude to explain the whole thing.\
The `createCanvasDevice()` function is probably the most important part of this file for us, but other important things also live here.\
But anyways, this file is where the sausage gets made.

# AppComponents

The .svelte files for the menus.
Highlights:
- The SideMenu files handle the rendering of the left side component menu. The listeners that handle new components being dropped live in here
- We will certainly be messing with SimMenu.svelte and TabMenu.svelte. These are svelte files with not too much going on, so I'd recommend maybe glancing at them. At their core, svelte files are just fancy html files.

# Circuit.svelte

The wrapper svelte file for every circuit component. This file handles taking one of the [Circuits](#circuits) and:
- Wrapping it in a Svelvet node
- Rotation

# CircuitParts

Component pieces to be used by the [Circuits](#circuits).

# Circuits

The svelte files that govern how the components look and behave.\
Every different type of component needs one of these.\
Take a look through one of these and try to figure out what's going on - they make a decent amount of sense.

# CustomHeadlessCircuit.ts

A wrapper for the HeadlessCircuit digitalJS class.\
Essentially handles conversion of the way we store the circuit on the frontend to the way that digitalJS understands them.\
Take a look at the `CustomHeadlessCircuit` class constructor at the bottom. It pretty much narrates what it does.\
`transformConnections()` will certainly need a serious overhaul for the new wiring system.

# makeDigitalJsJson.ts

A major step of the process of adding a component lives here.\
A new component needs a `make[component name]()` function, and an entry in `deviceJsonFactoryMap`, which is used by [CircuitStore](#circuitstorets) in `addCircuitDevice()`.

# circuitEngine.svelte.ts

Runs circuits and manages there state.\
Honestly, have no idea how half this file works. Might be important at some point so plugging it now.

# circuitModel.ts

The seventh circle of typescript hell!\
Basically, a whole bunch of types that get used all over the place. New components needed to be integrated into that typing structure.\
Take a look, it's largely self explanatory imho.\
Also, has the `menuJsonData` object that the SideMenu uses to populate.\
Also here is `getComponent()`, which is used by [Circuit.svelte](#circuitsvelte) to decide which svelte file in [Circuits](#circuits) to include.\
New components need their svelte file imported into this file and an entry in `getComponent()`.

# circuitSave.ts

Half of the system used for saving circuits.\
You can kind of infer what this one handles based on the `CircuitSave` interface.

# circuitStore.ts

The other half of the aforementioned system.\
The way these two files work together, and with the rest of the subsystems, is **EXTREMELY** weird.\
You kinda just have to poke around and trace a process.\
Highly recommend going into src and running `grep -Ril '<name of function/thing you're looking for>'` if you need to find where something is used.

# digital-js-representation.d.ts

Another step in components addition.\
New components need to be typed and added to `Devices`