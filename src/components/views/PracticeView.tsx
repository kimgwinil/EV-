import React, { useState } from 'react';
import { Session, PracticeData } from '../../types';
import { ShieldAlert, Wrench, CheckSquare, AlertTriangle, PlayCircle } from 'lucide-react';

export function PracticeView({ session }: { session: Session }) {
  const data = session.practiceData;
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  if (!data) return <div className="p-8 text-center text-slate-500">실습 매뉴얼이 준비 중입니다.</div>;

  const handleCheck = (id: string) => {
    setCheckedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progress = Math.round((Object.values(checkedSteps).filter(Boolean).length / data.steps.length) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 animate-fade-in pb-4 w-full">
       <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-slate-900 p-4 rounded-lg border border-slate-800">
             <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-orange-500 uppercase tracking-widest">
               <Wrench size={16} /> 실습 개요
             </h2>
             <div className="space-y-2 text-xs text-slate-300">
                <div className="flex gap-2">
                    <span className="text-slate-500 w-16 shrink-0 block">학습 목표:</span>
                    <ul className="list-disc pl-4 text-slate-300 space-y-1">
                        {session.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>
                <div className="flex gap-2 mt-2 items-center">
                    <span className="text-slate-500 w-16 shrink-0 block">선수 이수:</span>
                    <span className="bg-orange-950/50 text-orange-400 border border-orange-900/50 px-2 py-0.5 rounded font-mono text-[10px] tracking-wide">{data.prerequisites}</span>
                </div>
             </div>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">준비물 / 장비</h3>
             <ul className="text-xs space-y-1.5 text-slate-300">
                 {data.equipment.map((eq, i) => (
                     <li key={i} className="flex items-center gap-2">
                         <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                         {eq}
                     </li>
                 ))}
             </ul>
          </div>
       </div>

       <div className={`p-4 rounded-lg flex items-start gap-4 border ${
           data.safety.level === 'high' ? 'bg-red-950/30 border-red-900/50 text-red-200' : 'bg-amber-950/30 border-amber-900/50 text-amber-200'
       }`}>
           <ShieldAlert size={24} className={`shrink-0 ${data.safety.level === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
           <div className="flex-1">
               <h3 className={`font-bold text-xs uppercase tracking-widest mb-2 font-mono ${data.safety.level === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                   안전수칙 및 위험성평가(JSA) - {data.safety.level} RISK
               </h3>
               <ul className="space-y-1 text-xs">
                   {data.safety.rules.map((rule, i) => (
                       <li key={i} className="flex items-start gap-2 opacity-90">
                           <span className="text-[10px] font-mono mt-0.5 text-slate-500">■</span>
                           <span>{rule}</span>
                       </li>
                   ))}
               </ul>
           </div>
       </div>

       <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col">
           <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
               <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide"><PlayCircle size={14} className="text-blue-500"/> 절차 체크리스트</h3>
               <div className="flex items-center gap-3">
                   <div className="text-[10px] font-mono text-slate-400">PROGRESS: <span className="text-blue-400 font-bold">{progress}%</span></div>
                   <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
                   </div>
               </div>
           </div>
           
           <div className="p-3 space-y-2 flex-1 overflow-y-auto">
               {data.steps.map((step, idx) => (
                   <label key={step.id} className={`flex gap-3 p-3 rounded border transition-colors cursor-pointer ${
                       checkedSteps[step.id] ? 'bg-blue-900/10 border-blue-900/30 text-slate-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                   }`}>
                       <div className="relative flex items-start pt-0.5">
                          <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500/50 mt-0 cursor-pointer accent-blue-500"
                              checked={!!checkedSteps[step.id]}
                              onChange={() => handleCheck(step.id)}
                          />
                       </div>
                       <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                               <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider">STEP {("0"+(idx+1)).slice(-2)}</span>
                           </div>
                           <p className={`text-xs font-medium ${checkedSteps[step.id] ? 'line-through decoration-slate-600 opcaity-60' : ''}`}>
                               {step.action}
                           </p>
                           {step.safetyMeasure && (
                               <div className={`mt-2 p-2 rounded text-[10px] flex items-start gap-2 border ${
                                   checkedSteps[step.id] ? 'bg-slate-900/50 border-transparent text-slate-600' : 'bg-amber-950/20 text-amber-400 border-amber-900/30'
                               }`}>
                                   <AlertTriangle size={12} className={`shrink-0 mt-0.5 ${checkedSteps[step.id] ? 'opacity-30' : ''}`} />
                                   <span>{step.safetyMeasure}</span>
                               </div>
                           )}
                       </div>
                   </label>
               ))}
           </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">이상/정상 시나리오 비교</h3>
               <div className="space-y-3">
                   {data.scenarios.map((scenario, idx) => (
                       <div key={idx} className="space-y-2">
                           <div className="p-2 border-l-2 border-green-500 bg-green-950/20">
                               <div className="text-[9px] font-bold text-green-500 mb-0.5 uppercase tracking-wide">정상</div>
                               <div className="text-xs text-slate-300">{scenario.normal}</div>
                           </div>
                           <div className="p-2 border-l-2 border-red-500 bg-red-950/20">
                               <div className="text-[9px] font-bold text-red-500 mb-0.5 uppercase tracking-wide">이상 대처</div>
                               <div className="text-xs text-slate-300">{scenario.abnormal}</div>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
           
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <CheckSquare size={14}/> 수행평가 항목
               </h3>
               <table className="w-full text-xs text-left border-collapse">
                   <thead>
                       <tr className="border-b border-slate-800 text-slate-500">
                           <th className="py-2 px-2 font-medium">항목</th>
                           <th className="py-2 px-2 font-medium w-16 text-center">배점</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                       {data.checklist.map((item, idx) => (
                           <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                               <td className="py-2 px-2 text-slate-300">{item.item}</td>
                               <td className="py-2 px-2 font-mono text-center text-slate-400">{item.points}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>

    </div>
  );
}
