// 날짜는 기기 현지 시간 기준 'YYYY-MM-DD' 문자열로 다룬다.
export function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((parseDay(toKey).getTime() - parseDay(fromKey).getTime()) / 86400000)
}
