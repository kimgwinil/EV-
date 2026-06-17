export type SessionType = 'learning' | 'theory' | 'simulator' | 'practice' | 'evaluation';

export interface Session {
  id: string;
  day: number;
  type: SessionType;
  title: string;
  duration: number; // minutes
  objectives: string[];
  ncsUnit?: string;
  rhythmLabel?: string;
  
  // Specific data depending on session type
  theoryData?: TheoryData;
  simulatorId?: string;
  practiceData?: PracticeData;
  evaluationData?: EvaluationData;
}

export interface TheoryData {
  intro: { questions: { q: string; a: string }[] };
  mainContent: { title: string; duration: number; content: string }[];
  misconceptions: { wrong: string; correction: string }[];
  summary: { nextSessionLink: string };
  educatorNotes?: string;
  studentSlides?: string;
}

export interface PracticeData {
  prerequisites: string;
  equipment: string[];
  safety: { level: 'low' | 'medium' | 'high'; rules: string[] };
  steps: { id: string; action: string; safetyMeasure?: string }[];
  scenarios: { normal: string; abnormal: string }[];
  checklist: { item: string; points: number }[];
}

export interface EvaluationData {
  type: 'formative' | 'cumulative' | 'capstone';
  questions: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'short_answer';
    options?: string[];
    answer: string | number;
    explanation: string;
    points: number;
  }[];
  rubric?: { criterion: string; levels: { label: string; score: number }[] }[];
  passCriteria: string;
}

export interface Week {
  weekNumber: number;
  theme: string;
  sessions: Session[];
}

export interface Curriculum {
  title: string;
  target: string;
  level: string;
  totalHours: number;
  weeks: Week[];
}
