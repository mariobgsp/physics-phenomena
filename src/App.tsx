import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, X, Play, Info, Sigma, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, BookOpen, ExternalLink } from 'lucide-react';
import { phenomena } from './data/phenomena';
import type { Phenomenon, ControlDef } from './data/phenomena';
import SimulationCanvas from './components/SimulationCanvas';
import { simulationRegistry } from './simulations';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// ─── Slider ───────────────────────────────────
interface SliderControlProps {
  def: ControlDef;
  value: number;
  onChange: (key: string, value: number) => void;
  focused: boolean;
  onFocus: (key: string) => void;
  onBlur: () => void;
}

const SliderControl: React.FC<SliderControlProps> = ({ def, value, onChange, focused, onFocus, onBlur }) => {
  const isToggle = def.step >= 2 && def.min === -1 && def.max === 1;
  const pct = Math.max(0, Math.min(100, ((value - def.min) / (def.max - def.min)) * 100));

  const decimals = def.step < 0.001 ? 4 : def.step < 0.01 ? 3 : def.step < 0.1 ? 2 : def.step < 1 ? 1 : 0;
  const displayVal = Number.isInteger(value) && decimals === 0 ? value : value.toFixed(decimals);

  if (isToggle) {
    const isPos = value > 0;
    return (
      <div
        className={`rounded-xl p-3 border transition-all ${focused ? 'border-blue-400/60 bg-blue-950/30' : 'border-white/8 bg-white/4'}`}
        onMouseEnter={() => onFocus(def.key)} onMouseLeave={onBlur}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">{def.label}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isPos ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
            {isPos ? '+q positive' : '−q negative'}
          </span>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onChange(def.key, isPos ? -1 : 1)}
          onKeyDown={e => e.key === 'Enter' && onChange(def.key, isPos ? -1 : 1)}
          className={`w-full h-9 rounded-lg font-semibold text-sm flex items-center justify-center cursor-pointer transition-all select-none ${
            isPos ? 'bg-gradient-to-r from-red-600 to-red-500 text-white' : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
          }`}
        >
          Click to flip → {isPos ? '+ → −' : '− → +'}
        </div>
        {def.hint && <p className="text-[10px] text-slate-500 mt-1.5">{def.hint}</p>}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl p-3 border transition-all ${focused ? 'border-blue-400/60 bg-blue-950/30' : 'border-white/8 bg-white/4'}`}
      onMouseEnter={() => onFocus(def.key)} onMouseLeave={onBlur}
    >
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-semibold text-slate-300">{def.label}</label>
        <span className="text-xs font-mono bg-slate-700/50 text-blue-300 px-2 py-0.5 rounded-full">
          {displayVal}{def.unit && <span className="ml-0.5 text-slate-400 text-[10px]">{def.unit}</span>}
        </span>
      </div>
      {/* Custom slider track */}
      <div className="relative h-6 flex items-center group">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-700/70" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          style={{ width: `${pct}%`, transition: 'width 60ms linear' }}
        />
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value}
          onChange={e => onChange(def.key, parseFloat(e.target.value))}
          onFocus={() => onFocus(def.key)}
          onBlur={onBlur}
          aria-label={def.label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 10 }}
        />
        {/* Visual thumb */}
        <div
          className={`absolute w-4 h-4 rounded-full border-2 shadow-lg pointer-events-none -translate-x-1/2 transition-transform ${
            focused ? 'border-blue-300 bg-blue-200 scale-125' : 'border-blue-500 bg-white scale-100'
          }`}
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600">{def.min}{def.unit}</span>
        <span className="text-[10px] text-slate-600">{def.max}{def.unit}</span>
      </div>
      {def.hint && <p className="text-[10px] text-slate-500 mt-1">{def.hint}</p>}
    </div>
  );
};

// ─── Equation variable legend ─────────────────
const EquationLegend: React.FC<{
  vars: { symbol: string; description: string }[];
  focusedKey: string;
}> = ({ vars, focusedKey }) => (
  <div className="flex flex-wrap gap-1.5 mt-3">
    {vars.map(v => (
      <span
        key={v.symbol}
        className={`text-[11px] px-2 py-1 rounded-lg border transition-all ${
          focusedKey && v.description.toLowerCase().includes(focusedKey.toLowerCase().replace(/([A-Z])/g, ' $1').trim().toLowerCase())
            ? 'border-cyan-400/60 bg-cyan-950/40 text-cyan-200'
            : 'border-white/10 bg-white/5 text-slate-300'
        }`}
      >
        <span className="font-bold font-mono text-cyan-300 mr-1">{v.symbol}</span>
        <span className="text-slate-400">{v.description}</span>
      </span>
    ))}
  </div>
);

// ─── App ──────────────────────────────────────
const App: React.FC = () => {
  const [selectedPhenomenon, setSelectedPhenomenon] = useState<Phenomenon | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, number>>({});
  const [focusedKey, setFocusedKey] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [showRefs, setShowRefs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const simRef = useRef<any>(null);

  // Create simulation instance when phenomenon changes
  const currentSim = useMemo(() => {
    if (selectedPhenomenon && simulationRegistry[selectedPhenomenon.id]) {
      const sim = simulationRegistry[selectedPhenomenon.id]();
      simRef.current = sim;
      return sim;
    }
    simRef.current = null;
    return null;
  }, [selectedPhenomenon]);

  // Initialize control values in useEffect (NOT inside useMemo — avoids anti-pattern)
  useEffect(() => {
    if (selectedPhenomenon?.controls) {
      const defaults: Record<string, number> = {};
      selectedPhenomenon.controls.forEach(c => { defaults[c.key] = c.default; });
      setControlValues(defaults);
      // Apply defaults to the newly created sim
      if (simRef.current?.setParams) {
        simRef.current.setParams(defaults);
      }
    } else {
      setControlValues({});
    }
    setFocusedKey('');
    setShowControls(true);
    setShowRefs(false);
  }, [selectedPhenomenon]);

  // ── THE FIX: call setParams directly, not inside setControlValues updater ──
  const handleControlChange = useCallback((key: string, value: number) => {
    setControlValues(prev => ({ ...prev, [key]: value }));
    if (simRef.current?.setParams) {
      simRef.current.setParams({ [key]: value });
    }
  }, []);

  const handleReset = useCallback(() => {
    if (!selectedPhenomenon?.controls) return;
    const defaults: Record<string, number> = {};
    selectedPhenomenon.controls.forEach(c => { defaults[c.key] = c.default; });
    setControlValues(defaults);
    if (simRef.current?.setParams) {
      simRef.current.setParams(defaults);
    }
  }, [selectedPhenomenon]);

  const filteredPhenomena = useMemo(() => {
    if (!searchQuery.trim()) return phenomena;
    const q = searchQuery.toLowerCase();
    return phenomena.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const grouped = useMemo(() =>
    filteredPhenomena.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {} as Record<string, typeof phenomena>),
  [filteredPhenomena]);

  const hasControls = !!(selectedPhenomenon?.controls?.length);
  const hasVars = !!(selectedPhenomenon?.equationVars?.length);
  const hasRefs = !!(selectedPhenomenon?.references?.length);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1e293b]">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-8 pt-14 pb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <Atom className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-[#0f172a]">
            Physics<span className="text-blue-600">Lab</span>
          </h1>
        </div>
        <p className="text-lg text-[#64748b] max-w-2xl mb-6">
          Drag sliders to change parameters and see physics respond instantly. Every equation links to verified sources.
        </p>
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search phenomena…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-8 pb-20">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6 border-b border-[#e2e8f0] pb-2 font-['Space_Grotesk']">
              {category}
              <span className="ml-3 text-sm font-normal text-slate-400">{items.length} simulations</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map(p => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPhenomenon(p)}
                  className="bg-white p-5 rounded-2xl border border-[#e2e8f0] cursor-pointer group relative overflow-hidden"
                >
                  {p.controls && (
                    <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  )}
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600/70">
                    {p.category.split(' ')[0]}
                  </div>
                  <h3 className="text-sm font-bold text-[#1e293b] leading-tight group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#94a3b8]">
                    <Play className="w-3 h-3 fill-current" />
                    {p.controls ? 'Interactive' : 'Watch'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-24 text-slate-400">
            <Atom className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No simulations found for "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedPhenomenon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-md"
            onClick={e => { if (e.target === e.currentTarget) setSelectedPhenomenon(null); }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="bg-[#0d1117] w-full max-w-7xl h-[90vh] rounded-[28px] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row relative"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedPhenomenon(null)}
                className="absolute top-5 right-5 z-20 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                aria-label="Close simulation"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ── Canvas ── */}
              <div className="flex-grow bg-[#0a0f1a] relative overflow-hidden min-h-[40vh] md:min-h-0">
                {currentSim ? (
                  <SimulationCanvas
                    id={selectedPhenomenon.id}
                    onUpdate={(dt, w, h) => currentSim.update ? currentSim.update(dt, w, h) : null}
                    onDraw={(ctx, w, h, t) => currentSim.draw(ctx, w, h, t)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <div className="text-center">
                      <Atom className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p className="text-xl font-medium">Loading…</p>
                    </div>
                  </div>
                )}

                {/* Equation overlay on canvas */}
                <div className="absolute bottom-4 left-4 pointer-events-none">
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                    <Sigma className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <div className="text-white/90 text-sm">
                      <BlockMath math={selectedPhenomenon.equation} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Side Panel ── */}
              <div
                className="w-full md:w-[420px] flex flex-col overflow-hidden border-l border-white/5"
                style={{ background: 'linear-gradient(180deg,#111827 0%,#0d1117 100%)' }}
              >
                {/* Title */}
                <div className="px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{selectedPhenomenon.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">{selectedPhenomenon.title}</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedPhenomenon.description}</p>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 space-y-4">

                  {/* Equation */}
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <Sigma className="w-4 h-4" />
                      <h4 className="text-[11px] font-bold uppercase tracking-wider">Governing Equation</h4>
                    </div>
                    <div className="text-white overflow-x-auto text-center py-1">
                      <BlockMath math={selectedPhenomenon.equation} />
                    </div>
                    {hasVars && (
                      <EquationLegend
                        vars={selectedPhenomenon.equationVars!}
                        focusedKey={focusedKey}
                      />
                    )}
                  </div>

                  {/* Interactive Controls */}
                  {hasControls && (
                    <div className="rounded-2xl border border-white/8 overflow-hidden">
                      {/* Header — NOT a nested button, use div+onClick */}
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setShowControls(v => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setShowControls(v => !v)}
                      >
                        <div className="flex items-center gap-2 text-slate-200">
                          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">Interactive Parameters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Reset — separate clickable div, NOT a nested button */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={e => { e.stopPropagation(); handleReset(); }}
                            onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') handleReset(); }}
                            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                            title="Reset to defaults"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </div>
                          {showControls ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </div>
                      <AnimatePresence initial={false}>
                        {showControls && (
                          <motion.div
                            key="controls"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                              {selectedPhenomenon.controls!.map(def => (
                                <SliderControl
                                  key={def.key}
                                  def={def}
                                  value={controlValues[def.key] ?? def.default}
                                  onChange={handleControlChange}
                                  focused={focusedKey === def.key}
                                  onFocus={setFocusedKey}
                                  onBlur={() => setFocusedKey('')}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* References */}
                  {hasRefs && (
                    <div className="rounded-2xl border border-white/8 overflow-hidden">
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setShowRefs(v => !v)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setShowRefs(v => !v)}
                      >
                        <div className="flex items-center gap-2 text-slate-200">
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                          <span className="text-[11px] font-bold uppercase tracking-wider">Verified Sources</span>
                        </div>
                        {showRefs ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                      <AnimatePresence initial={false}>
                        {showRefs && (
                          <motion.div
                            key="refs"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                              {selectedPhenomenon.references!.map((ref, i) => (
                                <a
                                  key={i}
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/4 hover:bg-emerald-950/30 border border-white/6 hover:border-emerald-500/30 transition-all group"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                  <div>
                                    <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">{ref.title}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{ref.source}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Quick info */}
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category</span>
                        <span className="text-slate-200 font-medium">{selectedPhenomenon.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Engine</span>
                        <span className="text-slate-200 font-medium">Canvas 60 fps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Parameters</span>
                        <span className={`font-semibold ${hasControls ? 'text-cyan-400' : 'text-slate-500'}`}>
                          {hasControls ? `${selectedPhenomenon.controls!.length} sliders` : 'view only'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-8 py-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Physics Lab · All equations verified against Wikipedia &amp; academic sources</p>
      </footer>
    </div>
  );
};

export default App;