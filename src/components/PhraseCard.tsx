import { useEffect, useRef, useState } from 'react'
import type { Phrase } from '../data/types'
import { addCard, toggleFlag } from '../lib/plan'
import { recordingSupported, startRecording, type Recording } from '../lib/speech'
import { useApp } from '../state'

interface Props {
  phrase: Phrase
  /** 복습 화면처럼 뜻을 가릴 때 false */
  showKo?: boolean
  showVi?: boolean
  addButton?: 'add' | 'none'
  addLabel?: string
}

export function PhraseCard({ phrase, showKo = true, showVi = true, addButton = 'add', addLabel = '복습에 추가' }: Props) {
  const { state, update, say } = useApp()
  const added = !!state.cards[phrase.id]
  const flagged = state.flagged.includes(phrase.id)

  return (
    <article className="card phrase">
      {showVi && <p className="vi" lang="vi">{phrase.vi}</p>}
      {showKo && <p className="ko">{phrase.ko}</p>}
      {showVi && (phrase.north || phrase.south) && (
        <p className="variant">
          {phrase.north && (
            <>
              <span className="tag">북부</span> <span lang="vi">{phrase.north}</span>
            </>
          )}
          {phrase.south && (
            <>
              <span className="tag">남부</span> <span lang="vi">{phrase.south}</span>
            </>
          )}
        </p>
      )}
      {showVi && phrase.hanja && (
        <p className="hanja">
          {phrase.hanja.map(([vi, ko]) => (
            <span key={vi} className="chip">
              <span lang="vi">{vi}</span> ≈ {ko}
            </span>
          ))}
        </p>
      )}
      {showKo && phrase.note && <p className="note">{phrase.note}</p>}
      <div className="row">
        <button className="btn" onClick={() => say(phrase.vi)} aria-label="듣기">▶ 듣기</button>
        <button className="btn" onClick={() => say(phrase.vi, 0.55)} aria-label="느리게 듣기">🐢 느리게</button>
        <Recorder />
        <button
          className={`btn icon ${flagged ? 'on' : ''}`}
          onClick={() => update((s) => toggleFlag(s, phrase.id))}
          title="현지인에게 확인받을 문장으로 표시"
          aria-pressed={flagged}
        >
          {flagged ? '🚩' : '⚑'}
        </button>
      </div>
      {addButton === 'add' && (
        <button className="btn primary block" disabled={added} onClick={() => update((s) => addCard(s, phrase.id, new Date()))}>
          {added ? '✓ 복습 목록에 있어요' : addLabel}
        </button>
      )}
    </article>
  )
}

function Recorder() {
  const [rec, setRec] = useState<Recording | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url)
  }, [url])

  if (!recordingSupported()) return null

  const toggle = async () => {
    if (rec) {
      const u = await rec.stop()
      setRec(null)
      setUrl(u)
      setTimeout(() => audio.current?.play(), 50)
      return
    }
    try {
      setError(false)
      setRec(await startRecording())
    } catch {
      setError(true)
    }
  }

  return (
    <>
      <button className={`btn ${rec ? 'rec' : ''}`} onClick={toggle}>
        {rec ? '■ 멈춤' : error ? '🎙 권한 필요' : '🎙 녹음'}
      </button>
      {url && !rec && (
        <button className="btn" onClick={() => audio.current?.play()}>
          내 발음
        </button>
      )}
      {url && <audio ref={audio} src={url} preload="auto" />}
    </>
  )
}
