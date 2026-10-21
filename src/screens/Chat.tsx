import { useEffect, useMemo, useRef, useState } from 'react'
import { SCENES } from '../data/scenes'
import { connectedPeers, invitePeer, respondInvite, sendChat, startNearby, stopNearby, useChat, type ChatMessage, type Peer } from '../lib/chat'
import { isNative, ViSpeech } from '../lib/native'
import { checkPronunciation, hasDigits, type PronunciationResult } from '../lib/pronounce'
import { TONE_LABEL } from '../lib/tone'
import { useApp } from '../state'

export function Chat() {
  const { state, update } = useApp()
  const chat = useChat()
  const [name, setName] = useState(state.settings.chatName)
  const [error, setError] = useState('')

  if (!isNative()) {
    return (
      <section className="screen">
        <Hero />
        <div className="card">
          <h3>아이폰 앱에서만 돼요</h3>
          <p className="muted">
            근처 채팅은 블루투스와 와이파이 직접 연결을 쓰기 때문에 웹(홈 화면 추가)에서는 안 돼요. Xcode로 설치한 아이폰 앱에서 열어 주세요.
          </p>
        </div>
      </section>
    )
  }

  const start = async () => {
    const n = name.trim()
    if (!n) return setError('채팅에 쓸 이름을 적어 주세요.')
    update((s) => ({ ...s, settings: { ...s.settings, chatName: n } }))
    try {
      setError('')
      await startNearby(n)
    } catch {
      setError('근처 찾기를 시작하지 못했어요. 블루투스와 와이파이가 켜져 있는지 확인해 주세요.')
    }
  }

  return (
    <section className="screen">
      <Hero />
      {!chat.running ? (
        <div className="card form">
          <label>
            채팅에 보일 내 이름
            <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="예: Minjun" />
          </label>
          <button className="btn primary block" onClick={start}>📡 근처 찾기</button>
          {error && <p className="warn-text">{error}</p>}
          <p className="muted">두 아이폰 모두 이 앱에서 근처 찾기를 켜고, 블루투스·와이파이를 켜 두세요. 인터넷은 없어도 돼요.</p>
        </div>
      ) : (
        <>
          <Nearby peers={chat.peers} />
          <Messages messages={chat.messages} />
          <Composer myName={state.settings.chatName} connected={connectedPeers(chat).length > 0} />
          <button className="btn block" onClick={() => stopNearby()}>연결 끝내기</button>
        </>
      )}
    </section>
  )
}

function Hero() {
  return (
    <header className="hero">
      <p className="eyebrow">블루투스 근처 채팅</p>
      <h1>말해야 보내지는 채팅</h1>
      <p className="muted">보낼 베트남어를 정하고 소리 내어 읽으세요. 성조까지 맞게 들려야 메시지가 보내져요.</p>
    </header>
  )
}

const STATUS_LABEL: Record<Peer['status'], string> = {
  found: '',
  invited: '요청 보냄…',
  incoming: '',
  connecting: '연결 중…',
  connected: '✓ 연결됨',
}

function Nearby({ peers }: { peers: Peer[] }) {
  return (
    <div className="card">
      <h3>근처 사람</h3>
      {peers.length === 0 && <p className="muted">찾는 중이에요… 상대 아이폰에서도 근처 찾기를 켜 주세요.</p>}
      {peers.map((p) => (
        <div key={p.id} className="peer">
          <b>{p.name}</b>
          {p.status === 'found' && (
            <button className="btn" onClick={() => invitePeer(p.id)}>연결 요청</button>
          )}
          {p.status === 'incoming' && (
            <span className="row">
              <button className="btn primary" onClick={() => respondInvite(p.id, true)}>수락</button>
              <button className="btn" onClick={() => respondInvite(p.id, false)}>거절</button>
            </span>
          )}
          {STATUS_LABEL[p.status] && <span className="muted">{STATUS_LABEL[p.status]}</span>}
        </div>
      ))}
    </div>
  )
}

function Messages({ messages }: { messages: ChatMessage[] }) {
  const { say } = useApp()
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [messages.length])
  if (messages.length === 0) return null
  return (
    <div className="messages">
      {messages.map((m) =>
        m.from === 'system' ? (
          <p key={m.id} className="sys muted">{m.text}</p>
        ) : (
          <div key={m.id} className={`bubble ${m.from}`}>
            {m.from === 'them' && <small>{m.name}</small>}
            <p className="vi" lang="vi">{m.text}</p>
            {m.ko && <p className="ko">{m.ko}</p>}
            <button className="btn icon" onClick={() => say(m.text)} aria-label="듣기">▶</button>
          </div>
        ),
      )}
      <div ref={end} />
    </div>
  )
}

