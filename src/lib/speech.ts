// 기기 내장 음성(Web Speech API)으로 베트남어를 읽고, MediaRecorder로 내 발음을 녹음한다.

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function vietnameseVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return []
  return speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('vi'))
}

/** 음성 목록은 비동기로 채워지므로, 바뀔 때마다 콜백을 부른다. */
export function onVoicesChanged(cb: () => void): () => void {
  if (!speechSupported()) return () => {}
  speechSynthesis.addEventListener('voiceschanged', cb)
  return () => speechSynthesis.removeEventListener('voiceschanged', cb)
}

export function speak(text: string, opts: { rate?: number; voiceURI?: string | null } = {}): Promise<void> {
  if (!speechSupported()) return Promise.resolve()
  speechSynthesis.cancel()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'vi-VN'
    u.rate = opts.rate ?? 0.8
    const voices = vietnameseVoices()
    const voice = voices.find((v) => v.voiceURI === opts.voiceURI) ?? voices[0]
    if (voice) u.voice = voice
    u.onend = () => resolve()
    u.onerror = () => resolve()
    speechSynthesis.speak(u)
  })
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
