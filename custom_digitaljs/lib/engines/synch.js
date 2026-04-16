"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SynchEngine = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _fastpriorityqueue = _interopRequireDefault(require("fastpriorityqueue"));
var help = _interopRequireWildcard(require("../help.js"));
var _base = require("./base.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class SynchEngine extends _base.BaseEngine {
  constructor(graph, {
    cells
  }) {
    super(graph);
    this._queue = new Map();
    this._pq = new _fastpriorityqueue.default();
    this._tick = 0;
    this._cells = cells;
    this._monitorChecks = new Map();
    this._alarms = new Map();
    this._alarmQueue = new Map();
    this._addGraph(graph);
    this.ready_clocks = [];
  }
  get hasPendingEvents() {
    return this._queue.size > 0;
  }
  get tick() {
    return this._tick;
  }
  shutdown() {
    this.stopListening();
  }
  _updateSubcircuit(gate, sigs, prevSigs = {}) {
    if (!sigs) sigs = gate.get("inputSignals");
    const iomap = gate.get('circuitIOmap');
    for (const [port, sig] of Object.entries(sigs)) {
      if (prevSigs[port] && sig.eq(prevSigs[port])) continue;
      const input = gate.get('graph').getCell(iomap[port]);
      console.assert(input.isInput);
      input._setInput(sig);
    }
  }
  _addGate(graph, gate) {
    super._addGate(graph, gate);
    this._enqueue(gate);
    if (gate instanceof this._cells.Subcircuit) this._updateSubcircuit(gate);
  }
  _addGraph(graph) {
    this.listenTo(graph, 'manualMemChange', gate => {
      this._enqueue(gate);
    });
    this.listenTo(graph, 'change:constantCache', gate => {
      this._enqueue(gate);
    });
    this.listenTo(graph, 'change:inputSignals', (gate, sigs) => {
      const prevSigs = gate.previous("inputSignals");
      if (help.eqSigs(sigs, prevSigs)) return;
      if (gate instanceof this._cells.Subcircuit) {
        this._updateSubcircuit(gate, sigs, prevSigs);
      }
      if (gate instanceof this._cells.Output && gate.get('mode') == 0) {
        const subcir = gate.graph.get('subcircuit');
        if (subcir != true) {
          console.assert(subcir != null);
          const port = gate.get('net');
          const signals = _lodash.default.clone(subcir.get('outputSignals'));
          signals[port] = gate.getOutput();
          subcir.set('outputSignals', signals);
        }
      }
      this._enqueue(gate);
    });
    super._addGraph(graph);
  }
  _enqueue(gate) {
    const k = this._tick + gate.get('propagation') | 0;
    const sq = (() => {
      const q = this._queue.get(k);
      if (q !== undefined) return q;
      const q1 = new Map();
      this._queue.set(k, q1);
      this._pq.add(k);
      return q1;
    })();
    sq.set(gate, gate.get('inputSignals'));
  }
  updateGatesNext() {
    const k = this._pq.poll() | 0;
    this._tick = k;
    const q = this._queue.get(k);
    // Hack for clock delay
    // console.assert(this.ready_clocks.length || (k >= this._tick));
    let count = 0;
    while (q && q.size) {
      const [gate, args] = q.entries().next().value;
      q.delete(gate);
      if (gate instanceof this._cells.Subcircuit) continue;
      if (gate instanceof this._cells.Input) continue;
      if (gate instanceof this._cells.Output) continue;
      const graph = gate.graph;
      if (!graph) continue;
      const newOutputSignals = gate.operation(args);
      if ('_clock_hack' in newOutputSignals) {
        delete newOutputSignals['_clock_hack'];
        // this._enqueue(gate);
        // do not increment count here, the clock hasn't propagated yet
        // it's just deferred into ready_clocks.
        // if we counted it, count would be 1, and the updateClocks() call would never fire, freezing the sim
        this.ready_clocks.push({
          out: newOutputSignals,
          clock: gate
        });
      } else {
        gate.set('outputSignals', newOutputSignals);
        // only count gates that immediately produced outputs this tick
        count++;
      }
      // count++;
    }

    // so we delete the current tick's bucket and advance _tick before calling updateclocks()
    // updateClocks() calls enqueue, which uses this._tick to decide which bucket
    // to place the clock in. if we called updateclocks() before this, _tick would still be k
    // and the clock would be enqueued into the tick k bucket which we're about to delete
    // so the sim freezes
    this._queue.delete(k);
    this._tick = k + 1 | 0;
    this._checkMonitors();

    // now that tick is k+1, it's safe to flush ready_clocks. the clock will be
    // enqueued into the k+1 bucket, which is clean and won't be deleted
    // count == 0 means nothing propagated this tick, which is exacly when a 
    // clock needs to be flushed to keep the sim moving
    if (count == 0) {
      this.updateClocks();
    }
    this.trigger('postUpdateGates', k, count);
    return count;
  }
  updateClocks() {
    this.ready_clocks.forEach(clock => {
      clock.clock.set('outputSignals', clock.out);
      this._enqueue(clock.clock);
    });
    this.ready_clocks = [];
  }
  updateGates() {
    if (this._pq.peek() == this._tick || this.ready_clocks.length > 0) return this.updateGatesNext();else {
      const k = this._tick | 0;
      this._tick = k + 1 | 0;
      this._checkMonitors();
      this.trigger('postUpdateGates', k, 0);
      return Promise.resolve(0);
    }
  }
  synchronize() {
    return Promise.resolve();
  }
  start() {
    throw new Error("start() not supported");
  }
  startFast() {
    throw new Error("startFast() not supported");
  }
  stop() {
    return Promise.resolve();
  }
  get interval() {
    throw new Error("interval not supported");
  }
  set interval(ms) {
    throw new Error("interval not supported");
  }
  get running() {
    return false;
  }
  observeGraph(graph) {}
  unobserveGraph(graph) {}
  monitor(gate, port, callback, {
    triggerValues,
    stopOnTrigger,
    oneShot
  }) {
    const cb = (gate, sigs) => {
      const sig = sigs[port];
      this._monitorChecks.set(cb, {
        gate,
        sig,
        cb,
        callback,
        triggerValues,
        stopOnTrigger,
        oneShot
      });
    };
    gate.on('change:outputSignals', cb);
    if (triggerValues == undefined) callback(this._tick, gate.get('outputSignals')[port]);
    return {
      gate: gate,
      callback: cb
    };
  }
  unmonitor(monitorId) {
    monitorId.gate.off('change:outputSignals', monitorId.callback);
  }
  alarm(tick, callback, {
    stopOnAlarm
  }) {
    console.assert(tick > this._tick);
    const cb = () => {
      this.unalarm(cb);
      callback();
    };
    this._alarms.set(cb, {
      tick,
      stopOnAlarm
    });
    if (!this._alarmQueue.has(tick)) this._alarmQueue.set(tick, new Set());
    this._alarmQueue.get(tick).add(cb);
    this._pq.add(tick - 1);
    if (!this._queue.has(tick - 1)) this._queue.set(tick - 1, new Map());
    return cb;
  }
  unalarm(alarmId) {
    const {
      tick
    } = this._alarms.get(alarmId);
    this._alarmQueue.get(tick).delete(alarmId);
    if (this._alarmQueue.get(tick).size == 0) this._alarmQueue.delete(tick);
    this._alarms.delete(alarmId);
  }
  _checkMonitors() {
    for (const {
      gate,
      sig,
      cb,
      callback,
      triggerValues,
      stopOnTrigger,
      oneShot
    } of this._monitorChecks.values()) {
      let triggered = true;
      if (triggerValues != undefined) triggered = triggerValues.some(triggerValue => sig.eq(triggerValue));
      if (triggered) {
        if (oneShot) gate.off('change:outputSignals', cb);
        const ret = callback(this._tick, sig);
        if (ret && stopOnTrigger) this.stop();
      }
    }
    this._monitorChecks = new Map();
    if (this._alarmQueue.get(this._tick)) {
      for (const cb of this._alarmQueue.get(this._tick)) {
        const {
          stopOnAlarm
        } = this._alarms.get(cb);
        const ret = cb();
        if (ret && stopOnAlarm) this.stop();
      }
      this._alarmQueue.delete(this._tick);
    }
  }
}
exports.SynchEngine = SynchEngine;
;