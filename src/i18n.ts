import { create } from 'zustand';

export type Language = 'ko' | 'en' | 'ru';

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const languageOptions: { value: Language; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
];

export const useLanguageStore = create<LanguageState>(set => ({
  language: 'ko',
  setLanguage: language => set({ language })
}));

const uiText = {
  ko: {
    appTitle: '전기자동차 기술인력양성 통합 교육 플랫폼',
    edition: 'Enterprise Edition',
    currentCourse: '현재 과정',
    courseTarget: '내연기관 정비 경력자 EV전환',
    weeksSummary: '16 WEEKS / 160 HOURS / 80 SESSIONS',
    loading: 'LOADING',
    preparation: '준비 중입니다...',
    language: '언어',
    currentDirectory: 'Curr Directory',
    viewSafetyManual: 'View Safety Manual',
    trainingMode: 'TRAINING MODE',
    interactiveSimulation: 'INTERACTIVE SIMULATION',
    server: 'SERVER',
    theory: '이론 학습',
    simulator: '시뮬레이터',
    practice: '실무 진단',
    flowTheory: '1. 이론교육',
    flowSimulator: '2. 이론기반 시뮬레이터 실습',
    flowPractice: '3. 현장 절차 실습',
    flowEvaluation: '4. 평가·피드백',
    learningFlowDesc: '각 주차는 이론에서 다룬 원리와 고장 메커니즘을 다음 시뮬레이터 실습에서 변수 조작, 절차 수행, 오답 피드백으로 검증하도록 설계합니다.',
    commonVehicleController: '공통 차량 제어기',
    commonVehicleControllerDesc: '모든 시뮬레이터에서 차량 상태를 동일하게 제어합니다. 속도 변화는 바퀴 회전, 계측값, 그래프에 반영됩니다.',
    vehicleSpeed: '차량 속도',
    throttle: '가속 페달',
    regen: '회생제동',
    partInfo: '부품 설명 / 상태 확인',
    currentSelection: '현재 선택',
    integrated: '통합',
    theoryShort: '이론',
    simulatorShort: '시뮬',
    practiceShort: '실습',
    evaluationShort: '평가'
  },
  en: {
    appTitle: 'EV Technical Workforce Training Platform',
    edition: 'Enterprise Edition',
    currentCourse: 'Current course',
    courseTarget: 'EV transition for internal-combustion vehicle technicians',
    weeksSummary: '16 WEEKS / 160 HOURS / 80 SESSIONS',
    loading: 'LOADING',
    preparation: 'Preparation in progress...',
    language: 'Language',
    currentDirectory: 'Curriculum Directory',
    viewSafetyManual: 'View Safety Manual',
    trainingMode: 'TRAINING MODE',
    interactiveSimulation: 'INTERACTIVE SIMULATION',
    server: 'SERVER',
    theory: 'Theory',
    simulator: 'Simulator',
    practice: 'Field Diagnosis',
    flowTheory: '1. Theory',
    flowSimulator: '2. Theory-Based Simulator Practice',
    flowPractice: '3. Field Procedure Practice',
    flowEvaluation: '4. Assessment & Feedback',
    learningFlowDesc: 'Each week connects theory, fault mechanisms, simulator variable control, procedure practice, wrong-answer feedback, and assessment.',
    commonVehicleController: 'Common Vehicle Controller',
    commonVehicleControllerDesc: 'Vehicle state is controlled consistently across all simulators. Speed changes are reflected in wheel rotation, gauges, and graphs.',
    vehicleSpeed: 'Vehicle Speed',
    throttle: 'Throttle',
    regen: 'Regenerative Braking',
    partInfo: 'Component Description / Status',
    currentSelection: 'Current Selection',
    integrated: 'Integrated',
    theoryShort: 'Theory',
    simulatorShort: 'Sim',
    practiceShort: 'Practice',
    evaluationShort: 'Eval'
  },
  ru: {
    appTitle: 'Учебная платформа подготовки специалистов по электромобилям',
    edition: 'Enterprise Edition',
    currentCourse: 'Текущий курс',
    courseTarget: 'Переобучение специалистов ДВС для работы с EV',
    weeksSummary: '16 НЕДЕЛЬ / 160 ЧАСОВ / 80 СЕССИЙ',
    loading: 'ЗАГРУЗКА',
    preparation: 'Идет подготовка...',
    language: 'Язык',
    currentDirectory: 'Каталог курса',
    viewSafetyManual: 'Открыть руководство по безопасности',
    trainingMode: 'РЕЖИМ ОБУЧЕНИЯ',
    interactiveSimulation: 'ИНТЕРАКТИВНАЯ СИМУЛЯЦИЯ',
    server: 'СЕРВЕР',
    theory: 'Теория',
    simulator: 'Симулятор',
    practice: 'Практическая диагностика',
    flowTheory: '1. Теория',
    flowSimulator: '2. Практика на симуляторе',
    flowPractice: '3. Практика процедур',
    flowEvaluation: '4. Оценка и обратная связь',
    learningFlowDesc: 'Каждая неделя связывает теорию, механизмы отказов, управление переменными симулятора, процедурную практику, обратную связь и оценку.',
    commonVehicleController: 'Общий контроллер автомобиля',
    commonVehicleControllerDesc: 'Состояние автомобиля управляется одинаково во всех симуляторах. Изменение скорости отражается во вращении колес, приборах и графиках.',
    vehicleSpeed: 'Скорость автомобиля',
    throttle: 'Педаль акселератора',
    regen: 'Рекуперативное торможение',
    partInfo: 'Описание компонента / статус',
    currentSelection: 'Текущий выбор',
    integrated: 'Интегр.',
    theoryShort: 'Теория',
    simulatorShort: 'Сим.',
    practiceShort: 'Практика',
    evaluationShort: 'Оценка'
  }
} satisfies Record<Language, Record<string, string>>;

