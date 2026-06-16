import React, { useState } from 'react';
import { Battery, Zap, Cpu, ShieldAlert, Power, Settings } from 'lucide-react';
import { useVehicleStore } from '../../store/vehicleStore';

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
  const [activeId, setActiveId] = useState<string | null>(defaultHighlight || null);
  
  const { packSoc, sysVoltage, motorRpm, inverterTemp, bmsFault, obcActive, msdConnected, powerMode } = useVehicleStore();

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

  return (
    <div className={`bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col gap-4 ${className}`}>
       <div className="flex justify-between items-center border-b border-slate-800 pb-2">
         <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
           Interactive EV Blueprint
         </h3>
         <div className="flex items-center gap-3">
             <span className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border ${powerMode === 'READY' ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>SYS: {powerMode}</span>
             <span className="text-[10px] text-slate-500 font-mono tracking-widest">MODEL_VIEW_V1.0</span>
         </div>
       </div>
       
       <div className="flex gap-4">
         {/* Diagram Area */}
         <div className="flex-1 bg-slate-950 rounded border border-slate-800 relative h-64 overflow-hidden flex items-center justify-center">
            {/* Minimalist EV Top-down wireframe graphic */}
            <div className="relative w-32 h-56 border-2 border-slate-800 rounded-3xl shrink-0 opacity-50 z-0">
               {/* Wheels */}
               <div className="absolute -left-2 top-8 w-1.5 h-6 bg-slate-700 rounded-sm"></div>
               <div className="absolute -right-2 top-8 w-1.5 h-6 bg-slate-700 rounded-sm"></div>
               <div className="absolute -left-2 bottom-8 w-1.5 h-6 bg-slate-700 rounded-sm"></div>
               <div className="absolute -right-2 bottom-8 w-1.5 h-6 bg-slate-700 rounded-sm"></div>
            </div>

            {/* Components overlaid */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className="relative w-32 h-56">
                  {/* Motor */}
                  <button 
                    onMouseEnter={() => setActiveId('motor')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute top-6 left-1/2 -translate-x-1/2 w-14 h-8 rounded border transition-all flex flex-col items-center justify-center ${activeId === 'motor' ? 'bg-orange-900/50 border-orange-500 text-orange-400 z-20 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                    <div className="text-[8px] font-bold mt-0.5 tracking-wider">MOTOR</div>
                    {getLiveStats('motor')}
                  </button>

                  {/* Inverter */}
                  <button 
                    onMouseEnter={() => setActiveId('inverter')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute top-16 left-1/2 -translate-x-1/2 w-16 h-8 rounded border transition-all flex items-center justify-center flex-col ${activeId === 'inverter' ? 'bg-purple-900/50 border-purple-500 text-purple-400 z-20 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                    <div className="text-[8px] font-bold tracking-wider">INVERTER</div>
                    {getLiveStats('inverter')}
                  </button>

                  {/* Battery */}
                  <button 
                    onMouseEnter={() => setActiveId('battery')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute top-24 left-1/2 -translate-x-1/2 w-24 h-20 rounded border flex flex-col items-center justify-center transition-all ${activeId === 'battery' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400 z-20 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900/50 border-slate-700 text-slate-600'} ${packSoc < 20 ? 'border-red-500/50' : ''}`}
                  >
                    <Battery size={14}/>
                    <div className="text-[8px] font-bold mt-1 tracking-wider">BATTERY</div>
                    {getLiveStats('battery')}
                  </button>

                  {/* BMS (inside battery) */}
                  <button 
                    onMouseEnter={() => setActiveId('bms')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute top-26 right-4 w-10 h-7 rounded border flex flex-col items-center justify-center transition-all ${activeId === 'bms' ? 'bg-blue-900/80 border-blue-400 text-blue-300 z-30 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-800 border-slate-600 text-slate-400'} ${bmsFault !== 'none' ? 'border-red-500 bg-red-950/80' : ''}`}
                  >
                     <Cpu size={10}/>
                     <span className="text-[6px] font-bold mt-0.5">BMS</span>
                  </button>

                  {/* MSD (inside battery area) */}
                  <button 
                    onMouseEnter={() => setActiveId('msd')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute top-36 left-4 w-8 h-6 rounded border flex flex-col items-center justify-center transition-all ${activeId === 'msd' ? 'bg-red-900/80 border-red-500 text-red-300 z-30 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-slate-800 border-slate-600 text-slate-400'} ${!msdConnected ? 'border-red-500 border-dashed animate-pulse text-red-500' : ''}`}
                  >
                     <ShieldAlert size={8}/>
                  </button>

                  {/* OBC */}
                  <button 
                    onMouseEnter={() => setActiveId('obc')} onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-8 rounded border transition-all flex flex-col items-center justify-center ${activeId === 'obc' ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 z-20 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}
                  >
                     <div className="text-[8px] font-bold tracking-wider">OBC/LDC</div>
                     {getLiveStats('obc')}
                  </button>
               </div>
            </div>
         </div>

         {/* Legend / Info Area */}
         <div className="w-64 flex flex-col gap-2 shrink-0">
            {COMPONENTS.map(comp => {
               const isActive = activeId === comp.id;
               const Icon = comp.icon;
               
               // Using a safe fallback for dynamic tailwind classes in case they are purdged
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
                  <div 
                    key={comp.id} 
                    onMouseEnter={() => setActiveId(comp.id)}
                    onMouseLeave={() => setActiveId(defaultHighlight || null)}
                    className={`p-2 rounded border transition-all cursor-pointer ${isActive ? 'bg-slate-800 border-slate-600 shadow-sm' : 'bg-slate-950/50 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700'}`}
                  >
                     <div className="flex items-center gap-2 mb-1">
                        <Icon size={12} className={colorClasses} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider flex-1 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>{comp.name}</span>
                        {isActive && getLiveStats(comp.id)}
                     </div>
                     {isActive && <div className="text-[10px] text-slate-400 leading-snug animate-fade-in pl-5">{comp.desc}</div>}
                  </div>
               )
            })}
         </div>
       </div>
    </div>
  )
}
