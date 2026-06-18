import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Gauge, Battery, Zap, Wrench } from 'lucide-react';
import { useVehicleStore } from '../../../store/vehicleStore';
import { t, translateContent, useLanguageStore } from '../../../i18n';

const STEPS = [
  { id: 'ppe', label: '개인보호장구(PPE) 점검 및 착용', desc: '절연장갑(핀홀 검사), 절연복, 절연화 착용 및 작업구역 통제', risk: 'high' },
  { id: 'igoff', label: '차량 전원(IG) OFF & 12V 탈거', desc: '시동 끄기 후 배터리 (-) 단자 탈거. 커패시터 방전을 위해 3~5분 대기', risk: 'medium' },
  { id: 'plug', label: '고전압 서비스 플러그(MSD) 탈거', desc: '제조사 매뉴얼에 따른 안전 플러그 탈거 후 본인 주머니에 보관 (오결합 방지)', risk: 'high' },
  { id: 'wait', label: '잔류 전압 방전 대기 (5분)', desc: '인버터 내부 평활 커퍼시터 방전 대기', risk: 'low' },
  { id: 'measure', label: '인버터 고전압 입력단 0V 검전', desc: 'CAT III 1000V 이상 멀티미터로 정확히 0V 확인 (가장 중요한 단계)', risk: 'high' }
];

const SAFETY_PARTS = [
  { id: 'motor', name: '구동 모터', desc: '차량이 READY 상태일 때 구동축을 회전시키는 고전압 부품입니다. IG OFF 후 속도 0 km/h를 확인해야 합니다.' },
  { id: 'inverter', name: '인버터', desc: '배터리 DC 전압을 모터용 3상 AC로 변환합니다. 차단 전에는 잔류전압과 평활 커패시터 위험이 있습니다.' },
  { id: 'battery', name: '고전압 배터리', desc: '차량 하부에 에너지를 저장합니다. MSD 탈거 전까지 직접 접촉 금지 대상으로 봅니다.' },
  { id: 'msd', name: '서비스 플러그', desc: '고전압 회로를 물리적으로 분리하는 장치입니다. 탈거 후 작업자 본인이 보관해야 합니다.' },
  { id: 'bms', name: 'BMS', desc: 'SOC, 온도, 셀 상태, 인터록을 감시합니다. 안전 조건이 맞지 않으면 릴레이 투입을 제한합니다.' },
  { id: 'obc', name: 'OBC/LDC', desc: '완속 충전과 12V 전원 공급을 담당합니다. 고전압 차단 상태에서는 동작 대기 또는 차단으로 표시됩니다.' }
];

