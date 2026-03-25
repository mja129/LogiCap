import type { SingleSaveDataFormat } from '../../circuitSave'

// Hard-coded Decoder circuits

// 1 to 2 decoder
export const DECODER_1_2: SingleSaveDataFormat = {
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

// 2 to 4 decoder
export const DECODER_2_4: SingleSaveDataFormat = {
    circuit: {
      devices: {

      },
      connectors: {

      },
      subcircuits: [],
      wireManipulations: {

      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}


// 3 to 8 decoder
export const DECODER_3_8: SingleSaveDataFormat = {
    circuit: {
      devices: {

      },
      connectors: {

      },
      subcircuits: [],
      wireManipulations: {

      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}

// 4 to 16 decoder
export const DECODER_4_16: SingleSaveDataFormat = {
    circuit: {
      devices: {

      },
      connectors: {

      },
      subcircuits: [],
      wireManipulations: {

      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}

export const decoderMap: Record<string, SingleSaveDataFormat> = {
    'Decoder_1': DECODER_1_2,
    'Decoder_2': DECODER_2_4,
    'Decoder_3': DECODER_3_8,
    'Decoder_4': DECODER_4_16,
}

// export const SAMPLE: SingleSaveDataFormat = {
//   circuit: {
//       devices: {
        
//       },
//       connectors: {
        
//       },
//       subcircuits: [],
//       wireManipulations: {

//       }
//     },
//     zoom: 1,
//     translation: {x: 0, y: 0}
// }