import { useState, useCallback } from 'react'
import type { UserStats, LessonProgress } from '../types'

const STORAGE_KEY = 'vibe-shuangpin-progress'

function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserStats
  } catch {
    // Corrupted data, reset to defaults
  }
  return {
    streaks: 0,
    lastPracticeDate: null,
    totalExercisesCompleted: 0,
    lessonProgress: {},
  }
}

function saveStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function useProgress() {
  const [stats, setStats] = useState<UserStats>(loadStats)

  const completeLesson = useCallback(
    (lessonId: string, accuracy: number, wpm: number) => {
      setStats(prev => {
        const existing = prev.lessonProgress[lessonId]
        const updated: LessonProgress = {
          lessonId,
          completed: true,
          bestAccuracy: existing
            ? Math.max(existing.bestAccuracy, accuracy)
            : accuracy,
          bestWpm: existing
            ? Math.max(existing.bestWpm, wpm)
            : wpm,
          attempts: (existing?.attempts ?? 0) + 1,
          lastPracticed: new Date().toISOString().split('T')[0] ?? null,
        }

        const today = new Date().toISOString().split('T')[0] ?? ''

        const next: UserStats = {
          ...prev,
          totalExercisesCompleted: prev.totalExercisesCompleted + 1,
          lastPracticeDate: today,
          streaks: prev.lastPracticeDate === today
            ? prev.streaks
            : 1,
          lessonProgress: {
            ...prev.lessonProgress,
            [lessonId]: updated,
          },
        }

        saveStats(next)
        return next
      })
    },
    [],
  )

  const resetProgress = useCallback(() => {
    const empty: UserStats = {
      streaks: 0,
      lastPracticeDate: null,
      totalExercisesCompleted: 0,
      lessonProgress: {},
    }
    saveStats(empty)
    setStats(empty)
  }, [])

  return { stats, completeLesson, resetProgress } as const
}
