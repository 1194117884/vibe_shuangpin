import { xiaohe } from './xiaohe'
import { sougou } from './sougou'
import { microsoft } from './microsoft'
import { ziranma } from './ziranma'
import type { ShuangpinScheme } from '../types'

export const schemes: ShuangpinScheme[] = [xiaohe, sougou, microsoft, ziranma]

export function getSchemeById(id: string): ShuangpinScheme | undefined {
  return schemes.find(s => s.id === id)
}
