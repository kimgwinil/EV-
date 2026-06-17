import { Curriculum, EvaluationData, PracticeData, Session, TheoryData } from '../types';

type WeekPlan = {
  theme: string;
  ncs: string;
  simulatorId: string;
  theoryFocus: string[];
  simulatorFocus: string;
  practiceTopic: string;
  equipment: string[];
  faults: string[];
  misconceptions: { wrong: string; correction: string }[];
};

const weekPlans: WeekPlan[] = [
  {
    theme: 'EV 개론 + 고전압 안전 ①',
    ncs: '전기자동차 정비 안전관리 / 고전압 시스템 기초',
    simulatorId: 'safety_procedure',
    theoryFocus: ['EV 파워트레인 구성', '고전압 위험과 인체 영향', 'PPE와 작업구역 통제', '서비스 플러그와 인터록 구조'],
    simulatorFocus: 'PPE 착용, 전원 OFF, 12V 차단, MSD 탈거 순서를 반복 수행한다.',
    practiceTopic: '고전압 작업 전 안전점검과 작업구역 통제',
    equipment: ['절연장갑', '절연화', '절연매트', '안전콘', 'LOTO 태그', 'CAT III 멀티미터'],
    faults: ['PPE 미착용 상태에서 MSD 접근', '전원 OFF 확인 누락'],
    misconceptions: [
      { wrong: '절연장갑만 착용하면 고전압 작업은 안전하다.', correction: '장갑은 최후 방어선이며 전원 차단, 검전, 작업구역 통제가 먼저다.' },
      { wrong: 'EV는 시동음이 없으면 전기가 흐르지 않는다.', correction: 'READY, ACC, 충전 대기 상태에서도 고전압 릴레이가 투입될 수 있다.' }
    ]
  },
  {
    theme: '고전압 안전 ②: 차단·검전·절연측정',
    ncs: '전기자동차 고전압 안전작업 / 절연저항 측정',
    simulatorId: 'safety_procedure',
    theoryFocus: ['LOTO 절차', '평활 커패시터 잔류전압', '검전기와 멀티미터 확인법', '절연저항 측정 원리'],
    simulatorFocus: '차단 후 대기시간과 검전 위치를 선택하고, 잘못된 순서의 위험을 확인한다.',
    practiceTopic: '차단/검전/절연측정 실물 절차',
    equipment: ['CAT III 1000V 멀티미터', '절연저항계', '절연공구', '실습용 EV 모형', 'LOTO 키트'],
    faults: ['잔류전압 대기시간 미준수', '멀티미터 자체 점검 누락'],
    misconceptions: [
      { wrong: '12V 배터리만 빼면 고전압은 자동으로 안전해진다.', correction: '12V 차단은 릴레이 오작동 방지이며, MSD 탈거와 0V 검전이 별도로 필요하다.' },
      { wrong: '절연저항은 일반 저항 측정 모드로 확인할 수 있다.', correction: '절연저항은 지정 시험전압을 인가하는 메거로 측정해야 한다.' }
    ]
  },
  {
    theme: '고전압 배터리: 셀·모듈·팩, 열폭주, 열관리',
    ncs: '전기자동차 배터리 시스템 점검',
    simulatorId: 'bms_simulator',
    theoryFocus: ['리튬이온 셀 원리', '직렬·병렬 연결과 팩 전압', '열폭주 메커니즘', '배터리 냉각 구조'],
    simulatorFocus: 'SOC와 온도 변화가 셀 전압, 팩 전압, 열 위험에 미치는 영향을 관찰한다.',
    practiceTopic: '배터리 외관·온도·커넥터 점검',
    equipment: ['진단스캐너', '열화상 카메라', '절연저항계', '배터리 모형', '냉각수 누설 점검 키트'],
    faults: ['특정 모듈 핫스팟', '배터리 냉각수 누설 의심'],
    misconceptions: [
      { wrong: '전압만 정상이면 배터리 팩은 정상이다.', correction: '전압, 온도, 셀 편차, 절연, 냉각 상태를 함께 봐야 한다.' },
      { wrong: '열폭주는 외부 화염이 있어야 시작된다.', correction: '내부 단락, 과충전, 충격, 냉각 불량만으로도 시작될 수 있다.' }
    ]
  },
  {
    theme: 'BMS: SOC/SOH, 셀 밸런싱, 보호로직',
    ncs: 'BMS 데이터 분석 및 배터리 진단',
    simulatorId: 'bms_simulator',
    theoryFocus: ['SOC 추정', 'SOH와 내부저항', '수동·능동 셀 밸런싱', '과전압·저전압·과온 보호'],
    simulatorFocus: '셀 편차와 고온 시나리오에서 밸런싱과 보호로직 개입 조건을 판정한다.',
    practiceTopic: '진단스캐너 기반 BMS 데이터 판독',
    equipment: ['진단스캐너', '절연저항계', '오실로스코프', '실습용 BMS 보드'],
    faults: ['셀 전압 편차 과다', '온도센서 이상으로 충전 제한'],
    misconceptions: [
      { wrong: 'SOC 100%는 셀의 화학적 완전 충전 상태다.', correction: '제조사는 수명 보호를 위해 상하단 버퍼를 둔다.' },
      { wrong: '밸런싱은 낮은 셀을 강제로 충전하는 기능이다.', correction: '수동 밸런싱은 높은 셀의 에너지를 저항열로 소모해 편차를 줄인다.' }
    ]
  },
  {
    theme: '구동 모터: PMSM·유도전동기와 토크제어',
    ncs: '전기자동차 구동모터 점검',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['회전자계와 3상 교류', 'PMSM과 유도전동기 차이', '리졸버 위치검출', '토크·RPM·전류 관계'],
    simulatorFocus: 'READY 상태에서 RPM과 부하를 조작해 모터 온도와 전류 변화를 확인한다.',
    practiceTopic: '모터 권선저항, 절연, 리졸버 신호 점검',
    equipment: ['절연저항계', '밀리옴미터', '오실로스코프', '진단스캐너'],
    faults: ['권선 절연저하', '리졸버 신호 드롭아웃'],
    misconceptions: [
      { wrong: '전기모터는 마모가 없어 고장나지 않는다.', correction: '베어링, 절연, 냉각, 센서 계통 고장이 발생한다.' },
      { wrong: '모터 토크는 RPM이 높을수록 항상 커진다.', correction: '저속 정토크 영역과 고속 정출력 영역이 구분된다.' }
    ]
  },
  {
    theme: '전력변환: 인버터, DC-DC, OBC',
    ncs: '전력변환장치 점검 및 파형 분석',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['DC-AC 변환', 'PWM과 스위칭 소자', 'LDC 12V 전원공급', 'OBC 완속충전 변환'],
    simulatorFocus: '전압, 온도, 전원 모드 변화에 따른 인버터 출력 제한과 LDC 동작을 해석한다.',
    practiceTopic: '인버터 잔류전압, LDC 출력, OBC 입력 상태 점검',
    equipment: ['CAT III 멀티미터', '오실로스코프', '전류 클램프', '진단스캐너'],
    faults: ['인버터 과온 출력제한', 'LDC 출력 저하로 12V 경고'],
    misconceptions: [
      { wrong: '인버터는 단순 변환기라 진단 포인트가 적다.', correction: '전력소자, 게이트구동, 냉각, 커패시터, 통신 상태를 함께 본다.' },
      { wrong: '고전압 배터리가 충분하면 12V 문제는 생기지 않는다.', correction: 'LDC 또는 12V 배터리 문제가 있으면 차량 기동 자체가 제한된다.' }
    ]
  },
  {
    theme: '충전 시스템: AC/DC 충전, 표준, 충전 시퀀스',
    ncs: '전기자동차 충전시스템 점검',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['완속과 급속 충전 차이', 'CP/PP 신호', '충전 릴레이와 인터록', 'CC-CV 충전제어'],
    simulatorFocus: '충전 연결, 인증, 절연 확인, 전류 상승, 충전 종료 순서를 단계별로 수행한다.',
    practiceTopic: '충전 인렛, CP/PP, 충전 제한 원인 점검',
    equipment: ['충전 인렛 테스터', '진단스캐너', '멀티미터', '절연장갑', '실습용 충전기'],
    faults: ['CP 신호 불량으로 충전 불가', '인렛 온도센서 과열 감지'],
    misconceptions: [
      { wrong: '급속충전기는 차량 배터리에 무조건 최대전류를 넣는다.', correction: 'BMS가 허용전류를 계산하고 충전기가 그 요청값을 따른다.' },
      { wrong: '충전 커넥터만 꽂히면 고전압이 바로 흐른다.', correction: '통신, 접지, 인터록, 절연 확인 후 릴레이가 닫힌다.' }
    ]
  },
  {
    theme: '열관리·공조: 히트펌프와 통합 열관리',
    ncs: '전기자동차 열관리시스템 점검',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['배터리 냉각 회로', '전동식 컴프레서', 'PTC와 히트펌프', '밸브·펌프 제어'],
    simulatorFocus: '외기온, 배터리 온도, 인버터 온도 조건에 따른 냉각·난방 제어를 비교한다.',
    practiceTopic: '냉각수 회로, 전동컴프레서 절연, 밸브 작동 점검',
    equipment: ['냉각수 리필 장비', '공조 매니폴드 게이지', '절연저항계', '진단스캐너'],
    faults: ['전동 워터펌프 작동 불량', '전동컴프레서 절연 저하'],
    misconceptions: [
      { wrong: 'EV 공조는 주행장치와 무관하다.', correction: '배터리와 인버터 열관리가 출력, 충전속도, 수명에 직접 영향을 준다.' },
      { wrong: '일반 PAG 오일을 전동컴프레서에 써도 된다.', correction: '절연 저하를 막기 위해 전기차 전용 절연 오일을 사용해야 한다.' }
    ]
  },
  {
    theme: '차량 네트워크: CAN, VCU, DTC 해석',
    ncs: '전기자동차 네트워크 진단',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['CAN High/Low 신호', 'VCU 제어 구조', 'DTC Freeze Frame', '통신 단절 진단'],
    simulatorFocus: '가상 DTC와 실시간 데이터를 비교해 물리 고장과 통신 고장을 구분한다.',
    practiceTopic: 'CAN 파형 측정과 DTC 원인 추적',
    equipment: ['진단스캐너', '오실로스코프', '브레이크아웃 박스', '회로도'],
    faults: ['CAN Low 단선', 'VCU-BMS 통신 지연'],
    misconceptions: [
      { wrong: 'DTC 삭제는 수리 완료와 같다.', correction: '삭제는 증상 제거가 아니라 기록 초기화이며 원인 검증이 필요하다.' },
      { wrong: 'CAN 전압이 대략 보이면 통신은 정상이다.', correction: '차동 파형, 종단저항, 노이즈, 메시지 누락을 함께 확인한다.' }
    ]
  },
  {
    theme: '회생제동·진단 실무',
    ncs: '전기자동차 회생제동 및 진단장비 활용',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['발전모드 토크', '마찰제동 협조제어', 'SOC·온도별 회생제한', '스캐너 진단 워크플로'],
    simulatorFocus: 'SOC와 온도 조건에 따라 회생제동 가능량이 줄어드는 이유를 확인한다.',
    practiceTopic: '스캐너 기반 회생토크, 브레이크 압력, 제한 조건 점검',
    equipment: ['진단스캐너', '브레이크 오일 교환기', '리프트', '절연장갑'],
    faults: ['고SOC 상태 회생제동 제한', '브레이크 압력센서 불일치'],
    misconceptions: [
      { wrong: '원페달 주행에서는 마찰 브레이크가 쓰이지 않는다.', correction: '정차 직전, 저마찰 노면, 긴급제동에는 마찰 브레이크가 개입한다.' },
      { wrong: '회생제동이 약하면 모터 고장이다.', correction: 'SOC, 배터리 온도, 노면 안정성, 제동 시스템 조건을 먼저 확인한다.' }
    ]
  },
  {
    theme: '연계기술: V2G/V2L, 배터리 재사용, 충전인프라',
    ncs: '전기자동차 연계기술 운용 및 사례 분석',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['양방향 전력변환', 'V2L 보호로직', '사용후 배터리 SOH 선별', '충전인프라 부하관리'],
    simulatorFocus: '방전 한계, 부하 크기, SOC 조건을 바꿔 V2L 운용 가능 시간을 예측한다.',
    practiceTopic: 'V2L 부하 연결과 사용후 배터리 사례 분석',
    equipment: ['V2L 어댑터', 'AC 부하 테스터', '전력계', '진단스캐너'],
    faults: ['부하 과다로 V2L 차단', 'SOH 낮은 모듈의 재사용 부적합'],
    misconceptions: [
      { wrong: 'V2L은 배터리 수명을 급격히 줄인다.', correction: 'BMS 방전 하한과 부하 제한 내에서는 일반 주행 방전과 유사하게 관리된다.' },
      { wrong: '사용후 배터리는 팩 단위로만 재사용한다.', correction: '모듈별 SOH와 안전검사 후 ESS 등 용도에 맞게 선별한다.' }
    ]
  },
  {
    theme: '복합 진단 ①: 충전불가·주행불가 사례',
    ncs: '전기자동차 복합 고장진단',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['고객 문진', '증상 재현', 'DTC 우선순위', '안전 차단 후 계통별 분리진단'],
    simulatorFocus: '충전불가와 READY 불가 사례에서 진단 순서와 근거를 선택한다.',
    practiceTopic: '복합 DTC 기반 원인 후보 좁히기',
    equipment: ['진단스캐너', '멀티미터', '회로도', '작업지시서 템플릿'],
    faults: ['충전 인렛 인터록 불량', '12V 저전압으로 READY 불가'],
    misconceptions: [
      { wrong: '가장 먼저 보이는 DTC가 항상 원인이다.', correction: '전원, 통신, 안전 차단 조건을 기준으로 원인 DTC와 결과 DTC를 구분한다.' },
      { wrong: '복합 고장은 부품 교환으로 빠르게 해결한다.', correction: '측정 근거 없이 교환하면 비용과 2차 고장이 커진다.' }
    ]
  },
  {
    theme: '복합 진단 ②: 절연경고·출력제한 사례',
    ncs: '전기자동차 고전압 고장진단',
    simulatorId: 'safety_procedure',
    theoryFocus: ['절연경고 발생 조건', '누설전류 경로', '출력제한 로직', '고장 재현과 안전 확보'],
    simulatorFocus: '절연경고가 있는 차량에서 실물 접촉 전 차단·검전 절차를 완성한다.',
    practiceTopic: '절연저항 측정과 출력제한 원인 분석',
    equipment: ['절연저항계', '진단스캐너', '절연공구', '열화상 카메라'],
    faults: ['냉각수 유입에 의한 절연저하', '인버터 과온 출력제한'],
    misconceptions: [
      { wrong: '절연경고가 떠도 주행 가능하면 작업해도 된다.', correction: '절연경고는 감전·화재 리스크이므로 작업 전 차단과 검전이 필수다.' },
      { wrong: '출력제한은 배터리 문제만 의미한다.', correction: '배터리, 인버터, 모터, 열관리, 통신 조건 모두 원인이 될 수 있다.' }
    ]
  },
  {
    theme: '현장 서비스 운영: 정비문서, 고객응대, 품질관리',
    ncs: '전기자동차 정비품질관리 및 고객응대',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['작업지시서 작성', '측정값 증거화', '고객 설명 구조', '재작업 방지 체크'],
    simulatorFocus: '진단 결과 요약서를 작성하고 고객에게 안전·비용·재점검 기준을 설명한다.',
    practiceTopic: '정비 리포트와 고객 설명 브리핑',
    equipment: ['작업지시서', '진단 리포트 템플릿', '사진 기록 장비', '스캐너 출력물'],
    faults: ['측정값 누락으로 보증판정 불가', '안전 설명 누락으로 고객 불신'],
    misconceptions: [
      { wrong: '정비 실력만 있으면 문서는 형식이다.', correction: 'EV 정비는 안전과 보증 판단 때문에 측정 근거 기록이 핵심 품질이다.' },
      { wrong: '고객에게 기술 내용을 자세히 말할수록 좋다.', correction: '위험, 원인, 조치, 재발 방지 중심으로 이해 가능한 언어로 설명해야 한다.' }
    ]
  },
  {
    theme: '통합 고장진단 프로젝트 준비',
    ncs: '전기자동차 통합 진단 프로젝트 수행',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['프로젝트 문제정의', '진단 가설 수립', '역할 분담', '발표 자료 구성'],
    simulatorFocus: '제시된 복합 고장 로그에서 팀별 진단 계획과 측정 순서를 설계한다.',
    practiceTopic: '캡스톤 진단 계획서 작성과 예비 발표',
    equipment: ['진단스캐너', '회로도', '프로젝트 보드', '평가 루브릭'],
    faults: ['충전불가와 절연경고 동시 발생', '출력제한과 냉각성능 저하 동시 발생'],
    misconceptions: [
      { wrong: '캡스톤은 정답 부품을 맞히는 시험이다.', correction: '안전, 진단 근거, 절차, 팀 커뮤니케이션, 설명 능력을 함께 평가한다.' },
      { wrong: '가설은 하나만 세우고 검증하면 된다.', correction: '가능 원인을 우선순위화하고 측정으로 하나씩 배제해야 한다.' }
    ]
  },
  {
    theme: '최종 캡스톤: 종합 진단·발표·최종평가',
    ncs: '전기자동차 정비 종합 수행평가',
    simulatorId: 'interactive_powertrain',
    theoryFocus: ['안전 브리핑', '복합 고장진단', '수리방안 제안', '최종 발표와 피드백'],
    simulatorFocus: '최종 고장 시나리오를 수행하고 교수자 확인용 요약을 제출한다.',
    practiceTopic: '캡스톤 종합 진단과 발표',
    equipment: ['EV 진단 세트', 'PPE 풀세트', '실습용 EV/모형', '발표자료 템플릿'],
    faults: ['READY 불가 + BMS 셀 편차', '충전 중단 + 인렛 온도 경고'],
    misconceptions: [
      { wrong: '최종평가는 빠르게 수리하는 사람이 유리하다.', correction: '고전압 안전과 근거 있는 진단을 지킨 결과가 가장 중요하다.' },
      { wrong: '발표는 결과만 말하면 된다.', correction: '증상, 안전조치, 측정값, 판단근거, 재발방지까지 설명해야 한다.' }
    ]
  }
];

