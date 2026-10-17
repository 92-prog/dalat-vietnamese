// 앱에서 소리로 들려주는 모든 베트남어. scripts/gen-audio.mjs가 이 목록을 Linh 음성으로 녹음한다.
import { normalizeAudioText } from '../lib/audioKey'
import { CONSONANTS, FINALS, VOWELS } from './alphabet'
import { SCENES } from './scenes'
import { MINIMAL_SETS, TONE_INFO } from './tones'

export const VOICE_TEST_TEXT = 'Xin chào, tôi là người Hàn Quốc.'

export function allAudioTexts(): string[] {
  const texts = [
    ...SCENES.flatMap((s) => s.phrases.map((p) => p.vi)),
    ...MINIMAL_SETS.flatMap((s) => s.words.map((w) => w.vi)),
    ...TONE_INFO.map((t) => t.example),
    ...[...VOWELS, ...CONSONANTS, ...FINALS].map((l) => l.example),
    VOICE_TEST_TEXT,
  ]
  return [...new Set(texts.map(normalizeAudioText))]
}
