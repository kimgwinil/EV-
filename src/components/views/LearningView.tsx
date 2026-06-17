import React, { useEffect, useState } from 'react';
import { Session } from '../../types';
import { TheoryView } from './TheoryView';
import { PracticeView } from './PracticeView';
import { BmsSimulator } from './simulators/BmsSimulator';
import { SafetyProcedureSimulator } from './simulators/SafetySimulator';
import { InteractivePowertrain } from './simulators/InteractivePowertrain';
import { EvExplorer } from './EvExplorer';
import { curriculumData } from '../../data/curriculumData';
import { useVehicleStore } from '../../store/vehicleStore';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Gauge, MonitorPlay, Power, Wrench, Zap } from 'lucide-react';
import { t, useLanguageStore } from '../../i18n';

export function LearningView({ session }: { session: Session }) {
  const defaultTab = session.type === 'simulator' ? 'simulator' : session.type === 'practice' ? 'practice' : 'theory';
  const [activeTab, setActiveTab] = useState<'theory' | 'simulator' | 'practice'>(defaultTab);
  const weekInfo = curriculumData.weeks.find(w => w.sessions.some(s => s.id === session.id));
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    setActiveTab(session.type === 'simulator' ? 'simulator' : session.type === 'practice' ? 'practice' : 'theory');
  }, [session.id, session.type]);

  return (
    <div className="flex-1 flex flex-col pt-2 h-full">
      <div className="mx-8 mb-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <FlowStep active={session.type === 'theory' || session.type === 'learning'} icon={<BookOpen size={13} />} label={t(language, 'flowTheory')} />
          <ArrowRight size={12} className="text-slate-600" />
          <FlowStep active={session.type === 'simulator'} icon={<MonitorPlay size={13} />} label={t(language, 'flowSimulator')} />
          <ArrowRight size={12} className="text-slate-600" />
          <FlowStep active={session.type === 'practice'} icon={<Wrench size={13} />} label={t(language, 'flowPractice')} />
          <ArrowRight size={12} className="text-slate-600" />
          <FlowStep active={session.type === 'evaluation'} icon={<ClipboardCheck size={13} />} label={t(language, 'flowEvaluation')} />
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          {t(language, 'learningFlowDesc')}
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center justify-center gap-4 border-b border-slate-800 pb-2 mb-4 px-8">
         <button 
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'theory' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><BookOpen size={14}/> {t(language, 'theory')}</button>
         <button 
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'simulator' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><MonitorPlay size={14}/> {t(language, 'simulator')}</button>
         <button 
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-t transition-colors ${activeTab === 'practice' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
         ><Wrench size={14}/> {t(language, 'practice')}</button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar">
         {activeTab === 'theory' && <TheoryView session={session} />}
         
         {activeTab === 'simulator' && (
            <div className="max-w-7xl mx-auto w-full animate-fade-in pt-4">
              <SimulatorVehicleControls />
              {!['interactive_powertrain', 'safety_procedure'].includes(session.simulatorId || '') && (
                <EvExplorer className="mb-4" />
              )}
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

function SimulatorVehicleControls() {
  const language = useLanguageStore(state => state.language);
  const {
    powerMode,
    msdConnected,
    vehicleSpeed,
    throttle,
    regenLevel,
    driveMode,
    setPowerMode,
    setVehicleSpeed,
    setThrottle,
    setRegenLevel,
    setDriveMode
  } = useVehicleStore();

  const readyDisabled = !msdConnected;

  return (
    <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
            <Gauge size={14} className="text-cyan-400" /> {t(language, 'commonVehicleController')}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{t(language, 'commonVehicleControllerDesc')}</p>
        </div>
        <div className="flex gap-2">
          {(['eco', 'normal', 'sport'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setDriveMode(mode)}
              className={`rounded border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                driveMode === mode ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-950 text-slate-500'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px,1fr,1fr,1fr]">
        <div className="flex items-center gap-2">
          <button onClick={() => setPowerMode('OFF')} className={`rounded border px-3 py-2 text-[10px] font-bold ${powerMode === 'OFF' ? 'border-slate-500 bg-slate-800 text-white' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            OFF
          </button>
          <button onClick={() => setPowerMode('ACC')} disabled={readyDisabled} className={`rounded border px-3 py-2 text-[10px] font-bold disabled:opacity-40 ${powerMode === 'ACC' ? 'border-yellow-500/50 bg-yellow-950/40 text-yellow-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            ACC
          </button>
          <button onClick={() => setPowerMode('READY')} disabled={readyDisabled} className={`inline-flex items-center gap-1 rounded border px-3 py-2 text-[10px] font-bold disabled:opacity-40 ${powerMode === 'READY' ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-500'}`}>
            <Power size={11} /> READY
          </button>
        </div>

        <MiniSlider icon={<Gauge size={13} />} label={t(language, 'vehicleSpeed')} value={vehicleSpeed} unit="km/h" max={180} disabled={powerMode !== 'READY' || !msdConnected} onChange={setVehicleSpeed} />
        <MiniSlider icon={<Zap size={13} />} label={t(language, 'throttle')} value={throttle} unit="%" max={100} disabled={powerMode !== 'READY' || !msdConnected} onChange={setThrottle} />
        <MiniSlider icon={<Power size={13} />} label={t(language, 'regen')} value={regenLevel} unit={language === 'ko' ? '단계' : ''} max={3} step={1} disabled={powerMode !== 'READY' || !msdConnected} onChange={setRegenLevel} />
      </div>
    </div>
  );
}

function MiniSlider({ icon, label, value, unit, max, step = 1, disabled, onChange }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 font-bold text-slate-400">{icon}{label}</span>
        <span className="font-mono text-slate-300">{value.toFixed(0)} {unit}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={event => onChange(Number(event.target.value))}
        className="w-full accent-cyan-500 disabled:opacity-40"
      />
    </div>
  );
}

function FlowStep({ active, icon, label }: { active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 ${
      active
        ? 'border-blue-500/50 bg-blue-950/40 text-blue-300'
        : 'border-slate-800 bg-slate-950 text-slate-500'
    }`}>
      {active ? <CheckCircle2 size={13} /> : icon}
      <span>{label}</span>
    </div>
  );
}
