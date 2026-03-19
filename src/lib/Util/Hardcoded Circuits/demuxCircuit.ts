import type { SingleSaveDataFormat } from '../../circuitSave'

export const DEMUX: SingleSaveDataFormat = {
  circuit: {
      devices: {
        "Button_dmx0": {
            "type": "Button",
            "label": "Button_dmx0",
            "net": "Button_dmx0",
            "bits": 1,
            "position": {
              "x": 204.484375,
              "y": 220
            }
          },
        "Button_dmx1": {
        "type": "Button",
        "label": "Button_dmx1",
        "net": "Button_dmx1",
        "bits": 1,
        "rotation": 270,
        "position": {
            "x": 315.484375,
            "y": 409
        }
        },
        "Lamp_dmx2": {
        "type": "Lamp",
        "net": "Lamp_dmx2",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dmx2",
        "position": {
            "x": 626.484375,
            "y": 221
        }
        },
        "Lamp_dmx3": {
        "type": "Lamp",
        "net": "Lamp_dmx3",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dmx3",
        "position": {
            "x": 604.484375,
            "y": 336
        }
        },
        "Or_dmx4": {
        "type": "Or",
        "label": "Or_dmx4",
        "inputs": 2,
        "position": {
            "x": 418.484375,
            "y": 279
        }
        }
      },
      connectors: {
        "out_Button_dmx0": [
            [
              "Or_dmx4",
              "in2_Or_dmx4"
            ]
          ],
          "out_Button_dmx1": [
            [
              "Or_dmx4",
              "in1_Or_dmx4"
            ]
          ],
          "out_Or_dmx4": [
            [
              "Lamp_dmx2",
              "in_Lamp_dmx2"
            ],
            [
              "Lamp_dmx3",
              "in_Lamp_dmx3"
            ]
          ]
      },
      subcircuits: [],
      wireManipulations: {
        "out_Button_dmx0-in2_Or_dmx4": "step",
          "out_Button_dmx1-in1_Or_dmx4": "step",
          "out_Or_dmx4-in_Lamp_dmx2": "step",
          "out_Or_dmx4-in_Lamp_dmx3": "step"
      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}