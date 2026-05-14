import type { Exercise } from '../types'

export interface Sentence {
  text: string
  exercises: Exercise[]
}

export interface Article {
  id: string
  title: string
  description: string
  sentences: Sentence[]
}

export const articles: Article[] = [
  {
    id: 'daily-dialog',
    title: '日常对话',
    description: '简单的日常对话练习',
    sentences: [
      {
        text: '你好吗？',
        exercises: [
          { prompt: 'ni hao ma', answer: 'ni hc ma', type: 'phrase', char: '你好吗' },
        ],
      },
      {
        text: '我很好，谢谢。',
        exercises: [
          { prompt: 'wo hen hao', answer: 'wo hf hc', type: 'phrase', char: '我很好' },
          { prompt: 'xie xie', answer: 'xp xp', type: 'phrase', char: '谢谢' },
        ],
      },
      {
        text: '你叫什么名字？',
        exercises: [
          { prompt: 'ni jiao shen me ming zi', answer: 'ni jn uf me mk zi', type: 'phrase', char: '你叫什么名字' },
        ],
      },
      {
        text: '我叫小明。',
        exercises: [
          { prompt: 'wo jiao xiao ming', answer: 'wo jn xn mk', type: 'phrase', char: '我叫小明' },
        ],
      },
    ],
  },
  {
    id: 'introduce-self',
    title: '自我介绍',
    description: '学习如何用中文介绍自己',
    sentences: [
      {
        text: '我是中国人。',
        exercises: [
          { prompt: 'wo shi zhong guo ren', answer: 'wo ui vs go rf', type: 'phrase', char: '我是中国人' },
        ],
      },
      {
        text: '我住在北京。',
        exercises: [
          { prompt: 'wo zhu zai bei jing', answer: 'wo vu zd bw jk', type: 'phrase', char: '我住在北京' },
        ],
      },
      {
        text: '我喜欢学习语言。',
        exercises: [
          { prompt: 'wo xi huan xue xi yu yan', answer: 'wo xi hr xt xi vv ym', type: 'phrase', char: '我喜欢学习语言' },
        ],
      },
    ],
  },
  {
    id: 'weather',
    title: '天气',
    description: '谈论天气的常用表达',
    sentences: [
      {
        text: '今天天气真好！',
        exercises: [
          { prompt: 'jin tian tian qi zhen hao', answer: 'jb tm tm qi vf hc', type: 'phrase', char: '今天天气真好' },
        ],
      },
      {
        text: '明天可能会下雨。',
        exercises: [
          { prompt: 'ming tian ke neng hui xia yu', answer: 'mk tm ke ng hv xx vv', type: 'phrase', char: '明天可能会下雨' },
        ],
      },
      {
        text: '记得带伞。',
        exercises: [
          { prompt: 'ji de dai san', answer: 'ji de dd sj', type: 'phrase', char: '记得带伞' },
        ],
      },
    ],
  },
]
