<script lang="ts">

    import { CircuitStore } from '@CircuitStore'
    import { canvasTransform } from '@src/App.svelte'
    import { wireMode, cancelDrawSignal, selectedWireIds } from '@src/lib/wireModeStore'
    import { GRID_SIZE } from '@src/lib/grid'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    let svgEl: SVGSVGElement;
    let canvasW = 0;
    let canvasH = 0;

    // Where the current draw started
    let drawStart: GridPoint | null = null;
    // Current cursor grid position
    let cursorPoint: GridPoint | null = null;
    // True while left click is held down during a draw gesture
    let dragActive = false;

    // for moving wires
    let clickStart: GridPoint | null = null;
    // for selecting wires
    let clickedWire: string | null = null;

    // Box selection state
    let boxSelecting = false;
    let boxSelectStart: {x: number, y: number} | null = null;
    let boxSelectEnd: {x: number, y: number} | null = null;

    // Dots are offset by half a grid square
    const HALF = GRID_SIZE / 2;

    // Svelvet's transform-origin is 50% 50% (browser default), so translate values are
    // center-relative. Add the center offset to convert to top-left-relative screen coords.
    $: effectiveTx = $canvasTransform.x + canvasW * (1 - $canvasTransform.scale) / 2;
    $: effectiveTy = $canvasTransform.y + canvasH * (1 - $canvasTransform.scale) / 2;

    // Convert a screen position to canvas-local pixel coordinates (inside the <g> transform).
    function screenToCanvas(clientX: number, clientY: number): {x: number, y: number} {
        const rect = svgEl.getBoundingClientRect();
        const ct = get(canvasTransform);
        const effTx = ct.x + rect.width  * (1 - ct.scale) / 2;
        const effTy = ct.y + rect.height * (1 - ct.scale) / 2;
        return {
            x: (clientX - rect.left - effTx) / ct.scale,
            y: (clientY - rect.top  - effTy) / ct.scale,
        };
    }

    // True if line segment (x1,y1) -> (x2,y2) touches or crosses rect (rx,ry,rw,rh).
    function lineIntersectsRect(
        x1: number, y1: number, x2: number, y2: number,
        rx: number, ry: number, rw: number, rh: number): boolean {
        const inRect = (x: number, y: number) =>
            x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
        if (inRect(x1, y1) || inRect(x2, y2)) return true;
        // Check if the segment crosses any of the four rect edges
        const cross = (ax: number, ay: number, bx: number, by: number,
                       cx: number, cy: number, dx: number, dy: number) => {
            const d1x = bx-ax, d1y = by-ay, d2x = dx-cx, d2y = dy-cy;
            const denom = d1x*d2y - d1y*d2x;
            if (Math.abs(denom) < 1e-10) return false;
            const t = ((cx-ax)*d2y - (cy-ay)*d2x) / denom;
            const u = ((cx-ax)*d1y - (cy-ay)*d1x) / denom;
            return t >= 0 && t <= 1 && u >= 0 && u <= 1;
        };
        return cross(x1, y1, x2, y2, rx, ry, rx+rw, ry)
            || cross(x1, y1, x2, y2, rx+rw, ry, rx+rw, ry+rh)
            || cross(x1, y1, x2, y2, rx+rw, ry+rh, rx, ry+rh)
            || cross(x1, y1, x2, y2, rx, ry+rh, rx, ry);
    }

    function eventToGrid(e: MouseEvent): GridPoint {
        const rect = svgEl.getBoundingClientRect();
        const effTx = $canvasTransform.x + rect.width * (1 - $canvasTransform.scale) / 2;
        const effTy = $canvasTransform.y + rect.height * (1 - $canvasTransform.scale) / 2;
        const sx = (e.clientX - rect.left - effTx) / $canvasTransform.scale;
        const sy = (e.clientY - rect.top - effTy) / $canvasTransform.scale;
        return {
            gx: Math.round((sx - HALF) / GRID_SIZE),
            gy: Math.round((sy - HALF) / GRID_SIZE),
        };
    }

    // Convert a grid index back to the dot's pixel center
    function gp(g: number): number {
        return g * GRID_SIZE + HALF;
    }

    function finalizeWire() {
        if (!drawStart || !cursorPoint) return;
        if (drawStart.gx != cursorPoint.gx || drawStart.gy != cursorPoint.gy) {
            CircuitStore.update((circuit) => {
                circuit.wireSegments = [...circuit.wireSegments, {id: crypto.randomUUID(), from: drawStart as GridPoint, to: cursorPoint as GridPoint}];
                return circuit;
            });
        }
        drawStart = null;
        dragActive = false;
    }

    function cancelDraw() {
        drawStart = null;
        cursorPoint = null;
        dragActive = false;
    }

    /*
     * Superb level of jank here.
     * To deselect svelvet stuff, need to fire a mousedown on the svelvet canvas to deselect
     * any currently selected nodes. This begins a pan,
     * so immediately fire a mouseup (whose listener is on the window for
     * some reason :DDDD) to stop the drag.
     */
    function deselectNodes() {
        var wrapper = document.querySelector('.svelvet-wrapper');
        if (wrapper) {
            wrapper.dispatchEvent(new MouseEvent('mousedown'));
        }
        window.dispatchEvent(new MouseEvent('mouseup'));
    }

    function onMouseDown(e: MouseEvent) {
        if (e.buttons ^ 1) {return;}
        if ($wireMode == 0) {
            var target = e.target as HTMLElement;
            if (target.classList.contains('wire')) {
                var id = target.dataset.id as string;
                selectedWireIds.update(s => {
                    const next = new Set(s);
                    // If shift key is down, toggle select on this wire
                    if (e.shiftKey) {
                        if (next.has(id)) {next.delete(id);} else {next.add(id);}
                    // otherwise, if this wire is selected, we want to move whole selection
                    // if not selected, deselect all and select this wire
                    } else {
                        if (next.has(id)) {
                            // MOVE SELECTED WIRES/NODES
                            // If next mouseup is on the same wire, we want to just select this one
                            clickedWire = id;
                        } else {
                            deselectNodes();
                            return new Set([id]);
                        }
                    }
                    return next;
                });
            }
        } else {
            if (drawStart == null) {
                const pt = eventToGrid(e);
                drawStart = pt;
                cursorPoint = pt;
                dragActive = true;
            } else {
                finalizeWire();
            }
        }
    }

    function onMouseMove(e: MouseEvent) {
        if ($wireMode != 1 || !drawStart) {return;}
        const pt = eventToGrid(e);

        let cur = { ...drawStart };

        const dx = pt.gx - cur.gx;
        const dy = pt.gy - cur.gy;

        if (Math.abs(dx) > Math.abs(dy)) {
            cursorPoint = {gx: cur.gx + dx, gy: cur.gy};
        } else {
            cursorPoint = {gx: cur.gx, gy: cur.gy + dy};
        }
    }

    function onMouseUp(e: MouseEvent) {
        if ($wireMode == 1) {
            if (!dragActive || e.buttons ^ 1) {return;}
            dragActive = false;
            // Finalize only if the cursor actually moved to a different grid point (drag mode)
            if (cursorPoint && drawStart && (cursorPoint.gx !== drawStart.gx || cursorPoint.gy !== drawStart.gy)) {
                finalizeWire();
            }
        } else {
            // If mouseup is on the same wire as we mousedowned on, clear selection and select this wire
            // CLICKEDWIRE SHOULD BE NULLED IF MOUSEMOVE DETECTS WE'RE MOVING SELECTION
            var target = e.target as HTMLElement;
            if (target.classList.contains('wire') && (clickedWire && target.dataset.id as string == clickedWire)) {
                deselectNodes();
                selectedWireIds.update(() => new Set([target.dataset.id as string]));
                clickedWire == null;
            }
        }
    }

    function onMouseLeave() {
        if (dragActive) {
            // Cancel the in-progress drag when the mouse leaves the canvas
            cancelDraw();
        } else {
            cursorPoint = null;
        }
    }

    $: if ($cancelDrawSignal) {
        if (drawStart) {
            cancelDraw();
        } else {
            wireMode.update(() => 0);
            selectedWireIds.set(new Set());
        }
        cancelDrawSignal.update(() => 0);
    }

    onMount(() => {
        // Finalize or cancel a wire draw when the mouse is released outside the SVG
        function handleWindowMouseUp(e: MouseEvent) {
            if (!dragActive || e.button !== 0) {return;}
            dragActive = false;
            if (cursorPoint && drawStart && (cursorPoint.gx !== drawStart.gx || cursorPoint.gy !== drawStart.gy)) {
                finalizeWire();
            }
        }
        // Cancel draw and box selection when the mouse leaves the browser window
        function handleWindowMouseLeave(e: MouseEvent) {
            if (e.relatedTarget == null) {
                cancelDraw();
                boxSelecting = false;
                boxSelectStart = null;
                boxSelectEnd = null;
            }
        }
        // Shift+drag on the canvas starts a box selection.
        // Wire element handlers call stopPropagation so this won't fire for wire clicks.
        function handleDocMouseDown(e: MouseEvent) {
            if (
                get(wireMode) !== 0 || 
                e.buttons ^ 1 || (e.target as HTMLElement).classList.contains('wire')
            ) {return;}
            const rect = svgEl.getBoundingClientRect();
            const onCanvas = e.clientX >= rect.left && e.clientX <= rect.right &&
                             e.clientY >= rect.top  && e.clientY <= rect.bottom;
            if (e.shiftKey && onCanvas) {
                const pos = screenToCanvas(e.clientX, e.clientY);
                boxSelectStart = pos;
                boxSelectEnd = pos;
                boxSelecting = true;
            } else if (!e.shiftKey) {
                selectedWireIds.set(new Set());
            }
        }
        // Deselect wires if box select has moved significantly
        function handleDocMouseMove(e: MouseEvent) {
            if ($wireMode == 0 && boxSelectStart) {
                const pt = screenToCanvas(e.clientX, e.clientY);
                const dx = Math.abs(pt.x - boxSelectStart.x);
                const dy = Math.abs(pt.y - boxSelectStart.y);
                if (dx >= 1 || dy >= 1) {
                    selectedWireIds.set(new Set());
                }
            }
        }
        // Finalize box selection
        function handleDocMouseUp(e: MouseEvent) {
            if ($wireMode == 1 || !boxSelecting || e.button !== 0) {return;}
            boxSelecting = false;
            if (!boxSelectStart) {return;}
            boxSelectEnd = screenToCanvas(e.clientX, e.clientY);
            const minX = Math.min(boxSelectStart.x, boxSelectEnd.x);
            const minY = Math.min(boxSelectStart.y, boxSelectEnd.y);
            const rw = Math.abs(boxSelectEnd.x - boxSelectStart.x);
            const rh = Math.abs(boxSelectEnd.y - boxSelectStart.y);
            boxSelectStart = null;
            boxSelectEnd = null;
            // Ignore clicks that barely moved (not an intentional drag)
            if (rw * get(canvasTransform).scale < 4 && rh * get(canvasTransform).scale < 4) {return;}
            const toSelect = new Set<string>();
            for (const seg of get(CircuitStore).wireSegments) {
                if (lineIntersectsRect(
                    gp(seg.from.gx), gp(seg.from.gy), gp(seg.to.gx), gp(seg.to.gy),
                    minX, minY, rw, rh)) {
                    toSelect.add(seg.id);
                }
            }
            selectedWireIds.update(s => new Set([...s, ...toSelect]));
        }
        // RAAAHHHHHHHH EVENT LISTENERS
        // <insert travis scott mic stand meme>
        window.addEventListener('mouseup', handleWindowMouseUp);
        document.documentElement.addEventListener('mouseleave', handleWindowMouseLeave);
        document.addEventListener('mousedown', handleDocMouseDown);
        document.addEventListener('mouseup', handleDocMouseUp);
        document.addEventListener('mousemove', handleDocMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleWindowMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleWindowMouseLeave);
            document.removeEventListener('mousedown', handleDocMouseDown);
            document.removeEventListener('mouseup', handleDocMouseUp);
            document.removeEventListener('mousemove', handleDocMouseMove);
        };
    });
