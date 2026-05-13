import { describe, it, expect } from 'vitest'
import { xiaohe } from './xiaohe'

describe('xiaohe scheme', () => {
  it('has correct id and name', () => {
    expect(xiaohe.id).toBe('xiaohe')
    expect(xiaohe.name).toBe('小鹤')
  })

  it('maps all standard initials', () => {
    expect(xiaohe.initials['zh']).toBe('v')
    expect(xiaohe.initials['ch']).toBe('i')
    expect(xiaohe.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(xiaohe.finals['ang']).toBe('h')
    expect(xiaohe.finals['eng']).toBe('g')
    expect(xiaohe.finals['ong']).toBe('s')
    expect(xiaohe.finals['an']).toBe('j')
    expect(xiaohe.finals['ai']).toBe('d')
    expect(xiaohe.finals['ei']).toBe('w')
    expect(xiaohe.finals['ou']).toBe('b')
    expect(xiaohe.finals['iu']).toBe('q')
    expect(xiaohe.finals['ing']).toBe('k')
    expect(xiaohe.finals['un']).toBe('p')
    expect(xiaohe.finals['vn']).toBe('y')
    expect(xiaohe.finals['ia']).toBe('x')
    expect(xiaohe.finals['ie']).toBe('p')
    expect(xiaohe.finals['uo']).toBe('o')
    expect(xiaohe.finals['ue']).toBe('t')
    expect(xiaohe.finals['ui']).toBe('v')
    expect(xiaohe.finals['ua']).toBe('x')
    expect(xiaohe.finals['ian']).toBe('j')
    expect(xiaohe.finals['iao']).toBe('n')
    expect(xiaohe.finals['iang']).toBe('l')
    expect(xiaohe.finals['iong']).toBe('s')
    expect(xiaohe.finals['uang']).toBe('l')
    expect(xiaohe.finals['uan']).toBe('r')
    expect(xiaohe.finals['uai']).toBe('k')
    expect(xiaohe.finals['ve']).toBe('t')
    expect(xiaohe.finals['er']).toBe('r')
  })

  it('maps zero-initial finals', () => {
    expect(xiaohe.zeroInitialFinals['a']).toBe('aa')
    expect(xiaohe.zeroInitialFinals['o']).toBe('oo')
    expect(xiaohe.zeroInitialFinals['e']).toBe('ee')
    expect(xiaohe.zeroInitialFinals['ai']).toBe('ai')
    expect(xiaohe.zeroInitialFinals['an']).toBe('an')
    expect(xiaohe.zeroInitialFinals['ang']).toBe('ah')
    expect(xiaohe.zeroInitialFinals['ou']).toBe('ou')
  })

})
