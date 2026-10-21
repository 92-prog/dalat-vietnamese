// 음성인식 결과가 보내려는 문장과 성조까지 같은지 음절 단위로 판정한다.
// 대소문자·문장 부호·띄어쓰기, 성조 부호 위치(hòa/hoà)는 따지지 않는다.
import { stripTone, syllables, toneOf, type Tone } from './tone'

export type MarkStatus = 'ok' | 'tone' | 'wrong' | 'missing'

export interface SyllableMark {
  /** 보내려는 문장의 음절 (원래 표기 그대로) */
  text: string
  status: MarkStatus
  /** 대신 들린 음절 */
  heard?: string
  /** 성조만 틀렸을 때 들린 성조 */
  heardTone?: Tone
}

export interface PronunciationResult {
  pass: boolean
  marks: SyllableMark[]
  /** 문장에 없는데 더 들린 음절 */
  extra: string[]
}

interface Syl {
  text: string
  base: string
  tone: Tone
}

const parse = (sentence: string): Syl[] =>
  syllables(sentence).map((text) => ({ text, base: stripTone(text).toLowerCase(), tone: toneOf(text) }))

const subCost = (a: Syl, b: Syl) => (a.base !== b.base ? 1 : a.tone !== b.tone ? 0.5 : 0)

export function checkPronunciation(target: string, heard: string): PronunciationResult {
  const t = parse(target)
  const h = parse(heard)
  // 음절 편집 거리. 성조만 다르면 반만 틀린 것으로 쳐서 같은 자리끼리 짝짓게 한다.
  const d = Array.from({ length: t.length + 1 }, (_, i) => Array.from({ length: h.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= h.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + subCost(t[i - 1], h[j - 1]))
    }
  }

  const marks: SyllableMark[] = []
  const extra: string[] = []
  let i = t.length
  let j = h.length
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + subCost(t[i - 1], h[j - 1])) {
      const [a, b] = [t[i - 1], h[j - 1]]
      const cost = subCost(a, b)
      marks.push(
        cost === 0
          ? { text: a.text, status: 'ok' }
          : cost === 0.5
            ? { text: a.text, status: 'tone', heard: b.text, heardTone: b.tone }
            : { text: a.text, status: 'wrong', heard: b.text },
      )
      i--
      j--
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      marks.push({ text: t[i - 1].text, status: 'missing' })
      i--
    } else {
      extra.push(h[j - 1].text)
      j--
    }
  }
  marks.reverse()
  extra.reverse()
  return { pass: t.length > 0 && extra.length === 0 && marks.every((m) => m.status === 'ok'), marks, extra }
}

/** 음성인식은 숫자를 아라비아 숫자로 쓰기도 해서, 보낼 문장의 숫자는 글자로 쓰게 한다. */
export function hasDigits(text: string): boolean {
  return /\d/.test(text)
}
