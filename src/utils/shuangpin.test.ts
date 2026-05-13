import { describe, it, expect } from 'vitest'
import { getShuangpinKeys, parsePinyin, getAvailableSchemes } from './shuangpin'
import { xiaohe } from '../data/xiaohe'

describe('parsePinyin', () => {
  it('splits zh-initial syllables', () => {
    expect(parsePinyin('zhong')).toEqual({ initial: 'zh', final: 'ong' })
    expect(parsePinyin('zhi')).toEqual({ initial: 'zh', final: 'i' })
  })

  it('splits ch-initial syllables', () => {
    expect(parsePinyin('chi')).toEqual({ initial: 'ch', final: 'i' })
  })

  it('splits sh-initial syllables', () => {
    expect(parsePinyin('shi')).toEqual({ initial: 'sh', final: 'i' })
    expect(parsePinyin('shang')).toEqual({ initial: 'sh', final: 'ang' })
  })

  it('splits single-letter initial syllables', () => {
    expect(parsePinyin('da')).toEqual({ initial: 'd', final: 'a' })
    expect(parsePinyin('nian')).toEqual({ initial: 'n', final: 'ian' })
    expect(parsePinyin('kuai')).toEqual({ initial: 'k', final: 'uai' })
  })

  it('returns null for zero-initial syllables', () => {
    expect(parsePinyin('an')).toBeNull()
    expect(parsePinyin('a')).toBeNull()
    expect(parsePinyin('e')).toBeNull()
    expect(parsePinyin('ou')).toBeNull()
  })
})

describe('getShuangpinKeys', () => {
  it('returns keys for a syllable with initial + final', () => {
    // zhong = zh + ong → v + s
    expect(getShuangpinKeys('zhong', xiaohe)).toBe('vs')
  })

  it('handles ch/sh/zh initials', () => {
    expect(getShuangpinKeys('chi', xiaohe)).toBe('ii')
    expect(getShuangpinKeys('shi', xiaohe)).toBe('ui')
    expect(getShuangpinKeys('zhi', xiaohe)).toBe('vi')
  })

  it('handles zero-initial finals correctly', () => {
    expect(getShuangpinKeys('an', xiaohe)).toBe('an')
    expect(getShuangpinKeys('a', xiaohe)).toBe('aa')
    expect(getShuangpinKeys('e', xiaohe)).toBe('ee')
    expect(getShuangpinKeys('o', xiaohe)).toBe('oo')
    expect(getShuangpinKeys('ai', xiaohe)).toBe('ai')
    expect(getShuangpinKeys('ang', xiaohe)).toBe('ah')
    expect(getShuangpinKeys('ou', xiaohe)).toBe('ou')
  })

  it('handles syllables with ia/iao/uai finals', () => {
    expect(getShuangpinKeys('qia', xiaohe)).toBe('qx')
    expect(getShuangpinKeys('biao', xiaohe)).toBe('bn')
    expect(getShuangpinKeys('kuai', xiaohe)).toBe('kk')
  })

  it('handles two-character words separated by space', () => {
    expect(getShuangpinKeys('zhong guo', xiaohe)).toBe('vs go')
  })

  it('throws for invalid pinyin', () => {
    expect(() => getShuangpinKeys('xyz', xiaohe)).toThrow('无法解析拼音')
  })
})

describe('getAvailableSchemes', () => {
  it('returns at least xiaohe', () => {
    const schemes = getAvailableSchemes()
    const ids = schemes.map(s => s.id)
    expect(ids).toContain('xiaohe')
  })
})
