// 학습 상태는 이 기기의 localStorage에만 저장한다. 접근이 막혀 있어도 앱은 메모리 상태로 계속 동작한다.
import { dayKey, daysBetween } from './dates'
import type { StoredCard } from './srs'

const KEY = 'dalat-vi-v1'

export interface Settings {
  voiceURI: string | null
  rate: number
  dailyNew: number
}

export interface AppState {
  version: 1
  startDate: string
  settings: Settings
  cards: Record<string, StoredCard>
  newLog: Record<string, number>
  reviewLog: Record<string, number>
  streak: { count: number; last: string | null }
  toneStats: { correct: number; total: number }
  flagged: string[]
}

export function defaultState(now: Date = new Date()): AppState {
  return {
    version: 1,
    startDate: dayKey(now),
    settings: { voiceURI: null, rate: 0.8, dailyNew: 10 },
    cards: {},
    newLog: {},
    reviewLog: {},
    streak: { count: 0, last: null },
    toneStats: { correct: 0, total: 0 },
    flagged: [],
  }
}

/** 알 수 없는 값을 기본값과 합쳐 올바른 상태로 만든다. 잘못된 데이터면 null. */
export function normalizeState(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<AppState>
  if (r.version !== 1 || typeof r.startDate !== 'string' || typeof r.cards !== 'object' || r.cards === null) return null
  const base = defaultState()
  return {
    ...base,
    ...r,
    settings: { ...base.settings, ...(r.settings ?? {}) },
    streak: { ...base.streak, ...(r.streak ?? {}) },
    toneStats: { ...base.toneStats, ...(r.toneStats ?? {}) },
    flagged: Array.isArray(r.flagged) ? r.flagged : [],
    newLog: r.newLog ?? {},
    reviewLog: r.reviewLog ?? {},
  } as AppState
}

export function loadState(): AppState {
  try {
    const text = localStorage.getItem(KEY)
    if (text) return normalizeState(JSON.parse(text)) ?? defaultState()
  } catch {
    // 개인 정보 보호 모드 등으로 저장소를 못 쓰면 새 상태로 시작한다.
  }
  return defaultState()
}

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importState(text: string): AppState | null {
  try {
    return normalizeState(JSON.parse(text))
  } catch {
    return null
  }
}

/** 공부한 날을 기록하고 연속 학습일을 갱신한다. */
export function touchStreak(state: AppState, now: Date): AppState['streak'] {
  const today = dayKey(now)
  const { last, count } = state.streak
  if (last === today) return state.streak
  if (last && daysBetween(last, today) === 1) return { count: count + 1, last: today }
  return { count: 1, last: today }
}

/** 오늘 이후 하루 이상 공부를 안 했으면 연속 기록이 끊긴 것으로 보여준다. */
export function currentStreak(state: AppState, now: Date): number {
  const { last, count } = state.streak
  if (!last) return 0
  return daysBetween(last, dayKey(now)) <= 1 ? count : 0
}
