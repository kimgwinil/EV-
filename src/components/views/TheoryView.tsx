import React, { useState } from 'react';
import { Session, TheoryData } from '../../types';
import { Clock, Target, AlertTriangle, Lightbulb, FileText, ChevronDown } from 'lucide-react';
import { EvExplorer } from './EvExplorer';

export function TheoryView({ session }: { session: Session }) {
  const data = session.theoryData;
  const [expandedQId, setExpandedQId] = useState<number | null>(null);

  if (!data) return <div className="p-8 text-center text-slate-500">이론 자료가 준비 중입니다.</div>;

  const weekNumber = Number(session.id.match(/^w(\d+)/)?.[1] || 1);
  const highlightByWeek = [
    'msd',
    'msd',
    'battery',
    'bms',
    'motor',
    'inverter',
    'obc',
    'inverter',
    'bms',
    'motor',
    'obc',
    'obc',
    'inverter',
    'bms',
    'bms',
    'battery'
  ];
  const highlight = highlightByWeek[weekNumber - 1] || 'battery';

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 animate-fade-in pb-4 w-full">
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
        <h2 className="text-sm font-bold flex items-center gap-2 text-white uppercase tracking-widest">
          <Clock size={16} className="text-blue-500" /> 세션 개요 (120분)
        </h2>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex gap-4">
            <span className="text-slate-500 w-16 shrink-0 block">학습 목표:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              {session.objectives.length > 0 ? (
                session.objectives.map((obj, i) => <li key={i}>{obj}</li>)
              ) : (
                <li>세부 학습 목표가 곧 제공됩니다.</li>
              )}
            </ul>
          </div>
          {session.ncsUnit && (
             <div className="flex gap-4"><span className="text-slate-500 w-16 shrink-0 block">연계 NCS:</span> <span className="text-slate-300">{session.ncsUnit}</span></div>
          )}
          <div className="flex gap-4"><span className="text-slate-500 w-16 shrink-0 block">운영 리듬:</span> <span className="text-slate-300">{session.rhythmLabel || '120분 표준 세션'} · 도입 10분 / 본 활동 90분 / 정리 20분</span></div>
        </div>
      </div>

      <EvExplorer defaultHighlight={highlight} className="mb-2" />

      <div className="flex gap-4">
        <div className="w-10 flex flex-col items-center pt-2">
            <div className="bg-slate-800 border border-slate-700 text-blue-400 rounded w-8 h-8 flex items-center justify-center font-bold text-[10px] z-10 shrink-0 font-mono">10m</div>
            <div className="h-full w-px bg-slate-800 mt-2 mb-2"></div>
        </div>
        <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col gap-3">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2"><Lightbulb size={14}/> 도입 및 복습</h3>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500">학습자 동기유발 질문 (클릭하여 답변 확인):</p>
              {data.intro.questions.map((qObj, i) => (
                <div 
                  key={i} 
                  onClick={() => setExpandedQId(expandedQId === i ? null : i)}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 text-xs cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center gap-4">
                      <div className="font-bold text-slate-200"><span className="text-blue-500 mr-2">Q.</span>{qObj.q}</div>
                      <ChevronDown size={16} className={`text-slate-600 transition-transform ${expandedQId === i ? 'rotate-180' : ''}`} />
                  </div>
                  {expandedQId === i && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 text-emerald-400/90 leading-relaxed font-medium animate-fade-in">
                          <span className="text-emerald-500 font-bold mr-2">A.</span>{qObj.a}
                      </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="flex gap-4">
         <div className="w-10 flex flex-col items-center pt-2">
            <div className="bg-blue-600 text-white rounded w-8 h-8 flex items-center justify-center font-bold text-[10px] z-10 shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.3)] font-mono">90m</div>
            <div className="h-full w-px bg-slate-800 mt-2 mb-2"></div>
         </div>
         <div className="flex-1 space-y-4">
            {data.mainContent.map((content, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white">{idx+1}. {content.title}</h3>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-900/30 border border-blue-500/30 px-2 py-0.5 rounded">{content.duration}m</span>
                    </div>
                    <div className="text-slate-300 text-xs leading-relaxed p-3 bg-slate-950 rounded border border-slate-800/80">
                        {content.content}
                    </div>
                </div>
            ))}

            <div className="bg-amber-900/10 p-4 rounded-lg border border-amber-500/20 flex flex-col gap-3">
                 <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14}/> 현장 오개념 바로잡기</h3>
                 <div className="grid gap-3">
                    {data.misconceptions.map((mc, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/80 rounded border border-slate-800 text-xs">
                            <div className="flex items-start gap-2 mb-1.5">
                                <span className="bg-red-900/30 text-red-500 border border-red-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 mt-0.5 font-mono">X오개념</span>
                                <span className="text-slate-400 line-through decoration-red-900/50">{mc.wrong}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="bg-green-900/30 text-green-500 border border-green-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 mt-0.5 font-mono">O교 정</span>
                                <span className="text-slate-200">{mc.correction}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
         </div>
      </div>

      <div className="flex gap-4">
         <div className="w-10 flex flex-col items-center pt-2">
            <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded w-8 h-8 flex items-center justify-center font-bold text-[10px] z-10 shrink-0 font-mono">20m</div>
         </div>
         <div className="flex-1 bg-slate-900 p-4 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col gap-3">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> 정리 및 점검</h3>
             <div className="bg-slate-950 p-3 rounded text-xs text-slate-300 border border-slate-800 space-y-1">
                <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider font-mono">Next Session</span>
                <p>{data.summary.nextSessionLink}</p>
             </div>
         </div>
      </div>

      {(data.educatorNotes || data.studentSlides) && (
        <div className="grid md:grid-cols-2 gap-4">
          {data.educatorNotes && (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3"><FileText size={14}/> 강사용 설명 노트</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{data.educatorNotes}</p>
            </div>
          )}
          {data.studentSlides && (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3"><FileText size={14}/> 학습자용 슬라이드 개요</h3>
              <pre className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{data.studentSlides}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
