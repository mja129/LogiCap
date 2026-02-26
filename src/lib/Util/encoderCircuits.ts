import type { SingleSaveDataFormat } from '../circuitSave'

export const ENCODER_2_1: SingleSaveDataFormat = {
    circuit: {
        devices: {
          "Button_enc1": {
            "type": "Button",
            "label": "Button_enc1",
            "net": "Button_enc1",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 0
            }
          },
          "Button_enc2": {
            "type": "Button",
            "label": "Button_enc2",
            "net": "Button_enc2",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 100
            }
          },
          "Lamp_enc1": {
            "type": "Lamp",
            "net": "Lamp_enc1",
            "inputs": 1,
            "outputs": 0,
            "order": 0,
            "bits": 1,
            "label": "Lamp_enc1",
            "position": {
              "x": 350,
              "y": 0
            }
          },
          "Lamp_enc2": {
            "type": "Lamp",
            "net": "Lamp_enc2",
            "inputs": 1,
            "outputs": 0,
            "order": 0,
            "bits": 1,
            "label": "Lamp_enc2",
            "position": {
              "x": 350,
              "y": 100
            }
          },
          "Or_enc1": {
            "type": "Or",
            "label": "Or_enc1",
            "inputs": 2,
            "position": {
              "x": 150,
              "y": 0
            }
          }
        },
        connectors: {
          "out_Button_enc1": [
            [
              "Or_enc1",
              "in2_Or_enc1"
            ]
          ],
          "out_Button_enc2": [
            [
              "Or_enc1",
              "in1_Or_enc1"
            ],
            [
              "Lamp_enc2",
              "in_Lamp_enc2"
            ]
          ],
          "out_Or_enc1": [
            [
              "Lamp_enc1",
              "in_Lamp_enc1"
            ]
          ]
        },
        subcircuits: [],
        wireManipulations: {
          "out_Button_enc1-in2_Or_enc1": "step",
          "out_Button_enc2-in1_Or_enc1": "step",
          "out_Or_enc1-in_Lamp_enc1": "step",
          "out_Button_enc2-in_Lamp_enc2": "step"
        }
      },
      zoom: 1,
      translation: {x: 0, y: 0}
    }