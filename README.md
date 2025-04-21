# LogicAp

![LogicAp Logo](https://jmsjoseph.github.io/LogiCap/logicap.webp)

LogicAp is a fully functional logic simulator developed as part of the CS1980 course at the University of Pittsburgh in Spring 2025.

## Why is it called LogicAp?
The name *LogicAp* is derived from the combination of "Logic" and "App," highlighting its purpose as a logic simulation application designed to model and visualize circuits.

## Contributors

This project was designed and built by:

- **Sean Shmulevich**  
  - Architecture and integration
- **Joseph Secosky**  
  - Circuit "Backend", DevOps
- **Mason McGinnis**  
  - Full-stack, frontend-focused
- **Gabriel Schmidt**  
  - Graphic Design

## Tech Stack

- **Svelte** - UI framework
- **Vite** - Build and bundle
- **TypeScript** - Programming language
- **DigitalJS** (npm lib) - Logic gate simulation library ([GitHub](https://github.com/tilk/digitaljs))
- **unplugin-icons** (npm lib) - Icon handling for Svelte ([GitHub](https://github.com/unplugin/unplugin-icons))

## Features

### General Functionality
- Offline functionality
- Sync circuit with local storage to persist after reload
- Save and load circuit as JSON
- Tabs for organizing different circuits

### Circuit Manipulation
- Manipulate wires
- Drag and drop nodes onto the canvas
- Rotate nodes and wires (NSEW)
- Support for multiple wire types in one circuit

### User Interface
- Command menu for quick actions
- MiniMap for easy navigation
- Settings menu for customization

### Circuit Devices
- Single Input/Output Logic Gates
- Dual Input/Output Logic Gates
- Lamp and Button components

## Future Features

- More granular editing functionality
- Manipulate "step" and "straight" curves
- Toolbar with different editing tools
- Convert drawn circuit images into LogicAp-compatible formats
- Integrate Yosys to DigitalJS for outputting circuit representation in different formats ([Yosys2DigitalJS GitHub](https://github.com/tilk/yosys2digitaljs))
- Add support for more types of logic gates

## Architecture

![Architecture Diagram](./images/architecture.png)

## License

MIT License (MIT)

Copyright (c) 2011-2025 The Bootstrap Authors (replace with your project's copyright holders)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
