import type { SingleSaveDataFormat } from '../../circuitSave'

// Hard-coded Decoder circuits

// 1 to 2 decoder
export const DECODER_1_2: SingleSaveDataFormat = {
  circuit: {
      "devices": {
        "Lamp_dec0": {
          "type": "Lamp",
          "net": "Lamp_dec0",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_dec0",
          "position": {
            "x": 461.30287746160616,
            "y": 152.0463033916631
          }
        },
        "Lamp_dec1": {
          "type": "Lamp",
          "net": "Lamp_dec1",
          "inputs": 1,
          "outputs": 0,
          "order": 0,
          "bits": 1,
          "label": "Lamp_dec1",
          "position": {
            "x": 461.3854803609481,
            "y": 227.90863189276004
          }
        },
        "Button_dec2": {
          "type": "Button",
          "label": "Button_dec2",
          "net": "Button_dec2",
          "bits": 1,
          "position": {
            "x": 143.40177210065818,
            "y": 152.76157584791576
          }
        },
        "Not_dec3": {
          "type": "Not",
          "label": "Not_dec3",
          "inputs": 2,
          "position": {
            "x": 306.11275774041343,
            "y": 123.15736959785016
          }
        }
      },
    connectors: {
      "out_Button_dec2": [
        [
          "Not_dec3",
          "in_Not_dec3"
        ],
        [
          "Lamp_dec1",
          "in_Lamp_dec1"
        ]
      ],
      "out_Not_dec3": [
        [
          "Lamp_dec0",
          "in_Lamp_dec0"
        ]
      ]
    },
    subcircuits: [],
    wireManipulations: {
      "out_Button_dec2-in_Not_dec3": "step",
      "out_Not_dec3-in_Lamp_dec0": "step",
      "out_Button_dec2-in_Lamp_dec1": "step"
    }
  },
  zoom: 1,
  translation: {x: 0, y: 0}
}

// 2 to 4 decoder
export const DECODER_2_4: SingleSaveDataFormat = {
  circuit: {
    devices: {
      "Button_dec0": {
        "type": "Button",
        "label": "Button_dec0",
        "net": "Button_dec0",
        "bits": 1,
        "position": {
          "x": 78.47335169205132,
          "y": 636.3039378454702
        }
      },
      "Button_dec1": {
        "type": "Button",
        "label": "Button_dec1",
        "net": "Button_dec1",
        "bits": 1,
        "position": {
          "x": 79.41823515230797,
          "y": 708.7401553863244
        }
      },
      "Lamp_dec2": {
        "type": "Lamp",
        "net": "Lamp_dec2",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec2",
        "position": {
          "x": 590.484375,
          "y": 636
        }
      },
      "Lamp_dec3": {
        "type": "Lamp",
        "net": "Lamp_dec3",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec3",
        "position": {
          "x": 594.484375,
          "y": 717
        }
      },
      "Lamp_dec4": {
        "type": "Lamp",
        "net": "Lamp_dec4",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec4",
        "position": {
          "x": 597.1914604624785,
          "y": 792.1763729271787
        }
      },
      "Lamp_dec5": {
        "type": "Lamp",
        "net": "Lamp_dec5",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec5",
        "position": {
          "x": 599.1914604624785,
          "y": 867.6677070077764
        }
      },
      "Not_dec6": {
        "type": "Not",
        "label": "Not_dec6",
        "inputs": 2,
        "position": {
          "x": 235.56153815564068,
          "y": 583.7873696414483
        }
      },
      "Not_dec7": {
        "type": "Not",
        "label": "Not_dec7",
        "inputs": 2,
        "position": {
          "x": 210.05287223623833,
          "y": 679.2739889449532
        },
        "rotation": 0
      },
      "And_dec8": {
        "type": "And",
        "label": "And_dec8",
        "inputs": 2,
        "position": {
          "x": 468.30800207282124,
          "y": 640.9889766920513
        }
      },
      "And_dec9": {
        "type": "And",
        "label": "And_dec9",
        "inputs": 2,
        "position": {
          "x": 467.0702040750431,
          "y": 721.2425127748708
        }
      },
      "And_dec10": {
        "type": "And",
        "label": "And_dec10",
        "inputs": 2,
        "position": {
          "x": 470.0702040750431,
          "y": 792.9385749294006
        }
      },
      "And_dec11": {
        "type": "And",
        "label": "And_dec11",
        "inputs": 2,
        "position": {
          "x": 472.1142973068377,
          "y": 870.7007769316224
        }
      }
    },
    connectors: {
      "out_Button_dec0": [
        [
          "Not_dec6",
          "in_Not_dec6"
        ],
        [
          "And_dec9",
          "in2_And_dec9"
        ],
        [
          "And_dec11",
          "in2_And_dec11"
        ]
      ],
      "out_Button_dec1": [
        [
          "Not_dec7",
          "in_Not_dec7"
        ],
        [
          "And_dec10",
          "in1_And_dec10"
        ],
        [
          "And_dec11",
          "in1_And_dec11"
        ]
      ],
      "out_And_dec8": [
        [
          "Lamp_dec2",
          "in_Lamp_dec2"
        ]
      ],
      "out_Not_dec6": [
        [
          "And_dec8",
          "in2_And_dec8"
        ],
        [
          "And_dec10",
          "in2_And_dec10"
        ]
      ],
      "out_Not_dec7": [
        [
          "And_dec8",
          "in1_And_dec8"
        ],
        [
          "And_dec9",
          "in1_And_dec9"
        ]
      ],
      "out_And_dec9": [
        [
          "Lamp_dec3",
          "in_Lamp_dec3"
        ]
      ],
      "out_And_dec10": [
        [
          "Lamp_dec4",
          "in_Lamp_dec4"
        ]
      ],
      "out_And_dec11": [
        [
          "Lamp_dec5",
          "in_Lamp_dec5"
        ]
      ]
    },
    subcircuits: [],
    wireManipulations: {
      "out_Button_dec0-in_Not_dec6": "step",
      "out_Button_dec1-in_Not_dec7": "step",
      "out_And_dec8-in_Lamp_dec2": "step",
      "out_Not_dec6-in2_And_dec8": "step",
      "out_Not_dec7-in1_And_dec8": "step",
      "out_Not_dec7-in1_And_dec9": "step",
      "out_Button_dec0-in2_And_dec9": "step",
      "out_And_dec9-in_Lamp_dec3": "step",
      "out_Not_dec6-in2_And_dec10": "step",
      "out_Button_dec1-in1_And_dec10": "step",
      "out_And_dec10-in_Lamp_dec4": "step",
      "out_Button_dec0-in2_And_dec11": "step",
      "out_Button_dec1-in1_And_dec11": "step",
      "out_And_dec11-in_Lamp_dec5": "step"
    }
  },
  zoom: 1,
  translation: {x: 0, y: 0}
}


