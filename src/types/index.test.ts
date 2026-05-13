import { describe, it, expect } from 'vitest'
import type { ShuangpinScheme, Exercise, Lesson, ExerciseResult } from './index'

describe('types', () => {
  it('ShuangpinScheme has required fields', () => {
    const scheme: ShuangpinScheme = {
      id: 'test',
      name: 'Test',
      description: 'A test scheme',
      initials: { zh: 'v' },
      finals: { an: 'j' },
      specials: { a: 'aa' },
      zeroInitialFinals: { a: 'aa' },
    }
    expect(scheme.id).toBe('test')
    expect(Object.keys(scheme.initials).length).toBe(1)
  })

  it('Exercise type is correct', () => {
    const exercise: Exercise = {
      prompt: 'zhong',
      answer: 'vs',
      type: 'syllable',
    }
    expect(exercise.type).toBe('syllable')
  })

  it('Lesson has required structure', () => {
    const lesson: Lesson = {
      id: 'lesson-1',
      title: '声母练习',
      description: '练习声母',
      schemeId: 'xiaohe',
      exercises: [],
      prerequisites: [],
    }
    expect(lesson.prerequisites).toEqual([])
  })

  it('ExerciseResult tracks typing outcome', () => {
    const result: ExerciseResult = {
      exercise: { prompt: 'zhong', answer: 'vs', type: 'syllable' },
      input: 'vs',
      correct: true,
      timeMs: 1500,
    }
    expect(result.correct).toBe(true)
    expect(result.timeMs).toBe(1500)
  })
})
