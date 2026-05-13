import type { ShuangpinScheme } from '../types'

export const ziranma: ShuangpinScheme = {
  id: 'ziranma',
  name: '自然码',
  description: '自然码双拼方案',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'l', ei: 'z', ui: 'v',
    ao: 'c', ou: 'b',
    an: 'j', en: 'f', in: 'n', un: 'p', vn: 'y',
    ang: 'h', eng: 'g', ing: 'y', ong: 's',
    ia: 'x', iao: 'c', ie: 'x', iu: 'q',
    ua: 'x', uo: 'o', uai: 'y', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'j',
    ue: 't', ve: 't',
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
