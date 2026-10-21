import { describe, expect, it } from 'vitest'
import { checkPronunciation, hasDigits } from '../src/lib/pronounce'

describe('checkPronunciation', () => {
  it('똑같이 말하면 통과한다', () => {
    const r = checkPronunciation('Cho tôi một ly cà phê sữa đá.', 'cho tôi một ly cà phê sữa đá')
    expect(r.pass).toBe(true)
    expect(r.marks.every((m) => m.status === 'ok')).toBe(true)
  })

  it('대소문자, 문장 부호, 띄어쓰기, NFD 입력은 따지지 않는다', () => {
    expect(checkPronunciation('Xin chào!', '  xin   CHÀO ').pass).toBe(true)
    expect(checkPronunciation('Cảm ơn', 'Cảm ơn'.normalize('NFD')).pass).toBe(true)
  })

  it('성조 부호 위치가 달라도(hòa/hoà) 같은 음절로 본다', () => {
    expect(checkPronunciation('hòa bình', 'hoà bình').pass).toBe(true)
  })

  it('성조만 틀리면 실패하고 들린 성조를 알려 준다', () => {
    const r = checkPronunciation('ma', 'má')
    expect(r.pass).toBe(false)
    expect(r.marks).toEqual([{ text: 'ma', status: 'tone', heard: 'má', heardTone: 'sac' }])
  })

  it('문장 속 성조 실수를 제자리에 표시한다', () => {
    const r = checkPronunciation('bao nhiêu tiền', 'bao nhiều tiền')
    expect(r.marks.map((m) => m.status)).toEqual(['ok', 'tone', 'ok'])
  })

  it('빠진 음절과 더 들린 음절은 실패한다', () => {
    const missing = checkPronunciation('xin chào bạn', 'xin chào')
    expect(missing.pass).toBe(false)
    expect(missing.marks.map((m) => m.status)).toEqual(['ok', 'ok', 'missing'])

    const extra = checkPronunciation('xin chào', 'xin chào bạn')
    expect(extra.pass).toBe(false)
    expect(extra.extra).toEqual(['bạn'])
  })

  it('다른 음절은 wrong, d와 đ도 구분한다', () => {
    expect(checkPronunciation('đi', 'di').marks[0]).toEqual({ text: 'đi', status: 'wrong', heard: 'di' })
  })

  it('빈 문장은 통과하지 않는다', () => {
    expect(checkPronunciation('', '').pass).toBe(false)
  })
})

describe('hasDigits', () => {
  it('숫자가 있으면 true', () => {
    expect(hasDigits('50 nghìn')).toBe(true)
    expect(hasDigits('năm mươi nghìn')).toBe(false)
  })
})
