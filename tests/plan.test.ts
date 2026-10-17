import { describe, expect, it } from 'vitest'
import { addCard, currentWeek, newQueue, reviewCard, todaysNew } from '../src/lib/plan'
import { Rating } from '../src/lib/srs'
import { currentStreak, defaultState, exportState, importState } from '../src/lib/storage'

const day = (d: number) => new Date(2026, 9, 17 + d, 10)

describe('plan', () => {
  it('첫 주에는 인사 장면 문장 10개를 준다', () => {
    const s = defaultState(day(0))
    const ids = todaysNew(s, day(0))
    expect(ids).toHaveLength(10)
    expect(ids.every((id) => id.startsWith('greet-'))).toBe(true)
  })
  it('오늘 추가한 만큼 새 문장 수가 줄어든다', () => {
    let s = defaultState(day(0))
    for (const id of todaysNew(s, day(0)).slice(0, 4)) s = addCard(s, id, day(0))
    expect(todaysNew(s, day(0))).toHaveLength(6)
    expect(todaysNew(s, day(1))).toHaveLength(10)
  })
  it('주차가 지나면 다음 장면이 큐에 들어오고, 앞 주차 문장이 먼저 나온다', () => {
    const s = defaultState(day(0))
    expect(currentWeek(s, day(7)).week).toBe(2)
    const q = newQueue(s, day(7))
    expect(q[0]).toBe('greet-01')
    expect(q.some((id) => id.startsWith('numbers-'))).toBe(true)
    expect(currentWeek(s, day(400)).week).toBe(12)
  })
  it('연속 학습일을 센다', () => {
    let s = defaultState(day(0))
    s = addCard(s, 'greet-01', day(0))
    s = reviewCard(s, 'greet-01', Rating.Good, day(1))
    expect(currentStreak(s, day(1))).toBe(2)
    expect(currentStreak(s, day(2))).toBe(2)
    expect(currentStreak(s, day(3))).toBe(0)
    s = reviewCard(s, 'greet-01', Rating.Good, day(3))
    expect(s.streak.count).toBe(1)
  })
  it('백업을 내보내고 다시 가져올 수 있다', () => {
    let s = defaultState(day(0))
    s = addCard(s, 'greet-02', day(0))
    expect(importState(exportState(s))).toEqual(s)
    expect(importState('{"hello":1}')).toBeNull()
    expect(importState('not json')).toBeNull()
  })
})
