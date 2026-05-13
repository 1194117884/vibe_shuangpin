import { describe, it, expect } from 'vitest'
import { lessons } from './lessons'

describe('lessons', () => {
  it('has at least 8 lessons', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(8)
  })

  it('each lesson has required fields', () => {
    for (const lesson of lessons) {
      expect(lesson.id).toBeTruthy()
      expect(lesson.title).toBeTruthy()
      expect(lesson.schemeId).toBe('xiaohe')
      expect(lesson.exercises.length).toBeGreaterThan(0)
    }
  })

  it('lesson ids are unique', () => {
    const ids = lessons.map(l => l.id)
    const unique = new Set(ids)
    expect(ids.length).toBe(unique.size)
  })

  it('prerequisites reference valid lesson ids', () => {
    const ids = new Set(lessons.map(l => l.id))
    for (const lesson of lessons) {
      for (const prereq of lesson.prerequisites) {
        expect(ids.has(prereq)).toBe(true)
      }
    }
  })

  it('each exercise has prompt and answer', () => {
    for (const lesson of lessons) {
      for (const ex of lesson.exercises) {
        expect(ex.prompt).toBeTruthy()
        expect(ex.answer).toBeTruthy()
      }
    }
  })
})
