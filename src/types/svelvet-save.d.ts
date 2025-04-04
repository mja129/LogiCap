interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface GraphBounds extends Bounds {
  width?: number;
  height?: number;
}

// Node type
interface SvelvetNode {
  id: string;
  position: Position;
  dimensions: Dimensions;
  group: string | null;
  locked: boolean;
  inputs: number;
  outputs: number;
  rotation: number;
  moving: boolean;
  resizingWidth: boolean;
  resizingHeight: boolean;
  rotating: boolean;
  editable: boolean;
  resizable: boolean;
  anchors: Record<string, any>;
  zIndex: number;
  collapsed: boolean;
  edge: any | null;
  bgColor: string | null;
  direction: "LR" | "TB" | "RL" | "BT";
  label: string;
  borderColor: string | null;
  selectionColor: string | null;
  textColor: string | null;
  connections: Record<string, any>;
}

// Graph transformation type
interface Transform {
  translation: Position;
  scale: number;
}

// Group types
interface GroupNodes {
  parent: string | null;
  nodes: Record<string, any>;
}

interface Groups {
  selected: GroupNodes;
  hidden: GroupNodes;
}

// Complete graph type
interface SvelvetSave {
  id: string;
  nodes: SvelvetNode[];
  edges: Record<string, any>;
  transforms: Transform;
  maxZIndex: number;
  dimensions: GraphBounds;
  bounds: {
    graphBounds: Bounds;
    nodeBounds: Bounds;
  };
  center: Position;
  mounted: boolean;
  direction: "LR" | "TB" | "RL" | "BT";
  editable: boolean;
  edge: any | null;
  editing: any | null;
  cursor: Position;
  locked: boolean;
  groups: Groups;
  groupBoxes: Record<string, any>;
  activeGroup: string | null;
  initialNodePositions: Record<string, any>;
}
