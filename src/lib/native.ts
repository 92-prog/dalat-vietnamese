// 아이폰 앱(Capacitor)에만 있는 네이티브 기능. 코드는 ios/App/App/*Plugin.swift.
import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core'

export const isNative = () => Capacitor.isNativePlatform()

export interface PeerEvent {
  peerId: string
  name: string
}

export interface NearbyChatPlugin {
  start(opts: { name: string }): Promise<void>
  stop(): Promise<void>
  invite(opts: { peerId: string }): Promise<void>
  respond(opts: { peerId: string; accept: boolean }): Promise<void>
  send(opts: { text: string; ko?: string }): Promise<void>
  addListener(event: 'peerFound' | 'peerLost' | 'invitation', fn: (e: PeerEvent) => void): Promise<PluginListenerHandle>
  addListener(
    event: 'peerState',
    fn: (e: PeerEvent & { state: 'connecting' | 'connected' | 'notConnected' }) => void,
  ): Promise<PluginListenerHandle>
  addListener(event: 'message', fn: (e: PeerEvent & { text: string; ko?: string }) => void): Promise<PluginListenerHandle>
}

export interface ViSpeechPlugin {
  requestPermission(): Promise<{ granted: boolean; denied?: 'speech' | 'mic' }>
  start(): Promise<void>
  /** 녹음을 멈추고 들린 문장을 돌려준다. 못 알아들었으면 text가 비어 있다. */
  stop(): Promise<{ text: string; error?: string }>
  addListener(event: 'partial', fn: (e: { text: string }) => void): Promise<PluginListenerHandle>
}

export const NearbyChat = registerPlugin<NearbyChatPlugin>('NearbyChat')
export const ViSpeech = registerPlugin<ViSpeechPlugin>('ViSpeech')