const buildTheory = (week: WeekPlan, day: number): TheoryData => {
  const emphasis = day === 1 ? '원리와 구조' : '고장 메커니즘과 진단';
  const principleDetail = `${week.theoryFocus[0]}는 단순 명칭 암기가 아니라 에너지 변환 경로를 따라 이해해야 합니다. 전기 에너지가 배터리 팩에서 고전압 배선, 릴레이, 인버터 또는 충전 계통으로 이동할 때 전압, 전류, 온도, 통신 허가 조건이 동시에 만족되어야 합니다. 강의에서는 정상 운전, 충전, 고장 보호 상태를 나누어 어떤 제어기가 최종 허가권을 갖는지 추적합니다.`;
  const structureDetail = `${week.theoryFocus[1]}는 실제 정비 현장에서 부품 위치, 커넥터 잠금 구조, 냉각 라인, 차폐 케이블, 접지 포인트를 함께 봐야 합니다. 같은 증상이라도 전원 공급, 센서 입력, 통신, 냉각 불량 중 어느 계통이 원인인지 분리하기 위해 구성품 간 연결 관계를 블록도와 작업 동선 기준으로 정리합니다.`;
  const controlDetail = `${week.theoryFocus[2]}와 관련된 제어는 VCU, BMS, 인버터, OBC/LDC, 열관리 제어기가 데이터를 주고받으며 결정합니다. 예를 들어 요청 토크가 들어와도 SOC가 낮거나 온도가 높거나 절연 경고가 있으면 출력 제한이 걸립니다. 이 세션에서는 스캐너 데이터 항목을 원인 데이터와 결과 데이터로 구분하고, 어떤 값이 먼저 변해야 정상 로직인지 판단합니다.`;
  const faultDetail = `${week.faults[0]}가 발생하면 증상은 경고등 하나로만 나타나지 않습니다. DTC, Freeze Frame, 실시간 데이터, 물리 측정값이 서로 다른 시간차로 나타날 수 있습니다. 학습자는 단선, 단락, 접촉저항 증가, 절연저하, 과온, 통신 지연 중 어느 패턴인지 분류하고, 재현 가능한 조건과 재현하면 안 되는 위험 조건을 구분합니다.`;
  const diagnosisDetail = `${week.faults[1]} 진단은 "부품 추정"이 아니라 증거 수집 순서입니다. 고객 문진으로 발생 조건을 좁히고, 안전 차단 가능 여부를 판단한 뒤, 회로도 기준 측정 위치를 정합니다. 이후 기준값, 허용오차, 실측값, 판정, 다음 조치를 표로 남겨 재검증과 고객 설명까지 이어지게 합니다.`;
  const safetyDetail = `${emphasis} 단계에서도 고전압 시스템은 항상 에너지 잔류 가능성을 전제로 다룹니다. READY 표시, 충전 커넥터 체결, 12V 전원 상태, MSD 체결 상태, 평활 커패시터 방전 시간을 확인하고, 검전 전에는 계측기 자체 정상 여부를 먼저 확인합니다. 제조사 비공개 자료를 복제하지 않고 공개 가능한 일반 원리와 안전 절차 중심으로 설명합니다.`;
  return {
    intro: {
      questions: [
        { q: `${week.theme}에서 작업자가 가장 먼저 확인해야 할 안전 조건은 무엇인가요?`, a: '전원 상태, 고전압 차단 가능 여부, PPE, 작업구역 통제, 검전 가능 위치를 먼저 확인합니다.' },
        { q: `${week.theme}의 진단에서 측정값 하나만 보고 판단하면 안 되는 이유는 무엇인가요?`, a: 'EV 계통은 배터리, 전력변환, 통신, 열관리 보호로직이 연결되어 있어 결과 DTC와 원인 DTC가 분리될 수 있기 때문입니다.' }
      ]
    },
    mainContent: [
      { title: `원리: ${week.theoryFocus[0]}`, duration: 15, content: principleDetail },
      { title: `구조: ${week.theoryFocus[1]}`, duration: 15, content: structureDetail },
      { title: `제어 흐름: ${week.theoryFocus[2]}`, duration: 15, content: controlDetail },
      { title: `고장 메커니즘: ${week.faults[0]}`, duration: 15, content: faultDetail },
      { title: `진단 포인트: ${week.faults[1]}`, duration: 15, content: diagnosisDetail },
      { title: `안전: ${emphasis} 세션 작업한계`, duration: 15, content: safetyDetail }
    ],
    misconceptions: week.misconceptions,
    summary: { nextSessionLink: day === 1 ? '다음 세션에서는 같은 주제를 고장 사례와 진단 데이터 중심으로 확장합니다. 이론②에서 만든 진단 가설은 D3 시뮬레이터의 변수 조작 과제로 이어집니다.' : `다음 시뮬레이터에서는 ${week.simulatorFocus} 속도, 전압, 온도, SOC, 통신 상태 중 어떤 변수가 결과를 바꾸는지 관찰합니다.` },
    educatorNotes: `${week.theme} 강의는 일반 원리와 공개 가능한 정비 절차 중심으로 진행합니다. 강사는 이론 설명 후 반드시 "시뮬레이터에서 확인할 변수"를 지정합니다. 예: 정상 기준값, 위험 한계값, 보호로직 개입 조건, 오답 순서. 제조사 비공개 회로도나 서비스 매뉴얼 원문 복제는 사용하지 않습니다.`,
    studentSlides: [
      `1. 핵심 원리: ${week.theoryFocus[0]}의 에너지·신호 흐름`,
      `2. 구조 이해: ${week.theoryFocus[1]}의 부품 위치, 커넥터, 냉각/통신 연결`,
      `3. 제어 로직: ${week.theoryFocus[2]}가 허가·제한·차단을 결정하는 조건`,
      `4. 고장 패턴: ${week.faults[0]} 발생 시 증상, DTC, 데이터 변화`,
      `5. 진단 절차: ${week.faults[1]}를 기준값-실측값-판정으로 기록`,
      `6. 시뮬레이터 연결: ${week.simulatorFocus}`
    ].join('\n')
  };
};

