import React, { useState } from 'react';
import { Session, EvaluationData } from '../../types';
import { CheckCircle, HelpCircle, Target } from 'lucide-react';

export function EvaluationView({ session }: { session: Session }) {
  const data = session.evaluationData;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!data) return <div className="p-8 text-center text-slate-500">평가 문항이 준비 중입니다.</div>;

  const handleSelect = (qId: string, value: number | string) => {
    if(!submitted) {
        setSelectedAnswers(prev => ({ ...prev, [qId]: value }));
    }
  };

  const calculateScore = () => {
    let score = 0;
    data.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.answer) {
            score += q.points;
        }
    });
    return score;
  };

  const totalPoints = data.questions.reduce((acc, q) => acc + q.points, 0);
  const isPassed = calculateScore() >= (totalPoints * 0.6);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4 animate-fade-in pb-4 w-full">
      
      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-start justify-between">
         <div>
             <h2 className="text-sm font-bold flex items-center gap-2 mb-1 text-emerald-500 tracking-widest uppercase">
               <Target size={16} /> {data.type === 'formative' ? '형성평가' : data.type === 'cumulative' ? '누적평가' : '캡스톤 평가'}
             </h2>
             <p className="text-xs text-slate-400">학습 목표 달성 여부 확인. 통과 기준 충족 시 다음 모듈 이수.</p>
             <div className="mt-3 inline-flex flex-col bg-slate-950 p-2 rounded border border-slate-800 items-start">
                <span className="text-[10px] font-mono text-slate-500 mb-0.5 tracking-wider">REQ. SCORE & FALLBACK</span>
                <span className="text-xs text-slate-300 font-medium">{data.passCriteria}</span>
             </div>
         </div>
         {submitted && (
             <div className="bg-slate-950 p-4 rounded border border-slate-800 flex flex-col items-center min-w-[120px]">
                 <span className="text-[10px] font-mono text-slate-500 mb-1 tracking-wider uppercase">Score</span>
                 <div className="text-3xl font-mono text-emerald-400 tracking-tighter">
                     {calculateScore()}<span className="text-lg text-slate-600">/{totalPoints}</span>
                 </div>
                 <div className={`mt-1 text-xs font-bold uppercase tracking-widest ${isPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                     {isPassed ? 'PASS' : 'FAIL'}
                 </div>
             </div>
         )}
      </div>

      <div className="space-y-4">
        {data.questions.map((q, idx) => {
            const isCorrect = submitted && selectedAnswers[q.id] === q.answer;
            const isWrong = submitted && selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== q.answer;

            return (
                <div key={q.id} className={`bg-slate-900 p-5 rounded-lg border transition-colors ${
                    isCorrect ? 'border-emerald-500/30' : 
                    isWrong ? 'border-red-500/30' : 'border-slate-800'
                }`}>
                    <div className="flex gap-4 items-start mb-4">
                        <div className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isCorrect ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' :
                            isWrong ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                            Q{idx + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-sm font-medium text-slate-200 leading-relaxed">{q.question}</h3>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 ml-4">{q.points} PTS</span>
                            </div>
                            
                            <div className="space-y-2 mt-3">
                                {q.options?.map((opt, optIdx) => (
                                    <label key={optIdx} className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${
                                        selectedAnswers[q.id] === optIdx 
                                            ? submitted ? isCorrect ? 'bg-emerald-900/10 border-emerald-500/50' : 'bg-red-900/10 border-red-500/50'
                                                        : 'bg-blue-900/20 border-blue-500/50 ring-1 ring-blue-500/50'
                                            : submitted && q.answer === optIdx ? 'bg-emerald-900/10 border-emerald-500/50 border-dashed'
                                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                    }`}>
                                        <input 
                                            type="radio" 
                                            name={q.id}
                                            className="mt-0.5 w-3.5 h-3.5 bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500/50 accent-blue-500 cursor-pointer"
                                            checked={selectedAnswers[q.id] === optIdx}
                                            onChange={() => handleSelect(q.id, optIdx)}
                                            disabled={submitted}
                                        />
                                        <span className={`text-xs ${
                                            selectedAnswers[q.id] === optIdx ? 'text-slate-200' : 'text-slate-400'
                                        }`}>{opt}</span>
                                        {submitted && q.answer === optIdx && (
                                             <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">정답</span>
                                        )}
                                    </label>
                                ))}
                            </div>

                            {submitted && (
                                <div className={`mt-4 pt-3 border-t border-slate-800`}>
                                    <div className="text-[10px] text-slate-500">
                                        <div className="font-bold flex items-center gap-1.5 mb-1.5 text-slate-400 uppercase">
                                            <HelpCircle size={12}/> 해설
                                        </div>
                                        <p className="text-slate-400 leading-relaxed text-xs">{q.explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        })}
      </div>

      {!submitted && (
        <div className="flex justify-start pt-2">
            <button 
                onClick={() => setSubmitted(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-8 rounded shadow-sm transition-all focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2 uppercase tracking-wide"
            >
                답안 제출 및 채점
            </button>
        </div>
      )}

    </div>
  );
}