function Composer({ myName, connected }: { myName: string; connected: boolean }) {
  const { say } = useApp()
  const [text, setText] = useState('')
  const [ko, setKo] = useState<string | undefined>()
  const [picking, setPicking] = useState(false)
  const [listening, setListening] = useState(false)
  const [partial, setPartial] = useState('')
  const [result, setResult] = useState<PronunciationResult | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const handle = ViSpeech.addListener('partial', (e) => setPartial(e.text))
    return () => {
      handle.then((h) => h.remove())
      ViSpeech.stop().catch(() => {})
    }
  }, [])

  const edit = (v: string) => {
    setText(v)
    setKo(undefined)
    setResult(null)
  }

  const pick = (vi: string, meaning: string) => {
    setText(vi)
    setKo(meaning)
    setResult(null)
    setPicking(false)
  }

  const target = text.trim()

  const mic = async () => {
    setNotice('')
    if (!listening) {
      const perm = await ViSpeech.requestPermission()
      if (!perm.granted) {
        return setNotice(`설정 앱 > 달랏 베트남어에서 ${perm.denied === 'mic' ? '마이크' : '음성 인식'}를 허용해 주세요.`)
      }
      try {
        setResult(null)
        setPartial('')
        await ViSpeech.start()
        setListening(true)
      } catch (e) {
        setNotice(
          (e as { code?: string }).code === 'MIC_FAILED'
            ? '마이크를 켜지 못했어요. 다른 앱이 마이크를 쓰고 있는지 확인해 주세요.'
            : '베트남어 음성인식을 지금 쓸 수 없어요. 처음에는 인터넷 연결이 필요할 수 있어요.',
        )
      }
      return
    }
    setListening(false)
    const { text: heard, error } = await ViSpeech.stop()
    setPartial(heard)
    if (!heard) return setNotice(error ? `잘 못 알아들었어요. (${error})` : '잘 못 알아들었어요. 조금 더 크게 말해 보세요.')
    const r = checkPronunciation(target, heard)
    setResult(r)
    if (!r.pass) return
    if (!connected) return setNotice('발음 통과! 연결된 사람이 없어서 보내지는 않았어요.')
    try {
      await sendChat(myName, target, ko)
      setText('')
      setKo(undefined)
      setResult(null)
      setPartial('')
      setNotice('✓ 발음 통과! 보냈어요.')
    } catch {
      setNotice('발음은 맞았는데 보내지 못했어요. 연결을 확인해 주세요.')
    }
  }

  return (
    <div className="card form composer">
      <label>
        보낼 베트남어
        <textarea lang="vi" rows={2} value={text} onChange={(e) => edit(e.target.value)} placeholder="Xin chào!" disabled={listening} />
      </label>
      {ko && <p className="muted">뜻: {ko}</p>}
      {hasDigits(target) && <p className="warn-text">숫자는 글자로 써 주세요. (예: 50 → năm mươi)</p>}
      <div className="row">
        <button className="btn" onClick={() => setPicking(!picking)} disabled={listening}>📖 문장 고르기</button>
        {target && <button className="btn" onClick={() => say(target)} disabled={listening}>▶ 정답 듣기</button>}
      </div>
      {picking && <PhrasePicker onPick={pick} />}
      <button
        className={`btn block mic ${listening ? 'rec' : 'primary'}`}
        disabled={!target || hasDigits(target)}
        onClick={mic}
      >
        {listening ? '■ 다 말했어요' : result && !result.pass ? '🎤 다시 말하기' : '🎤 말해서 보내기'}
      </button>
      {(listening || partial) && (
        <p className="heard">
          <span className="muted">들린 말: </span>
          <span lang="vi">{partial || '…'}</span>
        </p>
      )}
      {result && <Verdict result={result} />}
      {notice && <p className={notice.startsWith('✓') || notice.startsWith('발음 통과') ? 'ok-text' : 'warn-text'}>{notice}</p>}
    </div>
  )
}

function Verdict({ result }: { result: PronunciationResult }) {
  return (
    <div className="verdict">
      <p className="syls" lang="vi">
        {result.marks.map((m, i) => (
          <span key={i} className={`syl ${m.status}`}>
            {m.text}
            {m.status === 'tone' && m.heardTone && <small>{TONE_LABEL[m.heardTone].ko}로 들림</small>}
            {m.status === 'wrong' && <small>{m.heard}</small>}
            {m.status === 'missing' && <small>안 들림</small>}
          </span>
        ))}
      </p>
      {result.extra.length > 0 && <p className="warn-text">더 들린 말: <span lang="vi">{result.extra.join(' ')}</span></p>}
      {!result.pass && <p className="muted">주황색은 성조, 빨간색은 소리가 달랐던 음절이에요. 정답을 듣고 다시 말해 보세요.</p>}
    </div>
  )
}

function PhrasePicker({ onPick }: { onPick: (vi: string, ko: string) => void }) {
  const [scene, setScene] = useState(SCENES[0].id)
  const [query, setQuery] = useState('')
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SCENES.find((s) => s.id === scene)?.phrases ?? []
    return SCENES.flatMap((s) => s.phrases)
      .filter((p) => p.ko.toLowerCase().includes(q) || p.vi.toLowerCase().includes(q))
      .slice(0, 40)
  }, [scene, query])

  return (
    <div className="picker">
      <input placeholder="한국어나 베트남어로 찾기" value={query} onChange={(e) => setQuery(e.target.value)} />
      {!query.trim() && (
        <select value={scene} onChange={(e) => setScene(e.target.value)}>
          {SCENES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.emoji} {s.title}
            </option>
          ))}
        </select>
      )}
      <ul>
        {list.map((p) => (
          <li key={p.id}>
            <button onClick={() => onPick(p.vi, p.ko)}>
              <b lang="vi">{p.vi}</b>
              <span>{p.ko}</span>
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="muted">찾는 문장이 없어요.</li>}
      </ul>
    </div>
  )
}
