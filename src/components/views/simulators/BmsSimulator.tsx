import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Power, AlertTriangle, Info, Settings2 } from 'lucide-react';
import { useVehicleStore, EvCell } from '../../../store/vehicleStore';
import { translateContent, useLanguageStore } from '../../../i18n';


export function BmsSimulator() {
  const language = useLanguageStore(state => state.language);
  const { 
      cells, 
      isBalancing, 
      toggleBalancing, 
      chargeStep, 
      setFaultScenario, 
      sysVoltage,
      packSoc,
      motorRpm,
      inverterTemp,
      msdConnected,
      vehicleSpeed
  } = useVehicleStore();

  const [localFault, setLocalFault] = useState<'none' | 'cell_degradation' | 'temp_warning'>('none');
  const wheelDuration = vehicleSpeed > 0 ? `${Math.max(0.22, 2.4 - vehicleSpeed / 38)}s` : '0s';
  const roadDashDuration = `${Math.max(0.22, 2.2 - vehicleSpeed / 45)}s`;
  const roadDashStyle = {
      '--road-dash-duration': roadDashDuration,
      '--road-dash-play-state': vehicleSpeed > 0 ? 'running' : 'paused',
  } as React.CSSProperties;

  const handleScenarioChange = (s: 'none' | 'cell_degradation' | 'temp_warning') => {
      setLocalFault(s);
      setFaultScenario(s);
  }

  const startCharge = () => {
      chargeStep();
  }


  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden text-xs flex flex-col h-full relative font-sans">
      <div className="bg-slate-950 p-3 text-slate-200 flex justify-between items-center border-b border-slate-800 shrink-0">
         <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-blue-500"/>
            <h2 className="font-bold text-sm tracking-widest uppercase">BMS CELL BALANCING SIMULATOR</h2>
         </div>
         <div className="flex gap-2 font-mono">
            <span className="rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-black text-slate-700">STATUS: <span className={isBalancing ? "text-amber-700 font-black" : "text-slate-950 font-black"}>{isBalancing ? 'BALANCING' : 'IDLE'}</span></span>
            <span className="rounded border border-slate-300 bg-white px-2 py-1 text-[10px] font-black text-slate-700">SYS_V: <span className="font-black text-blue-800">{sysVoltage.toFixed(1)}V</span></span>
         </div>
      </div>

      <div className="p-3 grid grid-cols-4 gap-3 border-b border-slate-800 bg-slate-900/50 shrink-0">
         <div className="col-span-1 space-y-2 p-3 bg-white rounded border border-slate-300 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-2 border-b border-slate-300 pb-2">Scenario Select</h3>
             <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 hover:text-slate-950">
                 <input type="radio" checked={localFault==='none'} onChange={()=>handleScenarioChange('none')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>{translateContent('정상 상태', language)}</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 hover:text-slate-950">
                 <input type="radio" checked={localFault==='cell_degradation'} onChange={()=>handleScenarioChange('cell_degradation')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>{translateContent('셀 편차 발생 (열화)', language)}</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer font-bold text-red-700 hover:text-red-900">
                 <input type="radio" checked={localFault==='temp_warning'} onChange={()=>handleScenarioChange('temp_warning')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>{translateContent('고온 경고 발생', language)}</span>
             </label>
         </div>
         <div className="col-span-3 grid gap-3 rounded border border-slate-800 bg-slate-950 p-3 md:grid-cols-[minmax(250px,1fr)_300px]">
             <div className="flex flex-col justify-center items-center gap-3">
                 <div className="flex flex-wrap justify-center gap-3">
                     <button 
                        onClick={startCharge}
                        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-500/50 font-bold py-1.5 px-4 rounded text-xs transition-colors uppercase tracking-wide"
                     >
                        {translateContent('전체 충전 (+5%)', language)}
                     </button>
                     <button 
                        onClick={toggleBalancing}
                        className={`${isBalancing ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 border-amber-500/50' : 'bg-green-900/30 hover:bg-green-900/50 text-green-500 border-green-500/50'} border font-bold py-1.5 px-4 rounded text-xs transition-colors flex items-center gap-2 uppercase tracking-wide`}
                     >
                        <Power size={14}/> {translateContent(isBalancing ? '밸런싱 중지' : '수동(Passive) 밸런싱 시작', language)}
                     </button>
                 </div>
                 <p className="text-[10px] font-semibold text-slate-700 max-w-lg text-center">
                    {translateContent('패시브 밸런싱은 전압이 가장 높은 셀의 에너지를 저항을 통해 열로 소비시켜 낮은 셀과 전압을 맞춥니다. 이 과정에서 열이 발생합니다. 실제 데이터 베이스를 통해 동기화됩니다.', language)}
                 </p>
             </div>
             <div className="relative min-h-[190px] overflow-hidden rounded border border-slate-700 bg-slate-950">
                <div className="absolute inset-0 blueprint-floor" style={roadDashStyle} />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/45 to-slate-950/80" />
                <div className="absolute right-2 top-2 z-30 rounded border border-blue-500/40 bg-white/90 px-2 py-1 font-mono text-[10px] font-black text-slate-950">
                   {vehicleSpeed.toFixed(0)} km/h
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                   <div className="topdown-ev scale-[0.78]">
                      <div className="topdown-ev-texture" />
                      <div className="topdown-wheel front-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                      <div className="topdown-wheel front-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                      <div className="topdown-wheel rear-left" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                      <div className="topdown-wheel rear-right" style={{ animationDuration: wheelDuration, animationPlayState: vehicleSpeed > 0 ? 'running' : 'paused' }} />
                      <div className={`topdown-cable ${!msdConnected ? 'is-cut' : ''}`} />
                   </div>
                   <div className="absolute h-[180px] w-[112px] scale-[0.78]">
                      <div className="safety-top-module motor">MOTOR<br />{motorRpm.toFixed(0)} RPM</div>
                      <div className="safety-top-module inverter">INVERTER<br />{inverterTemp.toFixed(1)}°C</div>
                      <div className="safety-top-pack">HV BATTERY<br />{packSoc.toFixed(1)}% / {sysVoltage.toFixed(0)}V</div>
                      <div className={`safety-top-msd ${!msdConnected ? 'is-cut' : ''}`}>MSD</div>
                      <div className="safety-top-module bms is-selected">BMS<br />{isBalancing ? 'BAL' : 'IDLE'}</div>
                      <div className="safety-top-module obc">OBC/LDC<br />STBY</div>
                   </div>
                </div>
             </div>
         </div>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0 bg-slate-950">
         <div className="flex-1 min-h-[200px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cells} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} stroke="#94a3b8"/>
                    <XAxis dataKey="id" tick={{fontSize: 10, fill: '#64748b'}} axisLine={{stroke: '#334155'}} tickLine={false}/>
                    <YAxis domain={[0, 100]} hide/>
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />}/>
                    <ReferenceLine y={Math.min(...cells.map(c=>c.soc))} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Min SOC Target', fill: '#10b981', fontSize: 9 }} />
                    <Bar dataKey="soc" radius={[2,2,0,0]} isAnimationActive={false}>
                        {cells.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={
                                entry.temp >= 60 ? '#ef4444' : // Red
                                entry.balancing ? '#f59e0b' : // Orange
                                '#3b82f6' // Blue
                            } />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>

         <div className="grid grid-cols-8 gap-2 shrink-0">
            {cells.slice(0, 8).map(cell => (
                <div key={cell.id} className={`flex flex-col items-center p-2 rounded border shadow-sm ${
                    cell.temp >= 60 ? 'bg-red-50 border-red-300' :
                    cell.balancing ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-300'
                }`}>
                    <div className="font-black text-slate-900 mb-0.5 text-[10px]">{cell.id}</div>
                    <div className="text-[10px] font-mono font-bold text-slate-700">{cell.voltage.toFixed(3)}V</div>
                    <div className={`text-[10px] font-mono font-black mt-0.5 max-w-full truncate ${cell.temp >= 60 ? 'text-red-700' : cell.balancing ? 'text-amber-700' : 'text-blue-800'}`}>{cell.soc.toFixed(1)}%</div>
                    
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden flex">
                       <div className={`h-full ${cell.temp >= 60 ? 'bg-red-500' : cell.temp > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${(cell.temp/80)*100}%`}}></div>
                    </div>
                    <div className="text-[9px] font-mono font-bold text-slate-700 mt-0.5">{cell.temp.toFixed(1)}°C</div>

                    {cell.temp >= 60 && <AlertTriangle size={12} className="text-red-500 mt-1.5 animate-pulse"/>}
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EvCell;
    return (
      <div className="bg-white border border-slate-300 p-3 rounded shadow-lg text-slate-900 text-[10px] font-sans pointer-events-none tracking-wide z-50 relative">
        <p className="font-black text-xs mb-2 uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">{label} DETAILS</p>
        <div className="space-y-1.5">
           <div className="flex justify-between gap-4"><span className="font-bold text-slate-700">Voltage:</span> <span className="font-mono text-blue-800 font-black">{data.voltage.toFixed(3)}V</span></div>
           <div className="flex justify-between gap-4"><span className="font-bold text-slate-700">SOC:</span> <span className="font-mono text-blue-800 font-black">{data.soc.toFixed(1)}%</span></div>
           <div className="flex justify-between gap-4"><span className="font-bold text-slate-700">Temperature:</span> <span className={`font-mono font-black ${data.temp >= 60 ? 'text-red-700' : 'text-emerald-700'}`}>{data.temp.toFixed(1)}°C</span></div>
           <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-slate-300"><span className="font-bold text-slate-700">Status:</span> {data.balancing ? <span className="text-amber-700 font-black">BALANCING</span> : <span className="text-slate-900 font-black">IDLE</span>}</div>
        </div>
      </div>
    );
  }
  return null;
}
