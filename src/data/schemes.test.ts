import { describe, it, expect } from 'vitest'
import { schemes, getSchemeById } from './schemes'

describe('schemes index', () => {
  it('exports all four schemes', () => {
    const ids = schemes.map(s => s.id)
    expect(ids).toEqual(['xiaohe', 'sougou', 'microsoft', 'ziranma'])
  })

  it('getSchemeById finds by id', () => {
    expect(getSchemeById('xiaohe')?.name).toBe('小鹤')
    expect(getSchemeById('sougou')?.name).toBe('搜狗')
    expect(getSchemeById('microsoft')?.name).toBe('微软')
    expect(getSchemeById('ziranma')?.name).toBe('自然码')
    expect(getSchemeById('invalid')).toBeUndefined()
  })
})
