import type { ShuangpinScheme } from '../types'
import { schemes } from '../data/schemes'

const COMPOUND_INITIALS = ['zh', 'ch', 'sh'] as const
const SINGLE_INITIALS = 'bpmfdtnlgkhjqxrzcsyw'

/**
 * Parse a pinyin syllable into initial and final parts.
 * Returns null if the syllable has no initial (zero-initial).
 */
export function parsePinyin(syllable: string): { initial: string; final: string } | null {
  for (const init of COMPOUND_INITIALS) {
    if (syllable.startsWith(init)) {
      return { initial: init, final: syllable.slice(init.length) }
    }
  }
  const first = syllable[0]
  if (!first) return null
  if (SINGLE_INITIALS.includes(first)) {
    return { initial: first, final: syllable.slice(1) }
  }
  return null
}

/**
 * Get the Shuangpin keystrokes for a pinyin syllable (or space-separated words) under a given scheme.
 */
export function getShuangpinKeys(input: string, scheme: ShuangpinScheme): string {
  if (input.includes(' ')) {
    return input.split(' ').map(word => getShuangpinKeys(word, scheme)).join(' ')
  }

  // Check specials first (single-key syllables like a, o, e)
  if (scheme.specials[input]) {
    return scheme.specials[input]!
  }

  // Check zero-initial finals
  if (scheme.zeroInitialFinals[input]) {
    return scheme.zeroInitialFinals[input]!
  }

  const parsed = parsePinyin(input)
  if (!parsed) {
    throw new Error(`无法解析拼音: ${input}`)
  }

  const { initial, final } = parsed
  const initialKey = scheme.initials[initial] ?? initial
  const finalKey = scheme.finals[final]

  if (!finalKey) {
    throw new Error(`无法解析拼音: ${input} (未找到韵母映射: ${final})`)
  }

  return initialKey + finalKey
}

/**
 * Get all available Shuangpin schemes.
 */
export function getAvailableSchemes(): ShuangpinScheme[] {
  return schemes
}