export function t(language: Language, key: keyof typeof uiText.ko): string {
  return uiText[language][key] || uiText.ko[key] || key;
}

const weekThemes: Record<string, { en: string; ru: string }> = {
  'EV 개론 + 고전압 안전 ①': { en: 'EV Introduction + High-Voltage Safety ①', ru: 'Введение в EV + высоковольтная безопасность ①' },
  '고전압 안전 ②: 차단·검전·절연측정': { en: 'High-Voltage Safety ②: Isolation, Voltage Check, Insulation Test', ru: 'Высоковольтная безопасность ②: отключение, проверка напряжения, измерение изоляции' },
  '고전압 배터리: 셀·모듈·팩, 열폭주, 열관리': { en: 'High-Voltage Battery: Cells, Modules, Packs, Thermal Runaway, Thermal Management', ru: 'Высоковольтная батарея: элементы, модули, пак, тепловой разгон и термоменеджмент' },
  'BMS: SOC/SOH, 셀 밸런싱, 보호로직': { en: 'BMS: SOC/SOH, Cell Balancing, Protection Logic', ru: 'BMS: SOC/SOH, балансировка ячеек, защитная логика' },
  '구동 모터: PMSM·유도전동기와 토크제어': { en: 'Drive Motor: PMSM, Induction Motor, Torque Control', ru: 'Тяговый двигатель: PMSM, асинхронный двигатель и управление моментом' },
  '전력변환: 인버터, DC-DC, OBC': { en: 'Power Conversion: Inverter, DC-DC, OBC', ru: 'Преобразование энергии: инвертор, DC-DC, OBC' },
  '충전 시스템: AC/DC 충전, 표준, 충전 시퀀스': { en: 'Charging System: AC/DC Charging, Standards, Charging Sequence', ru: 'Система зарядки: AC/DC зарядка, стандарты, последовательность' },
  '열관리·공조: 히트펌프와 통합 열관리': { en: 'Thermal Management & HVAC: Heat Pump and Integrated Thermal Control', ru: 'Термоменеджмент и HVAC: тепловой насос и интегрированное управление' },
  '차량 네트워크: CAN, VCU, DTC 해석': { en: 'Vehicle Network: CAN, VCU, DTC Interpretation', ru: 'Сеть автомобиля: CAN, VCU, интерпретация DTC' },
  '회생제동·진단 실무': { en: 'Regenerative Braking & Diagnostic Practice', ru: 'Рекуперативное торможение и диагностическая практика' },
  '연계기술: V2G/V2L, 배터리 재사용, 충전인프라': { en: 'Connected Technologies: V2G/V2L, Battery Reuse, Charging Infrastructure', ru: 'Связанные технологии: V2G/V2L, повторное использование батарей, зарядная инфраструктура' },
  '복합 진단 ①: 충전불가·주행불가 사례': { en: 'Complex Diagnosis ①: No-Charge and No-Drive Cases', ru: 'Комплексная диагностика ①: нет зарядки и нет движения' },
  '복합 진단 ②: 절연경고·출력제한 사례': { en: 'Complex Diagnosis ②: Insulation Warning and Power Limitation Cases', ru: 'Комплексная диагностика ②: предупреждение изоляции и ограничение мощности' },
  '현장 서비스 운영: 정비문서, 고객응대, 품질관리': { en: 'Field Service Operation: Service Documents, Customer Communication, Quality Control', ru: 'Сервисная эксплуатация: документы, работа с клиентом, контроль качества' },
  '통합 고장진단 프로젝트 준비': { en: 'Integrated Fault Diagnosis Project Preparation', ru: 'Подготовка интегрированного проекта диагностики неисправностей' },
  '최종 캡스톤: 종합 진단·발표·최종평가': { en: 'Final Capstone: Comprehensive Diagnosis, Presentation, Final Assessment', ru: 'Финальный капстоун: комплексная диагностика, презентация, итоговая оценка' }
};

