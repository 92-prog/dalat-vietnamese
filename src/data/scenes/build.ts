import type { Phrase, Scene } from '../types'

type Extra = Omit<Phrase, 'id' | 'vi' | 'ko'>
export type Row = [number, string, string, Extra?]

// 문장 id = 장면 id + 번호. 복습 기록이 id에 묶여 있으니 번호는 바꾸지 말고, 새 문장은 새 번호로 추가한다.
export function scene(meta: Omit<Scene, 'phrases'>, rows: Row[]): Scene {
  return {
    ...meta,
    phrases: rows.map(([n, vi, ko, extra]) => ({ id: `${meta.id}-${String(n).padStart(2, '0')}`, vi, ko, ...extra })),
  }
}
