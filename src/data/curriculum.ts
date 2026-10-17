// 12주 로드맵. 주차마다 새로 배울 장면을 정한다. 앞 주차에서 다 못 한 문장이 먼저 나온다.
export interface Week {
  week: number
  focus: string
  scenes: string[]
  tip: string
}

export const CURRICULUM: Week[] = [
  { week: 1, focus: '알파벳·발음·6성조', scenes: ['greet'], tip: '성조 탭에서 매일 듣기 퀴즈를 20문제 이상 풀어 보세요. 성조가 귀에 들어와야 나머지가 빨라져요.' },
  { week: 2, focus: '성조 굳히기·인사', scenes: ['numbers'], tip: '숫자는 소리 내어 세면서 외우세요. 가격 듣기가 시장 생활의 절반이에요.' },
  { week: 3, focus: '카페 주문', scenes: ['cafe'], tip: '실제 카페에 간 것처럼 소리 내어 주문해 보세요.' },
  { week: 4, focus: '식당·길거리 음식', scenes: ['food'], tip: '"Cho tôi ~" 뒤에 음식 이름만 바꿔 끼우는 연습을 하세요.' },
  { week: 5, focus: '시장·흥정', scenes: ['market'], tip: '숫자 장면을 다시 복습하면서 흥정 문장과 함께 연습하세요.' },
  { week: 6, focus: '이동·길 묻기', scenes: ['ride'], tip: '기사와의 전화 통화를 상상하며 쉐도잉해 보세요.' },
  { week: 7, focus: '집 구하기', scenes: ['housing'], tip: '집을 보러 갈 때 물어볼 질문 목록을 만들어 두세요.' },
  { week: 8, focus: '오토바이·장보기', scenes: ['motorbike', 'grocery'], tip: '생활용품 이름은 실제 물건을 보며 말해 보세요.' },
  { week: 9, focus: '유심·은행', scenes: ['services'], tip: '도착 첫 주에 할 일(유심, 환전, 계좌)을 미리 연습해 두세요.' },
  { week: 10, focus: '병원·긴급 상황', scenes: ['health', 'emergency'], tip: '긴급 문장은 쓸 일이 없길 바라지만, 입에서 바로 나와야 해요.' },
  { week: 11, focus: '날씨·이웃과 대화', scenes: ['weather', 'neighbors'], tip: '이웃과 나눌 짧은 안부 인사를 매일 한 번씩 말해 보세요.' },
  { week: 12, focus: '총복습·듣기 속도 올리기', scenes: [], tip: '설정에서 재생 속도를 1.0배로 올리고, 듣기 퀴즈로 약한 문장을 찾으세요.' },
]

export function weekFor(dayIndex: number): Week {
  const w = Math.min(CURRICULUM.length, Math.max(1, Math.floor(dayIndex / 7) + 1))
  return CURRICULUM[w - 1]
}
