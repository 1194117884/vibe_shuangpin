import { describe, it, expect } from 'vitest'
import { microsoft } from './microsoft'

describe('microsoft scheme', () => {
  it('has correct id and name', () => {
    expect(microsoft.id).toBe('microsoft')
    expect(microsoft.name).toBe('微软')
  })

  it('maps zh/ch/sh to v/i/u', () => {
    expect(microsoft.initials['zh']).toBe('v')
    expect(microsoft.initials['ch']).toBe('i')
    expect(microsoft.initials['sh']).toBe('u')
  })

  it('maps common finals', () => {
    expect(microsoft.finals['ang']).toBe('h')
    expect(microsoft.finals['eng']).toBe('g')
    expect(microsoft.finals['ong']).toBe('s')
    expect(microsoft.finals['an']).toBe('j')
    expect(microsoft.finals['ian']).toBe('j')
    expect(microsoft.finals['iao']).toBe('k')
    expect(microsoft.finals['in']).toBe('n')
    expect(microsoft.finals['ing']).toBe('y')
    expect(microsoft.finals['iu']).toBe('q')
    expect(microsoft.finals['uan']).toBe('r')
    expect(microsoft.finals['ue']).toBe('x')
    expect(microsoft.finals['un']).toBe('p')
    expect(microsoft.finals['uo']).toBe('o')
    expect(microsoft.finals['ve']).toBe('x')
  })
})
