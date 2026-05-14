import type { ShuangpinScheme } from '../types'

export const xiaohe: ShuangpinScheme = {
  id: 'xiaohe',
  name: '小鹤',
  description: '小鹤双拼方案，是目前最流行的双拼方案之一。',
  initials: {
    zh: 'v',
    ch: 'i',
    sh: 'u',
  },
  finals: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'd', ei: 'w', ui: 'v',
    ao: 'c', ou: 'z',
    an: 'j', en: 'f', in: 'b', un: 'y', vn: 'y',
    ang: 'h', eng: 'g', ing: 'k', ong: 's',
    ia: 'x', iao: 'n', ie: 'p', iu: 'q',
    ua: 'x', uo: 'o', uai: 'k', uan: 'r', uang: 'l',
    iong: 's', iang: 'l', ian: 'm',
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
    ya: 'yx', yan: 'ym', yang: 'yl', yao: 'yn',
    ye: 'yp', yong: 'ys', you: 'yq',
    yu: 'vv', yuan: 'yr', yue: 'yt', yun: 'yy',
    wa: 'wx', wo: 'wo', wai: 'wk', wei: 'wv',
    wan: 'wr', wen: 'wy', wang: 'wl', weng: 'wg',
  },
}
