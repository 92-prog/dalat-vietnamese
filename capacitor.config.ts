import type { CapacitorConfig } from '@capacitor/cli'

// 아이폰 앱(근처 채팅용) 설정. 웹 빌드(dist)를 그대로 앱에 넣는다.
const config: CapacitorConfig = {
  appId: 'com.prog92.dalatvi',
  appName: '달랏 베트남어',
  webDir: 'dist',
}

export default config
