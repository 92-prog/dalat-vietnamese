import { useMemo, useState } from 'react'
import { CONSONANTS, FINALS, VOWELS, type Letter } from '../data/alphabet'
import { PHRASE_BY_ID } from '../data/scenes'
import { MINIMAL_SETS, TONE_INFO } from '../data/tones'
import { ToneContour } from '../components/ToneContour'
import { recordTone } from '../lib/plan'
import { syllables, TONE_LABEL, TONES, toneOf, withTone, type Tone } from '../lib/tone'
import { useApp } from '../state'

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const ALL_WORDS = MINIMAL_SETS.flatMap((s) => s.words)
// 문장 속 외래어·이름은 성조 문제로 내지 않는다.
const LOANWORDS = /^(wifi|menu|size|online|atm|qr|gb|minho|sim|atisô)$/i

export function ToneTrainer() {
  return (
    <section className="screen">
      <header className="hero">
        <p className="eyebrow">1–2주차 핵심</p>
        <h1>6성조</h1>
        <p className="muted">같은 "ma"도 성조에 따라 귀신·엄마·말·무덤으로 뜻이 바뀌어요. 그림을 보며 듣고 따라 하세요.</p>
      </header>
      <ToneQuiz />
      <h2>성조 6개</h2>
      <div className="tone-grid">
        {TONE_INFO.map((t) => (
          <ToneCard key={t.tone} info={t} />
        ))}
      </div>
      <h2>성조만 다른 단어</h2>
      <MinimalSets />
      <SentenceToneQuiz />
      <h2>글자와 발음</h2>
      <LetterTable title="모음" letters={VOWELS} />
      <LetterTable title="자음" letters={CONSONANTS} />
      <LetterTable title="받침" letters={FINALS} />
    </section>
  )
}

function ToneCard({ info }: { info: (typeof TONE_INFO)[number] }) {
  const { say } = useApp()
  const label = TONE_LABEL[info.tone]
  return (
    <button className="card tone" onClick={() => say(info.example, 0.6)}>
      <div className="tone-head">
        <span className="tone-mark" lang="vi">{info.example}</span>
        <span>
          <b lang="vi">{label.vi}</b> <small>{label.ko}</small>
        </span>
      </div>
      <ToneContour contour={info.contour} />
      <p>{info.how}</p>
      {info.south && <p className="note">{info.south}</p>}
    </button>
  )
}

function MinimalSets() {
  const { say } = useApp()
  return (
    <div className="sets">
      {MINIMAL_SETS.map((set) => (
        <div key={set.title} className="card">
          <div className="row wrap">
            {set.words.map((w) => (
              <button key={w.vi} className="word" onClick={() => say(w.vi, 0.6)}>
                <b lang="vi">{w.vi}</b>
                <small>{w.ko}</small>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ToneQuiz() {
  const { update, say } = useApp()
  const [word, setWord] = useState(() => pick(ALL_WORDS))
  const [answer, setAnswer] = useState<Tone | null>(null)
  const [score, setScore] = useState({ ok: 0, n: 0 })
  const right = toneOf(word.vi)

  const choose = (t: Tone) => {
    if (answer) return
    setAnswer(t)
    const ok = t === right
    setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }))
    update((s) => recordTone(s, ok, new Date()))
  }
  const next = () => {
    const w = pick(ALL_WORDS.filter((x) => x.vi !== word.vi))
    setWord(w)
    setAnswer(null)
    say(w.vi, 0.7)
  }

  return (
    <div className="card quiz">
      <div className="quiz-head">
        <b>👂 듣고 성조 맞히기</b>
        <small>
          이번에 {score.ok}/{score.n}
        </small>
      </div>
      <button className="btn primary block" onClick={() => say(word.vi, 0.7)}>
        ▶ 소리 듣기
      </button>
      <div className="choices six">
        {TONES.map((t) => (
          <button
            key={t}
            className={`choice ${answer ? (t === right ? 'right' : t === answer ? 'wrong' : '') : ''}`}
            onClick={() => choose(t)}
          >
            <b lang="vi">{withTone('ma', t)}</b>
            <small>{TONE_LABEL[t].vi}</small>
          </button>
        ))}
      </div>
      {answer && (
        <div className="feedback">
          <p>
            {answer === right ? '정답! ' : '아쉬워요. '}
            <b lang="vi">{word.vi}</b> = {word.ko} ({TONE_LABEL[right].vi})
          </p>
          <button className="btn primary" onClick={next}>
            다음 →
          </button>
        </div>
      )}
    </div>
  )
}

function SentenceToneQuiz() {
  const { state, say } = useApp()
  const pool = useMemo(() => {
    const ids = Object.keys(state.cards)
    return (ids.length >= 5 ? ids : Object.keys(PHRASE_BY_ID).filter((id) => id.startsWith('greet-'))).map((id) => PHRASE_BY_ID[id])
  }, [state.cards])
  const make = () => {
    const p = pick(pool)
    const words = syllables(p.vi)
    const candidates = words
      .map((w, i) => [w, i] as const)
      .filter(([w]) => !LOANWORDS.test(w) && new Set(TONES.map((t) => withTone(w, t))).size >= 4)
    const [target, index] = pick(candidates.length ? candidates : words.map((w, i) => [w, i] as const))
    const options = [...new Set(TONES.map((t) => withTone(target, t)))].sort(() => Math.random() - 0.5)
    return { p, target, index, options }
  }
  const [q, setQ] = useState(make)
  const [answer, setAnswer] = useState<string | null>(null)
  if (!pool.length) return null
  const words = syllables(q.p.vi)

  return (
    <div className="card quiz">
      <div className="quiz-head">
        <b>✍️ 문장 속 성조 표기 고르기</b>
        <small>{Object.keys(state.cards).length >= 5 ? '내가 배운 문장에서' : '인사 문장에서'}</small>
      </div>
      <p className="vi blanks" lang="vi">
        {words.map((w, i) => (
          <span key={i} className={i === q.index ? 'blank' : ''}>
            {i === q.index ? (answer ? q.target : '____') : w}{' '}
          </span>
        ))}
      </p>
      <p className="ko">{q.p.ko}</p>
      <button className="btn block" onClick={() => say(q.p.vi)}>
        ▶ 문장 듣기
      </button>
      <div className="choices">
        {q.options.map((o) => (
          <button
            key={o}
            lang="vi"
            className={`choice ${answer ? (o === q.target ? 'right' : o === answer ? 'wrong' : '') : ''}`}
            onClick={() => !answer && setAnswer(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {answer && (
        <button
          className="btn primary block"
          onClick={() => {
            setQ(make())
            setAnswer(null)
          }}
        >
          다음 문제 →
        </button>
      )}
    </div>
  )
}

function LetterTable({ title, letters }: { title: string; letters: Letter[] }) {
  const { say } = useApp()
  return (
    <details className="card letters">
      <summary>{title}</summary>
      <ul>
        {letters.map((l) => (
          <li key={l.letter}>
            <button onClick={() => say(l.example, 0.6)}>
              <b lang="vi">{l.letter}</b>
              <span>{l.sound}</span>
              <span className="ex">
                <span lang="vi">{l.example}</span> · {l.exampleKo}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
