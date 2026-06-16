/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { curriculumData } from './data/curriculumData';
import { Sidebar } from './components/layout/Sidebar';
import { LearningView } from './components/views/LearningView';
import { EvaluationView } from './components/views/EvaluationView';
import { useVehicleStore } from './store/vehicleStore';
import { Power, FileWarning } from 'lucide-react';

export default function App() {
  const [activeSessionId, setActiveSessionId] = useState('w1-d1');
  const tickSimulation = useVehicleStore(state => state.tickSimulation);
  const powerMode = useVehicleStore(state => state.powerMode);
  const setPowerMode = useVehicleStore(state => state.setPowerMode);
  const msdConnected = useVehicleStore(state => state.msdConnected);

  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  // Find the active session data
  const session = curriculumData.weeks
    .flatMap(w => w.sessions)
    .find(s => s.id === activeSessionId);

  const renderContent = () => {
    if (!session) return <div>Session not found</div>;

    switch (session.type) {
      case 'learning':
        return <LearningView session={session} />;
      case 'evaluation':
        return <EvaluationView session={session} />;
      default:
        return <div className="p-8 text-slate-500">Preparation in progress...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        curriculum={curriculumData} 
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">EV</div>
             <h1 className="text-lg font-semibold tracking-tight text-slate-200">전기자동차 기술인력양성 통합 교육 플랫폼 <span className="text-slate-500 font-normal ml-2 text-sm uppercase">Enterprise Edition</span></h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-slate-800 p-1 rounded border border-slate-700">
                <button 
                  onClick={() => msdConnected && setPowerMode('OFF')}
                  className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-widest transition-all ${powerMode === 'OFF' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >OFF</button>
                <button 
                  onClick={() => msdConnected && setPowerMode('ACC')}
                  className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-widest transition-all ${powerMode === 'ACC' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-500/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'} ${!msdConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >ACC</button>
                <button 
                  onClick={() => msdConnected && setPowerMode('READY')}
                  className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-widest transition-all ${powerMode === 'READY' ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-500/50 shadow-sm flex items-center gap-1' : 'text-slate-500 hover:text-slate-300'} ${!msdConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {powerMode === 'READY' && <Power size={10} />}
                  READY
                </button>
             </div>
             
             <div className="flex flex-col items-end border-l border-slate-800 pl-6">
               <span className="text-xs text-slate-400">현재 과정: [{curriculumData.target}]</span>
               <span className="text-xs font-mono text-blue-400">PROGRESS: WEEK 4 / 12 (33%)</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold tracking-wider">SK</div>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
            <div className="mb-2 shrink-0">
              <div className="text-[10px] font-bold text-blue-500 mb-1 tracking-wider uppercase font-mono">
                  {session ? `DAY ${session.day} · ${session.type.toUpperCase()}` : 'LOADING'}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {session?.title}
              </h2>
            </div>
            {renderContent()}
        </div>

        <footer className="h-8 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-4">
             <span className="text-[10px] text-slate-500">TRAINING MODE: <strong className="text-slate-400">INTERACTIVE SIMULATION</strong></span>
             <span className="w-px h-3 bg-slate-700"></span>
             <span className="text-[10px] text-slate-500">SERVER: <strong className="text-slate-400">KOREA-EDU-HQ-01</strong></span>
           </div>
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
               <span className="text-[10px] text-slate-400 font-mono">SYS_OP</span>
             </div>
             <span className="text-[9px] text-slate-600 font-mono">v1.0.42-STABLE</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