// 3 to 8 decoder
export const DECODER_3_8: SingleSaveDataFormat = {
  circuit: {
    devices: {
      "Lamp_dec22": {
        "type": "Lamp",
        "net": "Lamp_dec22",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec22",
        "position": {
          "x": 632.3891137851323,
          "y": 40.01363768526789
        },
        "rotation": 0
      },
      "Button_dec0": {
        "type": "Button",
        "label": "Button_dec0",
        "net": "Button_dec0",
        "bits": 1,
        "position": {
          "x": 98.73813811604171,
          "y": 126.21545205304929
        }
      },
      "Button_dec1": {
        "type": "Button",
        "label": "Button_dec1",
        "net": "Button_dec1",
        "bits": 1,
        "position": {
          "x": 98.56536436825732,
          "y": 198.61725160121372
        }
      },
      "Button_dec2": {
        "type": "Button",
        "label": "Button_dec2",
        "net": "Button_dec2",
        "bits": 1,
        "position": {
          "x": 95.22208684353708,
          "y": 276.661397789446
        }
      },
      "Lamp_dec23": {
        "type": "Lamp",
        "net": "Lamp_dec23",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec23",
        "position": {
          "x": 634.9016217242621,
          "y": 128.63333659256554
        }
      },
      "Lamp_dec24": {
        "type": "Lamp",
        "net": "Lamp_dec24",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec24",
        "position": {
          "x": 638.364826662865,
          "y": 209.61729392816528
        }
      },
      "Lamp_dec25": {
        "type": "Lamp",
        "net": "Lamp_dec25",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec25",
        "position": {
          "x": 643.0797411554872,
          "y": 300.44184725915335
        }
      },
      "Lamp_dec26": {
        "type": "Lamp",
        "net": "Lamp_dec26",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec26",
        "position": {
          "x": 646.8849759182013,
          "y": 389.70123193379703
        }
      },
      "Lamp_dec27": {
        "type": "Lamp",
        "net": "Lamp_dec27",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec27",
        "position": {
          "x": 646.941033234579,
          "y": 472.80289441762005
        }
      },
      "Lamp_dec28": {
        "type": "Lamp",
        "net": "Lamp_dec28",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec28",
        "position": {
          "x": 650.0142433766182,
          "y": 552.5396036603313
        }
      },
      "Lamp_dec29": {
        "type": "Lamp",
        "net": "Lamp_dec29",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec29",
        "position": {
          "x": 651.312848048818,
          "y": 632.8237346928964
        }
      },
      "Not_dec12": {
        "type": "Not",
        "label": "Not_dec12",
        "inputs": 2,
        "position": {
          "x": 240.76000551804768,
          "y": 81.41654118501634
        }
      },
      "Not_dec13": {
        "type": "Not",
        "label": "Not_dec13",
        "inputs": 2,
        "position": {
          "x": 234.40689007337818,
          "y": 161.88933681749683
        }
      },
      "Not_dec14": {
        "type": "Not",
        "label": "Not_dec14",
        "inputs": 2,
        "position": {
          "x": 232.289184925155,
          "y": 250.12705132679565
        }
      },
      "And_dec3": {
        "type": "And",
        "label": "And_dec3",
        "inputs": 2,
        "position": {
          "x": 436.7538722462998,
          "y": 32.66220079897409
        }
      },
      "And_dec11": {
        "type": "And",
        "label": "And_dec11",
        "inputs": 2,
        "position": {
          "x": 524.5214716163488,
          "y": 47.501888027894424
        }
      },
      "And_dec4": {
        "type": "And",
        "label": "And_dec4",
        "inputs": 2,
        "position": {
          "x": 440.11512904728653,
          "y": 117.87668587903883
        }
      },
      "And_dec15": {
        "type": "And",
        "label": "And_dec15",
        "inputs": 2,
        "position": {
          "x": 521.4337343121698,
          "y": 133.51506076345265
        }
      },
      "And_dec5": {
        "type": "And",
        "label": "And_dec5",
        "inputs": 2,
        "position": {
          "x": 439.9264644473712,
          "y": 199.72991415811683
        }
      },
      "And_dec16": {
        "type": "And",
        "label": "And_dec16",
        "inputs": 2,
        "position": {
          "x": 527.2208559570936,
          "y": 213.65462225051746
        }
      },
      "And_dec6": {
        "type": "And",
        "label": "And_dec6",
        "inputs": 2,
        "position": {
          "x": 443.784545543987,
          "y": 287.52119576205064
        }
      },
      "And_dec17": {
        "type": "And",
        "label": "And_dec17",
        "inputs": 2,
        "position": {
          "x": 530.5616999375502,
          "y": 305.16407703473857
        }
      },
      "And_dec7": {
        "type": "And",
        "label": "And_dec7",
        "inputs": 2,
        "position": {
          "x": 442.70131462808195,
          "y": 376.7997466380994
        }
      },
      "And_dec18": {
        "type": "And",
        "label": "And_dec18",
        "inputs": 2,
        "position": {
          "x": 529.1876294253843,
          "y": 393.25722199853686
        }
      },
      "And_dec8": {
        "type": "And",
        "label": "And_dec8",
        "inputs": 2,
        "position": {
          "x": 441.1118703596216,
          "y": 460.6574813054517
        }
      },
      "And_dec19": {
        "type": "And",
        "label": "And_dec19",
        "inputs": 2,
        "position": {
          "x": 528.2930631093948,
          "y": 476.005016593605
        }
      },
      "And_dec9": {
        "type": "And",
        "label": "And_dec9",
        "inputs": 2,
        "position": {
          "x": 440.454725327134,
          "y": 539.2563552076429
        }
      },
      "And_dec20": {
        "type": "And",
        "label": "And_dec20",
        "inputs": 2,
        "position": {
          "x": 527.3450784806464,
          "y": 556.1178689242903
        }
      },
      "And_dec10": {
        "type": "And",
        "label": "And_dec10",
        "inputs": 2,
        "position": {
          "x": 438.0461805826502,
          "y": 621.2605151666531
        }
      },
      "And_dec21": {
        "type": "And",
        "label": "And_dec21",
        "inputs": 2,
        "position": {
          "x": 526.4505121646569,
          "y": 637.3029284072769
        }
      }
    },
    connectors: {
      "out_Button_dec0": [
        [
          "Not_dec12",
          "in_Not_dec12"
        ],
        [
          "And_dec4",
          "in2_And_dec4"
        ],
        [
          "And_dec6",
          "in2_And_dec6"
        ],
        [
          "And_dec8",
          "in2_And_dec8"
        ],
        [
          "And_dec10",
          "in2_And_dec10"
        ]
      ],
      "out_Button_dec1": [
        [
          "Not_dec13",
          "in_Not_dec13"
        ],
        [
          "And_dec5",
          "in2_And_dec5"
        ],
        [
          "And_dec6",
          "in1_And_dec6"
        ],
        [
          "And_dec9",
          "in1_And_dec9"
        ],
        [
          "And_dec10",
          "in1_And_dec10"
        ]
      ],
      "out_Button_dec2": [
        [
          "Not_dec14",
          "in_Not_dec14"
        ],
        [
          "And_dec7",
          "in2_And_dec7"
        ],
        [
          "And_dec8",
          "in1_And_dec8"
        ],
        [
          "And_dec9",
          "in2_And_dec9"
        ],
        [
          "And_dec21",
          "in1_And_dec21"
        ]
      ],
      "out_Not_dec12": [
        [
          "And_dec3",
          "in2_And_dec3"
        ],
        [
          "And_dec5",
          "in1_And_dec5"
        ],
        [
          "And_dec18",
          "in1_And_dec18"
        ],
        [
          "And_dec20",
          "in1_And_dec20"
        ]
      ],
      "out_And_dec3": [
        [
          "And_dec11",
          "in2_And_dec11"
        ]
      ],
      "out_And_dec4": [
        [
          "And_dec15",
          "in2_And_dec15"
        ]
      ],
      "out_And_dec5": [
        [
          "And_dec16",
          "in2_And_dec16"
        ]
      ],
      "out_And_dec6": [
        [
          "And_dec17",
          "in2_And_dec17"
        ]
      ],
      "out_And_dec7": [
        [
          "And_dec18",
          "in2_And_dec18"
        ]
      ],
      "out_And_dec8": [
        [
          "And_dec19",
          "in2_And_dec19"
        ]
      ],
      "out_And_dec9": [
        [
          "And_dec20",
          "in2_And_dec20"
        ]
      ],
      "out_And_dec10": [
        [
          "And_dec21",
          "in2_And_dec21"
        ]
      ],
      "out_And_dec11": [
        [
          "Lamp_dec22",
          "in_Lamp_dec22"
        ]
      ],
      "out_Not_dec13": [
        [
          "And_dec3",
          "in1_And_dec3"
        ],
        [
          "And_dec4",
          "in1_And_dec4"
        ],
        [
          "And_dec7",
          "in1_And_dec7"
        ],
        [
          "And_dec19",
          "in1_And_dec19"
        ]
      ],
      "out_Not_dec14": [
        [
          "And_dec11",
          "in1_And_dec11"
        ],
        [
          "And_dec15",
          "in1_And_dec15"
        ],
        [
          "And_dec16",
          "in1_And_dec16"
        ],
        [
          "And_dec17",
          "in1_And_dec17"
        ]
      ],
      "out_And_dec15": [
        [
          "Lamp_dec23",
          "in_Lamp_dec23"
        ]
      ],
      "out_And_dec16": [
        [
          "Lamp_dec24",
          "in_Lamp_dec24"
        ]
      ],
      "out_And_dec17": [
        [
          "Lamp_dec25",
          "in_Lamp_dec25"
        ]
      ],
      "out_And_dec18": [
        [
          "Lamp_dec26",
          "in_Lamp_dec26"
        ]
      ],
      "out_And_dec19": [
        [
          "Lamp_dec27",
          "in_Lamp_dec27"
        ]
      ],
      "out_And_dec20": [
        [
          "Lamp_dec28",
          "in_Lamp_dec28"
        ]
      ],
      "out_And_dec21": [
        [
          "Lamp_dec29",
          "in_Lamp_dec29"
        ]
      ]
    },
    subcircuits: [],
    wireManipulations: {
      "out_Button_dec0-in_Not_dec12": "step",
      "out_Button_dec1-in_Not_dec13": "step",
      "out_Button_dec2-in_Not_dec14": "step",
      "out_And_dec3-in2_And_dec11": "step",
      "out_And_dec4-in2_And_dec15": "step",
      "out_And_dec5-in2_And_dec16": "step",
      "out_And_dec6-in2_And_dec17": "step",
      "out_And_dec7-in2_And_dec18": "step",
      "out_And_dec8-in2_And_dec19": "step",
      "out_And_dec9-in2_And_dec20": "step",
      "out_And_dec10-in2_And_dec21": "step",
      "out_And_dec11-in_Lamp_dec22": "step",
      "out_Not_dec12-in2_And_dec3": "step",
      "out_Not_dec13-in1_And_dec3": "step",
      "out_Not_dec14-in1_And_dec11": "step",
      "out_And_dec15-in_Lamp_dec23": "step",
      "out_Button_dec0-in2_And_dec4": "step",
      "out_Not_dec13-in1_And_dec4": "step",
      "out_Not_dec14-in1_And_dec15": "step",
      "out_And_dec16-in_Lamp_dec24": "step",
      "out_Button_dec1-in2_And_dec5": "step",
      "out_Not_dec12-in1_And_dec5": "step",
      "out_Not_dec14-in1_And_dec16": "step",
      "out_And_dec17-in_Lamp_dec25": "step",
      "out_Button_dec0-in2_And_dec6": "step",
      "out_Button_dec1-in1_And_dec6": "step",
      "out_Not_dec14-in1_And_dec17": "step",
      "out_And_dec18-in_Lamp_dec26": "step",
      "out_Button_dec2-in2_And_dec7": "step",
      "out_Not_dec13-in1_And_dec7": "step",
      "out_Not_dec12-in1_And_dec18": "step",
      "out_And_dec19-in_Lamp_dec27": "step",
      "out_Button_dec0-in2_And_dec8": "step",
      "out_Button_dec2-in1_And_dec8": "step",
      "out_Not_dec13-in1_And_dec19": "step",
      "out_And_dec20-in_Lamp_dec28": "step",
      "out_Button_dec2-in2_And_dec9": "step",
      "out_Button_dec1-in1_And_dec9": "step",
      "out_Not_dec12-in1_And_dec20": "step",
      "out_And_dec21-in_Lamp_dec29": "step",
      "out_Button_dec0-in2_And_dec10": "step",
      "out_Button_dec1-in1_And_dec10": "step",
      "out_Button_dec2-in1_And_dec21": "step"
    }
  },
  zoom: 1,
  translation: {x: 0, y: 0}
}