const suffixes: Record<string, { en: string; ru: string }> = {
  ' - 이론① 원리·구조': { en: ' - Theory ① Principles & Structure', ru: ' - Теория ① принципы и структура' },
  ' - 이론② 고장·진단': { en: ' - Theory ② Faults & Diagnosis', ru: ' - Теория ② отказы и диагностика' },
  ' - 가상실습 시뮬레이터': { en: ' - Virtual Practice Simulator', ru: ' - Симулятор виртуальной практики' },
  ' - 형성평가': { en: ' - Formative Assessment', ru: ' - Формирующая оценка' },
  ' - 누적평가': { en: ' - Cumulative Assessment', ru: ' - Накопительная оценка' },
  ' - 최종 캡스톤 평가': { en: ' - Final Capstone Assessment', ru: ' - Итоговая оценка капстоуна' }
};

export function translateTheme(theme: string, language: Language): string {
  if (language === 'ko') return theme;
  return weekThemes[theme]?.[language] || theme;
}

export function translateSessionTitle(title: string, language: Language): string {
  if (language === 'ko') return title;

  let translated = title;
  Object.entries(weekThemes).forEach(([ko, values]) => {
    translated = translated.replace(ko, values[language]);
  });
  Object.entries(suffixes).forEach(([ko, values]) => {
    translated = translated.replace(ko, values[language]);
  });

  if (language === 'en') {
    translated = translated
      .replace(' - 고전압 작업 전 안전점검과 작업구역 통제', ' - Pre-Work HV Safety Check and Work Area Control')
      .replace(' - 차단/검전/절연측정 실물 절차', ' - Physical Isolation, Voltage Check, Insulation Test Procedure')
      .replace(' - 배터리 외관·온도·커넥터 점검', ' - Battery Appearance, Temperature, Connector Inspection')
      .replace(' - 모터 권선저항, 절연, 리졸버 신호 점검', ' - Motor Winding Resistance, Insulation, Resolver Signal Check');
  }

  if (language === 'ru') {
    translated = translated
      .replace(' - 고전압 작업 전 안전점검과 작업구역 통제', ' - проверка HV-безопасности и контроль рабочей зоны')
      .replace(' - 차단/검전/절연측정 실물 절차', ' - практическая процедура отключения, проверки напряжения и изоляции')
      .replace(' - 배터리 외관·온도·커넥터 점검', ' - проверка корпуса, температуры и разъемов батареи')
      .replace(' - 모터 권선저항, 절연, 리졸버 신호 점검', ' - проверка сопротивления обмоток, изоляции и сигнала резольвера');
  }

  return translated;
}

