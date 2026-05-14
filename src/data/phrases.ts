import type { Exercise } from '../types'

export interface PhraseCategory {
  id: string
  title: string
  description: string
  exercises: Exercise[]
}

export const phraseCategories: PhraseCategory[] = [
  {
    id: 'daily-verbs',
    title: '日常动词',
    description: '常用动词词组练习',
    exercises: [
      { prompt: 'zou lu', answer: 'zz lu', type: 'word', char: '走路' },
      { prompt: 'chi fan', answer: 'ii fj', type: 'word', char: '吃饭' },
      { prompt: 'he shui', answer: 'he uv', type: 'word', char: '喝水' },
      { prompt: 'shuo hua', answer: 'uo hx', type: 'word', char: '说话' },
      { prompt: 'kan shu', answer: 'kj uu', type: 'word', char: '看书' },
      { prompt: 'xie zi', answer: 'xp zi', type: 'word', char: '写字' },
      { prompt: 'zuo shi', answer: 'zo ui', type: 'word', char: '做事' },
      { prompt: 'mai dong xi', answer: 'md ds xi', type: 'phrase', char: '买东西' },
    ],
  },
  {
    id: 'daily-nouns',
    title: '日常名词',
    description: '常用名词词组练习',
    exercises: [
      { prompt: 'shui guo', answer: 'uv go', type: 'word', char: '水果' },
      { prompt: 'dian hua', answer: 'dm hx', type: 'word', char: '电话' },
      { prompt: 'gong zuo', answer: 'gs zo', type: 'word', char: '工作' },
      { prompt: 'sheng huo', answer: 'ig ho', type: 'word', char: '生活' },
      { prompt: 'jia ting', answer: 'jx tk', type: 'word', char: '家庭' },
      { prompt: 'shi jian', answer: 'ui jm', type: 'word', char: '时间' },
      { prompt: 'di fang', answer: 'di fh', type: 'word', char: '地方' },
      { prompt: 'peng you', answer: 'pg yq', type: 'word', char: '朋友' },
    ],
  },
  {
    id: 'travel',
    title: '出行旅游',
    description: '旅行相关词组练习',
    exercises: [
      { prompt: 'chu men', answer: 'iu mf', type: 'word', char: '出门' },
      { prompt: 'zuo che', answer: 'zo ie', type: 'word', char: '坐车' },
      { prompt: 'fei ji', answer: 'fw ji', type: 'word', char: '飞机' },
      { prompt: 'huo che', answer: 'ho ie', type: 'word', char: '火车' },
      { prompt: 'gong jiao', answer: 'gs jn', type: 'word', char: '公交' },
      { prompt: 'di tie', answer: 'di tp', type: 'word', char: '地铁' },
      { prompt: 'jiu dian', answer: 'jq dm', type: 'word', char: '酒店' },
      { prompt: 'lv you', answer: 'lv yq', type: 'word', char: '旅游' },
    ],
  },
]
