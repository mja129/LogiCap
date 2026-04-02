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
              "x": 146.6875,
              "y": 163
            }
        },
        "Lamp_dmx1": {
          "type": "Lamp",
          "net": "Lamp_dmx1",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_dmx1",
          "position": {
            "x": 631.6875,
            "y": 180
          },
          "rotation": 0
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
            "x": 632.6875,
            "y": 282
          }
        },
        "And_dmx3": {
          "type": "And",
          "label": "And_dmx3",
          "inputs": 2,
          "position": {
            "x": 444.6875,
            "y": 184
          }
        },
        "And_dmx4": {
          "type": "And",
          "label": "And_dmx4",
          "inputs": 2,
          "position": {
            "x": 447.6875,
            "y": 286
          }
        },
        "Not_dmx5": {
          "type": "Not",
          "label": "Not_dmx5",
          "inputs": 2,
          "position": {
            "x": 266.6875,
            "y": 233
          }
        },
        "Button_dmx6": {
          "type": "Button",
          "label": "Button_dmx6",
          "net": "Button_dmx6",
          "bits": 1,
          "position": {
            "x": 140.6875,
            "y": 296
          }
        }
      },
      connectors: {
        "out_And_dmx3": [
          [
            "Lamp_dmx1",
            "in_Lamp_dmx1"
          ]
        ],
        "out_And_dmx4": [
          [
            "Lamp_dmx2",
            "in_Lamp_dmx2"
          ]
        ],
        "out_Button_dmx0": [
          [
            "And_dmx3",
            "in2_And_dmx3"
          ],
          [
            "And_dmx4",
            "in2_And_dmx4"
          ]
        ],
        "out_Not_dmx5": [
          [
            "And_dmx3",
            "in1_And_dmx3"
          ]
        ],
        "out_Button_dmx6": [
          [
            "Not_dmx5",
            "in_Not_dmx5"
          ],
          [
            "And_dmx4",
            "in1_And_dmx4"
          ]
        ]
      },
      subcircuits: [],
      wireManipulations: {
        "out_And_dmx3-in_Lamp_dmx1": "step",
        "out_And_dmx4-in_Lamp_dmx2": "step",
        "out_Button_dmx0-in2_And_dmx3": "step",
        "out_Not_dmx5-in1_And_dmx3": "step",
        "out_Button_dmx6-in_Not_dmx5": "step",
        "out_Button_dmx6-in1_And_dmx4": "step",
        "out_Button_dmx0-in2_And_dmx4": "step"
      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}