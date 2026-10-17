// 오늘 배울 새 문장, 복습 처리 등 상태 변경을 순수 함수로 모아 둔다 (테스트하기 쉽게).
import { CURRICULUM, weekFor, type Week } from '../data/curriculum'
import { SCENE_BY_ID } from '../data/scenes'
import { dayKey, daysBetween } from './dates'
import { gradeCard, newCard, type Grade } from './srs'
import { touchStreak, type AppState } from './storage'

export function dayIndex(state: AppState, now: Date): number {
  return Math.max(0, daysBetween(state.startDate, dayKey(now)))
}

export function currentWeek(state: AppState, now: Date): Week {
  return weekFor(dayIndex(state, now))
}

/** 지금 주차까지 배워야 할 문장 중 아직 복습 카드에 없는 것 (앞 주차부터). */
export function newQueue(state: AppState, now: Date): string[] {
  const upTo = currentWeek(state, now).week
  return CURRICULUM.filter((w) => w.week <= upTo)
    .flatMap((w) => w.scenes)
    .flatMap((id) => SCENE_BY_ID[id]?.phrases ?? [])
    .map((p) => p.id)
    .filter((id) => !state.cards[id])
}

export function newLeftToday(state: AppState, now: Date): number {
  return Math.max(0, state.settings.dailyNew - (state.newLog[dayKey(now)] ?? 0))
}

export function todaysNew(state: AppState, now: Date): string[] {
  return newQueue(state, now).slice(0, newLeftToday(state, now))
}

export function addCard(state: AppState, id: string, now: Date): AppState {
  if (state.cards[id]) return state
  const today = dayKey(now)
  return {
    ...state,
    cards: { ...state.cards, [id]: newCard(now) },
    newLog: { ...state.newLog, [today]: (state.newLog[today] ?? 0) + 1 },
    streak: touchStreak(state, now),
  }
}

export function reviewCard(state: AppState, id: string, grade: Grade, now: Date): AppState {
  const card = state.cards[id]
  if (!card) return state
  const today = dayKey(now)
  return {
    ...state,
    cards: { ...state.cards, [id]: gradeCard(card, grade, now) },
    reviewLog: { ...state.reviewLog, [today]: (state.reviewLog[today] ?? 0) + 1 },
    streak: touchStreak(state, now),
  }
}

export function recordTone(state: AppState, correct: boolean, now: Date): AppState {
  return {
    ...state,
    toneStats: { correct: state.toneStats.correct + (correct ? 1 : 0), total: state.toneStats.total + 1 },
    streak: touchStreak(state, now),
  }
}

export function toggleFlag(state: AppState, id: string): AppState {
  const flagged = state.flagged.includes(id) ? state.flagged.filter((f) => f !== id) : [...state.flagged, id]
  return { ...state, flagged }
}
