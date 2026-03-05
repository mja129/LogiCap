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