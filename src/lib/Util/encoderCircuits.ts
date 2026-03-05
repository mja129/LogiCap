import type { SingleSaveDataFormat } from '../circuitSave'

// 2 to 1 Encoder
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

export const ENCODER_4_2: SingleSaveDataFormat = {
    circuit: {
        devices: {
          "Lamp_enc0": {
            "type": "Lamp",
            "net": "Lamp_enc0",
            "inputs": 1,
            "outputs": 0,
            "order": 0,
            "bits": 1,
            "label": "Lamp_enc0",
            "position": {
              "x": 522.6875,
              "y": 568
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
              "x": 502.6875,
              "y": 120
            }
          },
          "Button_enc0": {
            "type": "Button",
            "label": "Button_enc0",
            "net": "Button_enc0",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 121
            }
          },
          "Button_enc1": {
            "type": "Button",
            "label": "Button_enc1",
            "net": "Button_enc1",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 201
            }
          },
          "Button_enc2": {
            "type": "Button",
            "label": "Button_enc2",
            "net": "Button_enc2",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 272
            }
          },
          "Button_enc3": {
            "type": "Button",
            "label": "Button_enc3",
            "net": "Button_enc3",
            "bits": 1,
            "position": {
              "x": 0,
              "y": 350
            }
          },
          "Or_enc0": {
            "type": "Or",
            "label": "Or_enc0",
            "inputs": 2,
            "position": {
              "x": 164.6875,
              "y": 161
            }
          },
          "Or_enc1": {
            "type": "Or",
            "label": "Or_enc1",
            "inputs": 2,
            "position": {
              "x": 251.6875,
              "y": 203
            }
          },
          "Or_enc2": {
            "type": "Or",
            "label": "Or_enc2",
            "inputs": 2,
            "position": {
              "x": 352.6875,
              "y": 242
            }
          },
          "Or_enc3": {
            "type": "Or",
            "label": "Or_enc3",
            "inputs": 2,
            "position": {
              "x": 254.6875,
              "y": 570
            }
          },
          "And_enc0": {
            "type": "And",
            "label": "And_enc0",
            "inputs": 2,
            "position": {
              "x": 503.6875,
              "y": 383
            }
          },
          "Not_enc0": {
            "type": "Not",
            "label": "Not_enc0",
            "inputs": 2,
            "position": {
              "x": 302.6875,
              "y": 412
            }
          },
          "Or_enc4": {
            "type": "Or",
            "label": "Or_enc4",
            "inputs": 2,
            "position": {
              "x": 629.6875,
              "y": 447
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
              "x": 795.6875,
              "y": 451
            }
          }
        },
        connectors: {
          "out_Button_enc0": [
            [
              "Or_enc0",
              "in2_Or_enc0"
            ]
          ],
          "out_Button_enc1": [
            [
              "Or_enc0",
              "in1_Or_enc0"
            ],
            [
              "And_enc0",
              "in2_And_enc0"
            ]
          ],
          "out_Button_enc2": [
            [
              "Or_enc1",
              "in1_Or_enc1"
            ],
            [
              "Or_enc3",
              "in2_Or_enc3"
            ],
            [
              "Not_enc0",
              "in_Not_enc0"
            ]
          ],
          "out_Or_enc0": [
            [
              "Or_enc1",
              "in2_Or_enc1"
            ]
          ],
          "out_Button_enc3": [
            [
              "Or_enc2",
              "in1_Or_enc2"
            ],
            [
              "Or_enc3",
              "in1_Or_enc3"
            ],
            [
              "Or_enc4",
              "in1_Or_enc4"
            ]
          ],
          "out_Or_enc1": [
            [
              "Or_enc2",
              "in2_Or_enc2"
            ]
          ],
          "out_Or_enc2": [
            [
              "Lamp_enc1",
              "in_Lamp_enc1"
            ]
          ],
          "out_Or_enc3": [
            [
              "Lamp_enc0",
              "in_Lamp_enc0"
            ]
          ],
          "out_And_enc0": [
            [
              "Or_enc4",
              "in2_Or_enc4"
            ]
          ],
          "out_Not_enc0": [
            [
              "And_enc0",
              "in1_And_enc0"
            ]
          ],
          "out_Or_enc4": [
            [
              "Lamp_enc2",
              "in_Lamp_enc2"
            ]
          ]
        },
        subcircuits: [],
        wireManipulations: {
          "out_Button_enc0-in2_Or_enc0": "step",
          "out_Button_enc1-in1_Or_enc0": "step",
          "out_Button_enc2-in1_Or_enc1": "step",
          "out_Or_enc0-in2_Or_enc1": "step",
          "out_Button_enc3-in1_Or_enc2": "step",
          "out_Or_enc1-in2_Or_enc2": "step",
          "out_Or_enc2-in_Lamp_enc1": "step",
          "out_Button_enc2-in2_Or_enc3": "step",
          "out_Button_enc3-in1_Or_enc3": "step",
          "out_Or_enc3-in_Lamp_enc0": "step",
          "out_Button_enc1-in2_And_enc0": "step",
          "out_Not_enc0-in1_And_enc0": "step",
          "out_Button_enc2-in_Not_enc0": "step",
          "out_And_enc0-in2_Or_enc4": "step",
          "out_Button_enc3-in1_Or_enc4": "step",
          "out_Or_enc4-in_Lamp_enc2": "step"
        }
      },
      zoom: 1,
      translation: {x: 0, y: 0}
    }



// export const SAMPLE: SingleSaveDataFormat = {
//     circuit: {
//         devices: {
          
//         },
//         connectors: {
          
//         },
//         subcircuits: [],
//         wireManipulations: {

//         }
//       },
//       zoom: 1,
//       translation: {x: 0, y: 0}
//     }