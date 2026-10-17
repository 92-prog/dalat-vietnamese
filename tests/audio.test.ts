import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import manifest from '../src/data/audio-manifest.json'
import { allAudioTexts } from '../src/data/audioTexts'
import { audioKey } from '../src/lib/audioKey'
import { pickVietnameseVoice } from '../src/lib/speech'

const dir = join(__dirname, '../public/audio')
const keys = allAudioTexts().map(audioKey)

describe('녹음 파일', () => {
  it('앱에서 들려주는 모든 베트남어에 녹음 파일이 있다 (없으면 맥에서 npm run audio)', () => {
    const missing = allAudioTexts().filter((t) => !existsSync(join(dir, `${audioKey(t)}.m4a`)))
    expect(missing).toEqual([])
  })
  it('목록에 없는 녹음 파일이 남아 있지 않다', () => {
    const files = readdirSync(dir).filter((f) => f.endsWith('.m4a')).map((f) => f.slice(0, -4))
    expect(files.filter((f) => !keys.includes(f))).toEqual([])
  })
  it('manifest가 녹음 목록과 같다', () => {
    expect([...manifest].sort()).toEqual([...new Set(keys)].sort())
  })
  it('파일 이름이 겹치지 않는다', () => {
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('NFC와 NFD, 앞뒤 공백이 달라도 같은 파일을 가리킨다', () => {
    expect(audioKey('Việt'.normalize('NFD'))).toBe(audioKey('Việt'))
    expect(audioKey(' Xin chào. ')).toBe(audioKey('Xin chào.'))
    expect(audioKey('ma')).not.toBe(audioKey('mà'))
  })
})

describe('기기 음성 고르기', () => {
  const ko = { lang: 'ko-KR', voiceURI: 'yuna' }
  const en = { lang: 'en-US', voiceURI: 'samantha' }
  const vi = { lang: 'vi-VN', voiceURI: 'linh' }
  const vi2 = { lang: 'vi_VN', voiceURI: 'other' }
  it('베트남어 음성이 없으면 다른 언어 음성을 고르지 않는다', () => {
    expect(pickVietnameseVoice([ko, en], null)).toBeNull()
    expect(pickVietnameseVoice([], null)).toBeNull()
    expect(pickVietnameseVoice([ko, en], 'yuna')).toBeNull()
  })
  it('베트남어 음성 중에서 고른다', () => {
    expect(pickVietnameseVoice([ko, vi], null)).toBe(vi)
    expect(pickVietnameseVoice([ko, vi, vi2], 'other')).toBe(vi2)
  })
})
