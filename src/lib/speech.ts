// 베트남어 소리는 앱에 들어 있는 녹음(맥 Linh 음성, public/audio)을 먼저 재생한다.
// 녹음이 없을 때만 기기 음성을 쓰고, 베트남어 음성이 아니면 절대 읽지 않는다.
import manifest from '../data/audio-manifest.json'
import { audioKey } from './audioKey'

const CLIPS = new Set<string>(manifest)

export function hasClip(text: string): boolean {
  return CLIPS.has(audioKey(text))
}

export function clipUrl(text: string): string {
  return `${import.meta.env.BASE_URL}audio/${audioKey(text)}.m4a`
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

interface VoiceLike {
  lang: string
  voiceURI: string
}

/** 베트남어 음성만 고른다. 없으면 null (다른 언어 음성으로 대신 읽지 않기 위해). */
export function pickVietnameseVoice<V extends VoiceLike>(voices: V[], preferredURI?: string | null): V | null {
  const vi = voices.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('vi'))
  return vi.find((v) => v.voiceURI === preferredURI) ?? vi[0] ?? null
}

let player: HTMLAudioElement | null = null

function stopAll() {
  if (player) {
    player.pause()
    player.onended = player.onerror = null
  }
  if (speechSupported()) speechSynthesis.cancel()
}

function playClip(text: string, rate: number): Promise<boolean> {
  // iOS에서 소리가 끊기지 않도록 오디오 요소 하나를 계속 다시 쓴다.
  player ??= new Audio()
  const audio = player
  audio.src = clipUrl(text)
  audio.preservesPitch = true
  audio.defaultPlaybackRate = rate
  audio.playbackRate = rate
  return new Promise((resolve) => {
    audio.onended = () => resolve(true)
    audio.onerror = () => resolve(false)
    audio.play().catch(() => resolve(false))
  })
}

function speakDevice(text: string, rate: number, voiceURI?: string | null): Promise<boolean> {
  if (!speechSupported()) return Promise.resolve(false)
  const voice = pickVietnameseVoice(speechSynthesis.getVoices(), voiceURI)
  if (!voice) return Promise.resolve(false)
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = voice.lang
    u.voice = voice
    u.rate = rate
    u.onend = () => resolve(true)
    u.onerror = () => resolve(false)
    speechSynthesis.speak(u)
  })
}

let generation = 0

/** 베트남어로 읽는다. 들려줄 베트남어 소리가 없으면 false. */
export async function speak(text: string, opts: { rate?: number; voiceURI?: string | null } = {}): Promise<boolean> {
  const rate = opts.rate ?? 0.8
  const mine = ++generation
  stopAll()
  if (hasClip(text) && (await playClip(text, rate))) return true
  // 다른 소리를 재생하느라 끊긴 경우: 실패로 보지 않고, 기기 음성으로 다시 읽지도 않는다.
  if (mine !== generation) return true
  const ok = await speakDevice(text, rate, opts.voiceURI)
  return ok || mine !== generation
}

export function recordingSupported(): boolean {
  return typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'MediaRecorder' in window
}

export interface Recording {
  stop: () => Promise<string>
}

/** 녹음을 시작한다. stop()을 부르면 재생할 수 있는 blob URL을 돌려준다. */
export async function startRecording(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const recorder = new MediaRecorder(stream)
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)
  recorder.start()
  return {
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop())
          resolve(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/mp4' })))
        }
        recorder.stop()
      }),
  }
}
