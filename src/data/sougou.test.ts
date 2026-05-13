import { describe, it, expect } from 'vitest'
import { sougou } from './sougou'

describe('sougou scheme', () => {
  it('has correct id and name', () => {
    expect(sougou.id).toBe('sougou')
    expect(sougou.name).toBe('搜狗')
  })

  it('maps zh/ch/sh to v/i/u', () => {
    expect(sougou.initials['zh']).toBe('v')
    expect(sougou.initials['ch']).toBe('i')
    expect(sougou.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(sougou.finals['ang']).toBe('h')
    expect(sougou.finals['eng']).toBe('g')
    expect(sougou.finals['ong']).toBe('s')
    expect(sougou.finals['an']).toBe('j')
    expect(sougou.finals['ian']).toBe('j')
    expect(sougou.finals['iao']).toBe('c')
    expect(sougou.finals['in']).toBe('n')
    expect(sougou.finals['ing']).toBe('y')
    expect(sougou.finals['iu']).toBe('q')
    expect(sougou.finals['uan']).toBe('r')
    expect(sougou.finals['ue']).toBe('x')
    expect(sougou.finals['un']).toBe('p')
    expect(sougou.finals['uo']).toBe('o')
    expect(sougou.finals['ve']).toBe('x')
    expect(sougou.finals['ai']).toBe('l')
    expect(sougou.finals['ei']).toBe('z')
  })
})
