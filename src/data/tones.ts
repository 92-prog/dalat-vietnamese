import type { Tone } from '../lib/tone'

export interface ToneInfo {
  tone: Tone
  mark: string
  example: string
  /** 음높이 1(낮음)~5(높음) 점들. 'x'는 목이 끊기는 지점 */
  contour: (number | 'x')[]
  how: string
  south?: string
}

export const TONE_INFO: ToneInfo[] = [
  { tone: 'ngang', mark: '(없음)', example: 'ma', contour: [3, 3], how: '중간 높이에서 평평하게 쭉 끈다. 한국어로 "마~" 하고 길게 읽는 느낌.' },
  { tone: 'huyen', mark: 'à', example: 'mà', contour: [2.5, 1.5], how: '평소보다 낮게 시작해서 힘 빼고 천천히 내려간다. 한숨 쉬듯 부드럽게.' },
  { tone: 'sac', mark: 'á', example: 'má', contour: [3, 5], how: '중간에서 높이 쭉 올린다. "응?" 하고 되물을 때처럼 끝을 확 올린다.' },
  {
    tone: 'hoi',
    mark: 'ả',
    example: 'mả',
    contour: [3, 1.5, 2.5],
    how: '중간에서 아래로 떨어졌다가 살짝 다시 올라온다. "어~어?" 하고 의아할 때 느낌.',
    south: '남부·달랏에서는 hỏi와 ngã를 거의 같게(내려갔다 올라오게) 발음한다.',
  },
  {
    tone: 'nga',
    mark: 'ã',
    example: 'mã',
    contour: [3, 3.5, 'x', 5],
    how: '올라가다가 중간에 목을 한 번 꺾듯 끊고 다시 높이 올라간다.',
    south: '남부·달랏에서는 hỏi처럼 내려갔다 올라오게 발음하는 사람이 많다.',
  },
  {
    tone: 'nang',
    mark: 'ạ',
    example: 'mạ',
    contour: [2, 1, 'x'],
    how: '낮게 툭 떨어뜨리고 목을 막아 짧게 끊는다. 무거운 걸 내려놓듯 "맏!"',
    south: '남부에서는 끊지 않고 낮게 내려갔다 살짝 올라오기도 한다.',
  },
]

export interface MinimalSet {
  title: string
  words: { vi: string; ko: string }[]
}

// 성조만 다르고 소리가 같은 단어 묶음. 듣기 퀴즈에 쓴다.
export const MINIMAL_SETS: MinimalSet[] = [
  {
    title: 'ma 6성조',
    words: [
      { vi: 'ma', ko: '귀신' },
      { vi: 'mà', ko: '그런데, 하지만' },
      { vi: 'má', ko: '뺨 / (남부) 엄마' },
      { vi: 'mả', ko: '무덤' },
      { vi: 'mã', ko: '말(馬), 코드' },
      { vi: 'mạ', ko: '모(볏모)' },
    ],
  },
  {
    title: 'ban',
    words: [
      { vi: 'ban', ko: '반, 부서(班)' },
      { vi: 'bàn', ko: '책상, 테이블' },
      { vi: 'bán', ko: '팔다' },
      { vi: 'bản', ko: '판(本), 마을' },
      { vi: 'bạn', ko: '친구, 너' },
    ],
  },
  {
    title: 'mua · múa · mùa',
    words: [
      { vi: 'mua', ko: '사다' },
      { vi: 'múa', ko: '춤추다' },
      { vi: 'mùa', ko: '계절' },
    ],
  },
  {
    title: 'tôi',
    words: [
      { vi: 'tôi', ko: '나, 저' },
      { vi: 'tối', ko: '저녁, 어둡다' },
      { vi: 'tồi', ko: '형편없다' },
      { vi: 'tội', ko: '죄, 불쌍하다' },
    ],
  },
  {
    title: 'bo',
    words: [
      { vi: 'bò', ko: '소(소고기)' },
      { vi: 'bó', ko: '다발, 묶다' },
      { vi: 'bỏ', ko: '버리다, 넣다' },
      { vi: 'bọ', ko: '벌레' },
    ],
  },
  {
    title: 'sữa · sửa · sứa',
    words: [
      { vi: 'sữa', ko: '우유' },
      { vi: 'sửa', ko: '고치다' },
      { vi: 'sứa', ko: '해파리' },
    ],
  },
  {
    title: 'đâu · đầu · đấu · đậu',
    words: [
      { vi: 'đâu', ko: '어디' },
      { vi: 'đầu', ko: '머리, 처음' },
      { vi: 'đấu', ko: '겨루다, 경기' },
      { vi: 'đậu', ko: '콩, 주차하다' },
    ],
  },
]
