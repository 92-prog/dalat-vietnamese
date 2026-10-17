import { describe, expect, it } from 'vitest'
import { CURRICULUM } from '../src/data/curriculum'
import { SCENES, SCENE_BY_ID } from '../src/data/scenes'
import { MINIMAL_SETS, TONE_INFO } from '../src/data/tones'
import { toneOf } from '../src/lib/tone'

const phrases = SCENES.flatMap((s) => s.phrases)

describe('content', () => {
  it('장면이 14개, 문장이 280개 이상이다', () => {
    expect(SCENES).toHaveLength(14)
    expect(phrases.length).toBeGreaterThanOrEqual(280)
  })
  it('장면마다 문장이 15개 이상이다', () => {
    for (const s of SCENES) expect(s.phrases.length, s.id).toBeGreaterThanOrEqual(15)
  })
  it('문장 id가 겹치지 않는다', () => {
    const ids = phrases.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('모든 문장에 베트남어와 한국어가 있고 NFC로 저장돼 있다', () => {
    for (const p of phrases) {
      expect(p.vi.trim(), p.id).not.toBe('')
      expect(p.ko.trim(), p.id).not.toBe('')
      for (const text of [p.vi, p.ko, p.note, p.north, p.south].filter(Boolean) as string[]) {
        expect(text, p.id).toBe(text.normalize('NFC'))
      }
    }
  })
  it('한자어 힌트의 단어가 실제 문장에 들어 있다', () => {
    for (const p of phrases) {
      for (const [word] of p.hanja ?? []) expect(p.vi.toLowerCase(), p.id).toContain(word.toLowerCase())
    }
  })
  it('커리큘럼이 모든 장면을 한 번씩 다룬다', () => {
    const used = CURRICULUM.flatMap((w) => w.scenes)
    for (const id of used) expect(SCENE_BY_ID[id], id).toBeDefined()
    expect(new Set(used).size).toBe(used.length)
    expect(used.length).toBe(SCENES.length)
  })
  it('성조 예시와 최소대립쌍의 성조가 표기와 맞다', () => {
    for (const t of TONE_INFO) expect(toneOf(t.example)).toBe(t.tone)
    for (const set of MINIMAL_SETS) {
      const tones = set.words.map((w) => toneOf(w.vi))
      expect(new Set(tones).size, set.title).toBe(tones.length)
    }
  })
})
