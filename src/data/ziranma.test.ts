import { describe, it, expect } from 'vitest'
import { ziranma } from './ziranma'

describe('ziranma scheme', () => {
  it('has correct id and name', () => {
    expect(ziranma.id).toBe('ziranma')
    expect(ziranma.name).toBe('自然码')
  })

  it('maps zh/ch/sh to v/i/u', () => {
    expect(ziranma.initials['zh']).toBe('v')
    expect(ziranma.initials['ch']).toBe('i')
    expect(ziranma.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(ziranma.finals['ang']).toBe('h')
    expect(ziranma.finals['eng']).toBe('g')
    expect(ziranma.finals['ong']).toBe('s')
    expect(ziranma.finals['an']).toBe('j')
    expect(ziranma.finals['ian']).toBe('j')
    expect(ziranma.finals['iao']).toBe('c')
    expect(ziranma.finals['in']).toBe('n')
    expect(ziranma.finals['ing']).toBe('y')
    expect(ziranma.finals['iu']).toBe('q')
    expect(ziranma.finals['uan']).toBe('r')
    expect(ziranma.finals['ue']).toBe('t')
    expect(ziranma.finals['un']).toBe('p')
    expect(ziranma.finals['uo']).toBe('o')
    expect(ziranma.finals['ve']).toBe('t')
    expect(ziranma.finals['ai']).toBe('l')
    expect(ziranma.finals['ei']).toBe('z')
  })
})
