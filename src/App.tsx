import { useEffect, useState } from 'react'
import { dueIds } from './lib/srs'
import { Chat } from './screens/Chat'
import { Review } from './screens/Review'
import { SceneDetail, Scenes } from './screens/Scenes'
import { Settings } from './screens/Settings'
import { Today } from './screens/Today'
import { ToneTrainer } from './screens/ToneTrainer'
import { useApp, useNow } from './state'

const TABS = [
  { path: 'today', label: '오늘', icon: '☀️' },
  { path: 'tones', label: '성조', icon: '🎵' },
  { path: 'scenes', label: '장면', icon: '🗺️' },
  { path: 'review', label: '복습', icon: '🔁' },
  { path: 'chat', label: '채팅', icon: '💬' },
  { path: 'settings', label: '설정', icon: '⚙️' },
]

function useRoute(): string[] {
  const read = () => (location.hash.replace(/^#\/?/, '') || 'today').split('/')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return route
}

export function App() {
  const [page, param] = useRoute()
  const { state } = useApp()
  const due = dueIds(state.cards, useNow()).length

  return (
    <>
      <main>
        {page === 'tones' ? (
          <ToneTrainer />
        ) : page === 'scenes' && param ? (
          <SceneDetail id={param} />
        ) : page === 'scenes' ? (
          <Scenes />
        ) : page === 'review' ? (
          <Review />
        ) : page === 'chat' ? (
          <Chat />
        ) : page === 'settings' ? (
          <Settings />
        ) : (
          <Today />
        )}
      </main>
      <nav className="tabs">
        {TABS.map((t) => (
          <a key={t.path} href={`#/${t.path}`} className={page === t.path ? 'on' : ''}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
            {t.path === 'review' && due > 0 && <span className="badge">{due}</span>}
          </a>
        ))}
      </nav>
    </>
  )
}
