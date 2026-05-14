import { describe, it, expect } from 'vitest'
import { phraseCategories } from './phrases'

describe('phraseCategories', () => {
  it('has at least 3 categories', () => {
    expect(phraseCategories.length).toBeGreaterThanOrEqual(3)
  })

  it('each category has required fields', () => {
    for (const cat of phraseCategories) {
      expect(cat.id).toBeTruthy()
      expect(cat.title).toBeTruthy()
      expect(cat.exercises.length).toBeGreaterThan(0)
    }
  })

  it('each exercise has prompt, answer, and char', () => {
    for (const cat of phraseCategories) {
      for (const ex of cat.exercises) {
        expect(ex.prompt).toBeTruthy()
        expect(ex.answer).toBeTruthy()
        expect(ex.char).toBeTruthy()
        expect(['word', 'phrase']).toContain(ex.type)
      }
    }
  })
})
