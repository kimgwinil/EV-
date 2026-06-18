import React, { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useVehicleStore } from '../../../store/vehicleStore';
import { Activity, Battery, Flame, Gauge, RotateCcw, Route, Thermometer, Zap } from 'lucide-react';
import { Language, t, translateContent, translateTheme, useLanguageStore } from '../../../i18n';

type TelemetryPoint = {
  t: string;
  speed: number;
  power: number;
  current: number;
  motorTemp: number;
  inverterTemp: number;
};

const POWERTRAIN_PARTS = [
  { id: 'motor', name: '구동 모터', desc: '전기에너지를 회전력으로 바꾸는 구동 부품입니다. 속도와 가속 페달이 증가하면 RPM과 토크 요구가 함께 올라갑니다.' },
  { id: 'inverter', name: '인버터', desc: '배터리 DC 전력을 모터용 3상 AC로 변환합니다. 온도가 높아지면 보호 로직이 출력 제한을 걸 수 있습니다.' },
  { id: 'battery', name: '고전압 배터리', desc: '주행 에너지를 공급하는 하부 팩입니다. SOC와 팩 전압은 출력 가능 범위와 안전 판단의 기본값입니다.' },
  { id: 'msd', name: '서비스 플러그', desc: '정비 시 고전압 회로를 물리적으로 차단하는 장치입니다. 주행 제어 전에는 체결 상태를 확인해야 합니다.' },
  { id: 'bms', name: 'BMS', desc: 'SOC, 전류, 전압, 온도를 감시해 릴레이 투입과 고장 경고를 제어합니다.' },
  { id: 'obc', name: 'OBC/LDC', desc: '충전과 저전압 전원 공급 계통입니다. 주행 중에는 대기 상태로 표시하고 전원 상태와 연동합니다.' }
];

