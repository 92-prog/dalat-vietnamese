import { useMemo, useState } from 'react'
import { PHRASE_BY_ID } from '../data/scenes'
import { PhraseCard } from '../components/PhraseCard'
import { reviewCard } from '../lib/plan'
import { dueIds, formatInterval, GRADES, previewIntervals } from '../lib/srs'
import { useApp, useNow } from '../state'

export function Review() {
  const { state } = useApp()
  const now = useNow()
  // 콘텐츠에서 사라진 문장의 카드는 복습에서 건너뛴다.
  const due = dueIds(state.cards, now).filter((id) => PHRASE_BY_ID[id])
  const [mode, setMode] = useState<'srs' | 'listen'>('srs')

  const nextDue = useMemo(() => {
    const times = Object.values(state.cards).map((c) => new Date(c.due).getTime())
    return times.length ? new Date(Math.min(...times)) : null
  }, [state.cards])

  return (
    <section className="screen">
      <header className="hero">
        <p className="eyebrow">간격 반복 복습</p>
        <h1>복습</h1>
        <p className="muted">잊어버릴 때쯤 다시 보여줘요. 솔직하게 평가할수록 일정이 정확해져요.</p>
      </header>
      <div className="seg">
        <button className={mode === 'srs' ? 'on' : ''} onClick={() => setMode('srs')}>
          복습 카드 {due.length}
        </button>
        <button className={mode === 'listen' ? 'on' : ''} onClick={() => setMode('listen')}>
          듣기 퀴즈
        </button>
      </div>
      {mode === 'srs' ? (
        due.length ? (
          <ReviewCard key={due[0]} id={due[0]} />
        ) : (
          <div className="card empty">
            <p>🎉 지금 복습할 문장이 없어요.</p>
            {nextDue && <p className="muted">다음 복습은 {formatInterval(now, nextDue)} 뒤예요.</p>}
            {!nextDue && <p className="muted">오늘 탭에서 새 문장을 배우면 여기에 쌓여요.</p>}
          </div>
        )
      ) : (
        <ListenQuiz />
      )}
    </section>
  )
}

function ReviewCard({ id }: { id: string }) {
  const { state, update, say } = useApp()
  const phrase = PHRASE_BY_ID[id]
  const card = state.cards[id]
  const [shown, setShown] = useState(false)
  // 짝수 번째 복습은 듣고 뜻 떠올리기, 홀수 번째는 한국어 보고 베트남어로 말하기.
  const listening = card.reps % 2 === 0
  const previews = previewIntervals(card, new Date())

  return (
    <div className="review">
      {!shown ? (
        <div className="card prompt">
          {listening ? (
            <>
              <p className="muted">🎧 듣고 뜻을 떠올려 보세요</p>
              <button className="btn primary block" onClick={() => say(phrase.vi)} autoFocus>
                ▶ 듣기
              </button>
              <button className="btn block" onClick={() => say(phrase.vi, 0.55)}>
                🐢 느리게
              </button>
            </>
          ) : (
            <>
              <p className="muted">🗣️ 베트남어로 소리 내어 말해 보세요</p>
              <p className="ko big">{phrase.ko}</p>
            </>
          )}
          <button
            className="btn primary block"
            onClick={() => {
              setShown(true)
              if (!listening) say(phrase.vi)
            }}
          >
            정답 보기
          </button>
        </div>
      ) : (
        <>
          <PhraseCard phrase={phrase} addButton="none" />
          <p className="muted center">얼마나 잘 떠올렸나요?</p>
          <div className="grades">
            {GRADES.map(({ grade, label }) => (
              <button key={grade} className={`grade g${grade}`} onClick={() => update((s) => reviewCard(s, id, grade, new Date()))}>
                <b>{label}</b>
                <small>{previews[grade]}</small>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ListenQuiz() {
  const { state, say } = useApp()
  const pool = Object.keys(state.cards).map((id) => PHRASE_BY_ID[id]).filter(Boolean)
  const make = () => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const answer = shuffled[0]
    const options = shuffled.slice(0, 4).sort(() => Math.random() - 0.5)
    return { answer, options }
  }
  const [q, setQ] = useState(() => (pool.length >= 4 ? make() : null))
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState({ ok: 0, n: 0 })

  if (!q) return <div className="card empty"><p>문장을 4개 이상 배우면 듣기 퀴즈를 할 수 있어요.</p></div>

  return (
    <div className="card quiz">
      <div className="quiz-head">
        <b>🎧 듣고 뜻 고르기</b>
        <small>
          {score.ok}/{score.n}
        </small>
      </div>
      <button className="btn primary block" onClick={() => say(q.answer.vi)}>
        ▶ 듣기
      </button>
      <div className="choices col">
        {q.options.map((o) => (
          <button
            key={o.id}
            className={`choice ${picked ? (o.id === q.answer.id ? 'right' : o.id === picked ? 'wrong' : '') : ''}`}
            onClick={() => {
              if (picked) return
              setPicked(o.id)
              setScore((s) => ({ ok: s.ok + (o.id === q.answer.id ? 1 : 0), n: s.n + 1 }))
            }}
          >
            {o.ko}
          </button>
        ))}
      </div>
      {picked && (
        <div className="feedback">
          <p lang="vi">
            <b>{q.answer.vi}</b>
          </p>
          <button
            className="btn primary"
            onClick={() => {
              const n = make()
              setQ(n)
              setPicked(null)
              say(n.answer.vi)
            }}
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  )
}