// 4 to 16 decoder
export const DECODER_4_16: SingleSaveDataFormat = {
  circuit: {
    devices: {
      "Button_dec16": {
            "type": "Button",
            "label": "Button_dec16",
            "net": "Button_dec16",
            "bits": 1,
            "position": {
              "x": -3.519264828536432,
              "y": 55.83427927788851
            }
      },
      "Button_dec17": {
        "type": "Button",
        "label": "Button_dec17",
        "net": "Button_dec17",
        "bits": 1,
        "position": {
          "x": -5.140982876636581,
          "y": 145.2926482594454
        }
      },
      "Button_dec18": {
        "type": "Button",
        "label": "Button_dec18",
        "net": "Button_dec18",
        "bits": 1,
        "position": {
          "x": -5.140982876636585,
          "y": 223.00036886576243
        },
        "rotation": 0
      },
      "Button_dec19": {
        "type": "Button",
        "label": "Button_dec19",
        "net": "Button_dec19",
        "bits": 1,
        "position": {
          "x": -7.108266942619283,
          "y": 302.67537353806205
        }
      },
      "Not_dec27": {
        "type": "Not",
        "label": "Not_dec27",
        "inputs": 2,
        "position": {
          "x": 140.43803800608376,
          "y": 25.28832023450024
        }
      },
      "Not_dec28": {
        "type": "Not",
        "label": "Not_dec28",
        "inputs": 2,
        "position": {
          "x": 141.42168003907514,
          "y": 101.0287567748345
        }
      },
      "Not_dec29": {
        "type": "Not",
        "label": "Not_dec29",
        "inputs": 2,
        "position": {
          "x": 141.42168003907514,
          "y": 182.6710455131168
        }
      },
      "Not_dec30": {
        "type": "Not",
        "label": "Not_dec30",
        "inputs": 2,
        "position": {
          "x": 139.45439597309243,
          "y": 260.3787661194338
        }
      },
      "Lamp_dec0": {
        "type": "Lamp",
        "net": "Lamp_dec0",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec0",
        "position": {
          "x": 628.3244863697954,
          "y": -57.33761053677351
        }
      },
      "Lamp_dec1": {
        "type": "Lamp",
        "net": "Lamp_dec1",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec1",
        "position": {
          "x": 713.7846761102021,
          "y": 35.33679505108919
        }
      },
      "Lamp_dec2": {
        "type": "Lamp",
        "net": "Lamp_dec2",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec2",
        "position": {
          "x": 607.8509066111865,
          "y": 134.9524545519962
        }
      },
      "And_dec20": {
        "type": "And",
        "label": "And_dec20",
        "inputs": 2,
        "position": {
          "x": 433.56336383750727,
          "y": -80.94501932856603
        }
      },
      "And_dec21": {
        "type": "And",
        "label": "And_dec21",
        "inputs": 2,
        "position": {
          "x": 433.56336383750727,
          "y": -21.9264973490848
        }
      },
      "And_dec22": {
        "type": "And",
        "label": "And_dec22",
        "inputs": 2,
        "position": {
          "x": 539.7967034005735,
          "y": -52.41940037181677
        }
      },
      "And_dec23": {
        "type": "And",
        "label": "And_dec23",
        "inputs": 2,
        "position": {
          "x": 524.9254057758621,
          "y": 13.696670325279321
        }
      },
      "And_dec24": {
        "type": "And",
        "label": "And_dec24",
        "inputs": 2,
        "position": {
          "x": 525.9090478088534,
          "y": 72.7151923047605
        }
      },
      "And_dec25": {
        "type": "And",
        "label": "And_dec25",
        "inputs": 2,
        "position": {
          "x": 626.2405351739714,
          "y": 40.25500521604588
        }
      },
      "And_dec26": {
        "type": "And",
        "label": "And_dec26",
        "inputs": 2,
        "position": {
          "x": 523.2576917739299,
          "y": 139.87066471695297
        }
      },
      "And_dec34": {
        "type": "And",
        "label": "And_dec34",
        "inputs": 2,
        "position": {
          "x": 527.3049612944801,
          "y": 202.29302192262747
        }
      },
      "And_dec35": {
        "type": "And",
        "label": "And_dec35",
        "inputs": 2,
        "position": {
          "x": 526.9441355221707,
          "y": 259.8039208923718
        }
      },
      "And_dec33": {
        "type": "And",
        "label": "And_dec33",
        "inputs": 2,
        "position": {
          "x": 615.7733917693795,
          "y": 231.22888429365435
        }
      },
      "Lamp_dec3": {
        "type": "Lamp",
        "net": "Lamp_dec3",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec3",
        "position": {
          "x": 710.4006975044226,
          "y": 217.35409312166172
        }
      },
      "And_dec36": {
        "type": "And",
        "label": "And_dec36",
        "inputs": 2,
        "position": {
          "x": 530.3894488402705,
          "y": 321.66980509046
        }
      },
      "And_dec37": {
        "type": "And",
        "label": "And_dec37",
        "inputs": 2,
        "position": {
          "x": 432.0796306092802,
          "y": 305.8277298524847
        }
      },
      "And_dec38": {
        "type": "And",
        "label": "And_dec38",
        "inputs": 2,
        "position": {
          "x": 433.88872689700383,
          "y": 363.6550043787471
        }
      },
      "Lamp_dec4": {
        "type": "Lamp",
        "net": "Lamp_dec4",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec4",
        "position": {
          "x": 617.6122467938055,
          "y": 319.2873101840225
        }
      },
      "And_dec40": {
        "type": "And",
        "label": "And_dec40",
        "inputs": 2,
        "position": {
          "x": 534.2370197545895,
          "y": 390.8337797768906
        }
      },
      "And_dec41": {
        "type": "And",
        "label": "And_dec41",
        "inputs": 2,
        "position": {
          "x": 531.8051072061838,
          "y": 451.4537926238681
        }
      },
      "And_dec39": {
        "type": "And",
        "label": "And_dec39",
        "inputs": 2,
        "position": {
          "x": 629.8035173068329,
          "y": 411.7472855319044
        }
      },
      "Lamp_dec5": {
        "type": "Lamp",
        "net": "Lamp_dec5",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec5",
        "position": {
          "x": 719.5669979450645,
          "y": 406.82907536694785
        }
      },
      "And_dec43": {
        "type": "And",
        "label": "And_dec43",
        "inputs": 2,
        "position": {
          "x": 444.5887274473603,
          "y": 486.9340533932419
        }
      },
      "And_dec44": {
        "type": "And",
        "label": "And_dec44",
        "inputs": 2,
        "position": {
          "x": 443.3480623521732,
          "y": 543.9309062385951
        }
      },
      "And_dec42": {
        "type": "And",
        "label": "And_dec42",
        "inputs": 2,
        "position": {
          "x": 537.5651246729389,
          "y": 516.0281035425278
        }
      },
      "Lamp_dec6": {
        "type": "Lamp",
        "net": "Lamp_dec6",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec6",
        "position": {
          "x": 636.7498148006295,
          "y": 508.5741781190517
        }
      },
      "And_dec46": {
        "type": "And",
        "label": "And_dec46",
        "inputs": 2,
        "position": {
          "x": 541.326648568474,
          "y": 579.6059841630444
        }
      },
      "And_dec47": {
        "type": "And",
        "label": "And_dec47",
        "inputs": 2,
        "position": {
          "x": 545.3156017685848,
          "y": 636.1876261679428
        }
      },
      "And_dec45": {
        "type": "And",
        "label": "And_dec45",
        "inputs": 2,
        "position": {
          "x": 629.3304505609505,
          "y": 602.9019848244959
        }
      },
      "Lamp_dec7": {
        "type": "Lamp",
        "net": "Lamp_dec7",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec7",
        "position": {
          "x": 716.7114362927448,
          "y": 599.1750221127578
        }
      },
      "And_dec49": {
        "type": "And",
        "label": "And_dec49",
        "inputs": 2,
        "position": {
          "x": 447.78654992094124,
          "y": 670.6165094111614
        }
      },
      "And_dec50": {
        "type": "And",
        "label": "And_dec50",
        "inputs": 2,
        "position": {
          "x": 446.21247888176055,
          "y": 729.3699579755167
        }
      },
      "And_dec48": {
        "type": "And",
        "label": "And_dec48",
        "inputs": 2,
        "position": {
          "x": 532.0401929606976,
          "y": 695.109663012355
        }
      },
      "Lamp_dec8": {
        "type": "Lamp",
        "net": "Lamp_dec8",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec8",
        "position": {
          "x": 620.8126961684768,
          "y": 687.3878416139828
        }
      },
      "And_dec52": {
        "type": "And",
        "label": "And_dec52",
        "inputs": 2,
        "position": {
          "x": 540.7074834954998,
          "y": 817.8562854405073
        }
      },
      "And_dec53": {
        "type": "And",
        "label": "And_dec53",
        "inputs": 2,
        "position": {
          "x": 629.491777171683,
          "y": 783.4669044265914
        }
      },
      "And_dec51": {
        "type": "And",
        "label": "And_dec51",
        "inputs": 2,
        "position": {
          "x": 539.9683385961883,
          "y": 760.4305262822292
        }
      },
      "Lamp_dec9": {
        "type": "Lamp",
        "net": "Lamp_dec9",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec9",
        "position": {
          "x": 717.4605924547736,
          "y": 778.3907379669848
        }
      },
      "And_dec56": {
        "type": "And",
        "label": "And_dec56",
        "inputs": 2,
        "position": {
          "x": 524.3000801748841,
          "y": 875.8679031036404
        }
      },
      "And_dec55": {
        "type": "And",
        "label": "And_dec55",
        "inputs": 2,
        "position": {
          "x": 442.3790183659414,
          "y": 904.5246367194493
        }
      },
      "And_dec54": {
        "type": "And",
        "label": "And_dec54",
        "inputs": 2,
        "position": {
          "x": 442.04959280434434,
          "y": 845.4198059812574
        }
      },
      "Lamp_dec10": {
        "type": "Lamp",
        "net": "Lamp_dec10",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec10",
        "position": {
          "x": 619.4169964083509,
          "y": 873.977966053056
        }
      },
      "And_dec58": {
        "type": "And",
        "label": "And_dec58",
        "inputs": 2,
        "position": {
          "x": 535.0794248992065,
          "y": 938.2909039078277
        }
      },
      "And_dec59": {
        "type": "And",
        "label": "And_dec59",
        "inputs": 2,
        "position": {
          "x": 531.9054905318008,
          "y": 998.4032177906743
        }
      },
      "And_dec57": {
        "type": "And",
        "label": "And_dec57",
        "inputs": 2,
        "position": {
          "x": 606.0961127451012,
          "y": 970.2995125191982
        }
      },
      "Lamp_dec11": {
        "type": "Lamp",
        "net": "Lamp_dec11",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec11",
        "position": {
          "x": 698.0390946111623,
          "y": 965.2620967959236
        }
      },
      "And_dec62": {
        "type": "And",
        "label": "And_dec62",
        "inputs": 2,
        "position": {
          "x": 441.1935945931303,
          "y": 1096.7661862408415
        }
      },
      "And_dec60": {
        "type": "And",
        "label": "And_dec60",
        "inputs": 2,
        "position": {
          "x": 524.7545349752064,
          "y": 1068.4316289517785
        }
      },
      "And_dec61": {
        "type": "And",
        "label": "And_dec61",
        "inputs": 2,
        "position": {
          "x": 444.03810339893886,
          "y": 1035.3169636517428
        }
      },
      "Lamp_dec12": {
        "type": "Lamp",
        "net": "Lamp_dec12",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec12",
        "position": {
          "x": 612.9440984348142,
          "y": 1065.3106059738036
        }
      },
      "And_dec64": {
        "type": "And",
        "label": "And_dec64",
        "inputs": 2,
        "position": {
          "x": 528.7844675538261,
          "y": 1133.778505645919
        }
      },
      "And_dec65": {
        "type": "And",
        "label": "And_dec65",
        "inputs": 2,
        "position": {
          "x": 526.8224126539469,
          "y": 1192.000882478181
        }
      },
      "And_dec63": {
        "type": "And",
        "label": "And_dec63",
        "inputs": 2,
        "position": {
          "x": 614.0309486636152,
          "y": 1161.4542118117881
        }
      },
      "Lamp_dec13": {
        "type": "Lamp",
        "net": "Lamp_dec13",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec13",
        "position": {
          "x": 703.405935896034,
          "y": 1158.7347322447054
        }
      },
      "And_dec68": {
        "type": "And",
        "label": "And_dec68",
        "inputs": 2,
        "position": {
          "x": 527.075631426701,
          "y": 1255.8276154351688
        }
      },
      "And_dec66": {
        "type": "And",
        "label": "And_dec66",
        "inputs": 2,
        "position": {
          "x": 439.2909815104465,
          "y": 1221.1168716080413
        }
      },
      "And_dec67": {
        "type": "And",
        "label": "And_dec67",
        "inputs": 2,
        "position": {
          "x": 440.64104826185473,
          "y": 1283.6385855606406
        }
      },
      "Lamp_dec14": {
        "type": "Lamp",
        "net": "Lamp_dec14",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec14",
        "position": {
          "x": 620.1383369965117,
          "y": 1248.9278417335127
        }
      },
      "And_dec70": {
        "type": "And",
        "label": "And_dec70",
        "inputs": 2,
        "position": {
          "x": 532.5328034709005,
          "y": 1318.520467589256
        }
      },
      "And_dec71": {
        "type": "And",
        "label": "And_dec71",
        "inputs": 2,
        "position": {
          "x": 528.8058407591624,
          "y": 1378.151870977065
        }
      },
      "And_dec69": {
        "type": "And",
        "label": "And_dec69",
        "inputs": 2,
        "position": {
          "x": 614.5259831291379,
          "y": 1339.018762503815
        }
      },
      "Lamp_dec15": {
        "type": "Lamp",
        "net": "Lamp_dec15",
        "inputs": 1,
        "outputs": 0,
        "order": 0,
        "bits": 1,
        "label": "Lamp_dec15",
        "position": {
          "x": 705.8365695667208,
          "y": 1335.2917997920774
        }
      },
      "And_dec31": {
        "type": "And",
        "label": "And_dec31",
        "inputs": 2,
        "position": {
          "x": 429.0247956203049,
          "y": 112.06470338807748
        }
      },
      "And_dec32": {
        "type": "And",
        "label": "And_dec32",
        "inputs": 2,
        "position": {
          "x": 430.9920796862877,
          "y": 170.0995833345673
        }
      }
    },
    connectors: {
      "out_Button_dec16": [
        [
          "Not_dec27",
          "in_Not_dec27"
        ],
        [
          "And_dec23",
          "in2_And_dec23"
        ],
        [
          "And_dec34",
          "in2_And_dec34"
        ],
        [
          "And_dec40",
          "in2_And_dec40"
        ],
        [
          "And_dec46",
          "in2_And_dec46"
        ],
        [
          "And_dec51",
          "in2_And_dec51"
        ],
        [
          "And_dec58",
          "in2_And_dec58"
        ],
        [
          "And_dec64",
          "in2_And_dec64"
        ],
        [
          "And_dec70",
          "in2_And_dec70"
        ]
      ],
      "out_Button_dec17": [
        [
          "Not_dec28",
          "in_Not_dec28"
        ],
        [
          "And_dec31",
          "in2_And_dec31"
        ],
        [
          "And_dec34",
          "in1_And_dec34"
        ],
        [
          "And_dec43",
          "in1_And_dec43"
        ],
        [
          "And_dec46",
          "in1_And_dec46"
        ],
        [
          "And_dec54",
          "in1_And_dec54"
        ],
        [
          "And_dec58",
          "in1_And_dec58"
        ],
        [
          "And_dec66",
          "in1_And_dec66"
        ],
        [
          "And_dec70",
          "in1_And_dec70"
        ]
      ],
      "out_Button_dec18": [
        [
          "Not_dec29",
          "in_Not_dec29"
        ],
        [
          "And_dec37",
          "in2_And_dec37"
        ],
        [
          "And_dec41",
          "in2_And_dec41"
        ],
        [
          "And_dec44",
          "in2_And_dec44"
        ],
        [
          "And_dec47",
          "in2_And_dec47"
        ],
        [
          "And_dec62",
          "in2_And_dec62"
        ],
        [
          "And_dec65",
          "in2_And_dec65"
        ],
        [
          "And_dec67",
          "in2_And_dec67"
        ],
        [
          "And_dec71",
          "in2_And_dec71"
        ]
      ],
      "out_Button_dec19": [
        [
          "Not_dec30",
          "in_Not_dec30"
        ],
        [
          "And_dec50",
          "in1_And_dec50"
        ],
        [
          "And_dec52",
          "in1_And_dec52"
        ],
        [
          "And_dec55",
          "in1_And_dec55"
        ],
        [
          "And_dec59",
          "in1_And_dec59"
        ],
        [
          "And_dec62",
          "in1_And_dec62"
        ],
        [
          "And_dec65",
          "in1_And_dec65"
        ],
        [
          "And_dec67",
          "in1_And_dec67"
        ],
        [
          "And_dec71",
          "in1_And_dec71"
        ]
      ],
      "out_And_dec20": [
        [
          "And_dec22",
          "in2_And_dec22"
        ]
      ],
      "out_And_dec21": [
        [
          "And_dec22",
          "in1_And_dec22"
        ]
      ],
      "out_And_dec22": [
        [
          "Lamp_dec0",
          "in_Lamp_dec0"
        ]
      ],
      "out_And_dec23": [
        [
          "And_dec25",
          "in2_And_dec25"
        ]
      ],
      "out_And_dec24": [
        [
          "And_dec25",
          "in1_And_dec25"
        ]
      ],
      "out_And_dec25": [
        [
          "Lamp_dec1",
          "in_Lamp_dec1"
        ]
      ],
      "out_And_dec26": [
        [
          "Lamp_dec2",
          "in_Lamp_dec2"
        ]
      ],
      "out_Not_dec27": [
        [
          "And_dec20",
          "in2_And_dec20"
        ],
        [
          "And_dec31",
          "in1_And_dec31"
        ],
        [
          "And_dec38",
          "in2_And_dec38"
        ],
        [
          "And_dec43",
          "in2_And_dec43"
        ],
        [
          "And_dec49",
          "in2_And_dec49"
        ],
        [
          "And_dec54",
          "in2_And_dec54"
        ],
        [
          "And_dec61",
          "in2_And_dec61"
        ],
        [
          "And_dec66",
          "in2_And_dec66"
        ]
      ],
      "out_Not_dec28": [
        [
          "And_dec20",
          "in1_And_dec20"
        ],
        [
          "And_dec23",
          "in1_And_dec23"
        ],
        [
          "And_dec38",
          "in1_And_dec38"
        ],
        [
          "And_dec40",
          "in1_And_dec40"
        ],
        [
          "And_dec49",
          "in1_And_dec49"
        ],
        [
          "And_dec51",
          "in1_And_dec51"
        ],
        [
          "And_dec61",
          "in1_And_dec61"
        ],
        [
          "And_dec64",
          "in1_And_dec64"
        ]
      ],
      "out_Not_dec29": [
        [
          "And_dec21",
          "in2_And_dec21"
        ],
        [
          "And_dec24",
          "in2_And_dec24"
        ],
        [
          "And_dec32",
          "in2_And_dec32"
        ],
        [
          "And_dec35",
          "in2_And_dec35"
        ],
        [
          "And_dec50",
          "in2_And_dec50"
        ],
        [
          "And_dec52",
          "in2_And_dec52"
        ],
        [
          "And_dec55",
          "in2_And_dec55"
        ],
        [
          "And_dec59",
          "in2_And_dec59"
        ]
      ],
      "out_Not_dec30": [
        [
          "And_dec21",
          "in1_And_dec21"
        ],
        [
          "And_dec24",
          "in1_And_dec24"
        ],
        [
          "And_dec32",
          "in1_And_dec32"
        ],
        [
          "And_dec35",
          "in1_And_dec35"
        ],
        [
          "And_dec37",
          "in1_And_dec37"
        ],
        [
          "And_dec41",
          "in1_And_dec41"
        ],
        [
          "And_dec44",
          "in1_And_dec44"
        ],
        [
          "And_dec47",
          "in1_And_dec47"
        ]
      ],
      "out_And_dec31": [
        [
          "And_dec26",
          "in2_And_dec26"
        ]
      ],
      "out_And_dec32": [
        [
          "And_dec26",
          "in1_And_dec26"
        ]
      ],
      "out_And_dec33": [
        [
          "Lamp_dec3",
          "in_Lamp_dec3"
        ]
      ],
      "out_And_dec34": [
        [
          "And_dec33",
          "in2_And_dec33"
        ]
      ],
      "out_And_dec35": [
        [
          "And_dec33",
          "in1_And_dec33"
        ]
      ],
      "out_And_dec36": [
        [
          "Lamp_dec4",
          "in_Lamp_dec4"
        ]
      ],
      "out_And_dec37": [
        [
          "And_dec36",
          "in2_And_dec36"
        ]
      ],
      "out_And_dec38": [
        [
          "And_dec36",
          "in1_And_dec36"
        ]
      ],
      "out_And_dec39": [
        [
          "Lamp_dec5",
          "in_Lamp_dec5"
        ]
      ],
      "out_And_dec40": [
        [
          "And_dec39",
          "in2_And_dec39"
        ]
      ],
      "out_And_dec41": [
        [
          "And_dec39",
          "in1_And_dec39"
        ]
      ],
      "out_And_dec42": [
        [
          "Lamp_dec6",
          "in_Lamp_dec6"
        ]
      ],
      "out_And_dec43": [
        [
          "And_dec42",
          "in2_And_dec42"
        ]
      ],
      "out_And_dec44": [
        [
          "And_dec42",
          "in1_And_dec42"
        ]
      ],
      "out_And_dec45": [
        [
          "Lamp_dec7",
          "in_Lamp_dec7"
        ]
      ],
      "out_And_dec46": [
        [
          "And_dec45",
          "in2_And_dec45"
        ]
      ],
      "out_And_dec47": [
        [
          "And_dec45",
          "in1_And_dec45"
        ]
      ],
      "out_And_dec48": [
        [
          "Lamp_dec8",
          "in_Lamp_dec8"
        ]
      ],
      "out_And_dec49": [
        [
          "And_dec48",
          "in2_And_dec48"
        ]
      ],
      "out_And_dec50": [
        [
          "And_dec48",
          "in1_And_dec48"
        ]
      ],
      "out_And_dec51": [
        [
          "And_dec53",
          "in2_And_dec53"
        ]
      ],
      "out_And_dec52": [
        [
          "And_dec53",
          "in1_And_dec53"
        ]
      ],
      "out_And_dec53": [
        [
          "Lamp_dec9",
          "in_Lamp_dec9"
        ]
      ],
      "out_And_dec54": [
        [
          "And_dec56",
          "in2_And_dec56"
        ]
      ],
      "out_And_dec55": [
        [
          "And_dec56",
          "in1_And_dec56"
        ]
      ],
      "out_And_dec56": [
        [
          "Lamp_dec10",
          "in_Lamp_dec10"
        ]
      ],
      "out_And_dec57": [
        [
          "Lamp_dec11",
          "in_Lamp_dec11"
        ]
      ],
      "out_And_dec58": [
        [
          "And_dec57",
          "in2_And_dec57"
        ]
      ],
      "out_And_dec59": [
        [
          "And_dec57",
          "in1_And_dec57"
        ]
      ],
      "out_And_dec60": [
        [
          "Lamp_dec12",
          "in_Lamp_dec12"
        ]
      ],
      "out_And_dec61": [
        [
          "And_dec60",
          "in2_And_dec60"
        ]
      ],
      "out_And_dec62": [
        [
          "And_dec60",
          "in1_And_dec60"
        ]
      ],
      "out_And_dec63": [
        [
          "Lamp_dec13",
          "in_Lamp_dec13"
        ]
      ],
      "out_And_dec64": [
        [
          "And_dec63",
          "in2_And_dec63"
        ]
      ],
      "out_And_dec65": [
        [
          "And_dec63",
          "in1_And_dec63"
        ]
      ],
      "out_And_dec66": [
        [
          "And_dec68",
          "in2_And_dec68"
        ]
      ],
      "out_And_dec67": [
        [
          "And_dec68",
          "in1_And_dec68"
        ]
      ],
      "out_And_dec68": [
        [
          "Lamp_dec14",
          "in_Lamp_dec14"
        ]
      ],
      "out_And_dec69": [
        [
          "Lamp_dec15",
          "in_Lamp_dec15"
        ]
      ],
      "out_And_dec70": [
        [
          "And_dec69",
          "in2_And_dec69"
        ]
      ],
      "out_And_dec71": [
        [
          "And_dec69",
          "in1_And_dec69"
        ]
      ]
    },
    subcircuits: [],
    wireManipulations: {
      "out_Button_dec16-in_Not_dec27": "step",
      "out_Button_dec17-in_Not_dec28": "step",
      "out_Button_dec18-in_Not_dec29": "step",
      "out_Button_dec19-in_Not_dec30": "step",
      "out_And_dec20-in2_And_dec22": "step",
      "out_And_dec21-in1_And_dec22": "step",
      "out_And_dec22-in_Lamp_dec0": "step",
      "out_And_dec23-in2_And_dec25": "step",
      "out_And_dec24-in1_And_dec25": "step",
      "out_And_dec25-in_Lamp_dec1": "step",
      "out_And_dec26-in_Lamp_dec2": "step",
      "out_Not_dec27-in2_And_dec20": "step",
      "out_Not_dec28-in1_And_dec20": "step",
      "out_Not_dec29-in2_And_dec21": "step",
      "out_Not_dec30-in1_And_dec21": "step",
      "out_Button_dec16-in2_And_dec23": "step",
      "out_Not_dec28-in1_And_dec23": "step",
      "out_Not_dec29-in2_And_dec24": "step",
      "out_Not_dec30-in1_And_dec24": "step",
      "out_And_dec31-in2_And_dec26": "step",
      "out_And_dec32-in1_And_dec26": "step",
      "out_Button_dec17-in2_And_dec31": "step",
      "out_Not_dec27-in1_And_dec31": "step",
      "out_Not_dec29-in2_And_dec32": "step",
      "out_Not_dec30-in1_And_dec32": "step",
      "out_And_dec33-in_Lamp_dec3": "step",
      "out_And_dec34-in2_And_dec33": "step",
      "out_And_dec35-in1_And_dec33": "step",
      "out_Button_dec16-in2_And_dec34": "step",
      "out_Button_dec17-in1_And_dec34": "step",
      "out_Not_dec29-in2_And_dec35": "step",
      "out_Not_dec30-in1_And_dec35": "step",
      "out_And_dec36-in_Lamp_dec4": "step",
      "out_And_dec37-in2_And_dec36": "step",
      "out_And_dec38-in1_And_dec36": "step",
      "out_Button_dec18-in2_And_dec37": "step",
      "out_Not_dec30-in1_And_dec37": "step",
      "out_Not_dec27-in2_And_dec38": "step",
      "out_Not_dec28-in1_And_dec38": "step",
      "out_And_dec39-in_Lamp_dec5": "step",
      "out_And_dec40-in2_And_dec39": "step",
      "out_And_dec41-in1_And_dec39": "step",
      "out_Button_dec16-in2_And_dec40": "step",
      "out_Not_dec28-in1_And_dec40": "step",
      "out_Button_dec18-in2_And_dec41": "step",
      "out_Not_dec30-in1_And_dec41": "step",
      "out_And_dec42-in_Lamp_dec6": "step",
      "out_And_dec43-in2_And_dec42": "step",
      "out_And_dec44-in1_And_dec42": "step",
      "out_Not_dec27-in2_And_dec43": "step",
      "out_Button_dec17-in1_And_dec43": "step",
      "out_Button_dec18-in2_And_dec44": "step",
      "out_Not_dec30-in1_And_dec44": "step",
      "out_And_dec45-in_Lamp_dec7": "step",
      "out_And_dec46-in2_And_dec45": "step",
      "out_And_dec47-in1_And_dec45": "step",
      "out_Button_dec16-in2_And_dec46": "step",
      "out_Button_dec17-in1_And_dec46": "step",
      "out_Button_dec18-in2_And_dec47": "step",
      "out_Not_dec30-in1_And_dec47": "step",
      "out_And_dec48-in_Lamp_dec8": "step",
      "out_And_dec49-in2_And_dec48": "step",
      "out_And_dec50-in1_And_dec48": "step",
      "out_Not_dec27-in2_And_dec49": "step",
      "out_Not_dec28-in1_And_dec49": "step",
      "out_Not_dec29-in2_And_dec50": "step",
      "out_Button_dec19-in1_And_dec50": "step",
      "out_And_dec51-in2_And_dec53": "step",
      "out_And_dec52-in1_And_dec53": "step",
      "out_And_dec53-in_Lamp_dec9": "step",
      "out_Button_dec16-in2_And_dec51": "step",
      "out_Not_dec28-in1_And_dec51": "step",
      "out_Not_dec29-in2_And_dec52": "step",
      "out_Button_dec19-in1_And_dec52": "step",
      "out_And_dec54-in2_And_dec56": "step",
      "out_And_dec55-in1_And_dec56": "step",
      "out_And_dec56-in_Lamp_dec10": "step",
      "out_Not_dec27-in2_And_dec54": "step",
      "out_Button_dec17-in1_And_dec54": "step",
      "out_Not_dec29-in2_And_dec55": "step",
      "out_Button_dec19-in1_And_dec55": "step",
      "out_And_dec57-in_Lamp_dec11": "step",
      "out_And_dec58-in2_And_dec57": "step",
      "out_And_dec59-in1_And_dec57": "step",
      "out_Button_dec16-in2_And_dec58": "step",
      "out_Button_dec17-in1_And_dec58": "step",
      "out_Not_dec29-in2_And_dec59": "step",
      "out_Button_dec19-in1_And_dec59": "step",
      "out_And_dec60-in_Lamp_dec12": "step",
      "out_And_dec61-in2_And_dec60": "step",
      "out_And_dec62-in1_And_dec60": "step",
      "out_Not_dec27-in2_And_dec61": "step",
      "out_Not_dec28-in1_And_dec61": "step",
      "out_Button_dec18-in2_And_dec62": "step",
      "out_Button_dec19-in1_And_dec62": "step",
      "out_And_dec63-in_Lamp_dec13": "step",
      "out_And_dec64-in2_And_dec63": "step",
      "out_And_dec65-in1_And_dec63": "step",
      "out_Button_dec16-in2_And_dec64": "step",
      "out_Not_dec28-in1_And_dec64": "step",
      "out_Button_dec18-in2_And_dec65": "step",
      "out_Button_dec19-in1_And_dec65": "step",
      "out_And_dec66-in2_And_dec68": "step",
      "out_And_dec67-in1_And_dec68": "step",
      "out_And_dec68-in_Lamp_dec14": "step",
      "out_Not_dec27-in2_And_dec66": "step",
      "out_Button_dec17-in1_And_dec66": "step",
      "out_Button_dec18-in2_And_dec67": "step",
      "out_Button_dec19-in1_And_dec67": "step",
      "out_And_dec69-in_Lamp_dec15": "step",
      "out_And_dec70-in2_And_dec69": "step",
      "out_And_dec71-in1_And_dec69": "step",
      "out_Button_dec16-in2_And_dec70": "step",
      "out_Button_dec17-in1_And_dec70": "step",
      "out_Button_dec18-in2_And_dec71": "step",
      "out_Button_dec19-in1_And_dec71": "step"
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
//     devices: {

//     },
//     connectors: {

//     },
//     subcircuits: [],
//     wireManipulations: {

//     }
//   },
//   zoom: 1,
//   translation: {x: 0, y: 0}
// }