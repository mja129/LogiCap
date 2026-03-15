import { GRID_SIZE } from './grid'; // adjust path
const HALF = GRID_SIZE / 2
// Type guards
function isMux(device: Device): device is Mux {
  return device.type === 'Mux';
}
function isButton(device: Device): device is Button {
  return device.type === 'Button';
}
function isLamp(device: Device): device is Lamp {
  return device.type === 'Lamp';
}
function isClock(device: Device): device is Clock {
  return device.type === 'Clock';
}
function isTunnelInput(device: Device): device is TunnelInput {
  return device.type === 'TunnelInput';
}
function isTunnelOutput(device: Device): device is TunnelOutput {
  return device.type === 'TunnelOutput';
}
function hasInputs(device: Device): device is LogicGate | Subcomponent {
  return 'inputs' in device;
}
function hasOutputs(device: Device): device is Subcomponent {
  return 'outputs' in device;
}

function getPorts(device: Device): { inputPorts: string[]; outputPorts: string[] } {
  // Helper for numbered ports
  const generateNumbered = (prefix: string, count: number): string[] =>
    Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);

  if (isMux(device)) {
    const numDataInputs = Math.pow(2, device.bits.sel);
    const inputs = Array.from({ length: numDataInputs }, (_, i) => `in${i}`).concat('sel');
    return { inputPorts: inputs, outputPorts: ['out'] };
  }
  if (isButton(device) || isClock(device) || isTunnelInput(device)) {
    return { inputPorts: [], outputPorts: ['out'] };
  }
  if (isLamp(device) || isTunnelOutput(device)) {
    return { inputPorts: ['in'], outputPorts: [] };
  }
  if (hasInputs(device)) {
    const inputPorts = generateNumbered('in', device.inputs);
    let outputPorts: string[] = [];
    if (hasOutputs(device)) {
      outputPorts = generateNumbered('out', device.outputs);
    } else {
      // LogicGate (assume one output named 'out')
      outputPorts = ['out'];
    }
    return { inputPorts, outputPorts };
  }

  console.warn('Unknown device type for port extraction', device);
  return { inputPorts: [], outputPorts: [] };
}

export function computeAnchorOffsets(device: Device): Record<string, { x: number; y: number }> {
  const width = 80;   // your node width
  const height = 50;  // your node height

  const { inputPorts, outputPorts } = getPorts(device);
  const offsets: Record<string, { x: number; y: number }> = {};

  // Inputs on left edge
  if (inputPorts.length > 0) {
    const spacing = height / (inputPorts.length + 1);
    inputPorts.forEach((port, idx) => {
      offsets[port] = { x: 0, y: Math.round(spacing * (idx + 1)) };
    });
  }

  // Outputs on right edge
  if (outputPorts.length > 0) {
    const spacing = height / (outputPorts.length + 1);
    outputPorts.forEach((port, idx) => {
      offsets[port] = { x: width, y: Math.round(spacing * (idx + 1)) };
    });
  }

  // Define reference anchor (first input, or first output, or fallback)
  if (inputPorts.length > 0) {
    offsets.ref = offsets[inputPorts[0]];
  } else if (outputPorts.length > 0) {
    offsets.ref = offsets[outputPorts[0]];
  } else {
    offsets.ref = { x: 0, y: 0 };
  }

  return offsets;
}