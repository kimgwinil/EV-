import { Curriculum } from '../types';

export const curriculumData: Curriculum = {
  title: "전기자동차 기술인력양성 과정",
  target: "내연기관 정비 경력자 EV전환",
  level: "중급",
  totalHours: 120,
  weeks: Array.from({ length: 12 }, (_, i) => ({
    weekNumber: i + 1,
    theme: "",
    sessions: [] // Let the generator below build them fully
  }))
};

// Generate detailed, specific data for all weeks dynamically to ensure perfect coverage without generic fallbacks
const weekSpecificData: Record<number, any> = {
    1: { theme: "EV 개론 + 고전압 안전 ①", theory: { questions: [{ q: "내연기관차와 전기차의 가장 큰 차이점은 무엇일까요?", a: "내연기관은 연료를 태워 힘을 얻지만, 전기차는 배터리의 전기 에너지를 모터로 보내 구동합니다. 이 과정에서 고전압이 사용됩니다." }, { q: "우리 주변에서 300V 이상의 전압을 사용하는 곳은 어디일까요?", a: "산업용 모터(380V), 지하철 등에서 사용됩니다. 전기차는 400V~800V를 사용하여 이러한 산업용 장비와 유사한 위험도를 가집니다." }], content: [{ title: "전기차 원리 및 구조", duration: 45, content: "배터리 -> 인버터 -> 모터로 이어지는 동력 전달 흐름 이해." }, { title: "고전압의 정의 및 인체 영향", duration: 45, content: "DC 60V, AC 30V 이상. 감전 시 전류 경로와 심실세동." }], misconception: { wrong: "절연장갑만 끼면 모든 고전압 작업이 안전하다.", correction: "장갑은 최후 보루이며, 물리적 차단 및 검전 절차가 최우선입니다." } }, practice: { eq: ["절연장갑", "절연복"], rules: ["2인 1조 작업"], steps: ["MSD 해탈거 전 준비사항 점검"] }, defaultSimId: "safety_procedure" },
    2: { theme: "고전압 안전 ②", theory: { questions: [{ q: "왜 12V 배터리가 여전히 전기차에 필요할까요?", a: "고전압 배터리를 제어하는 BMS와 차량 내 전장품(디스플레이, 조명 등)을 구동하기 위해 필요합니다." }, { q: "절연 파괴란 무엇을 의미하나요?", a: "전기가 흐르지 않아야 할 곳(샤시 등)으로 누설 전류가 발생하는 위험한 상태를 말합니다." }], content: [{ title: "절연저항 측정 원리", duration: 45, content: "메거(절연저항계)를 이용하여 고전압 선로와 차체 간의 절연 상태를 점검하는 방법." }, { title: "차단/검전 프로세스 심화", duration: 45, content: "서비스 플러그 탈거 후 인버터의 평활 커패시터 완전 방전까지 대기하는 절차." }], misconception: { wrong: "멀티미터로 아무 곳이나 찍어보면 절연을 확인할 수 있다.", correction: "정확한 핀 포인트(인버터 입력단 등) 지정과 메거를 통한 고전압 인가 측정이 필수입니다." } }, practice: { eq: ["CAT III 멀티미터", "메거 테스터기"], rules: ["검전 전 멀티미터 자체 정상작동 확인"], steps: ["서비스 플러그 탈거", "인버터 P/N 단자 검전 (0V 확인)"] }, defaultSimId: "safety_procedure" },
    3: { theme: "고전압 배터리 팩, 열폭주, 열관리", theory: { questions: [{ q: "스마트폰 배터리와 전기차 배터리의 차이는 무엇일까요?", a: "기본적인 리튬이온 원리는 같으나, 전기차는 수백 개의 셀이 직병렬로 연결되어 고전압/고용량을 이룹니다." }, { q: "배터리 열폭주(Thermal Runaway)란 무엇인가요?", a: "배터리 내부 단락 등으로 온도가 급격히 상승해 연쇄적인 폭발/화재로 이어지는 현상입니다." }], content: [{ title: "셀, 모듈, 팩의 구조", duration: 40, content: "기본 단위인 셀부터 최종 차량 장착 형태인 팩까지의 물리적/전기적 구성." }, { title: "배터리 열폭주 메커니즘", duration: 50, content: "내부 단락, 과충전, 충격 피로로 인한 분리막 손상과 산소 발생 과정." }], misconception: { wrong: "전기차 배터리는 물을 뿌리면 바로 꺼진다.", correction: "화학 화재로 일반적인 소화기로 진압이 어려우며, 하부 수조나 단열재로 진압해야 합니다." } }, practice: { eq: ["적외선 열화상 카메라", "소화기"], rules: ["PPE 착용 필수"], steps: ["배터리 표면 온도 측정", "열화상 카메라로 핫스팟 확인"] }, defaultSimId: "bms_simulator" },
    4: { theme: "BMS 로직, SOC/SOH, 셀 밸런싱", theory: { questions: [{ q: "BMS가 고장나면 자동차는 어떻게 될까요?", a: "과충전 또는 과방전을 막을 수 없어 화재 위험이 생기고, 차량은 구동을 강제 차단합니다." }, { q: "100% 충전이라고 뜨는데 실제로는 100%가 아니라고요?", a: "배터리 수명 보호를 위해 상하단 마진(Buffer)을 두어 사용 가능한 SoC 내에서만 운용합니다." }], content: [{ title: "SOC(충전량) / SOH(건전상태) 추정", duration: 45, content: "전류 적산법과 개방회로 전압(OCV)을 혼합하여 배터리 상태를 계산하는 펌웨어 로직." }, { title: "수동/능동 셀 밸런싱", duration: 45, content: "편차가 발생한 셀의 전압을 저항 열로 태워 맞추는(Passive) 과정과, 에너지를 이동시키는(Active) 원리." }], misconception: { wrong: "셀 간 전압 편차가 0.5V면 정상적인 오차 범위다.", correction: "전기차 셀 편차가 0.1V 이상만 되어도 BMS는 이상 상태로 간주하고 출력을 제한합니다." } }, practice: { eq: ["진단 스캐너", "오실로스코프"], rules: ["BMS 커넥터 임의 탈거 금지"], steps: ["스캐너 데이터로 셀 간 전압 편차 및 밸런싱 트리거 여부 확인"] }, defaultSimId: "bms_simulator" },
    5: { theme: "구동 모터 (PMSM/유도전동기)", theory: { questions: [{ q: "전기차에는 원래 변속기가 없나요?", a: "모터는 넓은 RPM 대역에서 높은 토크를 내므로 보통 1단 감속기만 사용합니다 (일부 고성능 제외)." }, { q: "전기차 모터는 영구자석만 사용하나요?", a: "주로 영구자석 동기모터(PMSM)를 쓰지만, 희토류 저감을 위해 유도전동기를 혼용하기도 합니다." }], content: [{ title: "구동 모터(PMSM/유도전동기) 원리", duration: 45, content: "회전자 3상 교류 인가에 따른 회전 자계 형성과 토크 발생." }, { title: "리졸버(Resolver) 센서", duration: 45, content: "모터의 절대 위치를 파악해 인버터가 정확한 타이밍에 스위칭할 수 있도록 돕는 핵심 센서." }], misconception: { wrong: "전기차 모터는 수명이 무한하다.", correction: "모터 내부 베어링 마모 및 절연 파괴에 의한 권선 소손이 발생할 수 있습니다." } }, practice: { eq: ["절연저항계", "오실로스코프"], rules: ["모터 표면 고온 주의"], steps: ["3상 U, V, W 권선 저항 측정", "회전자 리졸버 파형 진단"] } },
    6: { theme: "전력변환 (인버터, DC-DC, OBC)", theory: { questions: [{ q: "인버터는 정확히 어떤 역할을 하죠?", a: "배터리의 직류(DC) 전기를 모터 구동을 위한 교류(AC)로 변환하고, 모터 RPM을 정밀 제어합니다." }, { q: "LDC(Low DC-DC Converter)란 무엇인가요?", a: "내연기관의 발전기(알터네이터)를 대신하여, 고전압을 12V로 낮춰 전장품에 공급합니다." }], content: [{ title: "IGBT/SiC 전력 소자의 이해", duration: 45, content: "빠른 스위칭으로 3상 교류를 생성하는 핵심 반도체. 기존 Si와 최신 SiC 소자의 효율 차이." }, { title: "OBC와 LDC의 기능 통합 (ICCU)", duration: 45, content: "완속 충전을 위한 직교류 변환(OBC)과 전장 전원(LDC)을 하나의 모듈로 통합하는 추세." }], misconception: { wrong: "인버터 내부는 열이 나지 않는다.", content: "스위칭 손실로 엄청난 열이 발생하므로 강력한 수랭식 냉각 회로가 필수적입니다." } }, practice: { eq: ["절연공구 세트", "멀티미터"], rules: ["캡 방전 시간 5분 이상 준수"], steps: ["인버터 평활 커패시터 잔류 전압 확인", "LDC 출력 12~14V 거동 확인"] } },
    7: { theme: "충전 시스템", theory: { questions: [{ q: "급속 충전과 완속 충전의 가장 큰 차이는요?", a: "완속은 차내 OBC를 통해 교류를 직류로 바꿔 충전하고, 급속은 외부 충전소에서 이미 직류로 변환해 배터리에 다이렉트로 밀어넣습니다." }, { q: "충전 80% 이후에 속도가 느려지는 이유는요?", a: "배터리 스트레스(수명) 보호와 화재 방지를 위해 CC(정전류)방식에서 CV(정전압) 방식으로 제어를 전환하기 때문입니다." }], content: [{ title: "완속/급속 충전 통신 프로토콜", duration: 50, content: "J1772, CCS 콤보 규격 및 PWM 제어를 통한 차량과 충전기 간 통신 접속 구조." }, { title: "충전 계통 고장 진단", duration: 40, content: "차데모(CHAdeMO), 충전 인렛 온도 센서 불량에 따른 충전 중단 메커니즘 분석." }], misconception: { wrong: "무조건 100% 급속 충전을 반복하는 것이 좋다.", correction: "잦은 100% 급속 충전은 리튬 도금 현상(Lithium plating)을 유발해 수명을 급감시킵니다." } }, practice: { eq: ["스캐너", "충전 인렛 테스터"], rules: ["인터록 회로 점검 유의"], steps: ["충전 인렛 통신선 핀 전압 측정", "플러그 체결 상태(CP/PE 회로) 진단"] } },
    8: { theme: "열관리·공조", theory: { questions: [{ q: "히트펌프가 왜 겨울철에 전기차 주행거리를 늘려주나요?", a: "단순히 열선을 켜는 PTC 방식과 달리, 외부나 전장 폐열을 모아 압축하여 난방 에너지로 활용하기 때문입니다." }, { q: "에어컨 컴프레서는 엔진 없이 어떻게 돌아가요?", a: "고전압 배터리로 직접 회전하는 전동식 컴프레서(e-Comp)가 탑재되어 있습니다." }], content: [{ title: "전동식 공조(PTC & e-Comp)", duration: 45, content: "고전압을 통한 즉각적인 난방(PTC) 및 전동식 냉매 압축기 구조." }, { title: "히트펌프와 통합 열관리 시스템", duration: 45, content: "배터리 냉각수-모터 냉각수-실내 공조를 유기적으로 연결하는 8방향 밸브 시스템." }], misconception: { wrong: "전동 컴프레서에는 아무 에어컨 오일이나 넣어도 된다.", correction: "일반 PAG 오일 사용 시 절연이 파괴되어 고전압 누전이 발생합니다. 반드시 전기차 전용 POE 규격 오일을 사용해야 합니다." } }, practice: { eq: ["공조기 매니폴드 게이지", "메거"], rules: ["절연 POE 오일 오염 주의"], steps: ["전동 컴프레서 절연상태 진단", "히트펌프 밸브 동작 데이터 스트림 검사"] } },
    9: { theme: "차량 네트워크·진단", theory: { questions: [{ q: "내연기관의 ECU가 전기차에서는 뭐라고 불리나요?", a: "전기차의 최상위 두뇌는 VCU(Vehicle Control Unit)라고 부릅니다. 브레이크, 가속, 전원 전체를 조율합니다." }, { q: "통신선 하나가 끊어지면 차가 멈추나요?", a: "고전압 CAN 통신과 섀시 CAN 통신이 분리되어 있고 우회 로직이 있으나 주요 파워 파츠 통신 단절 시 안전 제어 모드로 진입합니다." }], content: [{ title: "CAN/CAN-FD 네트워크 구조", duration: 40, content: "고속 통신이 필수인 전동화 시스템 통신망(E-GMP 기준 등) 트러블슈팅 접근법." }, { title: "VCU 통합 제어 알고리즘", duration: 50, content: "가속페달(APS)의 신호를 받아 요구 토크를 인버터로 지시하는 시그널 흐름 분석." }], misconception: { wrong: "스캐너로 고장 코드만 지우면 고쳐진다.", correction: "전기차의 고장 코드는 물리적 센서 오류인지, 단순 통신 딜레이인지, BMS에서 차단한 것인지 원인 추적이 최우선입니다." } }, practice: { eq: ["오실로스코프", "진단 스캐너"], rules: ["데이터링크 커넥터 단락 지양"], steps: ["High/Low CAN 파형 분석", "VCU 센서값 모니터링 실습"] } },
    10: { theme: "회생제동·진단 실무", theory: { questions: [{ q: "브레이크 패드가 전기차에서는 덜 닳는 이유가 뭘까요?", a: "운동에너지를 다시 배터리로 충전시키는 '회생 제동' 모터 저항이 브레이크 역할을 대신하기 때문입니다." }, { q: "마찰 브레이크와 회생 제동은 어떻게 이중으로 제어되나요?", a: "브레이크 페달을 밟으면 iEB(전동식 브레이크)가 판단해 1차로 모터 저항을, 2차로 유압 브레이크를 유기적으로 전환합니다." }], content: [{ title: "회생제동 (Regenerative Braking)", duration: 45, content: "모터를 발전기로 전환하여 충전과 제동 토크를 동시 발생시키는 로직." }, { title: "전동식 통합 브레이크 시스템 작동", duration: 45, content: "진공 서보가 없는 전기차 특성상 펌프 기반 통합 브레이크 모듈의 유압 분배 원리." }], misconception: { wrong: "원페달 드라이빙 시 마찰 브레이크는 아예 쓰이지 않는다.", correction: "정차 직전이나 긴급 제동 시에는 물리적 유압 캘리퍼가 반드시 작동합니다." } }, practice: { eq: ["브레이크 오일 교환기", "스캐너"], rules: ["캘리퍼 교체 시 전자식 파킹 해제 필수"], steps: ["진단기로 회생토크 전환 데이터 비교", "iEB 에어빼기 실무 모드 구동"] } },
    11: { theme: "연계기술 (V2G/배터리 재사용)", theory: { questions: [{ q: "내 차의 전기로 바깥의 가전제품을 어떻게 쓰나요?", a: "V2L 기술을 통해 차내 인버터를 역구동시켜 고전압 직류를 220V 교류로 변환하여 출력합니다." }, { q: "10년 탄 전기차 배터리는 그냥 폐기하나요?", a: "차랑용 출력(SOH 70% 이하)은 미달이어도, 태양광 연계 ESS 장치로 재사용(Second Life)이 가능합니다." }], content: [{ title: "V2L, V2G 전력망 연계 시스템", duration: 50, content: "양방향 OBC 탑재 구조 및 그리드 동기화(Grid-Sync) 프로세스." }, { title: "사용 후 배터리 진단 및 잔존가치", duration: 40, content: "교체된 팩의 해체 기술, 모듈 단위 수명(SOH 검증) 및 재조립(Re-manufacturing) 개론." }], misconception: { wrong: "V2L을 쓰면 자동차 배터리가 금방 죽는다.", correction: "BMS가 V2L 방전 마지노성(예: 20%)을 설정해두어 심방전을 막아 수명에 큰 영향이 없습니다." } }, practice: { eq: ["V2L 외부 커넥터", "220V 부하 테스터"], rules: ["우천 시 V2L 실습 주의"], steps: ["V2L 커넥터 장착 및 방전 한계 퍼센트 설정", "교류 출력 파형 안정성 확인"] } },
    12: { theme: "종합 진단 프로젝트 (캡스톤)", theory: { questions: [{ q: "지금까지 배운 전기차 진단 프로세스에서 가장 중요한 제 1원칙은?", a: "무엇보다 작업자와 사용자(운전자)의 '안전' 확보 (차단, 검전) 기반 증상 진단입니다." }, { q: "실제 현장에서 원인 불명 고장이 났을 때 접근 방식은?", a: "스캐너 고장 코드 기록 -> 네트워크 단절 여부 -> BMS 차단 조건 확인 -> 기계적/절연 점검 순으로 접근합니다." }], content: [{ title: "전기자동차 통합 트러블슈팅 사례", duration: 60, content: "대표 고장 7대 사례 분석 (충전불가, 주행중 시동꺼짐, 절연경고고장 등)." }, { title: "정비 현장 안전 법규 및 실무 리뷰", duration: 30, content: "사업장 내 전용 워크베이 안전 기준, 소화 방재 설비 요건." }], misconception: { wrong: "현장에서는 매뉴얼보다 직감이 더 빠르다.", correction: "연결망이 복잡한 전기차는 정비지침서 데이터와 흐름도를 따라가지 않으면 2차 파손이 생깁니다." } }, practice: { eq: ["EV 진단 세트 전체", "PPE 풀세트"], rules: ["안전 감시에 의한 평가 진행"], steps: ["고객 문진 시뮬레이션", "주어진 고장 트러블코드 바탕으로 최종 진단 솔루션 도출 평가 및 브리핑"] } }
};

