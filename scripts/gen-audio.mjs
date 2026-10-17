// 맥 내장 베트남어 음성(Linh)으로 앱의 모든 베트남어를 녹음해 public/audio/<key>.m4a로 저장한다.
// 사용법: npm run audio   (macOS 전용. 이미 있는 파일은 건너뛰고, 목록에서 빠진 파일은 지운다)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const outDir = join(root, 'public/audio')
const VOICE = 'Linh'

if (process.platform !== 'darwin') {
  console.error('맥에서만 실행할 수 있어요 (say, afconvert 필요).')
  process.exit(1)
}
const voices = execFileSync('say', ['-v', '?'], { encoding: 'utf8' })
if (!voices.split('\n').some((l) => l.startsWith(`${VOICE} `))) {
  console.error(`"${VOICE}" 음성이 없어요. 시스템 설정 → 손쉬운 사용 → 읽기 및 말하기에서 베트남어 음성을 내려받아 주세요.`)
  process.exit(1)
}

const server = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
const { allAudioTexts } = await server.ssrLoadModule('/src/data/audioTexts.ts')
const { audioKey } = await server.ssrLoadModule('/src/lib/audioKey.ts')
await server.close()

const texts = allAudioTexts()
const keys = new Map(texts.map((t) => [audioKey(t), t]))
if (keys.size !== texts.length) throw new Error('파일 이름(해시)이 겹치는 문장이 있어요.')

mkdirSync(outDir, { recursive: true })
const tmp = mkdtempSync(join(tmpdir(), 'gen-audio-'))
let made = 0
for (const [key, text] of keys) {
  const out = join(outDir, `${key}.m4a`)
  if (existsSync(out)) continue
  const aiff = join(tmp, `${key}.aiff`)
  execFileSync('say', ['-v', VOICE, '-o', aiff, text])
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-c', '1', '-b', '48000', aiff, out])
  made++
}
rmSync(tmp, { recursive: true, force: true })

let removed = 0
for (const f of readdirSync(outDir)) {
  if (f.endsWith('.m4a') && !keys.has(f.slice(0, -4))) {
    rmSync(join(outDir, f))
    removed++
  }
}

writeFileSync(join(root, 'src/data/audio-manifest.json'), JSON.stringify([...keys.keys()].sort(), null, 0) + '\n')
console.log(`녹음 ${keys.size}개 (새로 만듦 ${made}, 지움 ${removed})`)
