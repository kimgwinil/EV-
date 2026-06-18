import React, { useState } from 'react';
import { Battery, Zap, Cpu, ShieldAlert, Power, Settings } from 'lucide-react';
import { useVehicleStore } from '../../store/vehicleStore';
import { t, translateContent, useLanguageStore } from '../../i18n';

const COMPONENTS = [
  { id: 'battery', name: '고전압 배터리 팩', icon: Battery, desc: '차량 하부 전체에 위치하며 300V~800V의 고전압을 저장하는 주요 에너지원.', color: 'emerald' },
  { id: 'bms', name: 'BMS', icon: Cpu, desc: '배터리 상태(SOC/SOH/온도)를 모니터링하고 셀 밸런싱을 수행하여 안전을 확보.', color: 'blue' },
  { id: 'msd', name: '서비스 플러그 (MSD)', icon: ShieldAlert, desc: '고전압 시스템의 물리적 차단 장치. 정비 시 가장 먼저 분리해야 함.', color: 'red' },
  { id: 'motor', name: '구동 모터 / 감속기', icon: Settings, desc: '전기에너지를 운동에너지로 변환하여 휠에 동력을 전달.', color: 'orange' },
  { id: 'inverter', name: '인버터 (EPCU)', icon: Zap, desc: '배터리의 DC 전압을 모터 구동을 위한 3상 AC 전압으로 변환 및 토크 제어.', color: 'purple' },
  { id: 'obc', name: 'OBC / LDC', icon: Power, desc: '완속 충전 시 외부 AC를 DC로 변환(OBC), 고전압을 12V로 강하(LDC).', color: 'cyan' },
];

interface Props {
  className?: string;
  defaultHighlight?: string;
}

