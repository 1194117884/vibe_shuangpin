import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTyping } from './useTyping'
import type { Exercise } from '../types'

const mockExercises: Exercise[] = [
  { prompt: 'zhong', answer: 'vs', type: 'syllable' },
  { prompt: 'guo', answer: 'go', type: 'syllable' },
  { prompt: 'ren', answer: 'rf', type: 'syllable' },
]

describe('useTyping', () => {
  it('initializes with first exercise', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    expect(result.current.currentExercise?.prompt).toBe('zhong')
    expect(result.current.currentIndex).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('tracks input for current exercise', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.setInput('v'))
    expect(result.current.input).toBe('v')
  })

  it('submits correct answer and moves forward', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => {
      result.current.submitAnswer('vs')
    })
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.results.length).toBe(1)
    expect(result.current.results[0]?.correct).toBe(true)
    expect(result.current.lastResult?.correct).toBe(true)
  })

  it('submits incorrect answer and moves forward', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => {
      result.current.submitAnswer('xx')
    })
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.results[0]?.correct).toBe(false)
    expect(result.current.lastResult?.correct).toBe(false)
  })

  it('reports isComplete when all exercises done', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('go'))
    act(() => result.current.submitAnswer('rf'))
    expect(result.current.isComplete).toBe(true)
  })

  it('calculates accuracy', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    expect(result.current.accuracy).toBe(0)
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('xx'))
    act(() => result.current.submitAnswer('rf'))
    expect(result.current.accuracy).toBe(2 / 3)
  })

  it('resets correctly', () => {
    const { result } = renderHook(() => useTyping(mockExercises))
    act(() => result.current.submitAnswer('vs'))
    act(() => result.current.submitAnswer('go'))
    act(() => { result.current.reset() })
    expect(result.current.currentIndex).toBe(0)
    expect(result.current.results).toEqual([])
    expect(result.current.input).toBe('')
  })
})