</script>

<div class="wire-canvas-wrapper" bind:clientWidth={canvasW} bind:clientHeight={canvasH}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <svg
        bind:this={svgEl}
        class="wire-canvas"
        class:active={$wireMode}
        onmousedown={onMouseDown}
        onmousemove={onMouseMove}
        onmouseup={onMouseUp}
        onmouseleave={onMouseLeave}
    >
        <g transform="translate({effectiveTx} {effectiveTy}) scale({$canvasTransform.scale})">
            <!-- Render unselected wires -->
            {#each $CircuitStore.wireSegments.filter(s => !$selectedWireIds.has(s.id)) as seg (seg.id)}
                <line
                    class="wire-l wire"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    x1={gp(seg.from.gx)}
                    y1={gp(seg.from.gy)}
                    x2={gp(seg.to.gx)}
                    y2={gp(seg.to.gy)}
                    stroke="black"
                    stroke-width="4"
                    stroke-linecap="round"
                />
                <circle
                    class="wire-ep wire"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    cx={gp(seg.from.gx)}
                    cy={gp(seg.from.gy)}
                    r="4"
                    fill="#000"
                />
                <circle
                    class="wire-ep wire"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    cx={gp(seg.to.gx)}
                    cy={gp(seg.to.gy)}
                    r="4"
                    fill="#000"
                />
            {/each}

            <!-- Render selected wires -->
            {#each $CircuitStore.wireSegments.filter(s => $selectedWireIds.has(s.id)) as seg (seg.id)}
                <line
                    class="wire-l wire selected"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    x1={gp(seg.from.gx)}
                    y1={gp(seg.from.gy)}
                    x2={gp(seg.to.gx)}
                    y2={gp(seg.to.gy)}
                    stroke-width="4"
                    stroke-linecap="round"
                />
                <circle
                    class="wire-ep wire selected"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    cx={gp(seg.from.gx)}
                    cy={gp(seg.from.gy)}
                    r="4"
                />
                <circle
                    class="wire-ep wire selected"
                    class:draggable={$wireMode == 0}
                    onmousedown={(e) => {if ($wireMode == 0) {e.stopPropagation(); onMouseDown(e);}}}
                    data-id={seg.id}
                    cx={gp(seg.to.gx)}
                    cy={gp(seg.to.gy)}
                    r="4"
                />
            {/each}

            <!-- Preview line -->
            {#if $wireMode == 1 && drawStart && cursorPoint}
                <line
                    x1={gp(drawStart.gx)}
                    y1={gp(drawStart.gy)}
                    x2={gp(cursorPoint.gx)}
                    y2={gp(cursorPoint.gy)}
                    stroke="#333"
                    stroke-width="3"
                    stroke-dasharray="6 5"
                    stroke-linecap="round"
                    opacity="1"
                />
                <!-- Dots at start of draw and cursor -->
                <circle
                    cx={gp(drawStart.gx)}
                    cy={gp(drawStart.gy)}
                    r="3"
                    fill="#003594"
                />
                <circle
                    cx={gp(cursorPoint.gx)}
                    cy={gp(cursorPoint.gy)}
                    r="3"
                    fill="#003594"
                />
            {/if}
        </g>
    </svg>
</div>

<style>
    .wire-canvas-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    }

    .wire-canvas {
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    .wire-canvas.active {
        pointer-events: all;
        cursor: crosshair;
    }

    .wire-l.draggable, .wire-ep.draggable {
        pointer-events: auto;
        cursor: grab;
    }

    .wire-l.selected {
        stroke: #1a73e8;
        stroke-width: 5;
    }

    .wire-ep.selected {
        fill: #1a73e8;
    }
    
</style>
