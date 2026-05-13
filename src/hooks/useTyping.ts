import { useState, useCallback, useMemo } from 'react'
import type { Exercise, ExerciseResult } from '../types'

interface TypingState {
  currentIndex: number
  input: string
  results: ExerciseResult[]
  isComplete: boolean
}

export function useTyping(exercises: Exercise[]) {
  const [state, setState] = useState<TypingState>(() => ({
    currentIndex: 0,
    input: '',
    results: [],
    isComplete: exercises.length === 0,
  }))

  const currentExercise = useMemo(
    () => exercises[state.currentIndex] ?? null,
    [exercises, state.currentIndex],
  )

  const setInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, input }))
  }, [])

  const submitAnswer = useCallback((input: string) => {
    setState(prev => {
      const exercise = exercises[prev.currentIndex]
      if (!exercise) return prev

      const result: ExerciseResult = {
        exercise,
        input,
        correct: input === exercise.answer,
        timeMs: 0,
      }

      const nextIndex = prev.currentIndex + 1
      const isComplete = nextIndex >= exercises.length

      return {
        currentIndex: nextIndex,
        input: '',
        results: [...prev.results, result],
        isComplete,
      }
    })
  }, [exercises])

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      input: '',
      results: [],
      isComplete: exercises.length === 0,
    })
  }, [exercises.length])

  const accuracy = useMemo(() => {
    if (state.results.length === 0) return 0
    const correct = state.results.filter(r => r.correct).length
    return correct / state.results.length
  }, [state.results])

  const lastResult = useMemo(
    () => state.results[state.results.length - 1] ?? null,
    [state.results],
  )

  return {
    currentExercise,
    currentIndex: state.currentIndex,
    input: state.input,
    results: state.results,
    isComplete: state.isComplete,
    accuracy,
    lastResult,
    setInput,
    submitAnswer,
    reset,
  } as const
}
