import type { ShuangpinScheme } from '../types'

export const sougou: ShuangpinScheme = {
  id: 'sougou',
  name: '搜狗',
  description: '搜狗输入法双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'l', ei: 'z', ui: 'v',
    ao: 'k', ou: 'b',
    an: 'j', en: 'f', in: 'n', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'y', ong: 's',
    ia: 'x', iao: 'c', ie: 'x', iu: 'q',
    ua: 'x', uo: 'o', uai: 'm', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 'x', ve: 'x',
    er: 'r',
  },
  specials: {
    a: 'aa',
    o: 'oo',
    e: 'ee',
  },
  zeroInitialFinals: {
    a: 'aa', o: 'oo', e: 'ee',
    ai: 'ai', an: 'an', ang: 'ah', ao: 'ao',
    ei: 'ei', en: 'en', eng: 'eg', er: 'er',
    ou: 'ou',
  },
}
