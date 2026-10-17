import { PHRASE_BY_ID } from '../data/scenes'
import { PhraseCard } from '../components/PhraseCard'
import { currentWeek, dayIndex, newQueue, todaysNew } from '../lib/plan'
import { dueIds } from '../lib/srs'
import { currentStreak } from '../lib/storage'
import { useApp, useNow } from '../state'

export function Today() {
  const { state } = useApp()
  const now = useNow()
  const week = currentWeek(state, now)
  const due = dueIds(state.cards, now).length
  const fresh = todaysNew(state, now)
  const queued = newQueue(state, now).length
  const streak = currentStreak(state, now)
  const learned = Object.keys(state.cards).length
  const { correct, total } = state.toneStats

  return (
    <section className="screen">
      <header className="hero">
        <p className="eyebrow">
          {dayIndex(state, now) + 1}일째 · {week.week}주차
        </p>
        <h1>{week.focus}</h1>
        <p className="muted">{week.tip}</p>
      </header>

      <div className="stats">
        <div className="stat">
          <b>{streak}</b>
          <span>연속 학습일</span>
        </div>
        <div className="stat">
          <b>{learned}</b>
          <span>배운 문장</span>
        </div>
        <div className="stat">
          <b>{total ? Math.round((correct / total) * 100) : 0}%</b>
          <span>성조 정답률</span>
        </div>
      </div>

      {week.week <= 2 && (
        <a className="card cta" href="#/tones">
          <b>🎵 성조 연습부터</b>
          <span>1–2주차는 성조를 귀와 입에 익히는 게 가장 중요해요. 듣기 퀴즈를 하루 20문제 이상 풀어 보세요.</span>
        </a>
      )}

      <a className={`card cta ${due ? 'urgent' : ''}`} href="#/review">
        <b>🔁 복습 {due}개</b>
        <span>{due ? '잊어버리기 직전인 문장들이에요. 먼저 복습하세요.' : '지금은 복습할 문장이 없어요.'}</span>
      </a>

      <h2>오늘의 새 문장 {fresh.length > 0 && <small>{fresh.length}개 남음</small>}</h2>
      {fresh.length === 0 ? (
        <div className="card empty">
          {queued > 0 ? (
            <p>오늘 목표를 다 채웠어요! 내일 또 만나요. 더 하고 싶으면 장면 탭에서 문장을 골라 추가하세요.</p>
          ) : (
            <p>이번 주차까지의 문장을 모두 배웠어요. 장면 탭에서 다음 장면을 먼저 시작해도 좋아요.</p>
          )}
        </div>
      ) : (
        <>
          <p className="muted">듣고, 느리게 듣고, 녹음해서 따라 말해 본 뒤 "외웠어요"를 누르세요.</p>
          {fresh.map((id) => (
            <PhraseCard key={id} phrase={PHRASE_BY_ID[id]} addLabel="외웠어요 → 복습에 추가" />
          ))}
        </>
      )}

      <div className="card soon">
        <b>🤖 곧 추가: AI 상황극</b>
        <span>시장·카페·집주인과의 대화를 AI와 연습하고 교정받는 기능은 다음 버전에서 추가할 예정이에요.</span>
      </div>
    </section>
  )
}
