import React, { useState } from 'react';
import { BookOpen, Monitor, ShieldAlert, FileMinus, Activity, Wrench, CheckCircle, ChevronDown, ChevronRight, GraduationCap, X } from 'lucide-react';
import { Curriculum, Session, Week } from '../../types';
import { t, translateSessionTitle, translateTheme, useLanguageStore } from '../../i18n';

interface SidebarProps {
  curriculum: Curriculum;
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}

const typeIcons = {
  learning: <Activity size={12} />,
  theory: <BookOpen size={12} />,
  simulator: <Monitor size={12} />,
  practice: <Wrench size={12} />,
  evaluation: <CheckCircle size={12} />
};

export function Sidebar({ curriculum, activeSessionId, onSelectSession }: SidebarProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 5]);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const language = useLanguageStore(state => state.language);
  const typeLabels = {
    learning: t(language, 'integrated'),
    theory: t(language, 'theoryShort'),
    simulator: t(language, 'simulatorShort'),
    practice: t(language, 'practiceShort'),
    evaluation: t(language, 'evaluationShort')
  };

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };

  return (
    <nav className="w-56 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 h-full overflow-hidden hide-scrollbar">
      <div className="p-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 border-b border-slate-800/50 bg-slate-900/50">{t(language, 'currentDirectory')}</div>
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {curriculum.weeks.map((week) => (
          <div key={week.weekNumber} className="mb-2">
            <button 
              onClick={() => toggleWeek(week.weekNumber)}
              className="w-full text-left p-2 rounded bg-slate-800/20 hover:bg-slate-800/50 flex items-center justify-between text-xs font-medium text-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-blue-500 tracking-wider">WEEK {week.weekNumber}</span>
                <span className="line-clamp-1 text-[11px] text-slate-300">{translateTheme(week.theme, language)}</span>
              </div>
              {expandedWeeks.includes(week.weekNumber) ? <ChevronDown size={14} className="text-slate-500 shrink-0"/> : <ChevronRight size={14} className="text-slate-500 shrink-0"/>}
            </button>
            
            {expandedWeeks.includes(week.weekNumber) && (
              <div className="mt-1 space-y-1 pl-1">
                {week.sessions.map(session => {
                   const isActive = activeSessionId === session.id;
                   return (
                   <button
                     key={session.id}
                     onClick={() => onSelectSession(session.id)}
                     className={`w-full text-left p-1.5 px-2 rounded flex items-center gap-2 transition-colors
                       ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-slate-500 hover:bg-slate-800/80 hover:text-slate-300 border border-transparent'}
                     `}
                   >
                     <div className={`mt-0 shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        {typeIcons[session.type]}
                     </div>
                     <div className="flex-1 overflow-hidden flex items-center justify-between">
                       <span className="block truncate text-[10px] leading-tight flex-1">{translateSessionTitle(session.title, language)}</span>
                       <span className={`text-[8px] font-mono shrink-0 ml-2 px-1 py-0.5 rounded ${isActive ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>D{session.day} {isActive ? typeLabels[session.type] : ''}</span>
                     </div>
                   </button>
                 )})}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/50">
        <button 
           onClick={() => setIsManualOpen(true)}
           className="w-full py-2 px-4 bg-amber-600/90 hover:bg-amber-500 text-amber-50 font-bold text-[10px] rounded uppercase tracking-widest shadow-sm transition-colors border border-amber-500 flex justify-center items-center gap-2"
        >
           <ShieldAlert size={14}/> {t(language, 'viewSafetyManual')}
        </button>
      </div>

      {/* Safety Manual Modal */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 p-8 flex items-center justify-center animate-fade-in backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
              <div className="bg-amber-950/50 border-b border-amber-900/50 p-4 flex justify-between items-center text-amber-500">
                 <h2 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm"><ShieldAlert size={18}/> 현장 안전 지침서 (LOTO)</h2>
                 <button onClick={() => setIsManualOpen(false)} className="hover:text-amber-300 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4 text-sm text-slate-300">
                  <p className="text-amber-400/80 text-xs bg-amber-950/20 p-3 rounded font-mono border border-amber-900/30">WARNING: 300V 이상 고전압 시스템 작업 시 아래 절차를 타협하지 마십시오. 생명과 직결됩니다.</p>
                  
                  <div className="space-y-3 font-medium">
                      <div className="flex gap-3 items-start">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                         <div>
                            <div className="text-slate-200">개인보호장구(PPE) 착용 및 점검</div>
                            <div className="text-xs text-slate-500 font-normal mt-0.5">절연 장갑의 핀홀 검사(공기 주입 후 새는 곳 확인)를 수행하고 절연복, 절연화 착용</div>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                         <div>
                            <div className="text-slate-200">차량 시스템(IG) 전원 OFF 및 12V 탈거</div>
                            <div className="text-xs text-slate-500 font-normal mt-0.5">시동을 완전 차단하고, 12V (-) 보조배터리 단자를 탈거하여 릴레이 오작동 방지</div>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                         <div>
                            <div className="text-slate-200">고전압 서비스 플러그(MSD) 탈거</div>
                            <div className="text-xs text-slate-500 font-normal mt-0.5">안전 플러그를 해제하고, 타인이 장착할 수 없도록 반드시 작업자 본인 주머니에 보관</div>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs mt-0.5">4</span>
                         <div>
                            <div className="text-slate-200">평활 커패시터 자연 방전 대기 (최소 5분)</div>
                            <div className="text-xs text-slate-500 font-normal mt-0.5">차단 후에도 인버터 내부 커패시터에 수백 볼트의 치명적 잔류 전압이 남아있으므로 대기</div>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <span className="shrink-0 w-6 h-6 rounded-full text-red-500 bg-red-950 flex items-center justify-center font-bold text-xs mt-0.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]">5</span>
                         <div>
                            <div className="text-red-400 font-bold">인버터 전압 측정 및 0V 검출 확인 (검전)</div>
                            <div className="text-xs text-slate-400 font-normal mt-0.5">가장 중요한 최종 단계. CAT III 이상의 멀티미터로 실 고전압 단자를 측정하여 0V(또는 30V 이하의 극소전압)임을 눈으로 확인한 뒤 본 작업에 착수</div>
                         </div>
                      </div>
                  </div>
              </div>
              <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
                 <button onClick={() => setIsManualOpen(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded transition-colors uppercase tracking-widest">인지 및 확인</button>
              </div>
           </div>
        </div>
      )}
    </nav>
  )
}
