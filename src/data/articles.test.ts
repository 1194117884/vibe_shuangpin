import { describe, it, expect } from 'vitest'
import { articles } from './articles'

describe('articles', () => {
  it('has at least 3 articles', () => {
    expect(articles.length).toBeGreaterThanOrEqual(3)
  })

  it('each article has sentences with exercises', () => {
    for (const article of articles) {
      expect(article.id).toBeTruthy()
      expect(article.title).toBeTruthy()
      expect(article.sentences.length).toBeGreaterThan(0)
      for (const sentence of article.sentences) {
        expect(sentence.exercises.length).toBeGreaterThan(0)
        for (const ex of sentence.exercises) {
          expect(ex.prompt).toBeTruthy()
          expect(ex.answer).toBeTruthy()
          expect(ex.char).toBeTruthy()
        }
      }
    }
  })
})