const buildPractice = (week: WeekPlan, weekNumber: number): PracticeData => ({
  prerequisites: weekNumber >= 2 ? '2주차 고전압 안전 이수 필수. 미이수자는 실물 고전압 실습 금지.' : '고전압 실물 접촉 금지. 안전 관찰과 절차 시뮬레이션만 수행.',
  equipment: week.equipment,
  safety: {
    level: weekNumber <= 2 || week.theme.includes('절연') || week.theme.includes('캡스톤') ? 'high' : 'medium',
    rules: [
      '작업 전 전원 상태와 READY 표시를 확인한다.',
      '고전압 계통은 차단, 대기, 검전 전까지 접촉하지 않는다.',
      '측정값은 단위, 측정 위치, 기준값과 함께 기록한다.',
      '위험 단계에서는 반드시 2인 1조로 상호 확인한다.'
    ]
  },
  steps: [
    { id: 'p1', action: '작업지시서에서 증상, 차량상태, 금지작업을 확인한다.', safetyMeasure: '정보 누락 시 실습을 시작하지 않는다.' },
    { id: 'p2', action: 'PPE와 계측기 외관, 배터리, 리드선 손상 여부를 점검한다.', safetyMeasure: '절연장갑 핀홀 또는 계측기 손상이 있으면 즉시 교체한다.' },
    { id: 'p3', action: '차량 전원 OFF, 12V 차단, MSD 탈거 필요 여부를 판단한다.', safetyMeasure: '고전압 실물 접근은 안전 이수자만 수행한다.' },
    { id: 'p4', action: `${week.practiceTopic}의 기준 측정 위치를 표시하고 기준값을 확인한다.`, safetyMeasure: '측정 범위와 단자 극성을 먼저 설정한다.' },
    { id: 'p5', action: '정상 시나리오 측정값을 기록하고 데이터 스트림과 비교한다.' },
    { id: 'p6', action: `${week.faults[0]} 시나리오를 적용하고 증상, DTC, 측정값 차이를 기록한다.`, safetyMeasure: '이상값 발견 시 임의 초기화하지 말고 교수자에게 보고한다.' },
    { id: 'p7', action: `${week.faults[1]} 가능성을 회로도 또는 데이터 흐름 기준으로 배제/확정한다.` },
    { id: 'p8', action: '복구, 재검증, 작업장 정리, 고객 설명용 요약을 작성한다.' }
  ],
  scenarios: [
    { normal: `${week.practiceTopic}: 기준값과 데이터 스트림이 허용범위 안에 있고 관련 DTC가 없다.`, abnormal: `${week.faults[0]}: 증상 재현 후 안전 차단, 측정, 원인 후보 기록 순서로 대응한다.` },
    { normal: '작업 후 재검증에서 경고등과 DTC가 재발하지 않는다.', abnormal: `${week.faults[1]}: 단일 부품 교환 전 전원·통신·열관리 조건을 교차 확인한다.` }
  ],
  checklist: [
    { item: '고전압 안전 절차 준수', points: 25 },
    { item: '계측기 설정과 측정 위치 정확성', points: 20 },
    { item: '정상/이상 데이터 비교 기록', points: 20 },
    { item: '진단 근거와 결론의 일치성', points: 20 },
    { item: '정리·복구·보고 품질', points: 15 }
  ]
});

