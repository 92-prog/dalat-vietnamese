// 녹음 파일 이름 규칙. 브라우저와 생성 스크립트(scripts/gen-audio.mjs)가 같은 함수를 쓴다.
export function normalizeAudioText(text: string): string {
  return text.normalize('NFC').trim()
}

/** FNV-1a 32bit 해시 → 8자리 16진수 */
export function audioKey(text: string): string {
  let h = 0x811c9dc5
  for (const ch of normalizeAudioText(text)) {
    const cp = ch.codePointAt(0)!
    h ^= cp
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}
