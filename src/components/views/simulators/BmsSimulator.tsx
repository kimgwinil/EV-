import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Power, AlertTriangle, Info, Settings2 } from 'lucide-react';
import { useVehicleStore, EvCell } from '../../../store/vehicleStore';


export function BmsSimulator() {
  const { 
      cells, 
      isBalancing, 
      toggleBalancing, 
      chargeStep, 
      setFaultScenario, 
      sysVoltage 
  } = useVehicleStore();

  const [localFault, setLocalFault] = useState<'none' | 'cell_degradation' | 'temp_warning'>('none');

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
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-[10px] text-slate-400">STATUS: <span className={isBalancing ? "text-amber-500 font-bold" : "text-slate-300"}>{isBalancing ? 'BALANCING' : 'IDLE'}</span></span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-[10px] text-slate-400">SYS_V: <span className="text-blue-400 font-bold">{sysVoltage.toFixed(1)}V</span></span>
         </div>
      </div>

      <div className="p-3 grid grid-cols-4 gap-3 border-b border-slate-800 bg-slate-900/50 shrink-0">
         <div className="col-span-1 space-y-2 p-3 bg-slate-950 rounded border border-slate-800">
             <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-2 border-b border-slate-800 pb-2">Scenario Select</h3>
             <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-200">
                 <input type="radio" checked={localFault==='none'} onChange={()=>handleScenarioChange('none')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>정상 상태</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-200">
                 <input type="radio" checked={localFault==='cell_degradation'} onChange={()=>handleScenarioChange('cell_degradation')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>셀 편차 발생 (열화)</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300">
                 <input type="radio" checked={localFault==='temp_warning'} onChange={()=>handleScenarioChange('temp_warning')} className="text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-950 accent-blue-500" /> 
                 <span>고온 경고 발생</span>
             </label>
         </div>
         <div className="col-span-3 p-3 bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center gap-3">
             <div className="flex gap-3">
                 <button 
                    onClick={startCharge}
                    className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-500/50 font-bold py-1.5 px-4 rounded text-xs transition-colors uppercase tracking-wide"
                 >
                    전체 충전 (+5%)
                 </button>
                 <button 
                    onClick={toggleBalancing}
                    className={`${isBalancing ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-500 border-amber-500/50' : 'bg-green-900/30 hover:bg-green-900/50 text-green-500 border-green-500/50'} border font-bold py-1.5 px-4 rounded text-xs transition-colors flex items-center gap-2 uppercase tracking-wide`}
                 >
                    <Power size={14}/> {isBalancing ? '밸런싱 중지' : '수동(Passive) 밸런싱 시작'}
                 </button>
             </div>
             <p className="text-[10px] text-slate-500 max-w-lg text-center">
                패시브 밸런싱은 전압이 가장 높은 셀의 에너지를 저항을 통해 열로 소비시켜 낮은 셀과 전압을 맞춥니다. 이 과정에서 열이 발생합니다. 실제 데이터 베이스를 통해 동기화됩니다.
             </p>
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
                <div key={cell.id} className={`flex flex-col items-center p-2 rounded border ${
                    cell.temp >= 60 ? 'bg-red-950/20 border-red-900' :
                    cell.balancing ? 'bg-amber-950/20 border-amber-900/50' : 'bg-slate-900 border-slate-800'
                }`}>
                    <div className="font-bold text-slate-300 mb-0.5 text-[10px]">{cell.id}</div>
                    <div className="text-[10px] font-mono text-slate-500">{cell.voltage.toFixed(3)}V</div>
                    <div className={`text-[10px] font-mono font-bold mt-0.5 max-w-full truncate ${cell.temp >= 60 ? 'text-red-400' : cell.balancing ? 'text-amber-400' : 'text-blue-400'}`}>{cell.soc.toFixed(1)}%</div>
                    
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden flex">
                       <div className={`h-full ${cell.temp >= 60 ? 'bg-red-500' : cell.temp > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${(cell.temp/80)*100}%`}}></div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-0.5">{cell.temp.toFixed(1)}°C</div>

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
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-lg text-slate-300 text-[10px] font-sans pointer-events-none tracking-wide z-50 relative">
        <p className="font-bold text-xs mb-2 uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">{label} DETAILS</p>
        <div className="space-y-1.5">
           <div className="flex justify-between gap-4"><span className="text-slate-500">Voltage:</span> <span className="font-mono text-blue-400 font-bold">{data.voltage.toFixed(3)}V</span></div>
           <div className="flex justify-between gap-4"><span className="text-slate-500">SOC:</span> <span className="font-mono text-blue-400 font-bold">{data.soc.toFixed(1)}%</span></div>
           <div className="flex justify-between gap-4"><span className="text-slate-500">Temperature:</span> <span className={`font-mono font-bold ${data.temp >= 60 ? 'text-red-400' : 'text-emerald-400'}`}>{data.temp.toFixed(1)}°C</span></div>
           <div className="flex justify-between gap-4 mt-1 pt-1 border-t border-slate-800"><span className="text-slate-500">Status:</span> {data.balancing ? <span className="text-amber-400 font-bold">BALANCING</span> : <span className="text-slate-500">IDLE</span>}</div>
        </div>
      </div>
    );
  }
  return null;
}