export function InteractivePowertrain({ title, targetTheme }: { title: string; targetTheme?: string; fallbackFocus?: string }) {
  const language = useLanguageStore(state => state.language);
  const {
    packSoc,
    sysVoltage,
    sysCurrent,
    vehicleSpeed,
    throttle,
    regenLevel,
    driveMode,
    torqueNm,
    powerKw,
    efficiencyKwhPer100,
    motorRpm,
    motorTemp,
    inverterTemp,
    bmsFault,
    powerMode,
    msdConnected,
    setPowerMode,
    setVehicleSpeed,
    setThrottle,
    setRegenLevel,
    setDriveMode,
    setInverterTemp,
    setMsdConnected
  } = useVehicleStore();

  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [selectedPartId, setSelectedPartId] = useState('motor');

  useEffect(() => {
    const id = window.setInterval(() => {
      setHistory(prev => {
        const next = [
          ...prev,
          {
            t: new Date().toLocaleTimeString('ko-KR', { minute: '2-digit', second: '2-digit' }),
            speed: Math.round(vehicleSpeed),
            power: Number(powerKw.toFixed(1)),
            current: Number(sysCurrent.toFixed(1)),
            motorTemp: Number(motorTemp.toFixed(1)),
            inverterTemp: Number(inverterTemp.toFixed(1))
          }
        ];
        return next.slice(-28);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [vehicleSpeed, powerKw, sysCurrent, motorTemp, inverterTemp]);

  const riskState = useMemo(() => {
    if (!msdConnected) return { label: '고전압 차단', color: 'text-red-400', detail: 'MSD가 분리되어 주행 불가' };
    if (powerMode !== 'READY') return { label: '대기', color: 'text-slate-400', detail: 'READY 전환 후 속도 제어 가능' };
    if (inverterTemp > 85 || motorTemp > 95) return { label: '출력 제한', color: 'text-red-400', detail: '열 보호 로직 개입' };
    if (bmsFault !== 'none') return { label: 'BMS 경고', color: 'text-amber-400', detail: bmsFault };
    return { label: '정상 주행', color: 'text-emerald-400', detail: `${driveMode.toUpperCase()} 모드` };
  }, [bmsFault, driveMode, inverterTemp, motorTemp, msdConnected, powerMode]);

  const wheelDuration = vehicleSpeed > 0 ? `${Math.max(0.18, 2.6 - vehicleSpeed / 34)}s` : '0s';
  const selectedPart = POWERTRAIN_PARTS.find(part => part.id === selectedPartId) || POWERTRAIN_PARTS[0];

  const handleReady = () => {
    if (msdConnected) setPowerMode('READY');
  };
  const selectedPartValue = (() => {
    switch (selectedPartId) {
      case 'motor': return `${motorRpm.toFixed(0)} RPM`;
      case 'inverter': return `${inverterTemp.toFixed(1)}°C`;
      case 'battery': return `${packSoc.toFixed(1)}% / ${sysVoltage.toFixed(0)}V`;
      case 'msd': return msdConnected ? 'CONN' : 'CUT';
      case 'bms': return bmsFault === 'none' ? 'NORMAL' : bmsFault.toUpperCase();
      case 'obc': return powerMode !== 'OFF' ? 'STBY' : 'OFF';
      default: return '';
    }
  })();

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-4">
      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-1 border-b border-slate-800 bg-slate-950 p-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">{title}</h2>
            <p className="mt-1 text-[11px] text-slate-500">{targetTheme ? translateTheme(targetTheme, language) : ''} {translateContent('이론을 속도, 부하, 온도, 회생제동 변화로 검증하는 주행 시뮬레이터입니다.', language)}</p>
          </div>
          <div className={`text-xs font-bold uppercase tracking-widest ${riskState.color}`}>
            {translateContent(riskState.label, language)} <span className="ml-2 text-[10px] font-normal text-slate-500">{translateContent(riskState.detail, language)}</span>
          </div>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[1.35fr,0.9fr]">
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div
                className="grid gap-4"
                style={{
                  minWidth: '760px',
                  gridTemplateColumns: 'minmax(440px, 1fr) 300px'
                }}
              >
                <div className="relative min-h-[440px] overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                  <div className="absolute inset-0 blueprint-floor" />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
                  <div className="absolute left-0 right-0 bottom-0 h-24 bg-slate-900/90" />

                  <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-between p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Powertrain Scenario</div>
                        <h3 className="mt-1 text-base font-bold text-white">{translateContent('구동계 주행 상태 가상실습', language)}</h3>
                      </div>
                      <div className={`rounded border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${riskState.color} border-slate-700 bg-slate-900/70`}>
                        {translateContent(riskState.label, language)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <MetricCard icon={<Gauge size={15} />} label={translateContent('속도', language)} value={`${vehicleSpeed.toFixed(0)} km/h`} tone="text-cyan-300" />
                      <MetricCard icon={<Zap size={15} />} label={translateContent('출력', language)} value={`${powerKw.toFixed(1)} kW`} tone="text-amber-300" />
                      <MetricCard icon={<RotateCcw size={15} />} label={translateContent('모터', language)} value={`${motorRpm.toFixed(0)} rpm`} tone="text-orange-300" />
                      <MetricCard icon={<Battery size={15} />} label="SOC" value={`${packSoc.toFixed(1)}%`} tone="text-emerald-300" />
                    </div>

                    <div className="mx-auto flex w-full max-w-3xl justify-center">
                      <div className="relative pb-24">
                        <div className="ev-hover-info-card absolute left-1/2 top-[248px] z-40 w-[310px] -translate-x-1/2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 p-2.5 text-cyan-100 shadow-[0_18px_38px_rgba(0,0,0,0.42)] backdrop-blur">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[10px] font-black uppercase tracking-widest">{translateContent(selectedPart.name, language)}</div>
                            <div className="rounded bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] font-bold">{selectedPartValue}</div>
                          </div>
                          <div className="mt-1 text-[9px] leading-snug text-slate-300">{translateContent(selectedPart.desc, language)}</div>
                        </div>
                        <RealisticEvCar
                          wheelDuration={wheelDuration}
                          speed={vehicleSpeed}
                          motorRpm={motorRpm}
                          inverterTemp={inverterTemp}
                          packSoc={packSoc}
                          sysVoltage={sysVoltage}
                          msdConnected={msdConnected}
                          obcActive={powerMode !== 'OFF'}
                          selectedPartId={selectedPartId}
                          onSelectPart={setSelectedPartId}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <h3 className="mb-3 border-b border-slate-800 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{t(language, 'partInfo')}</h3>
                  <div className="space-y-2">
                    {POWERTRAIN_PARTS.map(part => {
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
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
              <InstrumentCluster
                speed={vehicleSpeed}
                throttle={throttle}
                regenLevel={regenLevel}
                powerKw={powerKw}
                torqueNm={torqueNm}
                efficiency={efficiencyKwhPer100}
                riskLabel={riskState.label}
                riskColor={riskState.color}
                language={language}
              />

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{translateContent('실시간 주행 그래프', language)}</h3>
                  <span className="text-[10px] font-mono text-slate-600">{translateContent('최근 28초', language)}</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="speedFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
                      <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 10 }} minTickGap={18} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                      <Area type="monotone" dataKey="speed" name={`${translateContent('속도', language)} km/h`} stroke="#22d3ee" fill="url(#speedFill)" strokeWidth={2} />
                      <Area type="monotone" dataKey="power" name={`${translateContent('출력', language)} kW`} stroke="#f59e0b" fill="url(#powerFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-4 border-b border-slate-800 pb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{translateContent('주행 제어 패널', language)}</h3>

            <div className="grid grid-cols-3 gap-2">
              {(['eco', 'normal', 'sport'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setDriveMode(mode)}
                  className={`rounded border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    driveMode === mode ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={() => setPowerMode('OFF')} className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">OFF</button>
              <button onClick={() => setPowerMode('ACC')} disabled={!msdConnected} className="rounded border border-yellow-900/60 bg-yellow-950/30 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-yellow-400 disabled:opacity-40">ACC</button>
              <button onClick={handleReady} disabled={!msdConnected} className="rounded border border-emerald-700/70 bg-emerald-950/40 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400 disabled:opacity-40">READY</button>
            </div>

            <ControlSlider
              label={translateContent('가속 페달', language)}
              value={throttle}
              unit="%"
              min={0}
              max={100}
              tone="accent-cyan-500"
              disabled={powerMode !== 'READY' || !msdConnected}
              onChange={setThrottle}
            />

            <ControlSlider
              label={translateContent('차량 속도 직접 설정', language)}
              value={vehicleSpeed}
              unit="km/h"
              min={0}
              max={180}
              tone="accent-orange-500"
              disabled={powerMode !== 'READY' || !msdConnected}
              onChange={setVehicleSpeed}
            />

            <ControlSlider
              label={translateContent('회생제동 단계', language)}
              value={regenLevel}
              unit={translateContent('단계', language)}
              min={0}
              max={3}
              step={1}
              tone="accent-emerald-500"
              disabled={powerMode !== 'READY' || !msdConnected}
              onChange={setRegenLevel}
            />

            <ControlSlider
              label={translateContent('인버터 온도 조건', language)}
              value={inverterTemp}
              unit="°C"
              min={20}
              max={120}
              tone="accent-purple-500"
              onChange={setInverterTemp}
            />

            <div className="mt-5 rounded border border-slate-800 bg-slate-900 p-3">
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{translateContent('현재 상태 해석', language)}</h4>
              <ul className="space-y-2 text-[11px] leading-relaxed text-slate-400">
                <li>{translateContent('속도를 올리면 모터 RPM, 출력, 시스템 전류, 인버터/모터 온도가 함께 상승합니다.', language)}</li>
                <li>{translateContent('회생제동 단계가 높고 가속 페달이 낮으면 감속이 빨라지고 전비가 개선됩니다.', language)}</li>
                <li>{translateContent('인버터 온도가 85°C를 넘으면 출력 제한 경고가 표시됩니다.', language)}</li>
              </ul>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatusTile icon={<Thermometer size={14} />} label={translateContent('모터 온도', language)} value={`${motorTemp.toFixed(1)}°C`} />
              <StatusTile icon={<Flame size={14} />} label={translateContent('인버터 온도', language)} value={`${inverterTemp.toFixed(1)}°C`} />
              <StatusTile icon={<Activity size={14} />} label={translateContent('시스템 전류', language)} value={`${sysCurrent.toFixed(1)} A`} />
              <StatusTile icon={<Route size={14} />} label={translateContent('전비', language)} value={efficiencyKwhPer100 ? `${efficiencyKwhPer100.toFixed(1)} kWh/100km` : translateContent('대기', language)} />
            </div>

            <button
              onClick={() => {
                if (powerMode !== 'OFF') {
                  alert(translateContent('차량 전원을 OFF 한 후에만 고전압 플러그를 해제/체결할 수 있습니다.', language));
                  return;
                }
                setMsdConnected(!msdConnected);
              }}
              className={`mt-4 w-full rounded border py-2 text-xs font-bold transition-colors ${
                msdConnected ? 'border-red-900/60 bg-red-950/40 text-red-400' : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              {translateContent(msdConnected ? 'MSD 플러그 해제' : 'MSD 플러그 체결', language)}
            </button>

            <div className="mt-3 text-[10px] text-slate-600">{translateContent('팩 전압', language)} {sysVoltage.toFixed(1)}V · BMS {bmsFault.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RealisticEvCar({
  wheelDuration,
  speed,
  motorRpm,
  inverterTemp,
  packSoc,
  sysVoltage,
  msdConnected,
  obcActive,
  selectedPartId,
  onSelectPart
}: {
  wheelDuration: string;
  speed: number;
  motorRpm: number;
  inverterTemp: number;
  packSoc: number;
  sysVoltage: number;
  msdConnected: boolean;
  obcActive: boolean;
  selectedPartId: string;
  onSelectPart: (id: string) => void;
}) {
  return (
    <div className="relative flex h-56 w-[240px] items-center justify-center">
      <div className="absolute inset-x-8 bottom-4 h-10 rounded-full bg-cyan-500/10 blur-xl" />
      <div className="topdown-ev powertrain-topdown-ev">
        <div className="topdown-ev-texture" />
        <div className="topdown-wheel front-left" style={{ animationDuration: wheelDuration, animationPlayState: speed > 0 ? 'running' : 'paused' }} />
        <div className="topdown-wheel front-right" style={{ animationDuration: wheelDuration, animationPlayState: speed > 0 ? 'running' : 'paused' }} />
        <div className="topdown-wheel rear-left" style={{ animationDuration: wheelDuration, animationPlayState: speed > 0 ? 'running' : 'paused' }} />
        <div className="topdown-wheel rear-right" style={{ animationDuration: wheelDuration, animationPlayState: speed > 0 ? 'running' : 'paused' }} />
        <div className={`topdown-cable ${!msdConnected ? 'is-cut' : ''}`} />
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="relative h-[238px] w-[148px] scale-95">
          <button onMouseEnter={() => onSelectPart('motor')} onClick={() => onSelectPart('motor')} className={`safety-top-module motor ${selectedPartId === 'motor' ? 'is-selected' : ''}`}>MOTOR<br />{motorRpm.toFixed(0)} RPM</button>
          <button onMouseEnter={() => onSelectPart('inverter')} onClick={() => onSelectPart('inverter')} className={`safety-top-module inverter ${selectedPartId === 'inverter' ? 'is-selected' : ''}`}>INVERTER<br />{inverterTemp.toFixed(1)}°C</button>
          <button onMouseEnter={() => onSelectPart('battery')} onClick={() => onSelectPart('battery')} className={`safety-top-pack ${selectedPartId === 'battery' ? 'is-selected' : ''}`}>HV BATTERY<br />{packSoc.toFixed(1)}% / {sysVoltage.toFixed(0)}V</button>
          <button onMouseEnter={() => onSelectPart('msd')} onClick={() => onSelectPart('msd')} className={`safety-top-msd ${!msdConnected ? 'is-cut' : ''} ${selectedPartId === 'msd' ? 'is-selected' : ''}`}>MSD</button>
          <button onMouseEnter={() => onSelectPart('bms')} onClick={() => onSelectPart('bms')} className={`safety-top-bms ${selectedPartId === 'bms' ? 'is-selected' : ''}`}>BMS</button>
          <button onMouseEnter={() => onSelectPart('obc')} onClick={() => onSelectPart('obc')} className={`safety-top-module obc ${!obcActive ? 'is-off' : ''} ${selectedPartId === 'obc' ? 'is-selected' : ''}`}>OBC/LDC<br />{obcActive ? 'STBY' : 'OFF'}</button>
        </div>
      </div>
    </div>
  );
}

function InstrumentCluster({ speed, throttle, regenLevel, powerKw, torqueNm, efficiency, riskLabel, riskColor, language }: {
  speed: number;
  throttle: number;
  regenLevel: number;
  powerKw: number;
  torqueNm: number;
  efficiency: number;
  riskLabel: string;
  riskColor: string;
  language: Language;
}) {
  const speedDeg = -130 + Math.min(260, speed / 180 * 260);
  const powerDeg = -130 + Math.min(260, powerKw / 170 * 260);
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{translateContent('디지털 계기판', language)}</h3>
        <span className={`text-[10px] font-bold ${riskColor}`}>{translateContent(riskLabel, language)}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GaugeDial label="SPEED" value={`${speed.toFixed(0)}`} unit="km/h" deg={speedDeg} color="#22d3ee" />
        <GaugeDial label="POWER" value={`${powerKw.toFixed(0)}`} unit="kW" deg={powerDeg} color="#f59e0b" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <StatusTile label={translateContent('가속 페달', language)} value={`${throttle.toFixed(0)}%`} />
        <StatusTile label={translateContent('회생제동', language)} value={`Lv.${regenLevel}`} />
        <StatusTile label={translateContent('토크', language)} value={`${torqueNm.toFixed(0)} Nm`} />
        <StatusTile label={translateContent('전비', language)} value={efficiency ? `${efficiency.toFixed(1)}` : '0.0'} />
      </div>
    </div>
  );
}

function GaugeDial({ label, value, unit, deg, color }: { label: string; value: string; unit: string; deg: number; color: string }) {
  return (
    <div className="relative mx-auto h-32 w-32 rounded-full border border-slate-800 bg-slate-900 shadow-inner">
      <div className="absolute inset-3 rounded-full border border-slate-700" />
      <div className="absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded bg-current" style={{ color, transform: `rotate(${deg}deg)` }} />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: color }} />
      <div className="absolute inset-x-0 bottom-6 text-center">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        <div className="text-[9px] uppercase tracking-widest text-slate-500">{unit}</div>
      </div>
      <div className="absolute inset-x-0 top-5 text-center text-[9px] font-bold tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

function ControlSlider({ label, value, unit, min, max, step = 1, tone, disabled, onChange }: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  tone: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-300">{label}</span>
        <span className="font-mono text-slate-400">{value.toFixed(step === 1 ? 0 : 1)} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={event => onChange(Number(event.target.value))}
        className={`w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${tone}`}
      />
    </div>
  );
}

function MetricCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/80 p-3 backdrop-blur">
      <div className={`mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${tone}`}>{icon}{label}</div>
      <div className="font-mono text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function StatusTile({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border border-slate-300 bg-white p-3 shadow-sm">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-700">{icon}{label}</div>
      <div className="font-mono text-sm font-black text-slate-950">{value}</div>
    </div>
  );
}
