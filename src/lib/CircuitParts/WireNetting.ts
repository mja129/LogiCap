import { GRID_SIZE } from '@src/lib/grid';

const HALF = GRID_SIZE / 2;

export type GridPoint = { gx: number, gy: number };
export type WireSegment = { id: string, from: GridPoint, to: GridPoint };
export type PortGridMap = Record<string, { type: 'input' | 'output', anchorId: string }>;

const ptKey = (gx: number, gy: number) => `${gx},${gy}`;

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
// extractNets optimized with a Spatial Hash
export function extractNets(segments: WireSegment[]): Set<string>[] {
    // Maps a grid coordinate "x,y" to an array of segment indices occupying it
    const pointToSegments = new Map<string, number[]>();
    
    // Cache the points so we don't have to recalculate them during BFS
    const segmentPointsCache = new Array<string[]>(segments.length);

    // Map all wires to the grid (O(P) where P is total wire length)
    for (let i = 0; i < segments.length; i++) {
        const points = getPointsOnSegment(segments[i]);
        segmentPointsCache[i] = points;
        
        for (const pt of points) {
            let segList = pointToSegments.get(pt);
            if (!segList) {
                segList = [];
                pointToSegments.set(pt, segList);
            }
            segList.push(i);
        }
    }

    const adjList = new Map<number, Set<number>>();
    for (let i = 0; i < segments.length; i++) {
        adjList.set(i, new Set());
    }

    // Build edges ONLY if an endpoint touches another segment
    // We only need to check the 'from' and 'to' endpoints against the Spatial Hash
    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const fromKey = ptKey(seg.from.gx, seg.from.gy);
        const toKey = ptKey(seg.to.gx, seg.to.gy);

        // Check who shares 'from' endpoint
        const fromMatches = pointToSegments.get(fromKey);
        if (fromMatches) {
            for (const matchIdx of fromMatches) {
                if (matchIdx !== i) {
                    adjList.get(i)!.add(matchIdx);
                    adjList.get(matchIdx)!.add(i); 
                }
            }
        }

        // Check who shares 'to' endpoint
        const toMatches = pointToSegments.get(toKey);
        if (toMatches) {
            for (const matchIdx of toMatches) {
                if (matchIdx !== i) {
                    adjList.get(i)!.add(matchIdx);
                    adjList.get(matchIdx)!.add(i);
                }
            }
        }
    }

    const visited = new Set<number>();
    const nets: Set<string>[] = [];

    // BFS to group Segments into Nets
    for (let i = 0; i < segments.length; i++) {
        if (!visited.has(i)) {
            const queue = [i];
            visited.add(i);

            const currentNetPoints = new Set<string>();

            while (queue.length > 0) {
                const currIdx = queue.shift()!;
                
                // Using the cached points -- way faster than recalculating.
                const points = segmentPointsCache[currIdx];
                for (let p = 0; p < points.length; p++) {
                    currentNetPoints.add(points[p]);
                }

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
        
        // this regex didn't catch subcircuits
        const anchorIdMatch = Array.from(anchor.classList).find(c => /^(in\d+|in_|out\d+|out_|cout_|cin_|sel_)/.test(c));
        
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