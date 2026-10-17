// 베트남어 성조 판별·변환. 성조 부호는 NFD로 분해했을 때 나오는 결합 부호로 구분한다.
// (ơ·ư의 갈고리, â·ê·ô의 모자, ă의 반달은 모음 글자의 일부라서 성조가 아니다.)

export type Tone = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang'

export const TONES: Tone[] = ['ngang', 'huyen', 'sac', 'hoi', 'nga', 'nang']

const MARK_TO_TONE: Record<string, Tone> = {
  '̀': 'huyen',
  '́': 'sac',
  '̉': 'hoi',
  '̃': 'nga',
  '̣': 'nang',
}

const TONE_TO_MARK: Record<Tone, string> = {
  ngang: '',
  huyen: '̀',
  sac: '́',
  hoi: '̉',
  nga: '̃',
  nang: '̣',
}

const VOWELS = new Set('aăâeêioôơuưy')
// 모음 위에 붙는 모양 부호(성조 아님). 이 부호가 있는 모음이 성조를 받는다.
const SHAPED = new Set('ăâêôơư')

const isToneMark = (ch: string) => ch in MARK_TO_TONE
const baseLower = (ch: string) => stripTone(ch).toLowerCase()
const isVowel = (ch: string) => VOWELS.has(baseLower(ch))

export function toneOf(syllable: string): Tone {
  for (const ch of syllable.normalize('NFD')) {
    const tone = MARK_TO_TONE[ch]
    if (tone) return tone
  }
  return 'ngang'
}

export function stripTone(text: string): string {
  return [...text.normalize('NFD')].filter((ch) => !isToneMark(ch)).join('').normalize('NFC')
}

function addMark(ch: string, tone: Tone): string {
  // 모양 부호 뒤에 성조 부호를 붙이고 NFC로 다시 합친다 (a + ̂ + ́ → ấ).
  return (ch.normalize('NFD') + TONE_TO_MARK[tone]).normalize('NFC')
}

/** 성조가 없는 음절에서 성조 부호가 들어갈 글자 위치를 찾는다 (구 표기법: hòa, thủy). */
function tonePosition(chars: string[]): number {
  let i = 0
  while (i < chars.length && !isVowel(chars[i])) i++
  const initial = chars.slice(0, i).join('').toLowerCase()
  // qu-의 u, 모음 앞 gi-의 i는 자음의 일부다.
  if (initial === 'q' && baseLower(chars[i] ?? '') === 'u') i++
  else if (initial === 'g' && baseLower(chars[i] ?? '') === 'i' && isVowel(chars[i + 1] ?? '')) i++

  const start = i
  while (i < chars.length && isVowel(chars[i])) i++
  const end = i // nucleus = [start, end)
  if (start >= end) return -1
  const hasFinal = end < chars.length

  for (let k = end - 1; k >= start; k--) {
    if (SHAPED.has(baseLower(chars[k]))) return k
  }
  const len = end - start
  if (len === 1) return start
  if (hasFinal) return end - 1
  if (len === 2) return start
  return start + 1
}

/** 음절의 성조를 바꾼다. 원래 성조 부호가 있으면 같은 글자 위에서 바꾼다. */
export function withTone(syllable: string, tone: Tone): string {
  const chars = [...syllable.normalize('NFC')]
  let pos = chars.findIndex((ch) => toneOf(ch) !== 'ngang')
  const plain = chars.map(stripTone)
  if (pos < 0) pos = tonePosition(plain)
  if (pos < 0 || tone === 'ngang') return plain.join('')
  plain[pos] = addMark(plain[pos], tone)
  return plain.join('')
}

/** 문장에서 음절만 뽑는다 (문장 부호 제외). */
export function syllables(sentence: string): string[] {
  return sentence
    .normalize('NFC')
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
}

export const TONE_LABEL: Record<Tone, { vi: string; ko: string }> = {
  ngang: { vi: 'ngang', ko: '평성' },
  huyen: { vi: 'huyền', ko: '내림' },
  sac: { vi: 'sắc', ko: '올림' },
  hoi: { vi: 'hỏi', ko: '굽이' },
  nga: { vi: 'ngã', ko: '꺾임' },
  nang: { vi: 'nặng', ko: '무거움' },
}