const buildEvaluation = (week: WeekPlan, weekNumber: number): EvaluationData => {
  const isCumulative = [4, 8, 12, 16].includes(weekNumber);
  return {
    type: weekNumber === 16 ? 'capstone' : isCumulative ? 'cumulative' : 'formative',
    passCriteria: isCumulative ? '70점 이상 합격. 미달 시 오답 주제 보충학습과 실습 재수행.' : '60점 이상 합격. 미달 시 핵심 안전·진단 문항 재교육.',
    questions: [
      { id: `w${weekNumber}-q1`, type: 'multiple_choice', question: `${week.theme}에서 실물 실습 전 반드시 확인해야 하는 조건은?`, options: ['DTC 삭제', '고전압 안전 절차와 PPE 확인', '충전량 100%', '시동 READY 유지'], answer: 1, explanation: 'EV 실습은 차단, 검전, PPE 확인이 선행되어야 한다.', points: 10 },
      { id: `w${weekNumber}-q2`, type: 'multiple_choice', question: `${week.faults[0]} 사례에서 가장 적절한 진단 접근은?`, options: ['부품부터 교환한다', '증상-DTC-측정값을 연결해 원인을 좁힌다', '경고등을 삭제한다', '충전 후 다시 본다'], answer: 1, explanation: '복합 계통은 근거 기반 진단 루프가 필요하다.', points: 10 },
      { id: `w${weekNumber}-q3`, type: 'multiple_choice', question: `다음 중 ${week.theme} 학습에서 부적절한 행동은?`, options: ['측정 위치 기록', '기준값 확인', '임의 커넥터 탈거', '교수자 보고'], answer: 2, explanation: '고전압·통신 커넥터 임의 탈거는 2차 고장과 안전사고로 이어진다.', points: 10 },
      { id: `w${weekNumber}-q4`, type: 'multiple_choice', question: `${week.theoryFocus[0]}를 현장 진단과 연결할 때 필요한 자료는?`, options: ['증상, 회로도, 데이터 스트림, 측정값', '차량 색상', '타이어 브랜드', '주행 음악 설정'], answer: 0, explanation: '진단에는 증상과 계통 정보를 연결하는 자료가 필요하다.', points: 10 }
    ],
    rubric: [
      { criterion: '안전절차', levels: [{ label: '미흡', score: 1 }, { label: '보통', score: 2 }, { label: '우수', score: 3 }, { label: '탁월', score: 4 }] },
      { criterion: '진단근거', levels: [{ label: '미흡', score: 1 }, { label: '보통', score: 2 }, { label: '우수', score: 3 }, { label: '탁월', score: 4 }] },
      { criterion: '보고품질', levels: [{ label: '미흡', score: 1 }, { label: '보통', score: 2 }, { label: '우수', score: 3 }, { label: '탁월', score: 4 }] }
    ]
  };
};

