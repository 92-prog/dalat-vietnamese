import { describe, expect, it } from 'vitest'
import { normalizeState } from '../src/lib/storage'

describe('storage', () => {
  it('채팅 이름이 없던 예전 백업도 기본값을 채워 불러온다', () => {
    const old = { version: 1, startDate: '2026-10-01', cards: {}, settings: { voiceURI: null, rate: 0.8, dailyNew: 10 } }
    expect(normalizeState(old)?.settings.chatName).toBe('')
  })
})
