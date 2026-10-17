// ts-fsrs(FSRS 알고리즘) 래퍼. 카드는 문장 id로 저장하고, 날짜는 문자열로 직렬화한다.
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type FSRS, type Grade } from 'ts-fsrs'

export { Rating }
export type { Grade }

export type StoredCard = Omit<Card, 'due' | 'last_review'> & { due: string; last_review?: string }

export function makeScheduler(enableFuzz = true): FSRS {
  return fsrs(generatorParameters({ enable_fuzz: enableFuzz, request_retention: 0.9 }))
}

const defaultScheduler = makeScheduler()

export function toStored(card: Card): StoredCard {
  const { due, last_review, ...rest } = card
  return { ...rest, due: due.toISOString(), ...(last_review ? { last_review: last_review.toISOString() } : {}) }
}

export function fromStored(stored: StoredCard): Card {
  const { due, last_review, ...rest } = stored
  return { ...rest, due: new Date(due), ...(last_review ? { last_review: new Date(last_review) } : {}) }
}

export function newCard(now: Date): StoredCard {
  return toStored(createEmptyCard(now))
}

export function gradeCard(stored: StoredCard, grade: Grade, now: Date, scheduler: FSRS = defaultScheduler): StoredCard {
  return toStored(scheduler.next(fromStored(stored), now, grade).card)
}

export function dueIds(cards: Record<string, StoredCard>, now: Date): string[] {
  const t = now.getTime()
  return Object.entries(cards)
    .filter(([, c]) => new Date(c.due).getTime() <= t)
    .sort(([, a], [, b]) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .map(([id]) => id)
}

export const GRADES: { grade: Grade; label: string }[] = [
  { grade: Rating.Again, label: '다시' },
  { grade: Rating.Hard, label: '어려움' },
  { grade: Rating.Good, label: '보통' },
  { grade: Rating.Easy, label: '쉬움' },
]

export function formatInterval(from: Date, to: Date): string {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000))
  if (minutes < 60) return `${minutes}분`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}시간`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}일`
  return `${Math.round(days / 30)}개월`
}

export function previewIntervals(stored: StoredCard, now: Date, scheduler: FSRS = defaultScheduler): Record<number, string> {
  const card = fromStored(stored)
  const out: Record<number, string> = {}
  for (const { grade } of GRADES) out[grade] = formatInterval(now, scheduler.next(card, now, grade).card.due)
  return out
}
