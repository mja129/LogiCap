import { GRID_SIZE } from '@src/lib/grid';

const HALF = GRID_SIZE / 2;

export type GridPoint = { gx: number, gy: number };
export type WireSegment = { id: string, from: GridPoint, to: GridPoint };
export type PortGridMap = Record<string, { type: 'input' | 'output', anchorId: string }>;

const ptKey = (gx: number, gy: number) => `${gx},${gy}`;

// Helper function, does what it says on the tin
function isPointOnSegment(p: GridPoint, seg: WireSegment): boolean {
    // Find bounds regardless of which direction the wire was drawn
    const minX = Math.min(seg.from.gx, seg.to.gx);
    const maxX = Math.max(seg.from.gx, seg.to.gx);
    const minY = Math.min(seg.from.gy, seg.to.gy);
    const maxY = Math.max(seg.from.gy, seg.to.gy);

    // Check if the point is collinear and within the segment bounds
    if (seg.from.gy === seg.to.gy) { 
        // Horizontal Wire
        return p.gy === seg.from.gy && p.gx >= minX && p.gx <= maxX;
    } else if (seg.from.gx === seg.to.gx) { 
        // Vertical Wire
        return p.gx === seg.from.gx && p.gy >= minY && p.gy <= maxY;
    }
    
    // Diagonal failsafe (for non-orthogonal routing)
    const crossProduct = (p.gy - seg.from.gy) * (seg.to.gx - seg.from.gx) - (p.gx - seg.from.gx) * (seg.to.gy - seg.from.gy);
    if (crossProduct !== 0) return false;
    return p.gx >= minX && p.gx <= maxX && p.gy >= minY && p.gy <= maxY;
}

// Need this to find the ports at the end.
function getPointsOnSegment(seg: WireSegment): string[] {
    const points: string[] = [];
    const dx = Math.sign(seg.to.gx - seg.from.gx);
    const dy = Math.sign(seg.to.gy - seg.from.gy);
    
    let currX = seg.from.gx;
    let currY = seg.from.gy;
    
    points.push(ptKey(currX, currY));
    
    while (currX !== seg.to.gx || currY !== seg.to.gy) {
        if (currX !== seg.to.gx) currX += dx;
        if (currY !== seg.to.gy) currY += dy;
        points.push(ptKey(currX, currY));
    }
    
    return points;
}

// BFS
export function extractNets(segments: WireSegment[]): Set<string>[] {
    // Graph nodes are now Segments (using their index in the array)
    const adjList = new Map<number, number[]>();

    for (let i = 0; i < segments.length; i++) {
        adjList.set(i, []);
    }

    // Build edges ONLY if an endpoint touches another segment (T-Junctions & Corners)
    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            const segA = segments[i];
            const segB = segments[j];

            if (
                isPointOnSegment(segA.from, segB) ||
                isPointOnSegment(segA.to, segB) ||
                isPointOnSegment(segB.from, segA) ||
                isPointOnSegment(segB.to, segA)
            ) {
                adjList.get(i)!.push(j);
                adjList.get(j)!.push(i);
            }
        }
    }

    const visited = new Set<number>();
    const nets: Set<string>[] = [];

    // BFS to group the Segments into Nets
    for (let i = 0; i < segments.length; i++) {
        if (!visited.has(i)) {
            const queue = [i];
            visited.add(i);

            // This set will hold the actual grid coordinates for the final port mapping
            const currentNetPoints = new Set<string>();

            while (queue.length > 0) {
                const currIdx = queue.shift()!;
                const currSeg = segments[currIdx];

                // Extract the physical path of this segment and add it to the Net's footprint
                const points = getPointsOnSegment(currSeg);
                points.forEach(p => currentNetPoints.add(p));

                const neighbors = adjList.get(currIdx)!;
                for (const neighborIdx of neighbors) {
                    if (!visited.has(neighborIdx)) {
                        visited.add(neighborIdx);
                        queue.push(neighborIdx);
                    }
                }
            }
            nets.push(currentNetPoints);
        }
    }

    return nets;
}

export function buildPortMap(
    canvasRect: DOMRect, 
    transform: { x: number, y: number, scale: number }
): PortGridMap {
    const portMap: PortGridMap = {};
    const anchors = document.querySelectorAll('.custom_anchor');
    
    anchors.forEach(anchor => {
        const rect = anchor.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;
        
        const effTx = transform.x + canvasRect.width * (1 - transform.scale) / 2;
        const effTy = transform.y + canvasRect.height * (1 - transform.scale) / 2;
        
        const sx = (clientX - canvasRect.left - effTx) / transform.scale;
        const sy = (clientY - canvasRect.top - effTy) / transform.scale;
        
        const gx = Math.round((sx - HALF) / GRID_SIZE);
        const gy = Math.round((sy - HALF) / GRID_SIZE);
        
        const isInput = anchor.classList.contains('input');
        const type = isInput ? 'input' : 'output';
        
        const anchorIdMatch = Array.from(anchor.classList).find(c => /^(in\d+|in_|out_|sel_)/.test(c));
        
        if (anchorIdMatch) {
            portMap[`${gx},${gy}`] = { type, anchorId: anchorIdMatch };
        }
    });
    
    return portMap;
}

// Consolidates the portmap with the wiresegments and updates the CircuitStore
export function compileCircuitConnections(
    wireSegments: WireSegment[], 
    portMap: PortGridMap
): Record<string, [string, string][]> { 
    
    const nets = extractNets(wireSegments);
    const newConnectors: Record<string, [string, string][]> = {};

    console.log("RAW NETS FOUND:", nets.length);
    nets.forEach((net, index) => {
        console.log(`  Net ${index}:`, Array.from(net));
    });


    // The time complexity of this is diabolical.
    // This will need some optimization
    nets.forEach(net => {
        const netOutputs: string[] = [];
        const netInputs: string[] = [];

        net.forEach(pointKey => {
            if (portMap[pointKey]) {
                if (portMap[pointKey].type === 'output') netOutputs.push(portMap[pointKey].anchorId);
                if (portMap[pointKey].type === 'input') netInputs.push(portMap[pointKey].anchorId);
            }
        });

        netOutputs.forEach(outAnchor => {
            if (!newConnectors[outAnchor]) newConnectors[outAnchor] = [];
            
            netInputs.forEach(inAnchor => {
                const inputNodeId = inAnchor.substring(inAnchor.indexOf('_') + 1); 
                newConnectors[outAnchor].push([inputNodeId, inAnchor]);
            });
        });
    });

    return newConnectors;
}