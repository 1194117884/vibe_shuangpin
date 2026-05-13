import type { ShuangpinScheme } from '../types'

export const microsoft: ShuangpinScheme = {
  id: 'microsoft',
  name: '微软',
  description: '微软双拼方案（又称"微软拼音双拼"）',
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
    ia: 'w', iao: 'k', ie: 'x', iu: 'q',
    ua: 'w', uo: 'o', uai: 'y', uan: 'r', uang: 'l',
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
