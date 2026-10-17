import { useEffect, useRef, useState } from 'react'
import { PHRASE_BY_ID } from '../data/scenes'
import { defaultState, exportState, importState } from '../lib/storage'
import { onVoicesChanged, speechSupported, vietnameseVoices } from '../lib/speech'
import { useApp } from '../state'

export function Settings() {
  const { state, update, replace, say, saveFailed } = useApp()
  const [voices, setVoices] = useState(vietnameseVoices)
  const [message, setMessage] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const { settings } = state

  useEffect(() => onVoicesChanged(() => setVoices(vietnameseVoices())), [])

  const set = (patch: Partial<typeof settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }))

  const download = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `dalat-vietnamese-backup-${state.startDate}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    setMessage('백업 파일을 저장했어요.')
  }

  const upload = async (f: File) => {
    const next = importState(await f.text())
    if (!next) return setMessage('이 파일은 백업 파일이 아니에요.')
    replace(next)
    setMessage('백업을 불러왔어요.')
  }

  return (
    <section className="screen">
      <header className="hero">
        <h1>설정</h1>
      </header>

      {saveFailed && <div className="card warn">⚠️ 이 브라우저에서는 학습 기록이 저장되지 않아요. 개인 정보 보호 모드를 끄거나 홈 화면에 추가해서 써 주세요.</div>}

      <div className="card form">
        <h3>음성</h3>
        {!speechSupported() ? (
          <p className="warn-text">이 브라우저는 음성 읽기를 지원하지 않아요.</p>
        ) : voices.length === 0 ? (
          <p className="warn-text">
            베트남어 음성이 없어요. 아이폰: 설정 → 손쉬운 사용 → 읽기 및 말하기 → 음성 → 베트남어에서 음성을 내려받은 뒤 앱을 다시 열어 주세요.
          </p>
        ) : (
          <label>
            목소리
            <select value={settings.voiceURI ?? ''} onChange={(e) => set({ voiceURI: e.target.value || null })}>
              <option value="">기본</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          재생 속도
          <select value={settings.rate} onChange={(e) => set({ rate: Number(e.target.value) })}>
            {[0.6, 0.7, 0.8, 0.9, 1].map((r) => (
              <option key={r} value={r}>
                {r.toFixed(1)}배{r === 0.8 ? ' (처음 추천)' : r === 1 ? ' (11주차부터)' : ''}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={() => say('Xin chào, tôi là người Hàn Quốc.')}>
          ▶ 음성 시험
        </button>
      </div>

      <div className="card form">
        <h3>학습 계획</h3>
        <label>
          하루 새 문장
          <select value={settings.dailyNew} onChange={(e) => set({ dailyNew: Number(e.target.value) })}>
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}개{n === 10 ? ' (추천)' : ''}
              </option>
            ))}
          </select>
        </label>
        <label>
          공부 시작일 (주차 계산 기준)
          <input type="date" value={state.startDate} onChange={(e) => e.target.value && update((s) => ({ ...s, startDate: e.target.value }))} />
        </label>
      </div>

      <div className="card form">
        <h3>백업</h3>
        <p className="muted">학습 기록은 이 기기에만 저장돼요. 휴대폰을 바꾸거나 오래 안 쓸 때를 대비해 가끔 백업해 두세요.</p>
        <div className="row">
          <button className="btn" onClick={download}>백업 파일 저장</button>
          <button className="btn" onClick={() => file.current?.click()}>백업 불러오기</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
        {message && <p className="ok-text">{message}</p>}
      </div>

      <div className="card form">
        <h3>🚩 현지인에게 확인받을 문장 ({state.flagged.length})</h3>
        <p className="muted">문장 카드의 ⚑ 버튼으로 표시한 문장이에요. 달랏에서 이웃이나 선생님에게 보여 주고 자연스러운지 물어보세요.</p>
        <ul className="flagged">
          {state.flagged.map((id) => PHRASE_BY_ID[id]).filter(Boolean).map((p) => (
            <li key={p.id}>
              <b lang="vi">{p.vi}</b> — {p.ko}
            </li>
          ))}
        </ul>
      </div>

      <div className="card form">
        <h3>아이폰에 앱처럼 설치하기</h3>
        <ol>
          <li>Safari로 이 페이지를 연다</li>
          <li>아래쪽 공유 버튼(□↑)을 누른다</li>
          <li>"홈 화면에 추가"를 누른다</li>
        </ol>
        <p className="muted">설치하면 인터넷이 없어도 열리고, 학습 기록도 더 안전하게 남아요.</p>
      </div>

      <button
        className="btn danger block"
        onClick={() => {
          if (confirm('학습 기록을 모두 지울까요? 되돌릴 수 없어요.')) replace(defaultState())
        }}
      >
        학습 기록 초기화
      </button>
    </section>
  )
}