const buildSessions = (week: WeekPlan, weekNumber: number): Session[] => [
  {
    id: `w${weekNumber}-d1`,
    day: 1,
    type: 'theory',
    rhythmLabel: 'D1 이론①',
    title: `${week.theme} - 이론① 원리·구조`,
    duration: 120,
    ncsUnit: week.ncs,
    objectives: [`${week.theoryFocus[0]}의 원리를 설명한다.`, '주요 구성품과 에너지·신호 흐름을 구분한다.'],
    simulatorId: week.simulatorId,
    theoryData: buildTheory(week, 1),
    practiceData: buildPractice(week, weekNumber)
  },
  {
    id: `w${weekNumber}-d2`,
    day: 2,
    type: 'theory',
    rhythmLabel: 'D2 이론②+개념점검',
    title: `${week.theme} - 이론② 고장·진단`,
    duration: 120,
    ncsUnit: week.ncs,
    objectives: [`${week.faults[0]}의 고장 메커니즘을 설명한다.`, '정상값과 이상값을 근거로 진단 가설을 세운다.'],
    simulatorId: week.simulatorId,
    theoryData: buildTheory(week, 2),
    practiceData: buildPractice(week, weekNumber)
  },
  {
    id: `w${weekNumber}-d3`,
    day: 3,
    type: 'simulator',
    rhythmLabel: 'D3 시뮬레이터',
    title: `${week.theme} - 가상실습 시뮬레이터`,
    duration: 120,
    ncsUnit: week.ncs,
    objectives: [week.simulatorFocus, '잘못된 조작 순서와 보호로직 개입 이유를 설명한다.'],
    simulatorId: week.simulatorId,
    theoryData: buildTheory(week, 2),
    practiceData: buildPractice(week, weekNumber)
  },
  {
    id: `w${weekNumber}-d4`,
    day: 4,
    type: 'practice',
    rhythmLabel: weekNumber === 1 ? 'D4 안전절차 관찰실습' : 'D4 실물실습',
    title: `${week.theme} - ${week.practiceTopic}`,
    duration: 120,
    ncsUnit: week.ncs,
    objectives: [`${week.practiceTopic} 절차를 체크리스트에 따라 수행한다.`, '측정값을 기준값과 비교해 정상/이상을 판정한다.'],
    simulatorId: week.simulatorId,
    theoryData: buildTheory(week, 2),
    practiceData: buildPractice(week, weekNumber)
  },
  {
    id: `w${weekNumber}-d5`,
    day: 5,
    type: 'evaluation',
    rhythmLabel: [4, 8, 12, 16].includes(weekNumber) ? 'D5 누적평가' : 'D5 형성평가',
    title: `${week.theme} - ${weekNumber === 16 ? '최종 캡스톤 평가' : [4, 8, 12, 16].includes(weekNumber) ? '누적평가' : '형성평가'}`,
    duration: 120,
    ncsUnit: week.ncs,
    objectives: ['주간 학습목표 달성도를 확인한다.', '미흡 영역을 보충학습 계획으로 연결한다.'],
    evaluationData: buildEvaluation(week, weekNumber)
  }
];

export const curriculumData: Curriculum = {
  title: '전기자동차 기술인력양성 과정',
  target: '내연기관 정비 경력자 EV전환',
  level: '중급',
  totalHours: 160,
  weeks: weekPlans.map((week, index) => ({
    weekNumber: index + 1,
    theme: week.theme,
    sessions: buildSessions(week, index + 1)
  }))
};
