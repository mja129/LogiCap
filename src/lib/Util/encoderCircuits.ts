import type { SingleSaveDataFormat } from '../circuitSave'

// Hard-coded Priority Encoder circuits

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

// 4 to 2 encoder
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

// 8 to 3 encoder
export const ENCODER_8_3: SingleSaveDataFormat = {
  circuit: {
      devices: {
        "Button_enc0": {
          "type": "Button",
          "label": "Button_enc0",
          "net": "Button_enc0",
          "bits": 1,
          "position": {
            "x": 83.484375,
            "y": 137
          }
        },
        "Button_enc1": {
          "type": "Button",
          "label": "Button_enc1",
          "net": "Button_enc1",
          "bits": 1,
          "position": {
            "x": 82.484375,
            "y": 204
          }
        },
        "Button_enc2": {
          "type": "Button",
          "label": "Button_enc2",
          "net": "Button_enc2",
          "bits": 1,
          "position": {
            "x": 81.484375,
            "y": 271
          }
        },
        "Button_enc3": {
          "type": "Button",
          "label": "Button_enc3",
          "net": "Button_enc3",
          "bits": 1,
          "position": {
            "x": 79.484375,
            "y": 338
          }
        },
        "Button_enc4": {
          "type": "Button",
          "label": "Button_enc4",
          "net": "Button_enc4",
          "bits": 1,
          "rotation": 0,
          "position": {
            "x": 79.484375,
            "y": 403
          }
        },
        "Button_enc5": {
          "type": "Button",
          "label": "Button_enc5",
          "net": "Button_enc5",
          "bits": 1,
          "position": {
            "x": 78.484375,
            "y": 468
          }
        },
        "Button_enc6": {
          "type": "Button",
          "label": "Button_enc6",
          "net": "Button_enc6",
          "bits": 1,
          "position": {
            "x": 76.484375,
            "y": 534
          }
        },
        "Button_enc7": {
          "type": "Button",
          "label": "Button_enc7",
          "net": "Button_enc7",
          "bits": 1,
          "position": {
            "x": 75.484375,
            "y": 599
          }
        },
        "Lamp_enc0": {
          "type": "Lamp",
          "net": "Lamp_enc0",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_enc0",
          "position": {
            "x": 1327.8527960526317,
            "y": 246.63157894736844
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
            "x": 1325.079516700405,
            "y": 479.2024291497976
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
            "x": 1327.5248608299596,
            "y": 823.3562753036438
          }
        },
        "Or_enc0": {
          "type": "Or",
          "label": "Or_enc0",
          "inputs": 2,
          "position": {
            "x": 228.484375,
            "y": 157
          }
        },
        "Or_enc1": {
          "type": "Or",
          "label": "Or_enc1",
          "inputs": 2,
          "position": {
            "x": 347.484375,
            "y": 172
          }
        },
        "Or_enc2": {
          "type": "Or",
          "label": "Or_enc2",
          "inputs": 2,
          "position": {
            "x": 471.484375,
            "y": 187
          }
        },
        "Or_enc3": {
          "type": "Or",
          "label": "Or_enc3",
          "inputs": 2,
          "position": {
            "x": 591.484375,
            "y": 203
          }
        },
        "Or_enc4": {
          "type": "Or",
          "label": "Or_enc4",
          "inputs": 2,
          "position": {
            "x": 710.484375,
            "y": 218
          }
        },
        "Or_enc5": {
          "type": "Or",
          "label": "Or_enc5",
          "inputs": 2,
          "position": {
            "x": 829.484375,
            "y": 235
          }
        },
        "Or_enc6": {
          "type": "Or",
          "label": "Or_enc6",
          "inputs": 2,
          "position": {
            "x": 947.484375,
            "y": 249
          }
        },
        "Or_enc7": {
          "type": "Or",
          "label": "Or_enc7",
          "inputs": 2,
          "position": {
            "x": 265.90542763157896,
            "y": 686.6315789473684
          }
        },
        "Or_enc8": {
          "type": "Or",
          "label": "Or_enc8",
          "inputs": 2,
          "position": {
            "x": 371.90542763157896,
            "y": 759.6315789473684
          }
        },
        "Or_enc9": {
          "type": "Or",
          "label": "Or_enc9",
          "inputs": 2,
          "position": {
            "x": 477.90542763157896,
            "y": 831.6315789473684
          }
        },
        "Or_enc10": {
          "type": "Or",
          "label": "Or_enc10",
          "inputs": 2,
          "position": {
            "x": 903.063322368421,
            "y": 539.0526315789473
          }
        },
        "Not_enc0": {
          "type": "Not",
          "label": "Not_enc0",
          "inputs": 2,
          "position": {
            "x": 674.063322368421,
            "y": 535.0526315789473
          }
        },
        "And_enc0": {
          "type": "And",
          "label": "And_enc0",
          "inputs": 2,
          "position": {
            "x": 795.063322368421,
            "y": 520.0526315789473
          }
        },
        "Or_enc11": {
          "type": "Or",
          "label": "Or_enc11",
          "inputs": 2,
          "position": {
            "x": 1051.063322368421,
            "y": 497.05263157894734
          }
        },
        "And_enc1": {
          "type": "And",
          "label": "And_enc1",
          "inputs": 2,
          "position": {
            "x": 901.063322368421,
            "y": 432.05263157894734
          }
        },
        "Not_enc1": {
          "type": "Not",
          "label": "Not_enc1",
          "inputs": 2,
          "rotation": 0,
          "position": {
            "x": 770.063322368421,
            "y": 449.05263157894734
          }
        },
        "And_enc2": {
          "type": "And",
          "label": "And_enc2",
          "inputs": 2,
          "position": {
            "x": 774.063322368421,
            "y": 387.05263157894734
          }
        },
        "Not_enc2": {
          "type": "Not",
          "label": "Not_enc2",
          "inputs": 2,
          "position": {
            "x": 661.063322368421,
            "y": 402.05263157894734
          }
        },
        "Or_enc12": {
          "type": "Or",
          "label": "Or_enc12",
          "inputs": 2,
          "position": {
            "x": 1180.642269736842,
            "y": 482.7368421052631
          }
        },
        "And_enc3": {
          "type": "And",
          "label": "And_enc3",
          "inputs": 2,
          "position": {
            "x": 658.905427631579,
            "y": 348.47368421052624
          }
        },
        "Not_enc3": {
          "type": "Not",
          "label": "Not_enc3",
          "inputs": 2,
          "position": {
            "x": 523.905427631579,
            "y": 364.47368421052624
          }
        },
        "And_enc4": {
          "type": "And",
          "label": "And_enc4",
          "inputs": 2,
          "position": {
            "x": 524.905427631579,
            "y": 295.47368421052624
          }
        },
        "Not_enc4": {
          "type": "Not",
          "label": "Not_enc4",
          "inputs": 2,
          "position": {
            "x": 389.90542763157896,
            "y": 312.47368421052624
          }
        },
        "And_enc5": {
          "type": "And",
          "label": "And_enc5",
          "inputs": 2,
          "position": {
            "x": 382.90542763157896,
            "y": 244.47368421052624
          }
        },
        "Not_enc5": {
          "type": "Not",
          "label": "Not_enc5",
          "inputs": 2,
          "position": {
            "x": 246.90542763157896,
            "y": 259.47368421052624
          }
        },
        "Lamp_enc3": {
          "type": "Lamp",
          "net": "Lamp_enc3",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_enc3",
          "position": {
            "x": 1325.1558614083299,
            "y": 666.0835178641079
          }
        },
        "Or_enc13": {
          "type": "Or",
          "label": "Or_enc13",
          "inputs": 2,
          "position": {
            "x": 700.9655780075199,
            "y": 722.257606932934
          }
        },
        "Or_enc14": {
          "type": "Or",
          "label": "Or_enc14",
          "inputs": 2,
          "position": {
            "x": 858.8603148496252,
            "y": 673.5733964066183
          }
        },
        "Or_enc15": {
          "type": "Or",
          "label": "Or_enc15",
          "inputs": 2,
          "position": {
            "x": 331.228735902257,
            "y": 565.678659564513
          }
        },
        "And_enc6": {
          "type": "And",
          "label": "And_enc6",
          "inputs": 2,
          "position": {
            "x": 716.7550516917304,
            "y": 657.7839227224079
          }
        },
        "Not_enc6": {
          "type": "Not",
          "label": "Not_enc6",
          "inputs": 2,
          "position": {
            "x": 582.5445253759412,
            "y": 670.9418174592497
          }
        },
        "And_enc7": {
          "type": "And",
          "label": "And_enc7",
          "inputs": 2,
          "position": {
            "x": 578.5971569548883,
            "y": 595.9418174592498
          }
        },
        "Not_enc7": {
          "type": "Not",
          "label": "Not_enc7",
          "inputs": 2,
          "position": {
            "x": 453.5971569548883,
            "y": 610.4155016697762
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
            "And_enc5",
            "in2_And_enc5"
          ]
        ],
        "out_Or_enc0": [
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
            "Not_enc5",
            "in_Not_enc5"
          ],
          [
            "Or_enc15",
            "in2_Or_enc15"
          ]
        ],
        "out_Or_enc1": [
          [
            "Or_enc2",
            "in2_Or_enc2"
          ]
        ],
        "out_Button_enc3": [
          [
            "Or_enc2",
            "in1_Or_enc2"
          ],
          [
            "And_enc2",
            "in2_And_enc2"
          ],
          [
            "Or_enc15",
            "in1_Or_enc15"
          ]
        ],
        "out_Or_enc2": [
          [
            "Or_enc3",
            "in2_Or_enc3"
          ]
        ],
        "out_Button_enc4": [
          [
            "Or_enc3",
            "in1_Or_enc3"
          ],
          [
            "Or_enc7",
            "in2_Or_enc7"
          ],
          [
            "Not_enc2",
            "in_Not_enc2"
          ],
          [
            "Not_enc4",
            "in_Not_enc4"
          ],
          [
            "Not_enc7",
            "in_Not_enc7"
          ]
        ],
        "out_Or_enc3": [
          [
            "Or_enc4",
            "in2_Or_enc4"
          ]
        ],
        "out_Button_enc5": [
          [
            "Or_enc4",
            "in1_Or_enc4"
          ],
          [
            "Or_enc7",
            "in1_Or_enc7"
          ],
          [
            "And_enc0",
            "in2_And_enc0"
          ],
          [
            "Not_enc6",
            "in_Not_enc6"
          ]
        ],
        "out_Or_enc4": [
          [
            "Or_enc5",
            "in2_Or_enc5"
          ]
        ],
        "out_Button_enc6": [
          [
            "Or_enc5",
            "in1_Or_enc5"
          ],
          [
            "Or_enc8",
            "in1_Or_enc8"
          ],
          [
            "Not_enc0",
            "in_Not_enc0"
          ],
          [
            "Not_enc1",
            "in_Not_enc1"
          ],
          [
            "Not_enc3",
            "in_Not_enc3"
          ],
          [
            "Or_enc13",
            "in2_Or_enc13"
          ]
        ],
        "out_Or_enc5": [
          [
            "Or_enc6",
            "in2_Or_enc6"
          ]
        ],
        "out_Button_enc7": [
          [
            "Or_enc6",
            "in1_Or_enc6"
          ],
          [
            "Or_enc9",
            "in1_Or_enc9"
          ],
          [
            "Or_enc10",
            "in1_Or_enc10"
          ],
          [
            "Or_enc13",
            "in1_Or_enc13"
          ]
        ],
        "out_Or_enc6": [
          [
            "Lamp_enc0",
            "in_Lamp_enc0"
          ]
        ],
        "out_Or_enc7": [
          [
            "Or_enc8",
            "in2_Or_enc8"
          ]
        ],
        "out_Or_enc8": [
          [
            "Or_enc9",
            "in2_Or_enc9"
          ]
        ],
        "out_Or_enc9": [
          [
            "Lamp_enc2",
            "in_Lamp_enc2"
          ]
        ],
        "out_Or_enc10": [
          [
            "Or_enc11",
            "in1_Or_enc11"
          ]
        ],
        "out_Not_enc0": [
          [
            "And_enc0",
            "in1_And_enc0"
          ]
        ],
        "out_And_enc0": [
          [
            "Or_enc10",
            "in2_Or_enc10"
          ]
        ],
        "out_Not_enc1": [
          [
            "And_enc1",
            "in1_And_enc1"
          ]
        ],
        "out_And_enc2": [
          [
            "And_enc1",
            "in2_And_enc1"
          ]
        ],
        "out_Not_enc2": [
          [
            "And_enc2",
            "in1_And_enc2"
          ]
        ],
        "out_And_enc1": [
          [
            "Or_enc11",
            "in2_Or_enc11"
          ]
        ],
        "out_Or_enc11": [
          [
            "Or_enc12",
            "in1_Or_enc12"
          ]
        ],
        "out_Not_enc3": [
          [
            "And_enc3",
            "in1_And_enc3"
          ]
        ],
        "out_And_enc4": [
          [
            "And_enc3",
            "in2_And_enc3"
          ]
        ],
        "out_Not_enc4": [
          [
            "And_enc4",
            "in1_And_enc4"
          ]
        ],
        "out_And_enc5": [
          [
            "And_enc4",
            "in2_And_enc4"
          ]
        ],
        "out_Not_enc5": [
          [
            "And_enc5",
            "in1_And_enc5"
          ]
        ],
        "out_And_enc3": [
          [
            "Or_enc12",
            "in2_Or_enc12"
          ]
        ],
        "out_Or_enc12": [
          [
            "Lamp_enc1",
            "in_Lamp_enc1"
          ]
        ],
        "out_Or_enc13": [
          [
            "Or_enc14",
            "in1_Or_enc14"
          ]
        ],
        "out_Not_enc6": [
          [
            "And_enc6",
            "in1_And_enc6"
          ]
        ],
        "out_Not_enc7": [
          [
            "And_enc7",
            "in1_And_enc7"
          ]
        ],
        "out_And_enc7": [
          [
            "And_enc6",
            "in2_And_enc6"
          ]
        ],
        "out_And_enc6": [
          [
            "Or_enc14",
            "in2_Or_enc14"
          ]
        ],
        "out_Or_enc15": [
          [
            "And_enc7",
            "in2_And_enc7"
          ]
        ],
        "out_Or_enc14": [
          [
            "Lamp_enc3",
            "in_Lamp_enc3"
          ]
        ]
      },
      subcircuits: [],
      wireManipulations: {
        "out_Button_enc0-in2_Or_enc0": "step",
        "out_Button_enc1-in1_Or_enc0": "step",
        "out_Or_enc0-in2_Or_enc1": "step",
        "out_Button_enc2-in1_Or_enc1": "step",
        "out_Or_enc1-in2_Or_enc2": "step",
        "out_Button_enc3-in1_Or_enc2": "step",
        "out_Or_enc2-in2_Or_enc3": "step",
        "out_Button_enc4-in1_Or_enc3": "step",
        "out_Or_enc3-in2_Or_enc4": "step",
        "out_Button_enc5-in1_Or_enc4": "step",
        "out_Or_enc4-in2_Or_enc5": "step",
        "out_Button_enc6-in1_Or_enc5": "step",
        "out_Or_enc5-in2_Or_enc6": "step",
        "out_Button_enc7-in1_Or_enc6": "step",
        "out_Or_enc6-in_Lamp_enc0": "step",
        "out_Button_enc4-in2_Or_enc7": "step",
        "out_Button_enc5-in1_Or_enc7": "step",
        "out_Or_enc7-in2_Or_enc8": "step",
        "out_Button_enc6-in1_Or_enc8": "step",
        "out_Or_enc8-in2_Or_enc9": "step",
        "out_Button_enc7-in1_Or_enc9": "step",
        "out_Or_enc9-in_Lamp_enc2": "step",
        "out_Button_enc7-in1_Or_enc10": "step",
        "out_And_enc0-in2_Or_enc10": "step",
        "out_Not_enc0-in1_And_enc0": "step",
        "out_Button_enc6-in_Not_enc0": "step",
        "out_Button_enc5-in2_And_enc0": "step",
        "out_Or_enc10-in1_Or_enc11": "step",
        "out_Not_enc1-in1_And_enc1": "step",
        "out_And_enc2-in2_And_enc1": "step",
        "out_Not_enc2-in1_And_enc2": "step",
        "out_Button_enc3-in2_And_enc2": "step",
        "out_Button_enc4-in_Not_enc2": "step",
        "out_Button_enc6-in_Not_enc1": "step",
        "out_And_enc1-in2_Or_enc11": "step",
        "out_Or_enc11-in1_Or_enc12": "step",
        "out_Not_enc3-in1_And_enc3": "step",
        "out_And_enc4-in2_And_enc3": "step",
        "out_Not_enc4-in1_And_enc4": "step",
        "out_And_enc5-in2_And_enc4": "step",
        "out_Not_enc5-in1_And_enc5": "step",
        "out_And_enc3-in2_Or_enc12": "step",
        "out_Button_enc1-in2_And_enc5": "step",
        "out_Button_enc2-in_Not_enc5": "step",
        "out_Button_enc4-in_Not_enc4": "step",
        "out_Button_enc6-in_Not_enc3": "step",
        "out_Or_enc12-in_Lamp_enc1": "step",
        "out_Button_enc7-in1_Or_enc13": "step",
        "out_Button_enc6-in2_Or_enc13": "step",
        "out_Or_enc13-in1_Or_enc14": "step",
        "out_Button_enc2-in2_Or_enc15": "step",
        "out_Button_enc3-in1_Or_enc15": "step",
        "out_Not_enc6-in1_And_enc6": "step",
        "out_Not_enc7-in1_And_enc7": "step",
        "out_And_enc7-in2_And_enc6": "step",
        "out_And_enc6-in2_Or_enc14": "step",
        "out_Or_enc15-in2_And_enc7": "step",
        "out_Button_enc4-in_Not_enc7": "step",
        "out_Button_enc5-in_Not_enc6": "step",
        "out_Or_enc14-in_Lamp_enc3": "step"
      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}

// 16 to 4 Encoder
export const ENCODER_16_4: SingleSaveDataFormat = {
  circuit: {
      devices: {
        "Button_enc0": {
            "type": "Button",
            "label": "Button_enc0",
            "net": "Button_enc0",
            "bits": 1,
            "position": {
              "x": 12.6875,
              "y": 87
            }
          },
        "Button_enc1": {
          "type": "Button",
          "label": "Button_enc1",
          "net": "Button_enc1",
          "bits": 1,
          "rotation": 0,
          "position": {
            "x": 12.6875,
            "y": 149
          }
        },
        "Button_enc2": {
          "type": "Button",
          "label": "Button_enc2",
          "net": "Button_enc2",
          "bits": 1,
          "position": {
            "x": 12.6875,
            "y": 211
          }
        },
        "Button_enc3": {
          "type": "Button",
          "label": "Button_enc3",
          "net": "Button_enc3",
          "bits": 1,
          "position": {
            "x": 11.6875,
            "y": 275
          }
        },
        "Button_enc4": {
          "type": "Button",
          "label": "Button_enc4",
          "net": "Button_enc4",
          "bits": 1,
          "position": {
            "x": 12.6875,
            "y": 338
          }
        },
        "Button_enc5": {
          "type": "Button",
          "label": "Button_enc5",
          "net": "Button_enc5",
          "bits": 1,
          "position": {
            "x": 13.6875,
            "y": 400
          }
        },
        "Button_enc6": {
          "type": "Button",
          "label": "Button_enc6",
          "net": "Button_enc6",
          "bits": 1,
          "position": {
            "x": 15.6875,
            "y": 464
          }
        },
        "Button_enc7": {
          "type": "Button",
          "label": "Button_enc7",
          "net": "Button_enc7",
          "bits": 1,
          "position": {
            "x": 17.6875,
            "y": 527
          }
        },
        "Button_enc8": {
          "type": "Button",
          "label": "Button_enc8",
          "net": "Button_enc8",
          "bits": 1,
          "position": {
            "x": 17.6875,
            "y": 590
          }
        },
        "Button_enc9": {
          "type": "Button",
          "label": "Button_enc9",
          "net": "Button_enc9",
          "bits": 1,
          "position": {
            "x": 16.6875,
            "y": 656
          }
        },
        "Button_enc10": {
          "type": "Button",
          "label": "Button_enc10",
          "net": "Button_enc10",
          "bits": 1,
          "position": {
            "x": 18.6875,
            "y": 720
          }
        },
        "Button_enc11": {
          "type": "Button",
          "label": "Button_enc11",
          "net": "Button_enc11",
          "bits": 1,
          "position": {
            "x": 18.6875,
            "y": 784
          }
        },
        "Button_enc12": {
          "type": "Button",
          "label": "Button_enc12",
          "net": "Button_enc12",
          "bits": 1,
          "position": {
            "x": 18.6875,
            "y": 850.2727272727273
          }
        },
        "Button_enc13": {
          "type": "Button",
          "label": "Button_enc13",
          "net": "Button_enc13",
          "bits": 1,
          "position": {
            "x": 18.6875,
            "y": 910
          }
        },
        "Button_enc14": {
          "type": "Button",
          "label": "Button_enc14",
          "net": "Button_enc14",
          "bits": 1,
          "position": {
            "x": 15.6875,
            "y": 972
          }
        },
        "Button_enc15": {
          "type": "Button",
          "label": "Button_enc15",
          "net": "Button_enc15",
          "bits": 1,
          "position": {
            "x": 16.6875,
            "y": 1036
          }
        },
        "Lamp_enc0": {
          "type": "Lamp",
          "net": "Lamp_enc0",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_enc0",
          "position": {
            "x": 1514.585747378123,
            "y": 356.0526307770887
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
            "x": 1535.6757197838854,
            "y": 501.33138224005097
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
            "x": 1531.8813659895313,
            "y": 593.8145472232154
          }
        },
        "Lamp_enc3": {
          "type": "Lamp",
          "net": "Lamp_enc3",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_enc3",
          "position": {
            "x": 1547.7016568098225,
            "y": 694.3560427647116
          }
        },
        "Lamp_enc4": {
          "type": "Lamp",
          "net": "Lamp_enc4",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_enc4",
          "position": {
            "x": 1548.0496421578082,
            "y": 1210.8891392978085
          }
        },
        "Or_enc0": {
          "type": "Or",
          "label": "Or_enc0",
          "inputs": 2,
          "position": {
            "x": 953.8230713679038,
            "y": 296.2545003492641
          }
        },
        "Or_enc1": {
          "type": "Or",
          "label": "Or_enc1",
          "inputs": 2,
          "position": {
            "x": 955.1388608415879,
            "y": 684.4123950861065
          }
        },
        "Or_enc2": {
          "type": "Or",
          "label": "Or_enc2",
          "inputs": 2,
          "position": {
            "x": 953.8230713679037,
            "y": 626.517658244001
          }
        },
        "Or_enc3": {
          "type": "Or",
          "label": "Or_enc3",
          "inputs": 2,
          "position": {
            "x": 953.8230713679037,
            "y": 572.5702898229486
          }
        },
        "Or_enc4": {
          "type": "Or",
          "label": "Or_enc4",
          "inputs": 2,
          "position": {
            "x": 955.1388608415881,
            "y": 350.20186877031705
          }
        },
        "Or_enc5": {
          "type": "Or",
          "label": "Or_enc5",
          "inputs": 2,
          "position": {
            "x": 955.1388608415882,
            "y": 404.14923719136965
          }
        },
        "Or_enc6": {
          "type": "Or",
          "label": "Or_enc6",
          "inputs": 2,
          "position": {
            "x": 955.1388608415882,
            "y": 460.7281845597907
          }
        },
        "Or_enc7": {
          "type": "Or",
          "label": "Or_enc7",
          "inputs": 2,
          "position": {
            "x": 955.1388608415881,
            "y": 515.9913424545275
          }
        },
        "Or_enc8": {
          "type": "Or",
          "label": "Or_enc8",
          "inputs": 2,
          "position": {
            "x": 1074.8757029468513,
            "y": 294.93871087557994
          }
        },
        "Or_enc9": {
          "type": "Or",
          "label": "Or_enc9",
          "inputs": 2,
          "position": {
            "x": 1074.8757029468513,
            "y": 352.83344771768526
          }
        },
        "Or_enc10": {
          "type": "Or",
          "label": "Or_enc10",
          "inputs": 2,
          "position": {
            "x": 1076.1914924205355,
            "y": 406.78081613873786
          }
        },
        "Or_enc11": {
          "type": "Or",
          "label": "Or_enc11",
          "inputs": 2,
          "position": {
            "x": 1076.1914924205355,
            "y": 462.04397403347474
          }
        },
        "Or_enc12": {
          "type": "Or",
          "label": "Or_enc12",
          "inputs": 2,
          "position": {
            "x": 1174.8757029468513,
            "y": 318.6229214018958
          }
        },
        "Or_enc13": {
          "type": "Or",
          "label": "Or_enc13",
          "inputs": 2,
          "position": {
            "x": 1178.823071367904,
            "y": 404.1492371913694
          }
        },
        "Or_enc14": {
          "type": "Or",
          "label": "Or_enc14",
          "inputs": 2,
          "position": {
            "x": 1263.0335976836932,
            "y": 358.096605612422
          }
        },
        "Or_enc15": {
          "type": "Or",
          "label": "Or_enc15",
          "inputs": 2,
          "position": {
            "x": 952.2677433110277,
            "y": 1396.1538837316195
          }
        },
        "Or_enc16": {
          "type": "Or",
          "label": "Or_enc16",
          "inputs": 2,
          "position": {
            "x": 954.3240203673047,
            "y": 1462.9287755065118
          }
        },
        "Or_enc17": {
          "type": "Or",
          "label": "Or_enc17",
          "inputs": 2,
          "position": {
            "x": 955.5144965577811,
            "y": 1522.6690352467715
          }
        },
        "Or_enc18": {
          "type": "Or",
          "label": "Or_enc18",
          "inputs": 2,
          "position": {
            "x": 954.9733710166554,
            "y": 1588.0370006147366
          }
        },
        "Or_enc19": {
          "type": "Or",
          "label": "Or_enc19",
          "inputs": 2,
          "position": {
            "x": 1061.1295832254991,
            "y": 1427.6542254951194
          }
        },
        "Or_enc20": {
          "type": "Or",
          "label": "Or_enc20",
          "inputs": 2,
          "position": {
            "x": 1061.1295832254991,
            "y": 1539.5589873998817
          }
        },
        "Or_enc21": {
          "type": "Or",
          "label": "Or_enc21",
          "inputs": 2,
          "position": {
            "x": 1168.2724403683565,
            "y": 1481.2256540665478
          }
        },
        "Or_enc22": {
          "type": "Or",
          "label": "Or_enc22",
          "inputs": 2,
          "position": {
            "x": 950.894817990734,
            "y": 1315.093452934346
          }
        },
        "Or_enc23": {
          "type": "Or",
          "label": "Or_enc23",
          "inputs": 2,
          "position": {
            "x": 950.5917876877036,
            "y": 1244.184362025256
          }
        },
        "Or_enc24": {
          "type": "Or",
          "label": "Or_enc24",
          "inputs": 2,
          "position": {
            "x": 956.1973310023304,
            "y": 872.3663869463871
          }
        },
        "Or_enc25": {
          "type": "Or",
          "label": "Or_enc25",
          "inputs": 2,
          "position": {
            "x": 961.6518764568759,
            "y": 934.1845687645687
          }
        },
        "Or_enc26": {
          "type": "Or",
          "label": "Or_enc26",
          "inputs": 2,
          "position": {
            "x": 1069.6821794871792,
            "y": 903.1239627039629
          }
        },
        "And_enc27": {
          "type": "And",
          "label": "And_enc27",
          "inputs": 2,
          "position": {
            "x": 1067.2579370629364,
            "y": 1153.2754778554781
          }
        },
        "Not_enc28": {
          "type": "Not",
          "label": "Not_enc28",
          "inputs": 2,
          "position": {
            "x": 954.8336946386942,
            "y": 1124.7906293706294
          }
        },
        "Not_enc29": {
          "type": "Not",
          "label": "Not_enc29",
          "inputs": 2,
          "position": {
            "x": 951.9549067599064,
            "y": 1183.1239627039627
          }
        },
        "Not_enc30": {
          "type": "Not",
          "label": "Not_enc30",
          "inputs": 2,
          "position": {
            "x": 957.1064219114214,
            "y": 1064.7906293706296
          }
        },
        "Not_enc31": {
          "type": "Not",
          "label": "Not_enc31",
          "inputs": 2,
          "position": {
            "x": 958.7730885780879,
            "y": 1002.9724475524479
          }
        },
        "And_enc32": {
          "type": "And",
          "label": "And_enc32",
          "inputs": 2,
          "position": {
            "x": 1069.0761188811184,
            "y": 1039.7906293706294
          }
        },
        "And_enc33": {
          "type": "And",
          "label": "And_enc33",
          "inputs": 2,
          "position": {
            "x": 1168.621573426573,
            "y": 1099.4875990675991
          }
        },
        "And_enc34": {
          "type": "And",
          "label": "And_enc34",
          "inputs": 2,
          "position": {
            "x": 1253.621573426573,
            "y": 991.7603263403266
          }
        },
        "Or_enc35": {
          "type": "Or",
          "label": "Or_enc35",
          "inputs": 2,
          "position": {
            "x": 1381.651876456876,
            "y": 1158.4269930069931
          }
        },
        "Or_enc36": {
          "type": "Or",
          "label": "Or_enc36",
          "inputs": 2,
          "position": {
            "x": 1056.3488461538457,
            "y": 1278.426993006993
          }
        },
        "Or_enc37": {
          "type": "Or",
          "label": "Or_enc37",
          "inputs": 2,
          "position": {
            "x": 314.32385360253744,
            "y": 1700.6911615869506
          }
        },
        "Not_enc38": {
          "type": "Not",
          "label": "Not_enc38",
          "inputs": 2,
          "position": {
            "x": 175.05259854180875,
            "y": 1629.6385300080033
          }
        },
        "Not_enc39": {
          "type": "Not",
          "label": "Not_enc39",
          "inputs": 2,
          "position": {
            "x": 143.4736511733877,
            "y": 1666.1769915464643
          }
        },
        "Or_enc40": {
          "type": "Or",
          "label": "Or_enc40",
          "inputs": 2,
          "position": {
            "x": 481.0242584608369,
            "y": 1600.6911615869499
          }
        },
        "And_enc41": {
          "type": "And",
          "label": "And_enc41",
          "inputs": 2,
          "position": {
            "x": 312.70442040415696,
            "y": 1646.6425785909994
          }
        },
        "And_enc42": {
          "type": "And",
          "label": "And_enc42",
          "inputs": 2,
          "position": {
            "x": 425.0525985418088,
            "y": 1661.5211211011201
          }
        },
        "Not_enc43": {
          "type": "Not",
          "label": "Not_enc43",
          "inputs": 2,
          "position": {
            "x": 175.65988599120143,
            "y": 1560.8126190768292
          }
        },
        "Not_enc44": {
          "type": "Not",
          "label": "Not_enc44",
          "inputs": 2,
          "position": {
            "x": 142.76514914909617,
            "y": 1595.3267891173145
          }
        },
        "Not_enc45": {
          "type": "Not",
          "label": "Not_enc45",
          "inputs": 2,
          "position": {
            "x": 175.35624226650498,
            "y": 1487.4320522752093
          }
        },
        "Not_enc46": {
          "type": "Not",
          "label": "Not_enc46",
          "inputs": 2,
          "position": {
            "x": 143.97972404788155,
            "y": 1524.375372113266
          }
        },
        "Or_enc47": {
          "type": "Or",
          "label": "Or_enc47",
          "inputs": 2,
          "position": {
            "x": 456.42911676043195,
            "y": 1465.5697040970717
          }
        },
        "And_enc48": {
          "type": "And",
          "label": "And_enc48",
          "inputs": 2,
          "position": {
            "x": 314.0202098778412,
            "y": 1577.5130239351286
          }
        },
        "And_enc49": {
          "type": "And",
          "label": "And_enc49",
          "inputs": 2,
          "position": {
            "x": 316.0445013758167,
            "y": 1501.5008781861409
          }
        },
        "And_enc50": {
          "type": "And",
          "label": "And_enc50",
          "inputs": 2,
          "position": {
            "x": 414.72871190213243,
            "y": 1544.213428793428
          }
        },
        "And_enc51": {
          "type": "And",
          "label": "And_enc51",
          "inputs": 2,
          "position": {
            "x": 590.5384285013229,
            "y": 1513.7478417488937
          }
        },
        "Or_enc52": {
          "type": "Or",
          "label": "Or_enc52",
          "inputs": 2,
          "position": {
            "x": 295.49794267136343,
            "y": 1219.0109996436304
          }
        },
        "Not_enc53": {
          "type": "Not",
          "label": "Not_enc53",
          "inputs": 2,
          "position": {
            "x": 182.74490623411634,
            "y": 1262.7356959999056
          }
        },
        "Not_enc54": {
          "type": "Not",
          "label": "Not_enc54",
          "inputs": 2,
          "position": {
            "x": 157.03640420982484,
            "y": 1301.9057364857354
          }
        },
        "Not_enc55": {
          "type": "Not",
          "label": "Not_enc55",
          "inputs": 2,
          "position": {
            "x": 181.93518963492602,
            "y": 1341.075776971566
          }
        },
        "Not_enc56": {
          "type": "Not",
          "label": "Not_enc56",
          "inputs": 2,
          "position": {
            "x": 152.27931918958214,
            "y": 1380.0433883075982
          }
        },
        "Not_enc57": {
          "type": "Not",
          "label": "Not_enc57",
          "inputs": 2,
          "position": {
            "x": 179.2023961126588,
            "y": 1413.7478417488935
          }
        },
        "Not_enc58": {
          "type": "Not",
          "label": "Not_enc58",
          "inputs": 2,
          "position": {
            "x": 145.70037182116084,
            "y": 1448.8692992387723
          }
        },
        "And_enc59": {
          "type": "And",
          "label": "And_enc59",
          "inputs": 2,
          "position": {
            "x": 297.92709246893423,
            "y": 1276.5008781861409
          }
        },
        "And_enc60": {
          "type": "And",
          "label": "And_enc60",
          "inputs": 2,
          "position": {
            "x": 299.1416673677196,
            "y": 1356.9664652306753
          }
        },
        "And_enc61": {
          "type": "And",
          "label": "And_enc61",
          "inputs": 2,
          "position": {
            "x": 298.9392382179219,
            "y": 1427.6142385100275
          }
        },
        "And_enc62": {
          "type": "And",
          "label": "And_enc62",
          "inputs": 2,
          "position": {
            "x": 401.6720317401892,
            "y": 1394.112214218529
          }
        },
        "And_enc63": {
          "type": "And",
          "label": "And_enc63",
          "inputs": 2,
          "position": {
            "x": 404.5060398373552,
            "y": 1245.3267891173148
          }
        },
        "And_enc64": {
          "type": "And",
          "label": "And_enc64",
          "inputs": 2,
          "position": {
            "x": 495.70037182116084,
            "y": 1315.468489522173
          }
        },
        "Or_enc65": {
          "type": "Or",
          "label": "Or_enc65",
          "inputs": 2,
          "position": {
            "x": 559.769197732092,
            "y": 1682.8773964047648
          }
        },
        "Or_enc66": {
          "type": "Or",
          "label": "Or_enc66",
          "inputs": 2,
          "position": {
            "x": 698.0283070438326,
            "y": 1415.1648457974766
          }
        },
        "Or_enc67": {
          "type": "Or",
          "label": "Or_enc67",
          "inputs": 2,
          "position": {
            "x": 781.5303313353305,
            "y": 1590.367274947274
          }
        },
        "Or_enc68": {
          "type": "Or",
          "label": "Or_enc68",
          "inputs": 2,
          "position": {
            "x": 656.0972921522913,
            "y": 1169.550175380176
          }
        },
        "Not_enc69": {
          "type": "Not",
          "label": "Not_enc69",
          "inputs": 2,
          "position": {
            "x": 154.92207847707797,
            "y": 293.58863691863735
          }
        },
        "Not_enc70": {
          "type": "Not",
          "label": "Not_enc70",
          "inputs": 2,
          "position": {
            "x": 190.71267676767613,
            "y": 868.1078676878685
          }
        },
        "Not_enc71": {
          "type": "Not",
          "label": "Not_enc71",
          "inputs": 2,
          "position": {
            "x": 189.53746309246222,
            "y": 1098.449748029748
          }
        },
        "Not_enc72": {
          "type": "Not",
          "label": "Not_enc72",
          "inputs": 2,
          "position": {
            "x": 160.53105283605186,
            "y": 1056.3023121323126
          }
        },
        "Not_enc73": {
          "type": "Not",
          "label": "Not_enc73",
          "inputs": 2,
          "position": {
            "x": 155.13575369075284,
            "y": 530.0251171051179
          }
        },
        "Not_enc74": {
          "type": "Not",
          "label": "Not_enc74",
          "inputs": 2,
          "position": {
            "x": 191.03318958818878,
            "y": 717.3065856365863
          }
        },
        "Not_enc75": {
          "type": "Not",
          "label": "Not_enc75",
          "inputs": 2,
          "position": {
            "x": 161.22549728049663,
            "y": 984.6142779442787
          }
        },
        "And_enc76": {
          "type": "And",
          "label": "And_enc76",
          "inputs": 2,
          "position": {
            "x": 318.91780497280433,
            "y": 1113.4604317904325
          }
        },
        "Not_enc77": {
          "type": "Not",
          "label": "Not_enc77",
          "inputs": 2,
          "position": {
            "x": 190.37759518259455,
            "y": 489.30542013542123
          }
        },
        "Not_enc78": {
          "type": "Not",
          "label": "Not_enc78",
          "inputs": 2,
          "position": {
            "x": 192.47549728049663,
            "y": 946.3129958929969
          }
        },
        "Not_enc79": {
          "type": "Not",
          "label": "Not_enc79",
          "inputs": 2,
          "position": {
            "x": 190.71267676767616,
            "y": 1018.7488933288944
          }
        },
        "Not_enc80": {
          "type": "Not",
          "label": "Not_enc80",
          "inputs": 2,
          "position": {
            "x": 159.78318958818886,
            "y": 681.2488933288942
          }
        },
        "Not_enc81": {
          "type": "Not",
          "label": "Not_enc81",
          "inputs": 2,
          "position": {
            "x": 161.86652292152246,
            "y": 830.1270984570994
          }
        },
        "Not_enc82": {
          "type": "Not",
          "label": "Not_enc82",
          "inputs": 2,
          "position": {
            "x": 186.01182206682154,
            "y": 258.9732523032534
          }
        },
        "Not_enc83": {
          "type": "Not",
          "label": "Not_enc83",
          "inputs": 2,
          "position": {
            "x": 156.34496114996028,
            "y": 452.94178377178497
          }
        },
        "Not_enc84": {
          "type": "Not",
          "label": "Not_enc84",
          "inputs": 2,
          "position": {
            "x": 191.0331895881889,
            "y": 792.14632922633
          }
        },
        "Not_enc85": {
          "type": "Not",
          "label": "Not_enc85",
          "inputs": 2,
          "position": {
            "x": 161.22549728049685,
            "y": 908.492483072484
          }
        },
        "Not_enc86": {
          "type": "Not",
          "label": "Not_enc86",
          "inputs": 2,
          "position": {
            "x": 191.033189588189,
            "y": 641.0245343545353
          }
        },
        "Not_enc87": {
          "type": "Not",
          "label": "Not_enc87",
          "inputs": 2,
          "position": {
            "x": 152.83874514374486,
            "y": 228.84504717504802
          }
        },
        "Not_enc88": {
          "type": "Not",
          "label": "Not_enc88",
          "inputs": 2,
          "position": {
            "x": 155.4562665112658,
            "y": 603.3642779442789
          }
        },
        "Not_enc89": {
          "type": "Not",
          "label": "Not_enc89",
          "inputs": 2,
          "position": {
            "x": 159.94344599844547,
            "y": 753.3642779442789
          },
          "rotation": 0
        },
        "Not_enc90": {
          "type": "Not",
          "label": "Not_enc90",
          "inputs": 2,
          "position": {
            "x": 189.8531196581188,
            "y": 414.4802453102463
          }
        },
        "Not_enc91": {
          "type": "Not",
          "label": "Not_enc91",
          "inputs": 2,
          "position": {
            "x": 184.08874514374486,
            "y": 194.22966255966367
          }
        },
        "Not_enc92": {
          "type": "Not",
          "label": "Not_enc92",
          "inputs": 2,
          "position": {
            "x": 188.78959984459925,
            "y": 567.1463292263302
          }
        },
        "Not_enc93": {
          "type": "Not",
          "label": "Not_enc93",
          "inputs": 2,
          "position": {
            "x": 153.03785159285076,
            "y": 379.50064158064265
          }
        },
        "Not_enc94": {
          "type": "Not",
          "label": "Not_enc94",
          "inputs": 2,
          "position": {
            "x": 146.58874514374483,
            "y": 161.69761127761228
          }
        },
        "Not_enc95": {
          "type": "Not",
          "label": "Not_enc95",
          "inputs": 2,
          "position": {
            "x": 182.00541181041152,
            "y": 125.15914973915085
          }
        },
        "Not_enc96": {
          "type": "Not",
          "label": "Not_enc96",
          "inputs": 2,
          "position": {
            "x": 184.11302641802578,
            "y": 337.73199356199467
          }
        },
        "Not_enc97": {
          "type": "Not",
          "label": "Not_enc97",
          "inputs": 2,
          "position": {
            "x": 146.4284887334882,
            "y": 88.62068820068919
          }
        },
        "And_enc98": {
          "type": "And",
          "label": "And_enc98",
          "inputs": 2,
          "position": {
            "x": 514.2703690753686,
            "y": 1074.9988933288944
          }
        },
        "And_enc99": {
          "type": "And",
          "label": "And_enc99",
          "inputs": 2,
          "position": {
            "x": 319.23831779331715,
            "y": 1035.7360728160734
          }
        },
        "And_enc100": {
          "type": "And",
          "label": "And_enc100",
          "inputs": 2,
          "position": {
            "x": 512.0267793317787,
            "y": 999.5715429015438
          },
          "rotation": 0
        },
        "And_enc101": {
          "type": "And",
          "label": "And_enc101",
          "inputs": 2,
          "position": {
            "x": 324.0460101010094,
            "y": 963.4604317904327
          }
        },
        "And_enc102": {
          "type": "And",
          "label": "And_enc102",
          "inputs": 2,
          "position": {
            "x": 423.08447163947096,
            "y": 920.6719702519713
          }
        },
        "And_enc103": {
          "type": "And",
          "label": "And_enc103",
          "inputs": 2,
          "position": {
            "x": 514.5908818958811,
            "y": 866.1847907647917
          }
        },
        "And_enc104": {
          "type": "And",
          "label": "And_enc104",
          "inputs": 2,
          "position": {
            "x": 311.8665229215221,
            "y": 772.9155599955608
          }
        },
        "And_enc105": {
          "type": "And",
          "label": "And_enc105",
          "inputs": 2,
          "position": {
            "x": 310.58447163947073,
            "y": 849.9988933288944
          }
        },
        "And_enc106": {
          "type": "And",
          "label": "And_enc106",
          "inputs": 2,
          "position": {
            "x": 423.4049844599838,
            "y": 810.0950471750482
          }
        },
        "And_enc107": {
          "type": "And",
          "label": "And_enc107",
          "inputs": 2,
          "position": {
            "x": 556.7383177933173,
            "y": 784.9347907647917
          }
        },
        "And_enc108": {
          "type": "And",
          "label": "And_enc108",
          "inputs": 2,
          "position": {
            "x": 313.9498562548555,
            "y": 698.2360728160736
          }
        },
        "And_enc109": {
          "type": "And",
          "label": "And_enc109",
          "inputs": 2,
          "position": {
            "x": 315.3921639471631,
            "y": 625.6399189699198
          }
        },
        "And_enc110": {
          "type": "And",
          "label": "And_enc110",
          "inputs": 2,
          "position": {
            "x": 413.6293434343427,
            "y": 658.1719702519713
          }
        },
        "And_enc111": {
          "type": "And",
          "label": "And_enc111",
          "inputs": 2,
          "position": {
            "x": 468.75754856254764,
            "y": 734.7745343545355
          }
        },
        "And_enc112": {
          "type": "And",
          "label": "And_enc112",
          "inputs": 2,
          "position": {
            "x": 491.4347324897316,
            "y": 420.53335886335947
          }
        },
        "And_enc113": {
          "type": "And",
          "label": "And_enc113",
          "inputs": 2,
          "position": {
            "x": 299.76806582306483,
            "y": 505.9500255300265
          }
        },
        "And_enc114": {
          "type": "And",
          "label": "And_enc114",
          "inputs": 2,
          "position": {
            "x": 297.68473248973146,
            "y": 433.9803285603292
          }
        },
        "And_enc115": {
          "type": "And",
          "label": "And_enc115",
          "inputs": 2,
          "position": {
            "x": 296.54836885336795,
            "y": 357.2757831057839
          }
        },
        "And_enc116": {
          "type": "And",
          "label": "And_enc116",
          "inputs": 2,
          "position": {
            "x": 414.16200521700443,
            "y": 470.1545709845717
          }
        },
        "And_enc117": {
          "type": "And",
          "label": "And_enc117",
          "inputs": 2,
          "position": {
            "x": 417.0029143079132,
            "y": 369.5863891663899
          }
        },
        "And_enc118": {
          "type": "And",
          "label": "And_enc118",
          "inputs": 2,
          "position": {
            "x": 508.14510545010455,
            "y": 303.8812609612616
          }
        },
        "And_enc119": {
          "type": "And",
          "label": "And_enc119",
          "inputs": 2,
          "position": {
            "x": 295.912199467199,
            "y": 108.90262848262921
          }
        },
        "And_enc120": {
          "type": "And",
          "label": "And_enc120",
          "inputs": 2,
          "position": {
            "x": 300.5596353646349,
            "y": 174.92826950827015
          }
        },
        "And_enc121": {
          "type": "And",
          "label": "And_enc121",
          "inputs": 2,
          "position": {
            "x": 300.5596353646349,
            "y": 239.67185925185993
          }
        },
        "And_enc122": {
          "type": "And",
          "label": "And_enc122",
          "inputs": 2,
          "position": {
            "x": 403.92501998001944,
            "y": 141.27442335442402
          }
        },
        "And_enc123": {
          "type": "And",
          "label": "And_enc123",
          "inputs": 2,
          "position": {
            "x": 402.162199467199,
            "y": 253.774423354424
          }
        },
        "And_enc124": {
          "type": "And",
          "label": "And_enc124",
          "inputs": 2,
          "position": {
            "x": 475.39937895437845,
            "y": 196.72314130314209
          }
        },
        "Or_enc125": {
          "type": "Or",
          "label": "Or_enc125",
          "inputs": 2,
          "position": {
            "x": 603.6045071595063,
            "y": 354.8962182262189
          }
        },
        "Or_enc126": {
          "type": "Or",
          "label": "Or_enc126",
          "inputs": 2,
          "position": {
            "x": 642.4933960483952,
            "y": 824.1804062604068
          }
        },
        "Or_enc127": {
          "type": "Or",
          "label": "Or_enc127",
          "inputs": 2,
          "position": {
            "x": 652.9634815184804,
            "y": 1041.1141669441677
          }
        },
        "Or_enc128": {
          "type": "Or",
          "label": "Or_enc128",
          "inputs": 2,
          "position": {
            "x": 768.9357037407028,
            "y": 1093.1975002775011
          }
        },
        "Or_enc129": {
          "type": "Or",
          "label": "Or_enc129",
          "inputs": 2,
          "position": {
            "x": 711.9912592962582,
            "y": 552.2252780552787
          }
        },
        "Or_enc130": {
          "type": "Or",
          "label": "Or_enc130",
          "inputs": 2,
          "position": {
            "x": 858.3587806637801,
            "y": 816.6483549783558
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
            "And_enc118",
            "in2_And_enc118"
          ]
        ],
        "out_Or_enc0": [
          [
            "Or_enc8",
            "in2_Or_enc8"
          ]
        ],
        "out_Button_enc2": [
          [
            "Or_enc4",
            "in2_Or_enc4"
          ],
          [
            "Or_enc52",
            "in2_Or_enc52"
          ],
          [
            "Not_enc97",
            "in_Not_enc97"
          ]
        ],
        "out_Button_enc3": [
          [
            "Or_enc4",
            "in1_Or_enc4"
          ],
          [
            "Or_enc52",
            "in1_Or_enc52"
          ],
          [
            "And_enc112",
            "in2_And_enc112"
          ]
        ],
        "out_Button_enc4": [
          [
            "Or_enc5",
            "in2_Or_enc5"
          ],
          [
            "Or_enc24",
            "in2_Or_enc24"
          ],
          [
            "Not_enc53",
            "in_Not_enc53"
          ],
          [
            "Not_enc95",
            "in_Not_enc95"
          ],
          [
            "Not_enc96",
            "in_Not_enc96"
          ]
        ],
        "out_Button_enc5": [
          [
            "Or_enc5",
            "in1_Or_enc5"
          ],
          [
            "Or_enc24",
            "in1_Or_enc24"
          ],
          [
            "Not_enc54",
            "in_Not_enc54"
          ],
          [
            "And_enc107",
            "in2_And_enc107"
          ]
        ],
        "out_Button_enc6": [
          [
            "Or_enc6",
            "in2_Or_enc6"
          ],
          [
            "Or_enc25",
            "in2_Or_enc25"
          ],
          [
            "Or_enc47",
            "in2_Or_enc47"
          ],
          [
            "Not_enc94",
            "in_Not_enc94"
          ],
          [
            "Not_enc93",
            "in_Not_enc93"
          ],
          [
            "Not_enc92",
            "in_Not_enc92"
          ]
        ],
        "out_Button_enc7": [
          [
            "Or_enc6",
            "in1_Or_enc6"
          ],
          [
            "Or_enc25",
            "in1_Or_enc25"
          ],
          [
            "Or_enc47",
            "in1_Or_enc47"
          ],
          [
            "And_enc103",
            "in2_And_enc103"
          ]
        ],
        "out_Button_enc8": [
          [
            "Or_enc7",
            "in2_Or_enc7"
          ],
          [
            "Or_enc15",
            "in2_Or_enc15"
          ],
          [
            "Not_enc31",
            "in_Not_enc31"
          ],
          [
            "Not_enc45",
            "in_Not_enc45"
          ],
          [
            "Not_enc55",
            "in_Not_enc55"
          ],
          [
            "Not_enc91",
            "in_Not_enc91"
          ],
          [
            "Not_enc88",
            "in_Not_enc88"
          ],
          [
            "Not_enc90",
            "in_Not_enc90"
          ],
          [
            "Not_enc89",
            "in_Not_enc89"
          ]
        ],
        "out_Button_enc9": [
          [
            "Or_enc7",
            "in1_Or_enc7"
          ],
          [
            "Or_enc15",
            "in1_Or_enc15"
          ],
          [
            "Not_enc30",
            "in_Not_enc30"
          ],
          [
            "Not_enc46",
            "in_Not_enc46"
          ],
          [
            "Not_enc56",
            "in_Not_enc56"
          ],
          [
            "And_enc100",
            "in2_And_enc100"
          ]
        ],
        "out_Button_enc15": [
          [
            "Or_enc1",
            "in1_Or_enc1"
          ],
          [
            "Or_enc18",
            "in1_Or_enc18"
          ],
          [
            "Or_enc23",
            "in1_Or_enc23"
          ],
          [
            "Or_enc37",
            "in1_Or_enc37"
          ],
          [
            "Or_enc68",
            "in1_Or_enc68"
          ]
        ],
        "out_Button_enc14": [
          [
            "Or_enc1",
            "in2_Or_enc1"
          ],
          [
            "Or_enc18",
            "in2_Or_enc18"
          ],
          [
            "Or_enc23",
            "in2_Or_enc23"
          ],
          [
            "Or_enc37",
            "in2_Or_enc37"
          ],
          [
            "Not_enc69",
            "in_Not_enc69"
          ],
          [
            "Not_enc70",
            "in_Not_enc70"
          ],
          [
            "Not_enc71",
            "in_Not_enc71"
          ],
          [
            "Not_enc72",
            "in_Not_enc72"
          ],
          [
            "Not_enc73",
            "in_Not_enc73"
          ],
          [
            "Not_enc74",
            "in_Not_enc74"
          ],
          [
            "Not_enc75",
            "in_Not_enc75"
          ]
        ],
        "out_Button_enc12": [
          [
            "Or_enc2",
            "in2_Or_enc2"
          ],
          [
            "Or_enc17",
            "in2_Or_enc17"
          ],
          [
            "Or_enc22",
            "in2_Or_enc22"
          ],
          [
            "Not_enc38",
            "in_Not_enc38"
          ],
          [
            "Not_enc43",
            "in_Not_enc43"
          ],
          [
            "Not_enc57",
            "in_Not_enc57"
          ],
          [
            "Not_enc77",
            "in_Not_enc77"
          ],
          [
            "Not_enc78",
            "in_Not_enc78"
          ],
          [
            "Not_enc79",
            "in_Not_enc79"
          ],
          [
            "Not_enc80",
            "in_Not_enc80"
          ],
          [
            "Not_enc81",
            "in_Not_enc81"
          ],
          [
            "Not_enc82",
            "in_Not_enc82"
          ]
        ],
        "out_Button_enc13": [
          [
            "Or_enc2",
            "in1_Or_enc2"
          ],
          [
            "Or_enc17",
            "in1_Or_enc17"
          ],
          [
            "Or_enc22",
            "in1_Or_enc22"
          ],
          [
            "Not_enc39",
            "in_Not_enc39"
          ],
          [
            "Not_enc44",
            "in_Not_enc44"
          ],
          [
            "Not_enc58",
            "in_Not_enc58"
          ],
          [
            "And_enc76",
            "in2_And_enc76"
          ]
        ],
        "out_Button_enc10": [
          [
            "Or_enc3",
            "in2_Or_enc3"
          ],
          [
            "Or_enc16",
            "in2_Or_enc16"
          ],
          [
            "Not_enc28",
            "in_Not_enc28"
          ],
          [
            "Or_enc40",
            "in2_Or_enc40"
          ],
          [
            "Not_enc87",
            "in_Not_enc87"
          ],
          [
            "Not_enc83",
            "in_Not_enc83"
          ],
          [
            "Not_enc86",
            "in_Not_enc86"
          ],
          [
            "Not_enc84",
            "in_Not_enc84"
          ],
          [
            "Not_enc85",
            "in_Not_enc85"
          ]
        ],
        "out_Button_enc11": [
          [
            "Or_enc3",
            "in1_Or_enc3"
          ],
          [
            "Or_enc16",
            "in1_Or_enc16"
          ],
          [
            "Not_enc29",
            "in_Not_enc29"
          ],
          [
            "Or_enc40",
            "in1_Or_enc40"
          ],
          [
            "And_enc98",
            "in2_And_enc98"
          ]
        ],
        "out_Or_enc4": [
          [
            "Or_enc8",
            "in1_Or_enc8"
          ]
        ],
        "out_Or_enc5": [
          [
            "Or_enc9",
            "in2_Or_enc9"
          ]
        ],
        "out_Or_enc6": [
          [
            "Or_enc9",
            "in1_Or_enc9"
          ]
        ],
        "out_Or_enc7": [
          [
            "Or_enc10",
            "in2_Or_enc10"
          ]
        ],
        "out_Or_enc3": [
          [
            "Or_enc10",
            "in1_Or_enc10"
          ]
        ],
        "out_Or_enc2": [
          [
            "Or_enc11",
            "in2_Or_enc11"
          ]
        ],
        "out_Or_enc1": [
          [
            "Or_enc11",
            "in1_Or_enc11"
          ]
        ],
        "out_Or_enc8": [
          [
            "Or_enc12",
            "in2_Or_enc12"
          ]
        ],
        "out_Or_enc9": [
          [
            "Or_enc12",
            "in1_Or_enc12"
          ]
        ],
        "out_Or_enc10": [
          [
            "Or_enc13",
            "in2_Or_enc13"
          ]
        ],
        "out_Or_enc11": [
          [
            "Or_enc13",
            "in1_Or_enc13"
          ]
        ],
        "out_Or_enc12": [
          [
            "Or_enc14",
            "in2_Or_enc14"
          ]
        ],
        "out_Or_enc13": [
          [
            "Or_enc14",
            "in1_Or_enc14"
          ]
        ],
        "out_Or_enc14": [
          [
            "Lamp_enc0",
            "in_Lamp_enc0"
          ]
        ],
        "out_Or_enc15": [
          [
            "Or_enc19",
            "in2_Or_enc19"
          ]
        ],
        "out_Or_enc16": [
          [
            "Or_enc19",
            "in1_Or_enc19"
          ]
        ],
        "out_Or_enc17": [
          [
            "Or_enc20",
            "in2_Or_enc20"
          ]
        ],
        "out_Or_enc18": [
          [
            "Or_enc20",
            "in1_Or_enc20"
          ]
        ],
        "out_Or_enc19": [
          [
            "Or_enc21",
            "in2_Or_enc21"
          ]
        ],
        "out_Or_enc20": [
          [
            "Or_enc21",
            "in1_Or_enc21"
          ]
        ],
        "out_Or_enc21": [
          [
            "Lamp_enc4",
            "in_Lamp_enc4"
          ]
        ],
        "out_Or_enc24": [
          [
            "Or_enc26",
            "in2_Or_enc26"
          ]
        ],
        "out_Or_enc25": [
          [
            "Or_enc26",
            "in1_Or_enc26"
          ]
        ],
        "out_Not_enc28": [
          [
            "And_enc27",
            "in2_And_enc27"
          ]
        ],
        "out_Not_enc29": [
          [
            "And_enc27",
            "in1_And_enc27"
          ]
        ],
        "out_Not_enc31": [
          [
            "And_enc32",
            "in2_And_enc32"
          ]
        ],
        "out_Not_enc30": [
          [
            "And_enc32",
            "in1_And_enc32"
          ]
        ],
        "out_And_enc32": [
          [
            "And_enc33",
            "in2_And_enc33"
          ]
        ],
        "out_And_enc27": [
          [
            "And_enc33",
            "in1_And_enc33"
          ]
        ],
        "out_Or_enc26": [
          [
            "And_enc34",
            "in2_And_enc34"
          ]
        ],
        "out_And_enc33": [
          [
            "And_enc34",
            "in1_And_enc34"
          ]
        ],
        "out_And_enc34": [
          [
            "Or_enc35",
            "in2_Or_enc35"
          ]
        ],
        "out_Or_enc23": [
          [
            "Or_enc36",
            "in2_Or_enc36"
          ]
        ],
        "out_Or_enc22": [
          [
            "Or_enc36",
            "in1_Or_enc36"
          ]
        ],
        "out_Or_enc36": [
          [
            "Or_enc35",
            "in1_Or_enc35"
          ]
        ],
        "out_Or_enc35": [
          [
            "Lamp_enc3",
            "in_Lamp_enc3"
          ]
        ],
        "out_Not_enc38": [
          [
            "And_enc41",
            "in2_And_enc41"
          ]
        ],
        "out_Not_enc39": [
          [
            "And_enc41",
            "in1_And_enc41"
          ]
        ],
        "out_Or_enc40": [
          [
            "And_enc42",
            "in2_And_enc42"
          ]
        ],
        "out_And_enc41": [
          [
            "And_enc42",
            "in1_And_enc42"
          ]
        ],
        "out_Not_enc43": [
          [
            "And_enc48",
            "in2_And_enc48"
          ]
        ],
        "out_Not_enc44": [
          [
            "And_enc48",
            "in1_And_enc48"
          ]
        ],
        "out_Not_enc45": [
          [
            "And_enc49",
            "in2_And_enc49"
          ]
        ],
        "out_Not_enc46": [
          [
            "And_enc49",
            "in1_And_enc49"
          ]
        ],
        "out_And_enc49": [
          [
            "And_enc50",
            "in2_And_enc50"
          ]
        ],
        "out_And_enc48": [
          [
            "And_enc50",
            "in1_And_enc50"
          ]
        ],
        "out_Or_enc47": [
          [
            "And_enc51",
            "in2_And_enc51"
          ]
        ],
        "out_And_enc50": [
          [
            "And_enc51",
            "in1_And_enc51"
          ]
        ],
        "out_Or_enc52": [
          [
            "And_enc63",
            "in2_And_enc63"
          ]
        ],
        "out_Not_enc53": [
          [
            "And_enc59",
            "in2_And_enc59"
          ]
        ],
        "out_Not_enc54": [
          [
            "And_enc59",
            "in1_And_enc59"
          ]
        ],
        "out_Not_enc55": [
          [
            "And_enc60",
            "in2_And_enc60"
          ]
        ],
        "out_Not_enc56": [
          [
            "And_enc60",
            "in1_And_enc60"
          ]
        ],
        "out_Not_enc57": [
          [
            "And_enc61",
            "in2_And_enc61"
          ]
        ],
        "out_Not_enc58": [
          [
            "And_enc61",
            "in1_And_enc61"
          ]
        ],
        "out_And_enc60": [
          [
            "And_enc62",
            "in2_And_enc62"
          ]
        ],
        "out_And_enc61": [
          [
            "And_enc62",
            "in1_And_enc62"
          ]
        ],
        "out_And_enc59": [
          [
            "And_enc63",
            "in1_And_enc63"
          ]
        ],
        "out_And_enc63": [
          [
            "And_enc64",
            "in2_And_enc64"
          ]
        ],
        "out_And_enc62": [
          [
            "And_enc64",
            "in1_And_enc64"
          ]
        ],
        "out_And_enc42": [
          [
            "Or_enc65",
            "in2_Or_enc65"
          ]
        ],
        "out_Or_enc37": [
          [
            "Or_enc65",
            "in1_Or_enc65"
          ]
        ],
        "out_And_enc64": [
          [
            "Or_enc66",
            "in2_Or_enc66"
          ]
        ],
        "out_And_enc51": [
          [
            "Or_enc66",
            "in1_Or_enc66"
          ]
        ],
        "out_Or_enc66": [
          [
            "Or_enc67",
            "in2_Or_enc67"
          ]
        ],
        "out_Or_enc65": [
          [
            "Or_enc67",
            "in1_Or_enc67"
          ]
        ],
        "out_Or_enc67": [
          [
            "Lamp_enc2",
            "in_Lamp_enc2"
          ]
        ],
        "out_Not_enc71": [
          [
            "And_enc76",
            "in1_And_enc76"
          ]
        ],
        "out_And_enc76": [
          [
            "Or_enc68",
            "in2_Or_enc68"
          ]
        ],
        "out_Not_enc79": [
          [
            "And_enc99",
            "in2_And_enc99"
          ]
        ],
        "out_Not_enc72": [
          [
            "And_enc99",
            "in1_And_enc99"
          ]
        ],
        "out_And_enc99": [
          [
            "And_enc98",
            "in1_And_enc98"
          ]
        ],
        "out_Not_enc78": [
          [
            "And_enc101",
            "in2_And_enc101"
          ]
        ],
        "out_Not_enc75": [
          [
            "And_enc101",
            "in1_And_enc101"
          ]
        ],
        "out_Not_enc85": [
          [
            "And_enc102",
            "in2_And_enc102"
          ]
        ],
        "out_And_enc101": [
          [
            "And_enc102",
            "in1_And_enc102"
          ]
        ],
        "out_And_enc102": [
          [
            "And_enc100",
            "in1_And_enc100"
          ]
        ],
        "out_Not_enc89": [
          [
            "And_enc104",
            "in2_And_enc104"
          ]
        ],
        "out_Not_enc84": [
          [
            "And_enc104",
            "in1_And_enc104"
          ]
        ],
        "out_Not_enc81": [
          [
            "And_enc105",
            "in2_And_enc105"
          ]
        ],
        "out_Not_enc70": [
          [
            "And_enc105",
            "in1_And_enc105"
          ]
        ],
        "out_And_enc104": [
          [
            "And_enc106",
            "in2_And_enc106"
          ]
        ],
        "out_And_enc105": [
          [
            "And_enc106",
            "in1_And_enc106"
          ]
        ],
        "out_And_enc106": [
          [
            "And_enc103",
            "in1_And_enc103"
          ]
        ],
        "out_Not_enc80": [
          [
            "And_enc108",
            "in2_And_enc108"
          ]
        ],
        "out_Not_enc74": [
          [
            "And_enc108",
            "in1_And_enc108"
          ]
        ],
        "out_Not_enc88": [
          [
            "And_enc109",
            "in2_And_enc109"
          ]
        ],
        "out_Not_enc86": [
          [
            "And_enc109",
            "in1_And_enc109"
          ]
        ],
        "out_And_enc109": [
          [
            "And_enc110",
            "in2_And_enc110"
          ]
        ],
        "out_And_enc108": [
          [
            "And_enc110",
            "in1_And_enc110"
          ]
        ],
        "out_Not_enc92": [
          [
            "And_enc111",
            "in2_And_enc111"
          ]
        ],
        "out_And_enc110": [
          [
            "And_enc111",
            "in1_And_enc111"
          ]
        ],
        "out_And_enc111": [
          [
            "And_enc107",
            "in1_And_enc107"
          ]
        ],
        "out_Not_enc77": [
          [
            "And_enc113",
            "in2_And_enc113"
          ]
        ],
        "out_Not_enc73": [
          [
            "And_enc113",
            "in1_And_enc113"
          ]
        ],
        "out_Not_enc90": [
          [
            "And_enc114",
            "in2_And_enc114"
          ]
        ],
        "out_Not_enc83": [
          [
            "And_enc114",
            "in1_And_enc114"
          ]
        ],
        "out_Not_enc96": [
          [
            "And_enc115",
            "in2_And_enc115"
          ]
        ],
        "out_Not_enc93": [
          [
            "And_enc115",
            "in1_And_enc115"
          ]
        ],
        "out_And_enc114": [
          [
            "And_enc116",
            "in2_And_enc116"
          ]
        ],
        "out_And_enc113": [
          [
            "And_enc116",
            "in1_And_enc116"
          ]
        ],
        "out_And_enc116": [
          [
            "And_enc117",
            "in1_And_enc117"
          ]
        ],
        "out_And_enc115": [
          [
            "And_enc117",
            "in2_And_enc117"
          ]
        ],
        "out_And_enc117": [
          [
            "And_enc112",
            "in1_And_enc112"
          ]
        ],
        "out_Not_enc97": [
          [
            "And_enc119",
            "in2_And_enc119"
          ]
        ],
        "out_Not_enc95": [
          [
            "And_enc119",
            "in1_And_enc119"
          ]
        ],
        "out_Not_enc94": [
          [
            "And_enc120",
            "in2_And_enc120"
          ]
        ],
        "out_Not_enc91": [
          [
            "And_enc120",
            "in1_And_enc120"
          ]
        ],
        "out_Not_enc87": [
          [
            "And_enc121",
            "in2_And_enc121"
          ]
        ],
        "out_Not_enc82": [
          [
            "And_enc121",
            "in1_And_enc121"
          ]
        ],
        "out_And_enc119": [
          [
            "And_enc122",
            "in2_And_enc122"
          ]
        ],
        "out_And_enc120": [
          [
            "And_enc122",
            "in1_And_enc122"
          ]
        ],
        "out_Not_enc69": [
          [
            "And_enc123",
            "in1_And_enc123"
          ]
        ],
        "out_And_enc121": [
          [
            "And_enc123",
            "in2_And_enc123"
          ]
        ],
        "out_And_enc122": [
          [
            "And_enc124",
            "in2_And_enc124"
          ]
        ],
        "out_And_enc123": [
          [
            "And_enc124",
            "in1_And_enc124"
          ]
        ],
        "out_And_enc124": [
          [
            "And_enc118",
            "in1_And_enc118"
          ]
        ],
        "out_And_enc118": [
          [
            "Or_enc125",
            "in2_Or_enc125"
          ]
        ],
        "out_And_enc112": [
          [
            "Or_enc125",
            "in1_Or_enc125"
          ]
        ],
        "out_And_enc107": [
          [
            "Or_enc126",
            "in2_Or_enc126"
          ]
        ],
        "out_And_enc103": [
          [
            "Or_enc126",
            "in1_Or_enc126"
          ]
        ],
        "out_And_enc100": [
          [
            "Or_enc127",
            "in2_Or_enc127"
          ]
        ],
        "out_And_enc98": [
          [
            "Or_enc127",
            "in1_Or_enc127"
          ]
        ],
        "out_Or_enc68": [
          [
            "Or_enc128",
            "in1_Or_enc128"
          ]
        ],
        "out_Or_enc127": [
          [
            "Or_enc128",
            "in2_Or_enc128"
          ]
        ],
        "out_Or_enc126": [
          [
            "Or_enc129",
            "in1_Or_enc129"
          ]
        ],
        "out_Or_enc125": [
          [
            "Or_enc129",
            "in2_Or_enc129"
          ]
        ],
        "out_Or_enc129": [
          [
            "Or_enc130",
            "in2_Or_enc130"
          ]
        ],
        "out_Or_enc128": [
          [
            "Or_enc130",
            "in1_Or_enc130"
          ]
        ],
        "out_Or_enc130": [
          [
            "Lamp_enc1",
            "in_Lamp_enc1"
          ]
        ]
      },
      subcircuits: [],
      wireManipulations: {
        "out_Button_enc0-in2_Or_enc0": "step",
        "out_Button_enc1-in1_Or_enc0": "step",
        "out_Button_enc15-in1_Or_enc1": "step",
        "out_Button_enc14-in2_Or_enc1": "step",
        "out_Button_enc12-in2_Or_enc2": "step",
        "out_Button_enc13-in1_Or_enc2": "step",
        "out_Button_enc10-in2_Or_enc3": "step",
        "out_Button_enc11-in1_Or_enc3": "step",
        "out_Button_enc2-in2_Or_enc4": "step",
        "out_Button_enc3-in1_Or_enc4": "step",
        "out_Button_enc4-in2_Or_enc5": "step",
        "out_Button_enc5-in1_Or_enc5": "step",
        "out_Button_enc6-in2_Or_enc6": "step",
        "out_Button_enc7-in1_Or_enc6": "step",
        "out_Button_enc8-in2_Or_enc7": "step",
        "out_Button_enc9-in1_Or_enc7": "step",
        "out_Or_enc0-in2_Or_enc8": "step",
        "out_Or_enc4-in1_Or_enc8": "step",
        "out_Or_enc5-in2_Or_enc9": "step",
        "out_Or_enc6-in1_Or_enc9": "step",
        "out_Or_enc7-in2_Or_enc10": "step",
        "out_Or_enc3-in1_Or_enc10": "step",
        "out_Or_enc2-in2_Or_enc11": "step",
        "out_Or_enc1-in1_Or_enc11": "step",
        "out_Or_enc8-in2_Or_enc12": "step",
        "out_Or_enc9-in1_Or_enc12": "step",
        "out_Or_enc10-in2_Or_enc13": "step",
        "out_Or_enc11-in1_Or_enc13": "step",
        "out_Or_enc12-in2_Or_enc14": "step",
        "out_Or_enc13-in1_Or_enc14": "step",
        "out_Or_enc14-in_Lamp_enc0": "step",
        "out_Button_enc15-in1_Or_enc18": "step",
        "out_Button_enc14-in2_Or_enc18": "step",
        "out_Button_enc12-in2_Or_enc17": "step",
        "out_Button_enc13-in1_Or_enc17": "step",
        "out_Button_enc10-in2_Or_enc16": "step",
        "out_Button_enc11-in1_Or_enc16": "step",
        "out_Button_enc9-in1_Or_enc15": "step",
        "out_Button_enc8-in2_Or_enc15": "step",
        "out_Or_enc15-in2_Or_enc19": "step",
        "out_Or_enc16-in1_Or_enc19": "step",
        "out_Or_enc17-in2_Or_enc20": "step",
        "out_Or_enc18-in1_Or_enc20": "step",
        "out_Or_enc19-in2_Or_enc21": "step",
        "out_Or_enc20-in1_Or_enc21": "step",
        "out_Or_enc21-in_Lamp_enc4": "step",
        "out_Button_enc15-in1_Or_enc23": "step",
        "out_Button_enc14-in2_Or_enc23": "step",
        "out_Button_enc13-in1_Or_enc22": "step",
        "out_Button_enc12-in2_Or_enc22": "step",
        "out_Button_enc4-in2_Or_enc24": "step",
        "out_Button_enc5-in1_Or_enc24": "step",
        "out_Button_enc6-in2_Or_enc25": "step",
        "out_Button_enc7-in1_Or_enc25": "step",
        "out_Or_enc24-in2_Or_enc26": "step",
        "out_Or_enc25-in1_Or_enc26": "step",
        "out_Button_enc11-in_Not_enc29": "step",
        "out_Button_enc10-in_Not_enc28": "step",
        "out_Button_enc9-in_Not_enc30": "step",
        "out_Button_enc8-in_Not_enc31": "step",
        "out_Not_enc28-in2_And_enc27": "step",
        "out_Not_enc29-in1_And_enc27": "step",
        "out_Not_enc31-in2_And_enc32": "step",
        "out_Not_enc30-in1_And_enc32": "step",
        "out_And_enc32-in2_And_enc33": "step",
        "out_And_enc27-in1_And_enc33": "step",
        "out_Or_enc26-in2_And_enc34": "step",
        "out_And_enc33-in1_And_enc34": "step",
        "out_And_enc34-in2_Or_enc35": "step",
        "out_Or_enc23-in2_Or_enc36": "step",
        "out_Or_enc22-in1_Or_enc36": "step",
        "out_Or_enc36-in1_Or_enc35": "step",
        "out_Or_enc35-in_Lamp_enc3": "step",
        "out_Button_enc14-in2_Or_enc37": "step",
        "out_Button_enc15-in1_Or_enc37": "step",
        "out_Button_enc12-in_Not_enc38": "step",
        "out_Button_enc13-in_Not_enc39": "step",
        "out_Button_enc10-in2_Or_enc40": "step",
        "out_Button_enc11-in1_Or_enc40": "step",
        "out_Not_enc38-in2_And_enc41": "step",
        "out_Not_enc39-in1_And_enc41": "step",
        "out_Or_enc40-in2_And_enc42": "step",
        "out_And_enc41-in1_And_enc42": "step",
        "out_Button_enc12-in_Not_enc43": "step",
        "out_Button_enc13-in_Not_enc44": "step",
        "out_Button_enc6-in2_Or_enc47": "step",
        "out_Button_enc7-in1_Or_enc47": "step",
        "out_Button_enc8-in_Not_enc45": "step",
        "out_Button_enc9-in_Not_enc46": "step",
        "out_Not_enc43-in2_And_enc48": "step",
        "out_Not_enc44-in1_And_enc48": "step",
        "out_Not_enc45-in2_And_enc49": "step",
        "out_Not_enc46-in1_And_enc49": "step",
        "out_And_enc49-in2_And_enc50": "step",
        "out_And_enc48-in1_And_enc50": "step",
        "out_Or_enc47-in2_And_enc51": "step",
        "out_And_enc50-in1_And_enc51": "step",
        "out_Button_enc2-in2_Or_enc52": "step",
        "out_Button_enc3-in1_Or_enc52": "step",
        "out_Button_enc4-in_Not_enc53": "step",
        "out_Button_enc5-in_Not_enc54": "step",
        "out_Button_enc8-in_Not_enc55": "step",
        "out_Button_enc9-in_Not_enc56": "step",
        "out_Button_enc13-in_Not_enc58": "step",
        "out_Button_enc12-in_Not_enc57": "step",
        "out_Not_enc53-in2_And_enc59": "step",
        "out_Not_enc54-in1_And_enc59": "step",
        "out_Not_enc55-in2_And_enc60": "step",
        "out_Not_enc56-in1_And_enc60": "step",
        "out_Not_enc57-in2_And_enc61": "step",
        "out_Not_enc58-in1_And_enc61": "step",
        "out_And_enc60-in2_And_enc62": "step",
        "out_And_enc61-in1_And_enc62": "step",
        "out_Or_enc52-in2_And_enc63": "step",
        "out_And_enc59-in1_And_enc63": "step",
        "out_And_enc63-in2_And_enc64": "step",
        "out_And_enc62-in1_And_enc64": "step",
        "out_And_enc42-in2_Or_enc65": "step",
        "out_Or_enc37-in1_Or_enc65": "step",
        "out_And_enc64-in2_Or_enc66": "step",
        "out_And_enc51-in1_Or_enc66": "step",
        "out_Or_enc66-in2_Or_enc67": "step",
        "out_Or_enc65-in1_Or_enc67": "step",
        "out_Or_enc67-in_Lamp_enc2": "step",
        "out_Button_enc15-in1_Or_enc68": "step",
        "out_Button_enc14-in_Not_enc69": "step",
        "out_Button_enc14-in_Not_enc70": "step",
        "out_Button_enc14-in_Not_enc71": "step",
        "out_Button_enc14-in_Not_enc72": "step",
        "out_Button_enc14-in_Not_enc73": "step",
        "out_Button_enc14-in_Not_enc74": "step",
        "out_Button_enc14-in_Not_enc75": "step",
        "out_Not_enc71-in1_And_enc76": "step",
        "out_Button_enc13-in2_And_enc76": "step",
        "out_And_enc76-in2_Or_enc68": "step",
        "out_Button_enc12-in_Not_enc77": "step",
        "out_Button_enc12-in_Not_enc78": "step",
        "out_Button_enc12-in_Not_enc79": "step",
        "out_Button_enc12-in_Not_enc80": "step",
        "out_Button_enc12-in_Not_enc81": "step",
        "out_Button_enc12-in_Not_enc82": "step",
        "out_Button_enc10-in_Not_enc87": "step",
        "out_Button_enc10-in_Not_enc83": "step",
        "out_Button_enc10-in_Not_enc86": "step",
        "out_Button_enc10-in_Not_enc84": "step",
        "out_Button_enc10-in_Not_enc85": "step",
        "out_Button_enc8-in_Not_enc91": "step",
        "out_Button_enc8-in_Not_enc88": "step",
        "out_Button_enc8-in_Not_enc90": "step",
        "out_Button_enc8-in_Not_enc89": "step",
        "out_Button_enc6-in_Not_enc94": "step",
        "out_Button_enc6-in_Not_enc93": "step",
        "out_Button_enc6-in_Not_enc92": "step",
        "out_Button_enc4-in_Not_enc95": "step",
        "out_Button_enc4-in_Not_enc96": "step",
        "out_Button_enc2-in_Not_enc97": "step",
        "out_Button_enc11-in2_And_enc98": "step",
        "out_Not_enc79-in2_And_enc99": "step",
        "out_Not_enc72-in1_And_enc99": "step",
        "out_And_enc99-in1_And_enc98": "step",
        "out_Button_enc9-in2_And_enc100": "step",
        "out_Not_enc78-in2_And_enc101": "step",
        "out_Not_enc75-in1_And_enc101": "step",
        "out_Not_enc85-in2_And_enc102": "step",
        "out_And_enc101-in1_And_enc102": "step",
        "out_And_enc102-in1_And_enc100": "step",
        "out_Button_enc7-in2_And_enc103": "step",
        "out_Not_enc89-in2_And_enc104": "step",
        "out_Not_enc84-in1_And_enc104": "step",
        "out_Not_enc81-in2_And_enc105": "step",
        "out_Not_enc70-in1_And_enc105": "step",
        "out_And_enc104-in2_And_enc106": "step",
        "out_And_enc105-in1_And_enc106": "step",
        "out_And_enc106-in1_And_enc103": "step",
        "out_Button_enc5-in2_And_enc107": "step",
        "out_Not_enc80-in2_And_enc108": "step",
        "out_Not_enc74-in1_And_enc108": "step",
        "out_Not_enc88-in2_And_enc109": "step",
        "out_Not_enc86-in1_And_enc109": "step",
        "out_And_enc109-in2_And_enc110": "step",
        "out_And_enc108-in1_And_enc110": "step",
        "out_Not_enc92-in2_And_enc111": "step",
        "out_And_enc110-in1_And_enc111": "step",
        "out_And_enc111-in1_And_enc107": "step",
        "out_Button_enc3-in2_And_enc112": "step",
        "out_Not_enc77-in2_And_enc113": "step",
        "out_Not_enc73-in1_And_enc113": "step",
        "out_Not_enc90-in2_And_enc114": "step",
        "out_Not_enc83-in1_And_enc114": "step",
        "out_Not_enc96-in2_And_enc115": "step",
        "out_Not_enc93-in1_And_enc115": "step",
        "out_And_enc114-in2_And_enc116": "step",
        "out_And_enc113-in1_And_enc116": "step",
        "out_And_enc116-in1_And_enc117": "step",
        "out_And_enc115-in2_And_enc117": "step",
        "out_And_enc117-in1_And_enc112": "step",
        "out_Button_enc1-in2_And_enc118": "step",
        "out_Not_enc97-in2_And_enc119": "step",
        "out_Not_enc95-in1_And_enc119": "step",
        "out_Not_enc94-in2_And_enc120": "step",
        "out_Not_enc91-in1_And_enc120": "step",
        "out_Not_enc87-in2_And_enc121": "step",
        "out_Not_enc82-in1_And_enc121": "step",
        "out_And_enc119-in2_And_enc122": "step",
        "out_And_enc120-in1_And_enc122": "step",
        "out_Not_enc69-in1_And_enc123": "step",
        "out_And_enc121-in2_And_enc123": "step",
        "out_And_enc122-in2_And_enc124": "step",
        "out_And_enc123-in1_And_enc124": "step",
        "out_And_enc124-in1_And_enc118": "step",
        "out_And_enc118-in2_Or_enc125": "step",
        "out_And_enc112-in1_Or_enc125": "step",
        "out_And_enc107-in2_Or_enc126": "step",
        "out_And_enc103-in1_Or_enc126": "step",
        "out_And_enc100-in2_Or_enc127": "step",
        "out_And_enc98-in1_Or_enc127": "step",
        "out_Or_enc68-in1_Or_enc128": "step",
        "out_Or_enc127-in2_Or_enc128": "step",
        "out_Or_enc126-in1_Or_enc129": "step",
        "out_Or_enc125-in2_Or_enc129": "step",
        "out_Or_enc129-in2_Or_enc130": "step",
        "out_Or_enc128-in1_Or_enc130": "step",
        "out_Or_enc130-in_Lamp_enc1": "step"
      }
    },
    zoom: 1,
    translation: {x: 0, y: 0}
}

export const encoderMap: Record<string, SingleSaveDataFormat> = {
    'Encoder_1': ENCODER_2_1,
    'Encoder_2': ENCODER_4_2,
    'Encoder_3': ENCODER_8_3,
    'Encoder_4': ENCODER_16_4,
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