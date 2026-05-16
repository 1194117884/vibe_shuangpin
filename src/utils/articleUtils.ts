import { pinyin } from 'pinyin-pro'
import { getShuangpinKeys } from './shuangpin'
import type { Exercise, ShuangpinScheme } from '../types'

export interface ArticleInfo {
  title: string
  text: string
}

function isChinese(char: string): boolean {
  const code = char.charCodeAt(0)
  return code >= 0x4e00 && code <= 0x9fff
}

/** Fetch a random Chinese article summary from Wikipedia */
export async function fetchRandomArticle(): Promise<ArticleInfo> {
  const res = await fetch(
    'https://zh.wikipedia.org/api/rest_v1/page/random/summary',
  )
  if (!res.ok) throw new Error('获取文章失败')
  const data = await res.json()
  return { title: data.title, text: data.extract }
}

/** Convert Chinese text to Shuangpin exercises, character by character */
export function textToExercises(
  text: string,
  scheme: ShuangpinScheme,
  maxChars = 100,
): Exercise[] {
  const pinyinArray = pinyin(text, {
    toneType: 'none',
    type: 'array',
    v: true,
  })

  const exercises: Exercise[] = []

  for (let i = 0; i < text.length && exercises.length < maxChars; i++) {
    const char = text[i]!
    if (!isChinese(char)) continue

    const py = pinyinArray[i]
    if (!py || py === char) continue

    try {
      const answer = getShuangpinKeys(py, scheme)
      exercises.push({ prompt: py, answer, type: 'syllable', char })
    } catch {
      // Skip characters that can't be converted
    }
  }

  return exercises
}

/** Get positions of Chinese characters in a text string */
export function getChinesePositions(text: string): number[] {
  const positions: number[] = []
  for (let i = 0; i < text.length; i++) {
    if (isChinese(text[i]!)) positions.push(i)
  }
  return positions
}
