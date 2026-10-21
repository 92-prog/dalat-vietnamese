import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { isNative } from './lib/native'
import { App } from './App'
import { AppProvider } from './state'
import './styles.css'

// 아이폰 앱 안(WKWebView)에서는 서비스 워커가 동작하지 않고, 파일도 앱에 들어 있어 필요 없다.
if (!isNative()) registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
