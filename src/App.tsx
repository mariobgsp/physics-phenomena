import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, X, Play, Info, Sigma } from 'lucide-react';
import { phenomena } from './data/phenomena';
import type { Phenomenon } from './data/phenomena';
import SimulationCanvas from './components/SimulationCanvas';
import { simulationRegistry } from './simulations';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

const App: React.FC = () => {
  const [selectedPhenomenon, setSelectedPhenomenon] = useState<Phenomenon | null>(null);

  const currentSim = useMemo(() => {
    if (selectedPhenomenon && simulationRegistry[selectedPhenomenon.id]) {
      return simulationRegistry[selectedPhenomenon.id]();
    }
    return null;
  }, [selectedPhenomenon]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1e293b]">
      <header className="max-w-7xl mx-auto px-8 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <Atom className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-[#0f172a]">
            Physics<span className="text-blue-600">Lab</span>
          </h1>
        </div>
        <p className="text-lg text-[#64748b] max-w-2xl">
          Explore the fundamental laws of nature through interactive, real-time simulations.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-20">
        {Object.entries(
          phenomena.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
          }, {} as Record<string, typeof phenomena>)
        ).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-6 border-b border-[#e2e8f0] pb-2 font-['Space_Grotesk']">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPhenomenon(p)}
                  className="bg-white p-5 rounded-2xl border border-[#e2e8f0] cursor-pointer transition-all group"
                >
                  <div className="mb-4 text-xs font-bold uppercase tracking-wider text-blue-600/70">
                    {p.category.split(' ')[0]}
                  </div>
                  <h3 className="text-lg font-bold text-[#1e293b] leading-tight group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#94a3b8]">
                    <Play className="w-3 h-3 fill-current" />
                    Start Experiment
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <AnimatePresence>
        {selectedPhenomenon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-6xl h-[85vh] rounded-[32px] shadow-2xl border border-white/20 overflow-hidden flex flex-col md:flex-row relative"
            >
              <button
                onClick={() => setSelectedPhenomenon(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-grow bg-[#0f172a] relative overflow-hidden">
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
                      <p className="text-xl font-medium">Simulation Loading...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-[450px] p-10 overflow-y-auto hide-scrollbar bg-white flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Description</span>
                </div>
                <h2 className="text-3xl font-bold mb-6 text-[#0f172a] font-['Space_Grotesk'] leading-tight">
                  {selectedPhenomenon.title}
                </h2>
                <p className="text-base text-[#64748b] leading-relaxed mb-8">
                  {selectedPhenomenon.description}
                </p>
                
                <div className="mt-auto">
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mb-6">
                      <div className="flex items-center gap-2 mb-4 text-blue-600">
                        <Sigma className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase">Governing Equation</h4>
                      </div>
                      <div className="text-[#0f172a] overflow-x-auto overflow-y-hidden text-center py-2">
                        <BlockMath math={selectedPhenomenon.equation} />
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Quick Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category</span>
                          <span className="text-slate-900 font-medium">{selectedPhenomenon.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Engine</span>
                          <span className="text-slate-900 font-medium">Real-time Canvas</span>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; 2026 Physics Lab Project | Modern Interactive Education</p>
      </footer>
    </div>
  );
};

export default App;
