// 근처 채팅 상태. 화면(탭)을 옮겨도 연결과 대화가 유지되도록 모듈 하나에 모아 두고,
// 네이티브 이벤트도 여기서 한 번만 구독한다. 대화는 메모리에만 있고 앱을 끄면 사라진다.
import { useSyncExternalStore } from 'react'
import { NearbyChat } from './native'

export type PeerStatus = 'found' | 'invited' | 'incoming' | 'connecting' | 'connected'

export interface Peer {
  id: string
  name: string
  status: PeerStatus
}

export interface ChatMessage {
  id: number
  from: 'me' | 'them' | 'system'
  name: string
  text: string
  ko?: string
}

export interface ChatState {
  running: boolean
  peers: Peer[]
  messages: ChatMessage[]
}

let state: ChatState = { running: false, peers: [], messages: [] }
const subscribers = new Set<() => void>()
let nextMessageId = 1
let listening = false

function set(next: Partial<ChatState>) {
  state = { ...state, ...next }
  subscribers.forEach((fn) => fn())
}

function upsertPeer(id: string, name: string, status: PeerStatus) {
  const rest = state.peers.filter((p) => p.id !== id)
  set({ peers: [...rest, { id, name, status }] })
}

function addMessage(m: Omit<ChatMessage, 'id'>) {
  set({ messages: [...state.messages, { ...m, id: nextMessageId++ }] })
}

const peerOf = (id: string) => state.peers.find((p) => p.id === id)

function listen() {
  if (listening) return
  listening = true
  NearbyChat.addListener('peerFound', ({ peerId, name }) => {
    if (!peerOf(peerId)) upsertPeer(peerId, name, 'found')
  })
  NearbyChat.addListener('peerLost', ({ peerId }) => {
    // 연결된 사람은 근처 목록에서 잠깐 사라져도 대화는 이어진다.
    if (peerOf(peerId)?.status !== 'connected') set({ peers: state.peers.filter((p) => p.id !== peerId) })
  })
  NearbyChat.addListener('invitation', ({ peerId, name }) => upsertPeer(peerId, name, 'incoming'))
  NearbyChat.addListener('peerState', ({ peerId, name, state: s }) => {
    const was = peerOf(peerId)?.status
    if (s === 'connected') {
      upsertPeer(peerId, name, 'connected')
      addMessage({ from: 'system', name, text: `${name} 님과 연결됐어요.` })
    } else if (s === 'connecting') {
      upsertPeer(peerId, name, 'connecting')
    } else {
      upsertPeer(peerId, name, 'found')
      if (was === 'connected') addMessage({ from: 'system', name, text: `${name} 님과 연결이 끊겼어요.` })
    }
  })
  NearbyChat.addListener('message', ({ name, text, ko }) => addMessage({ from: 'them', name, text, ko }))
}

export async function startNearby(name: string) {
  listen()
  await NearbyChat.start({ name })
  set({ running: true, peers: [] })
}

export async function stopNearby() {
  await NearbyChat.stop()
  set({ running: false, peers: [] })
}

export async function invitePeer(id: string) {
  const p = peerOf(id)
  if (!p) return
  upsertPeer(id, p.name, 'invited')
  await NearbyChat.invite({ peerId: id })
}

export async function respondInvite(id: string, accept: boolean) {
  const p = peerOf(id)
  if (!p) return
  upsertPeer(id, p.name, accept ? 'connecting' : 'found')
  await NearbyChat.respond({ peerId: id, accept })
}

export async function sendChat(myName: string, text: string, ko?: string) {
  await NearbyChat.send({ text, ko })
  addMessage({ from: 'me', name: myName, text, ko })
}

export const connectedPeers = (s: ChatState) => s.peers.filter((p) => p.status === 'connected')

const subscribe = (fn: () => void) => {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function useChat(): ChatState {
  return useSyncExternalStore(subscribe, () => state)
}