export function SafetyProcedureSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [history, setHistory] = useState<{id: string, success: boolean}[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing');
  const [failReason, setFailReason] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState('battery');
  const language = useLanguageStore(state => state.language);
  
  const { setMsdConnected, msdConnected, powerMode, vehicleSpeed, sysVoltage, packSoc, setPowerMode, setVehicleSpeed } = useVehicleStore();

  useEffect(() => {
    setMsdConnected(true);
    setPowerMode('READY');
    setVehicleSpeed(18);
  }, [setMsdConnected, setPowerMode, setVehicleSpeed]);

  const reset = () => {
    setCurrentStepIndex(-1);
    setHistory([]);
    setGameState('playing');
    setFailReason(null);
    setMsdConnected(true);
    setPowerMode('READY');
    setVehicleSpeed(18);
  };

  const handleAction = (stepId: string) => {
    if (gameState !== 'playing') return;

    const expectedStep = STEPS[currentStepIndex + 1];

    if (stepId === expectedStep.id) {
       // Correct step
       setHistory([...history, {id: stepId, success: true}]);
       setCurrentStepIndex(currentStepIndex + 1);
       if (stepId === 'igoff') {
           setPowerMode('OFF');
           setVehicleSpeed(0);
       }
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

  const completed = (id: string) => history.some(h => h.id === id && h.success);
  const wheelDuration = vehicleSpeed > 0 ? `${Math.max(0.22, 2.4 - vehicleSpeed / 38)}s` : '0s';
  const safetyVoltage = completed('plug') ? 0 : powerMode === 'READY' ? sysVoltage : Math.min(42, sysVoltage * 0.08);
  const stageLabel = gameState === 'success'
    ? '검전 완료'
    : completed('plug')
      ? '고전압 차단'
      : powerMode === 'READY'
        ? '주행 가능 상태'
        : '전원 차단 대기';
  const selectedPart = SAFETY_PARTS.find(part => part.id === selectedPartId) || SAFETY_PARTS[2];
  const selectedPartValue = (() => {
    switch (selectedPartId) {
      case 'motor': return `${vehicleSpeed.toFixed(0)} km/h`;
      case 'inverter': return completed('plug') ? '0V' : `${safetyVoltage.toFixed(0)}V`;
      case 'battery': return `${packSoc.toFixed(1)}%`;
      case 'msd': return completed('plug') ? 'CUT' : 'CONN';
      case 'bms': return gameState === 'failed' ? 'WARNING' : 'NORMAL';
      case 'obc': return completed('plug') ? 'CUT' : 'STBY';
      default: return '';
    }
  })();

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden font-sans text-xs">
      <div className="bg-red-950 border-b border-red-900 p-3 text-red-200 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500"/>
            <h2 className="font-bold text-sm tracking-widest uppercase">{translateContent('고전압 안전 차단 절차 (LOTO) 시뮬레이션', language)}</h2>
         </div>
         <div className="text-[10px] font-mono bg-red-900/50 px-2 py-0.5 rounded border border-red-500/30 text-red-400">HIGH RISK ACTIVITY</div>
      </div>

      <div className="overflow-x-auto p-4 bg-slate-950 border-b border-slate-800">
        <div
          className="grid gap-4"
          style={{
            minWidth: '760px',
            gridTemplateColumns: 'minmax(440px, 1fr) 300px'
          }}
        >
          <div className="relative min-h-[410px] overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            <div className="absolute inset-0 blueprint-floor" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950" />
            <div className="absolute left-0 right-0 bottom-0 h-24 bg-slate-900/90" />

            <div className="relative z-10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-red-400">Safety Scenario</div>
                  <h3 className="mt-1 text-base font-bold text-white">{translateContent('고전압 차량 안전 차단 가상실습', language)}</h3>
                </div>
                <div className={`rounded border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${completed('plug') ? 'border-emerald-600/40 bg-emerald-950/30 text-emerald-300' : 'border-red-600/40 bg-red-950/30 text-red-300'}`}>
                  {translateContent(stageLabel, language)}
                </div>
              </div>

              <div className="mt-4 flex h-[320px] items-start justify-center pt-2">
                <div className="relative">
                  <div className="ev-hover-info-card absolute left-1/2 top-[252px] z-40 w-[300px] -translate-x-1/2 rounded-lg border border-blue-500/40 bg-blue-950/30 p-2.5 text-blue-100 shadow-[0_18px_38px_rgba(0,0,0,0.42)] backdrop-blur">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[10px] font-black uppercase tracking-widest">{translateContent(selectedPart.name, language)}</div>
                      <div className="rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] font-bold">{selectedPartValue}</div>
                    </div>
                    <div className="mt-1 text-[9px] leading-snug text-slate-300">{translateContent(selectedPart.desc, language)}</div>
                  </div>
                  <div className="topdown-ev safety-topdown-ev">
                    <div className="topdown-ev-texture" />
                    <div className="topdown-wheel front-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                    <div className="topdown-wheel front-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                    <div className="topdown-wheel rear-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                    <div className="topdown-wheel rear-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                    <div className={`topdown-cable ${completed('plug') ? 'is-cut' : ''}`} />
                  </div>
                  <div className="absolute inset-0 z-20">
                    <button onMouseEnter={() => setSelectedPartId('motor')} onClick={() => setSelectedPartId('motor')} className={`safety-top-module motor ${completed('igoff') ? 'is-off' : ''} ${selectedPartId === 'motor' ? 'is-selected' : ''}`}>MOTOR<br />{vehicleSpeed.toFixed(0)} km/h</button>
                    <button onMouseEnter={() => setSelectedPartId('inverter')} onClick={() => setSelectedPartId('inverter')} className={`safety-top-module inverter ${completed('igoff') ? 'is-off' : ''} ${selectedPartId === 'inverter' ? 'is-selected' : ''}`}>INVERTER<br />{completed('plug') ? '0V' : `${safetyVoltage.toFixed(0)}V`}</button>
                    <button onMouseEnter={() => setSelectedPartId('battery')} onClick={() => setSelectedPartId('battery')} className={`safety-top-pack ${completed('plug') ? 'is-cut' : ''} ${selectedPartId === 'battery' ? 'is-selected' : ''}`}>HV BATTERY<br />{packSoc.toFixed(1)}%</button>
                    <button onMouseEnter={() => setSelectedPartId('msd')} onClick={() => setSelectedPartId('msd')} className={`safety-top-msd ${completed('plug') ? 'is-cut' : ''} ${selectedPartId === 'msd' ? 'is-selected' : ''}`}>MSD</button>
                    <button onMouseEnter={() => setSelectedPartId('bms')} onClick={() => setSelectedPartId('bms')} className={`safety-top-bms ${gameState === 'failed' ? 'is-warning' : ''} ${selectedPartId === 'bms' ? 'is-selected' : ''}`}>BMS</button>
                    <button onMouseEnter={() => setSelectedPartId('obc')} onClick={() => setSelectedPartId('obc')} className={`safety-top-module obc ${completed('plug') ? 'is-off' : ''} ${selectedPartId === 'obc' ? 'is-selected' : ''}`}>OBC/LDC<br />{completed('plug') ? 'CUT' : 'STBY'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <h3 className="mb-3 border-b border-slate-800 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t(language, 'partInfo')}</h3>
            <div className="space-y-2">
              {SAFETY_PARTS.map(part => {
                const isActive = selectedPartId === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`w-full rounded border p-2 text-left transition-colors ${isActive ? 'border-blue-500/40 bg-blue-950/25' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'}`}
                  >
                    <div className={`text-[11px] font-bold ${isActive ? 'text-blue-300' : 'text-slate-300'}`}>{translateContent(part.name, language)}</div>
                    {isActive && <div className="mt-1 text-[10px] leading-snug text-slate-400">{translateContent(part.desc, language)}</div>}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{t(language, 'currentSelection')}</div>
              <div className="mt-1 text-xs font-bold text-slate-200">{translateContent(selectedPart.name, language)}</div>
              <div className="mt-1 text-[10px] leading-snug text-slate-500">{translateContent(selectedPart.desc, language)}</div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4" style={{ gridColumn: '1 / -1' }}>
            <SafetyMetric icon={<Gauge size={14} />} label={translateContent('차량 속도', language)} value={`${vehicleSpeed.toFixed(0)} km/h`} note={translateContent(vehicleSpeed > 0 ? 'IG OFF 전: 바퀴 회전 중' : '정지 확인', language)} />
            <SafetyMetric icon={<Zap size={14} />} label={translateContent('고전압 추정', language)} value={`${safetyVoltage.toFixed(0)} V`} note={translateContent(completed('plug') ? 'MSD 탈거 후 0V 검전 단계' : '접촉 금지', language)} danger={!completed('plug')} />
            <SafetyMetric icon={<Battery size={14} />} label={translateContent('배터리 SOC', language)} value={`${packSoc.toFixed(1)}%`} note={translateContent('에너지 잔류 가능성 전제', language)} />
            <SafetyMetric icon={<Wrench size={14} />} label={translateContent('작업 허가', language)} value={translateContent(gameState === 'success' ? '허가' : '금지', language)} note={translateContent(gameState === 'success' ? '0V 확인 후 제한적 작업' : '절차 완료 전 접촉 금지', language)} danger={gameState !== 'success'} />
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-5">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={`rounded border p-3 ${completed(step.id) ? 'border-emerald-600/40 bg-emerald-950/20' : idx === currentStepIndex + 1 && gameState === 'playing' ? 'border-blue-500/50 bg-blue-950/25' : 'border-slate-800 bg-slate-900/70'}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-500">STEP {idx + 1}</span>
                {completed(step.id) && <CheckCircle2 size={12} className="text-emerald-400" />}
              </div>
              <div className="text-[11px] font-bold text-slate-200">{translateContent(step.label, language)}</div>
              <div className="mt-1 text-[10px] leading-snug text-slate-500">{translateContent('왜', language)}: {translateContent(step.desc, language)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 bg-slate-950">
         {/* Action Panel */}
         <div className="space-y-2">
             <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{translateContent('수행할 작업을 선택하세요', language)}</div>
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
                             <div className={`font-bold ${isCompleted ? 'text-slate-500' : isFailed ? 'text-red-400' : 'text-slate-300'}`}>{translateContent(step.label, language)}</div>
                             <div className="text-[10px] text-slate-500 mt-1 leading-snug">{translateContent(step.desc, language)}</div>
                         </div>
                     </button>
                 )
             })}
         </div>

         {/* Status & Feedback Panel */}
         <div className="bg-slate-900 rounded border border-slate-800 p-4 flex flex-col">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 border-b border-slate-800 pb-2">{translateContent('작업 진행 로그', language)}</h3>
            
            <div className="flex-1 space-y-2 mb-4">
                {history.length === 0 && <div className="text-slate-600 text-xs text-center py-6">{translateContent('아직 수행한 작업이 없습니다.', language)}</div>}
                {history.map((h, i) => {
                    const stepInfo = STEPS.find(s => s.id === h.id)!;
                    return (
                        <div key={i} className={`text-xs p-2.5 rounded border flex items-center gap-2 ${
                            h.success ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-red-950/30 border-red-900/50 text-red-400 font-bold'
                        }`}>
                            {h.success ? <CheckCircle2 size={14} className="text-emerald-500"/> : <XCircle size={14}/>}
                            <span className="font-mono text-[10px] opacity-50">{(i+1).toString().padStart(2,'0')}</span> {translateContent(stepInfo.label, language)}
                        </div>
                    )
                })}
            </div>

            {gameState === 'failed' && (
                <div className="bg-red-950/30 border border-red-500/30 rounded p-3 text-left">
                    <div className="font-bold text-red-500 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-widest"><AlertTriangle size={14}/> FATAL SAFETY ERROR</div>
                    <p className="text-red-300/80 text-[11px] mb-3">{translateContent(failReason || '', language)}</p>
                    <button onClick={reset} className="flex items-center justify-center gap-2 w-full text-xs font-bold bg-slate-950 text-red-500 py-2 rounded hover:bg-red-950/50 border border-red-900/50 transition-colors uppercase tracking-wider">
                        <RefreshCw size={12}/> {translateContent('시뮬레이터 초기화', language)}
                    </button>
                </div>
            )}

            {gameState === 'success' && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-900/50 rounded-full border transform shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                        <CheckCircle2 size={24}/>
                    </div>
                    <div className="font-bold text-emerald-400 text-sm mb-1 uppercase tracking-widest">{translateContent('절차 완벽 수행', language)}</div>
                    <p className="text-emerald-500/70 text-[10px] mb-3">{translateContent('안전하게 고전압 차단 및 검전을 완료했습니다.', language)}</p>
                     <button onClick={reset} className="text-xs font-bold bg-slate-950 text-emerald-500 w-full py-2 rounded hover:bg-emerald-950/50 border border-emerald-900/50 transition-colors inline-flex justify-center items-center gap-2 uppercase tracking-wider">
                        <RefreshCw size={12}/> {translateContent('다시 연습하기', language)}
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
}

function SafetyMetric({ icon, label, value, note, danger }: { icon: React.ReactNode; label: string; value: string; note: string; danger?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${danger ? 'border-red-900/50 bg-red-950/20' : 'border-slate-800 bg-slate-900'}`}>
      <div className={`mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${danger ? 'text-red-400' : 'text-slate-500'}`}>{icon}{label}</div>
      <div className="font-mono text-xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[10px] text-slate-500">{note}</div>
    </div>
  );
}