export function EvExplorer({ className = '', defaultHighlight }: Props) {
  const [activeId, setActiveId] = useState<string | null>(defaultHighlight || 'battery');
  const language = useLanguageStore(state => state.language);
  
  const { packSoc, sysVoltage, motorRpm, inverterTemp, bmsFault, obcActive, msdConnected, powerMode, vehicleSpeed } = useVehicleStore();
  const wheelDuration = vehicleSpeed > 0 ? `${Math.max(0.2, 2.6 - vehicleSpeed / 36)}s` : '0s';
  const activeComponent = COMPONENTS.find(comp => comp.id === activeId) || COMPONENTS[0];

  const getLiveStats = (id: string, isBlock: boolean = false) => {
     switch(id) {
         case 'battery': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} text-emerald-400 scale-75 whitespace-nowrap`}>{packSoc.toFixed(1)}% / {sysVoltage.toFixed(0)}V</div>;
         case 'motor': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} text-orange-400 scale-75 whitespace-nowrap`}>{motorRpm.toFixed(0)} RPM</div>;
         case 'bms': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} ${bmsFault !== 'none' ? 'text-red-400 animate-pulse' : 'text-blue-400'} scale-75 whitespace-nowrap`}>{bmsFault === 'none' ? 'NO FAULT' : bmsFault.toUpperCase()}</div>;
         case 'inverter': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} text-purple-400 scale-75 whitespace-nowrap`}>{inverterTemp.toFixed(1)}°C</div>;
         case 'msd': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} ${!msdConnected ? 'text-red-500 font-bold' : 'text-slate-400'} scale-75 whitespace-nowrap`}>{msdConnected ? 'CONN' : 'CUT'}</div>;
         case 'obc': return <div className={`font-mono ${isBlock ? 'mt-1' : ''} text-cyan-400 scale-75 whitespace-nowrap`}>{obcActive ? 'CHR' : 'STBY'}</div>;
     }
     return null;
  }

  const getLiveStatText = (id: string) => {
     switch(id) {
         case 'battery': return `${packSoc.toFixed(1)}% / ${sysVoltage.toFixed(0)}V`;
         case 'motor': return `${motorRpm.toFixed(0)} RPM`;
         case 'bms': return bmsFault === 'none' ? 'NO FAULT' : bmsFault.toUpperCase();
         case 'inverter': return `${inverterTemp.toFixed(1)}°C`;
         case 'msd': return msdConnected ? 'CONN' : 'CUT';
         case 'obc': return obcActive ? 'CHR' : 'STBY';
     }
     return '';
  }

  const getToneClasses = (color: string) => {
     switch(color) {
         case 'emerald': return 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200';
         case 'blue': return 'border-blue-500/40 bg-blue-950/30 text-blue-200';
         case 'red': return 'border-red-500/40 bg-red-950/30 text-red-200';
         case 'orange': return 'border-orange-500/40 bg-orange-950/30 text-orange-200';
         case 'purple': return 'border-purple-500/40 bg-purple-950/30 text-purple-200';
         case 'cyan': return 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200';
         default: return 'border-slate-600 bg-slate-900 text-slate-200';
     }
  }

  return (
    <div className={`bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-4 overflow-x-auto xl:overflow-visible ${className}`}>
       <div className="flex justify-between items-center border-b border-slate-800 pb-2">
         <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
           Interactive EV Blueprint
         </h3>
         <div className="flex items-center gap-3">
             <span className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border ${powerMode === 'READY' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>SYS: {powerMode}</span>
             <span className="text-[10px] text-slate-500 font-mono tracking-widest">MODEL_VIEW_V1.0</span>
         </div>
       </div>
       
       <div
         className="grid gap-4"
         style={{
           minWidth: '760px',
           gridTemplateColumns: 'minmax(440px, 1fr) 300px'
         }}
       >
         {/* Diagram Area */}
         <div className="flex-1 bg-slate-950 rounded border border-slate-800 relative h-[360px] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 blueprint-floor" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/65 to-slate-950" />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/70" />
            <div className={`ev-hover-info-card absolute bottom-3 left-1/2 z-40 w-[340px] -translate-x-1/2 rounded-lg border p-3 shadow-[0_18px_38px_rgba(0,0,0,0.42)] backdrop-blur transition-all duration-200 ${getToneClasses(activeComponent.color)}`}>
               <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-black uppercase tracking-widest">{translateContent(activeComponent.name, language)}</div>
                  <div className="rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] font-bold">{getLiveStatText(activeComponent.id)}</div>
               </div>
               <div className="mt-1 text-[10px] leading-snug text-slate-300">{translateContent(activeComponent.desc, language)}</div>
            </div>

            <div className="absolute inset-x-0 top-5 z-10 flex justify-center">
               <div className="topdown-ev">
                  <div className="topdown-ev-texture" />
                  <div className="topdown-wheel front-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                  <div className="topdown-wheel front-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                  <div className="topdown-wheel rear-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                  <div className="topdown-wheel rear-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                  <div className={`topdown-cable ${!msdConnected ? 'is-cut' : ''}`} />
               </div>
            </div>

            {/* Components overlaid */}
            <div className="absolute inset-x-0 top-5 z-20 flex justify-center">
               <div className="relative h-[238px] w-[148px]">
                  {/* Motor */}
                  <button 
                    onClick={() => setActiveId('motor')} onMouseEnter={() => setActiveId('motor')}
                    className={`absolute left-1/2 top-8 -translate-x-1/2 w-16 h-9 rounded border transition-all flex flex-col items-center justify-center ${activeId === 'motor' ? 'bg-orange-900/60 border-orange-500 text-orange-300 z-20 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                    <div className="text-[8px] font-bold mt-0.5 tracking-wider">MOTOR</div>
                    {getLiveStats('motor')}
                  </button>

                  {/* Inverter */}
                  <button 
                    onClick={() => setActiveId('inverter')} onMouseEnter={() => setActiveId('inverter')}
                    className={`absolute left-1/2 top-[4.15rem] -translate-x-1/2 w-[74px] h-9 rounded border transition-all flex items-center justify-center flex-col ${activeId === 'inverter' ? 'bg-purple-900/60 border-purple-500 text-purple-300 z-20 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                    <div className="text-[8px] font-bold tracking-wider">INVERTER</div>
                    {getLiveStats('inverter')}
                  </button>

                  {/* Battery */}
                  <button 
                    onClick={() => setActiveId('battery')} onMouseEnter={() => setActiveId('battery')}
                    className={`absolute left-1/2 top-[6.25rem] -translate-x-1/2 w-[94px] h-[76px] rounded border flex flex-col items-center justify-center transition-all ${activeId === 'battery' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300 z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900/70 border-slate-700 text-slate-500'} ${packSoc < 20 ? 'border-red-500/50' : ''}`}
                  >
                    <Battery size={14}/>
                    <div className="text-[8px] font-bold mt-1 tracking-wider">BATTERY</div>
                    {getLiveStats('battery')}
                  </button>

                  {/* BMS (inside battery) */}
                  <button 
                    onClick={() => setActiveId('bms')} onMouseEnter={() => setActiveId('bms')}
                    className={`absolute top-[7.7rem] right-7 w-9 h-7 rounded border flex flex-col items-center justify-center transition-all ${activeId === 'bms' ? 'bg-blue-900/80 border-blue-400 text-blue-300 z-30 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-800 border-slate-600 text-slate-400'} ${bmsFault !== 'none' ? 'border-red-500 bg-red-950/80' : ''}`}
                  >
                     <Cpu size={10}/>
                     <span className="text-[6px] font-bold mt-0.5">BMS</span>
                  </button>

                  {/* MSD (inside battery area) */}
                  <button 
                    onClick={() => setActiveId('msd')} onMouseEnter={() => setActiveId('msd')}
                    className={`absolute top-[8.35rem] left-6 w-9 h-7 rounded border flex flex-col items-center justify-center transition-all ${activeId === 'msd' ? 'bg-red-900/80 border-red-500 text-red-300 z-30 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-slate-800 border-slate-600 text-slate-400'} ${!msdConnected ? 'border-red-500 border-dashed animate-pulse text-red-500' : ''}`}
                  >
                     <ShieldAlert size={8}/>
                  </button>

                  {/* OBC */}
                  <button 
                    onClick={() => setActiveId('obc')} onMouseEnter={() => setActiveId('obc')}
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-9 rounded border transition-all flex flex-col items-center justify-center ${activeId === 'obc' ? 'bg-cyan-900/60 border-cyan-500 text-cyan-300 z-20 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                     <div className="text-[8px] font-bold tracking-wider">OBC/LDC</div>
                     {getLiveStats('obc')}
                  </button>
               </div>
            </div>
         </div>
         
         {/* Legend / Info Area */}
         <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
            <h3 className="mb-3 border-b border-slate-800 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t(language, 'partInfo')}</h3>
            <div className="flex flex-col gap-2">
            {COMPONENTS.map(comp => {
               const isActive = activeId === comp.id;
               const Icon = comp.icon;
               
               let colorClasses = '';
               switch(comp.color) {
                   case 'emerald': colorClasses = 'text-emerald-500'; break;
                   case 'blue': colorClasses = 'text-blue-500'; break;
                   case 'red': colorClasses = 'text-red-500'; break;
                   case 'orange': colorClasses = 'text-orange-500'; break;
                   case 'purple': colorClasses = 'text-purple-500'; break;
                   case 'cyan': colorClasses = 'text-cyan-500'; break;
                   default: colorClasses = 'text-slate-500';
               }

               return (
                  <button
                    key={comp.id} 
                    onClick={() => setActiveId(comp.id)}
                    onMouseEnter={() => setActiveId(comp.id)}
                    title={translateContent(comp.desc, language)}
                    className={`min-h-[36px] p-2.5 rounded border transition-all cursor-pointer text-left ${isActive ? 'bg-slate-800 border-slate-600 shadow-sm' : 'bg-slate-950/50 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700'}`}
                  >
                     <div className="flex items-center gap-2">
                        <Icon size={12} className={colorClasses} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider flex-1 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>{translateContent(comp.name, language)}</span>
                        {isActive && getLiveStats(comp.id)}
                     </div>
                     {isActive && <div className="mt-1 text-[10px] leading-snug text-slate-400">{translateContent(comp.desc, language)}</div>}
                  </button>
               )
            })}
            </div>
            <div className="mt-3 rounded border border-slate-800 bg-slate-950 p-2">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{t(language, 'currentSelection')}</div>
              <div className="mt-1 text-xs font-bold text-slate-200">{translateContent(activeComponent.name, language)}</div>
              <div className="mt-1 text-[10px] leading-snug text-slate-500">{translateContent(activeComponent.desc, language)}</div>
            </div>
         </div>
       </div>
    </div>
  )
}
