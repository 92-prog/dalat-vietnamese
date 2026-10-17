import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { loadState, saveState, type AppState } from './lib/storage'
import { speak } from './lib/speech'

interface Ctx {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  replace: (s: AppState) => void
  say: (text: string, rate?: number) => Promise<boolean>
  saveFailed: boolean
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    setSaveFailed(!saveState(state))
  }, [state])

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), [])
  const replace = useCallback((s: AppState) => setState(s), [])
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const say = useCallback(
    async (text: string, rate?: number) => {
      const ok = await speak(text, { rate: rate ?? state.settings.rate, voiceURI: state.settings.voiceURI })
      if (!ok) setToast('이 문장은 아직 베트남어 음성이 없어요.')
      return ok
    },
    [state.settings.rate, state.settings.voiceURI],
  )

  return (
    <AppCtx.Provider value={{ state, update, replace, say, saveFailed }}>
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </AppCtx.Provider>
  )
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('AppProvider가 없어요')
  return ctx
}

/** 현재 시각. 렌더할 때마다 새로 읽고, 화면을 켜 둔 동안에도 1분마다 다시 그린다. */
export function useNow(): Date {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000)
    return () => clearInterval(t)
  }, [])
  return new Date()
}
