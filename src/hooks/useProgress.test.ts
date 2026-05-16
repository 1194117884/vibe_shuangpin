import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with default stats', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.stats.totalExercisesCompleted).toBe(0)
    expect(result.current.stats.lastPracticeDate).toBeNull()
    expect(result.current.stats.lessonProgress).toEqual({})
  })

  it('saves lesson completion', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.completeLesson('lesson-1', 0.9, 10)
    })
    expect(result.current.stats.lessonProgress['lesson-1']?.completed).toBe(true)
    expect(result.current.stats.lessonProgress['lesson-1']?.bestAccuracy).toBe(0.9)
  })

  it('updates best accuracy on subsequent attempts', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLesson('lesson-1', 0.7, 10))
    act(() => result.current.completeLesson('lesson-1', 0.95, 8))
    expect(result.current.stats.lessonProgress['lesson-1']?.bestAccuracy).toBe(0.95)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLesson('lesson-1', 1, 10))

    const saved = JSON.parse(localStorage.getItem('vibe-shuangpin-progress')!)
    expect(saved.lessonProgress['lesson-1']?.completed).toBe(true)
  })

  it('loads existing progress from localStorage', () => {
    localStorage.setItem('vibe-shuangpin-progress', JSON.stringify({
      totalExercisesCompleted: 20,
      lastPracticeDate: '2024-01-15',
      streaks: 5,
      lessonProgress: {
        'lesson-1': { lessonId: 'lesson-1', completed: true, bestAccuracy: 1, bestWpm: 0, attempts: 2, lastPracticed: '2024-01-15' },
      },
    }))

    const { result } = renderHook(() => useProgress())
    expect(result.current.stats.totalExercisesCompleted).toBe(20)
    expect(result.current.stats.lessonProgress['lesson-1']?.attempts).toBe(2)
  })
})
