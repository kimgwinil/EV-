import React from 'react';
import { EvExplorer } from '../EvExplorer';
import { useVehicleStore } from '../../../store/vehicleStore';
import { Zap, Gauge, Flame, Activity } from 'lucide-react';

export function InteractivePowertrain({ title, targetTheme, fallbackFocus }: { title: string, targetTheme?: string, fallbackFocus?: string }) {
  const { packSoc, sysVoltage, motorRpm, inverterTemp, bmsFault, powerMode, obcActive, setMotorRpm, setPackSoc, setInverterTemp, setPowerMode, setMsdConnected, msdConnected } = useVehicleStore();

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-4">
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
         <h2 className="text-sm font-bold flex items-center gap-2 mb-1 text-slate-200">
            {title}
         </h2>
         <p className="text-[10px] text-slate-500 mb-4">{targetTheme} 주제와 연동되는 인터랙티브 전동화 제어 시뮬레이터입니다.</p>
         
         <div className="grid grid-cols-[1fr,300px] gap-6">
            <div className="flex-1">
               <EvExplorer defaultHighlight={fallbackFocus} />
            </div>
            
            <div className="bg-slate-950 p-4 rounded border border-slate-800 flex flex-col gap-4 max-h-[500px] overflow-y-auto w-full">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">가상 제어 패널</h3>
               
               {/* RPM Control */}
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs text-orange-400">
                    <span className="flex items-center gap-1 font-bold"><Gauge size={14}/> 구동 모터(PMSM) RPM</span>
                    <span className="font-mono">{motorRpm.toFixed(0)}</span>
                 </div>
                 <input 
                    type="range" min="0" max="15000" step="100" 
                    value={motorRpm} 
                    onChange={e => setMotorRpm(Number(e.target.value))}
                    disabled={powerMode !== 'READY'}
                    className="w-full accent-orange-500 cursor-pointer disabled:opacity-50"
                 />
                 {powerMode !== 'READY' && <div className="text-[9px] text-slate-600 block">차량 전원(SYS)이 READY 상태여야 제어 가능합니다.</div>}
               </div>

               {/* SOC Control */}
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs text-emerald-400">
                    <span className="flex items-center gap-1 font-bold"><Activity size={14}/> SOC (충전량)</span>
                    <span className="font-mono">{packSoc.toFixed(1)}%</span>
                 </div>
                 <input 
                    type="range" min="0" max="100" step="1" 
                    value={packSoc} 
                    onChange={e => setPackSoc(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                 />
               </div>

               {/* Inverter Temp Control */}
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs text-purple-400">
                    <span className="flex items-center gap-1 font-bold"><Flame size={14}/> 인버터 온도</span>
                    <span className="font-mono">{inverterTemp.toFixed(1)}°C</span>
                 </div>
                 <input 
                    type="range" min="15" max="120" step="1" 
                    value={inverterTemp} 
                    onChange={e => setInverterTemp(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                 />
                 {inverterTemp > 85 && <div className="text-[9px] text-red-500 font-bold block animate-pulse">고온 경고! 인버터 출력 제한(Derating) 개입</div>}
               </div>
               
               {/* MSD Toggle */}
               <div className="space-y-2 pt-4 border-t border-slate-800">
                 <div className="flex justify-between items-center text-xs text-red-400">
                    <span className="flex items-center gap-1 font-bold"><Zap size={14}/> 고전압 안전 플러그 (MSD)</span>
                 </div>
                 <button 
                    onClick={() => {
                       if (powerMode !== 'OFF') {
                          alert("차량 전원을 OFF 한 후에만 고전압 플러그를 해제/체결할 수 있습니다.");
                          return;
                       }
                       setMsdConnected(!msdConnected);
                    }}
                    className={`w-full py-2 rounded text-xs font-bold border transition-colors ${msdConnected ? 'bg-red-950/50 border-red-900/50 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                 >
                     {msdConnected ? '플러그 해제 (안전 차단)' : '플러그 체결 (전원 인가)'}
                 </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
