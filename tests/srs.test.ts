import { describe, expect, it } from 'vitest'
import { dueIds, formatInterval, fromStored, gradeCard, makeScheduler, newCard, Rating, toStored } from '../src/lib/srs'

const s = makeScheduler(false)
const t0 = new Date('2026-10-17T09:00:00')

describe('srs', () => {
  it('새 카드는 바로 복습 대상이다', () => {
    const c = newCard(t0)
    expect(dueIds({ a: c }, t0)).toEqual(['a'])
  })
  it('쉬움은 보통보다, 보통은 다시보다 다음 복습이 늦다', () => {
    const c = newCard(t0)
    const again = new Date(gradeCard(c, Rating.Again, t0, s).due).getTime()
    const good = new Date(gradeCard(c, Rating.Good, t0, s).due).getTime()
    const easy = new Date(gradeCard(c, Rating.Easy, t0, s).due).getTime()
    expect(again).toBeLessThan(good)
    expect(good).toBeLessThan(easy)
  })
  it('계속 맞히면 간격이 늘어난다', () => {
    let c = newCard(t0)
    let now = t0
    const gaps: number[] = []
    for (let i = 0; i < 4; i++) {
      c = gradeCard(c, Rating.Good, now, s)
      const due = new Date(c.due)
      gaps.push(due.getTime() - now.getTime())
      now = due
    }
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThanOrEqual(gaps[i - 1])
    expect(gaps[3]).toBeGreaterThan(86400000)
  })
  it('JSON으로 저장했다 불러와도 같은 결과가 나온다', () => {
    const c = gradeCard(newCard(t0), Rating.Good, t0, s)
    const restored = JSON.parse(JSON.stringify(c))
    expect(toStored(fromStored(restored))).toEqual(c)
    const t1 = new Date(c.due)
    expect(gradeCard(restored, Rating.Good, t1, s)).toEqual(gradeCard(c, Rating.Good, t1, s))
  })
  it('복습할 카드를 오래된 순서로 돌려준다', () => {
    const a = newCard(new Date('2026-10-17T08:00:00'))
    const b = newCard(new Date('2026-10-16T08:00:00'))
    const later = gradeCard(newCard(t0), Rating.Easy, t0, s)
    expect(dueIds({ a, b, later }, t0)).toEqual(['b', 'a'])
  })
  it('간격을 한국어로 표시한다', () => {
    expect(formatInterval(t0, new Date(t0.getTime() + 10 * 60000))).toBe('10분')
    expect(formatInterval(t0, new Date(t0.getTime() + 3 * 86400000))).toBe('3일')
  })
})