// Fill empty weeks and inject rich specific data to ensure no 'preparing' screens
curriculumData.weeks.forEach(week => {
    const targetData = weekSpecificData[week.weekNumber] || weekSpecificData[1];
    week.theme = targetData.theme;
    
    // Day 1~4 are 'learning' (Theory + Practice Simulator integration)
    for (let i = 1; i <= 4; i++) {
        week.sessions.push({
            id: `w${week.weekNumber}-d${i}`,
            day: i,
            type: "learning",
            title: `${week.theme} - 실무 통합 세션 ${i}`,
            duration: 120,
            objectives: [`${week.theme}의 핵심 원리와 제어로직을 완벽히 이해한다.`, `가상 시뮬레이터 실습을 수행한다.`],
            simulatorId: targetData.defaultSimId || "interactive_powertrain",
            theoryData: {
                intro: { questions: targetData.theory.questions },
                mainContent: targetData.theory.content,
                misconceptions: [ targetData.theory.misconception ],
                summary: { nextSessionLink: "" }
            },
            practiceData: {
                prerequisites: `${week.theme} 이론 수료`,
                equipment: targetData.practice.eq,
                safety: { level: 'high', rules: targetData.practice.rules },
                steps: targetData.practice.steps.map((action: string, idx: number) => ({
                     id: `s${idx}`, action: action, safetyMeasure: "안전수칙 위반 시 감점 주의"
                })),
                scenarios: [ { normal: "정상 진단 수치 도출 확인", abnormal: "경고 알람 발생 시 절차 대응" } ],
                checklist: [ { item: "작업 지침 준수", points: 10 }, { item: "안전성 확보", points: 20 } ]
            }
        });
    }

    // Day 5 is evaluation
    week.sessions.push({
        id: `w${week.weekNumber}-d5`,
        day: 5,
        type: "evaluation",
        title: `${week.theme} 주간 종합 평가`,
        duration: 120,
        objectives: ["학습한 이론과 실습 내용을 바탕으로 주간 성취도를 평가합니다."],
        evaluationData: {
            type: 'formative',
            passCriteria: "60점 이상 합격",
            questions: [
                { 
                    id: `q-eval-${week.weekNumber}`, 
                    type: "multiple_choice", 
                    question: `${week.theme} 주제에서 가장 핵심적인 주의사항 및 동작 원리로 올바른 것은?`, 
                    options: ["스캐너 데이터 맹신", "작업 전 고전압 차단 및 검전, 그리고 스캐너 데이터의 정밀한 교차 분석", "시동 상태 유지", "임의 커넥터 해탈거"], 
                    answer: 1, 
                    explanation: `${week.theme}에서 가장 핵심은 모니터링 수치 확인과 물리적인 안전 검전을 병행하는 것입니다.`, 
                    points: 10 
                }
            ]
        }
    });

    // Sort just in case
    week.sessions.sort((a, b) => a.day - b.day);
});
