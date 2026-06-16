import React, { useState } from 'react';
import { Session } from '../../types';
import { TheoryView } from './TheoryView';
import { PracticeView } from './PracticeView';
import { BmsSimulator } from './simulators/BmsSimulator';
import { SafetyProcedureSimulator } from './simulators/SafetySimulator';
import { InteractivePowertrain } from './simulators/InteractivePowertrain';
import { curriculumData } from '../../data/curriculumData';
import { BookOpen, MonitorPlay, Wrench } from 'lucide-react';

export function LearningView({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState<'theory' | 'simulator' | 'practice'>('theory');
  const weekInfo = curriculumData.weeks.find(w => w.sessions.some(s => s.id === session.id));

  return (
    <div className="flex-1 flex flex-col pt-2 h-full">
      {/* Tabs Menu */}
      <div className="flex items-center justify-center gap-4 border-b border-slate-800 pb-2 mb-4 px-8">
         <button 
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'theory' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><BookOpen size={14}/> 1. 이론 학습</button>
         <button 
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'simulator' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><MonitorPlay size={14}/> 2. 시뮬레이터 (동작 원리)</button>
         <button 
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'practice' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><Wrench size={14}/> 3. 실무 진단 (현장 적용)</button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
         {activeTab === 'theory' && <TheoryView session={session} />}
         
         {activeTab === 'simulator' && (
            <div className="max-w-5xl mx-auto w-full animate-fade-in pt-4">
              {session.simulatorId === 'bms_simulator' && <BmsSimulator />}
              {session.simulatorId === 'safety_procedure' && <SafetyProcedureSimulator />}
              {(!session.simulatorId || session.simulatorId === 'interactive_powertrain') && (
                  <InteractivePowertrain 
                      title={session.title} 
                      targetTheme={weekInfo?.theme} 
                  />
              )}
            </div>
         )}

         {activeTab === 'practice' && <PracticeView session={session} />}
      </div>
    </div>
  );
}
