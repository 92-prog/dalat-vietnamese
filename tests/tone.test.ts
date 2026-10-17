import { describe, expect, it } from 'vitest'
import { stripTone, syllables, toneOf, withTone } from '../src/lib/tone'

describe('toneOf', () => {
  it('ma 6성조를 구분한다', () => {
    expect(['ma', 'mà', 'má', 'mả', 'mã', 'mạ'].map(toneOf)).toEqual(['ngang', 'huyen', 'sac', 'hoi', 'nga', 'nang'])
  })
  it('모양 부호(ơ ư â ê ô ă)는 성조로 보지 않는다', () => {
    expect(toneOf('cơm')).toBe('ngang')
    expect(toneOf('đâu')).toBe('ngang')
    expect(toneOf('ăn')).toBe('ngang')
    expect(toneOf('người')).toBe('huyen')
    expect(toneOf('Việt')).toBe('nang')
    expect(toneOf('tiếng')).toBe('sac')
    expect(toneOf('sữa')).toBe('nga')
    expect(toneOf('sửa')).toBe('hoi')
  })
  it('대문자와 NFD 입력도 처리한다', () => {
    expect(toneOf('Đà')).toBe('huyen')
    expect(toneOf('mạ'.normalize('NFD'))).toBe('nang')
  })
})

describe('stripTone / withTone', () => {
  it('성조만 지우고 모양 부호는 남긴다', () => {
    expect(stripTone('Việt')).toBe('Viêt')
    expect(stripTone('người')).toBe('ngươi')
    expect(stripTone('Đà Lạt')).toBe('Đa Lat')
  })
  it('원래 성조 위치에서 성조를 바꾼다', () => {
    expect(withTone('mà', 'nga')).toBe('mã')
    expect(withTone('Việt', 'sac')).toBe('Viết')
    expect(withTone('ấm', 'nang')).toBe('ậm')
    expect(withTone('sữa', 'hoi')).toBe('sửa')
    expect(withTone('bán', 'ngang')).toBe('ban')
  })
  it('성조 없는 음절에 성조 위치 규칙을 적용한다', () => {
    expect(withTone('ma', 'huyen')).toBe('mà')
    expect(withTone('mua', 'sac')).toBe('múa')
    expect(withTone('hoa', 'huyen')).toBe('hòa')
    expect(withTone('ngoai', 'huyen')).toBe('ngoài')
    expect(withTone('ngươi', 'huyen')).toBe('người')
    expect(withTone('quân', 'nang')).toBe('quận')
    expect(withTone('gia', 'huyen')).toBe('già')
    expect(withTone('gi', 'huyen')).toBe('gì')
    expect(withTone('toan', 'huyen')).toBe('toàn')
    expect(withTone('tiêng', 'sac')).toBe('tiếng')
    expect(withTone('Đa', 'huyen')).toBe('Đà')
  })
  it('결과는 항상 NFC다', () => {
    const out = withTone('ân', 'sac')
    expect(out).toBe(out.normalize('NFC'))
    expect(out).toBe('ấn')
  })
})

describe('syllables', () => {
  it('문장 부호를 빼고 음절만 뽑는다', () => {
    expect(syllables('Em ơi, tính tiền!')).toEqual(['Em', 'ơi', 'tính', 'tiền'])
  })
})
