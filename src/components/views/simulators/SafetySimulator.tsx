import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useVehicleStore } from '../../../store/vehicleStore';

const STEPS = [
  { id: 'ppe', label: '개인보호장구(PPE) 점검 및 착용', desc: '절연장갑(핀홀 검사), 절연복, 절연화 착용 및 작업구역 통제', risk: 'high' },
  { id: 'igoff', label: '차량 전원(IG) OFF & 12V 탈거', desc: '시동 끄기 후 배터리 (-) 단자 탈거. 커패시터 방전을 위해 3~5분 대기', risk: 'medium' },
  { id: 'plug', label: '고전압 서비스 플러그(MSD) 탈거', desc: '제조사 매뉴얼에 따른 안전 플러그 탈거 후 본인 주머니에 보관 (오결합 방지)', risk: 'high' },
  { id: 'wait', label: '잔류 전압 방전 대기 (5분)', desc: '인버터 내부 평활 커퍼시터 방전 대기', risk: 'low' },
  { id: 'measure', label: '인버터 고전압 입력단 0V 검전', desc: 'CAT III 1000V 이상 멀티미터로 정확히 0V 확인 (가장 중요한 단계)', risk: 'high' }
];

export function SafetyProcedureSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [history, setHistory] = useState<{id: string, success: boolean}[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing');
  const [failReason, setFailReason] = useState<string | null>(null);
  
  const { setMsdConnected, msdConnected } = useVehicleStore();

  const reset = () => {
    setCurrentStepIndex(-1);
    setHistory([]);
    setGameState('playing');
    setFailReason(null);
    setMsdConnected(true);
  };

  const handleAction = (stepId: string) => {
    if (gameState !== 'playing') return;

    const expectedStep = STEPS[currentStepIndex + 1];

    if (stepId === expectedStep.id) {
       // Correct step
       setHistory([...history, {id: stepId, success: true}]);
       setCurrentStepIndex(currentStepIndex + 1);
       if (stepId === 'plug') {
           setMsdConnected(false);
       }
       if (currentStepIndex + 1 === STEPS.length - 1) {
          setGameState('success');
       }
    } else {
       // Wrong step - Immediate failure in safety
       setHistory([...history, {id: stepId, success: false}]);
       setGameState('failed');
       
       // Explain why
       if (stepId === 'measure' && !history.find(h=>h.id === 'plug')) {
           setFailReason('차단 플러그를 해제하지 않고 검전을 시도하여 감전 위험이 매우 높습니다.');
       } else if (stepId === 'plug' && !history.find(h=>h.id === 'ppe')) {
           setFailReason('보호장구 없이 고전압 부품을 만졌습니다. 치명적인 감전 위험이 있습니다.');
       } else {
           setFailReason(`규정된 안전 절차 순서를 위반했습니다. (기대 절차: ${expectedStep.label})`);
       }
    }
  };

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden font-sans text-xs">
      <div className="bg-red-950 border-b border-red-900 p-3 text-red-200 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500"/>
            <h2 className="font-bold text-sm tracking-widest uppercase">고전압 안전 차단 절차 (LOTO) 시뮬레이션</h2>
         </div>
         <div className="text-[10px] font-mono bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30 text-red-400">HIGH RISK ACTIVITY</div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 bg-slate-950">
         {/* Action Panel */}
         <div className="space-y-2">
             <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">수행할 작업을 선택하세요</div>
             {[STEPS[1], STEPS[4], STEPS[0], STEPS[3], STEPS[2]].map((step) => {
                 const isCompleted = history.some(h => h.id === step.id && h.success);
                 const isFailed = history.some(h => h.id === step.id && !h.success);
                 
                 return (
                     <button
                        key={step.id}
                        disabled={gameState !== 'playing' || isCompleted}
                        onClick={() => handleAction(step.id)}
                        className={`w-full text-left p-3 rounded border transition-all flex items-start gap-3
                            ${isCompleted ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : 
                              isFailed ? 'bg-red-950/30 border-red-500/50 animate-shake' : 
                              'bg-slate-900 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 text-slate-200'}
                        `}
                     >
                         <div className="mt-0.5 shrink-0">
                            {isCompleted ? <CheckCircle2 size={16} className="text-emerald-500"/> :
                             isFailed ? <XCircle size={16} className="text-red-500"/> :
                             <div className="w-4 h-4 rounded bg-slate-800 border border-slate-600"></div>}
                         </div>
                         <div>
                             <div className={`font-bold ${isCompleted ? 'text-slate-500' : isFailed ? 'text-red-400' : 'text-slate-300'}`}>{step.label}</div>
                             <div className="text-[10px] text-slate-500 mt-1 leading-snug">{step.desc}</div>
                         </div>
                     </button>
                 )
             })}
         </div>

         {/* Status & Feedback Panel */}
         <div className="bg-slate-900 rounded border border-slate-800 p-4 flex flex-col">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 border-b border-slate-800 pb-2">작업 진행 로그</h3>
            
            <div className="flex-1 space-y-2 mb-4">
                {history.length === 0 && <div className="text-slate-600 text-xs text-center py-6">아직 수행한 작업이 없습니다.</div>}
                {history.map((h, i) => {
                    const stepInfo = STEPS.find(s => s.id === h.id)!;
                    return (
                        <div key={i} className={`text-xs p-2.5 rounded border flex items-center gap-2 ${
                            h.success ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-red-950/30 border-red-900/50 text-red-400 font-bold'
                        }`}>
                            {h.success ? <CheckCircle2 size={14} className="text-emerald-500"/> : <XCircle size={14}/>}
                            <span className="font-mono text-[10px] opacity-50">{(i+1).toString().padStart(2,'0')}</span> {stepInfo.label}
                        </div>
                    )
                })}
            </div>

            {gameState === 'failed' && (
                <div className="bg-red-950/30 border border-red-500/30 rounded p-3 text-left">
                    <div className="font-bold text-red-500 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-widest"><AlertTriangle size={14}/> FATAL SAFETY ERROR</div>
                    <p className="text-red-300/80 text-[11px] mb-3">{failReason}</p>
                    <button onClick={reset} className="flex items-center justify-center gap-2 w-full text-xs font-bold bg-slate-950 text-red-500 py-2 rounded hover:bg-red-950/50 border border-red-900/50 transition-colors uppercase tracking-wider">
                        <RefreshCw size={12}/> 시뮬레이터 초기화
                    </button>
                </div>
            )}

            {gameState === 'success' && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-900/50 rounded-full border transform shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                        <CheckCircle2 size={24}/>
                    </div>
                    <div className="font-bold text-emerald-400 text-sm mb-1 uppercase tracking-widest">절차 완벽 수행</div>
                    <p className="text-emerald-500/70 text-[10px] mb-3">안전하게 고전압 차단 및 검전을 완료했습니다.</p>
                     <button onClick={reset} className="text-xs font-bold bg-slate-950 text-emerald-500 w-full py-2 rounded hover:bg-emerald-950/50 border border-emerald-900/50 transition-colors inline-flex justify-center items-center gap-2 uppercase tracking-wider">
                        <RefreshCw size={12}/> 다시 연습하기
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}
