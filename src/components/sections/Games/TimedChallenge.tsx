import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Exercise } from '../../Exercise/Exercise'
import { lessons } from '../../../data/lessons'
import type { ShuangpinScheme } from '../../../types'
import styles from './TimedChallenge.module.css'

interface TimedChallengeProps {
  scheme: ShuangpinScheme
  onComplete: (score: number) => void
  onBack: () => void
}

export function TimedChallenge({ scheme, onComplete, onBack }: TimedChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Gather all single-syllable exercises for the challenge
  const allExercises = useMemo(
    () => lessons.flatMap(l => l.exercises.filter(e => e.type === 'syllable')),
    [],
  )

  // Pick a random batch once on mount
  const [shuffled] = useState(() =>
    [...allExercises].sort(() => Math.random() - 0.5).slice(0, 10),
  )

  const handleStart = useCallback(() => {
    setStarted(true)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
  }, [])

  // Stop the timer when it reaches 0
  useEffect(() => {
    if (started && timeLeft <= 0 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [started, timeLeft])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!started) {
    return (
      <div className={styles.startScreen}>
        <h2 className={styles.startTitle}>限时挑战</h2>
        <p className={styles.startDesc}>60秒内尽可能回答更多练习</p>
        <button className={styles.startButton} onClick={handleStart}>
          开始
        </button>
        <button className={styles.backBtn} onClick={onBack}>
          返回
        </button>
      </div>
    )
  }

  if (timeLeft <= 0) {
    return (
      <div className={styles.resultScreen}>
        <h2 className={styles.resultTitle}>时间到!</h2>
        <p className={styles.resultScore}>得分: {score}</p>
        <button className={styles.startButton} onClick={() => onComplete(score)}>
          完成
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <span className={styles.timerValue}>{timeLeft}</span>
        <span className={styles.timerLabel}>秒</span>
      </div>
      <div className={styles.score}>得分: {score}</div>
      <Exercise
        exercises={shuffled}
        scheme={scheme}
        onComplete={(result) => {
          setScore(s => s + result.correct)
        }}
        onBack={onBack}
      />
    </div>
  )
}
