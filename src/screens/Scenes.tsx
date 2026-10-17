import { SCENES, SCENE_BY_ID } from '../data/scenes'
import { PhraseCard } from '../components/PhraseCard'
import { addCard } from '../lib/plan'
import { useApp } from '../state'

export function Scenes() {
  const { state } = useApp()
  return (
    <section className="screen">
      <header className="hero">
        <p className="eyebrow">달랏 생활 장면 {SCENES.length}개</p>
        <h1>장면별 문장</h1>
        <p className="muted">오늘 탭이 주차에 맞춰 문장을 골라 주지만, 당장 필요한 장면이 있으면 여기서 먼저 배워도 돼요.</p>
      </header>
      <div className="scene-grid">
        {SCENES.map((s) => {
          const done = s.phrases.filter((p) => state.cards[p.id]).length
          return (
            <a key={s.id} className="card scene" href={`#/scenes/${s.id}`}>
              <span className="emoji">{s.emoji}</span>
              <b>{s.title}</b>
              <span className="progress">
                <span style={{ width: `${(done / s.phrases.length) * 100}%` }} />
              </span>
              <small>
                {done}/{s.phrases.length}
              </small>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export function SceneDetail({ id }: { id: string }) {
  const { state, update, say } = useApp()
  const scene = SCENE_BY_ID[id]
  if (!scene) return <section className="screen"><p>장면을 찾을 수 없어요.</p><a href="#/scenes">← 장면 목록</a></section>
  const remaining = scene.phrases.filter((p) => !state.cards[p.id])

  const playAll = async () => {
    for (const p of scene.phrases) {
      await say(p.vi)
      await new Promise((r) => setTimeout(r, 700))
    }
  }

  return (
    <section className="screen">
      <a className="back" href="#/scenes">← 장면 목록</a>
      <header className="hero">
        <p className="eyebrow">{scene.emoji} 장면</p>
        <h1>{scene.title}</h1>
        <p className="muted">{scene.intro}</p>
      </header>
      <div className="row">
        <button className="btn" onClick={playAll}>▶ 전체 이어 듣기</button>
        <button
          className="btn"
          disabled={!remaining.length}
          onClick={() => update((s) => remaining.reduce((acc, p) => addCard(acc, p.id, new Date()), s))}
        >
          남은 {remaining.length}개 모두 복습에 추가
        </button>
      </div>
      {scene.phrases.map((p) => (
        <PhraseCard key={p.id} phrase={p} />
      ))}
    </section>
  )
}
