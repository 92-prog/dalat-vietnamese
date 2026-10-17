import type { ToneInfo } from '../data/tones'

// 성조 음높이를 1~5 단계 선으로 그린다. 'x'는 목이 끊기는 지점(점선 간격).
export function ToneContour({ contour }: { contour: ToneInfo['contour'] }) {
  const W = 120
  const H = 60
  const y = (v: number) => H - 6 - ((v - 1) / 4) * (H - 12)
  const nums = contour.filter((v): v is number => v !== 'x')
  const step = (W - 20) / Math.max(1, nums.length - 1)
  const segments: string[][] = [[]]
  let i = 0
  for (const v of contour) {
    if (v === 'x') {
      segments.push([])
      continue
    }
    segments[segments.length - 1].push(`${10 + i * step},${y(v)}`)
    i++
  }
  return (
    <svg className="contour" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="음높이 모양">
      {[1, 3, 5].map((v) => (
        <line key={v} x1="4" x2={W - 4} y1={y(v)} y2={y(v)} className="grid" />
      ))}
      {segments.map((pts, k) => {
        const prev = segments[k - 1]
        const joined = prev && prev.length ? [prev[prev.length - 1], ...pts] : pts
        return (
          <polyline key={k} points={joined.join(' ')} className={k > 0 ? 'line broken' : 'line'} />
        )
      })}
      {contour[contour.length - 1] === 'x' && nums.length > 0 && (
        <circle cx={10 + (nums.length - 1) * step} cy={y(nums[nums.length - 1])} r="4" className="stop" />
      )}
    </svg>
  )
}
