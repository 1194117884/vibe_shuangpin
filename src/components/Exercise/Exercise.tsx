import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useTyping } from '../../hooks/useTyping'
import { Keyboard } from '../Keyboard/Keyboard'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../types'
import styles from './Exercise.module.css'

interface ExerciseProps {
  exercises: ExerciseType[]
  scheme: ShuangpinScheme
  onComplete: (results: { correct: number; total: number; accuracy: number }) => void
  onBack: () => void
}

export function Exercise({ exercises, scheme, onComplete }: ExerciseProps) {
  const {
    currentExercise,
    currentIndex,
    input,
    setInput,
    submitAnswer,
    isComplete,
    accuracy,
    results,
  } = useTyping(exercises)

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const lastAnswerRef = useRef<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    const trimmed = input.trim().toLowerCase()
    const currentAnswer = currentExercise?.answer ?? ''
    lastAnswerRef.current = currentAnswer
    const isCorrect = trimmed === currentAnswer
    submitAnswer(trimmed)
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setTimeout(() => setFeedback(null), 800)
  }, [input, currentExercise, submitAnswer])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSubmit()
    },
    [handleSubmit],
  )

  const handleContinue = useCallback(() => {
    onComplete({
      correct: results.filter(r => r.correct).length,
      total: results.length,
      accuracy,
    })
  }, [results, accuracy, onComplete])

  const handleKeyPress = useCallback(
    (key: string) => {
      setInput(input + key)
    },
    [input, setInput],
  )

  const highlightKeys = useMemo(() => {
    if (!currentExercise) return []
    return currentExercise.answer.split('')
  }, [currentExercise])

  const schemeLabels = useMemo(() => {
    const labels: Record<string, string> = {}
    for (const [pinyin, key] of Object.entries(scheme.initials)) {
      labels[key] = labels[key]
        ? `${labels[key]} ${pinyin}`
        : pinyin
    }
    for (const [pinyin, key] of Object.entries(scheme.finals)) {
      if (pinyin.length > 1 && key.length === 1) {
        labels[key] = labels[key]
          ? `${labels[key]} ${pinyin}`
          : pinyin
      }
    }
    return labels
  }, [scheme])

  if (isComplete) {
    const correctCount = results.filter(r => r.correct).length
    return (
      <div className={styles.exerciseContainer}>
        <div className={styles.completionCard}>
          <div className={styles.completionTitle}>太棒了!</div>
          <div className={styles.completionStats}>
            {correctCount}/{results.length} 正确
            {' · '}
            {Math.round(accuracy * 100)}% 准确率
          </div>
          <button className={styles.continueButton} onClick={handleContinue}>
            继续
          </button>
        </div>
      </div>
    )
  }

  if (!currentExercise) return null

  return (
    <div className={styles.exerciseContainer}>
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentIndex / exercises.length) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      <div className={styles.promptCard}>
        <div className={styles.prompt}>{currentExercise.prompt}</div>

        <div className={styles.inputSection}>
          <input
            ref={inputRef}
            className={`${styles.input} ${
              feedback === 'correct' ? styles.inputCorrect : ''
            } ${feedback === 'incorrect' ? styles.inputIncorrect : ''}`}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入双拼..."
            autoComplete="off"
            aria-label="输入双拼"
          />
          {feedback && (
            <div
              className={`${styles.feedback} ${
                feedback === 'correct'
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect
              }`}
            >
              {feedback === 'correct'
                ? '正确!'
                : `正确: ${lastAnswerRef.current}`}
            </div>
          )}
          <span className={styles.hint}>按 Enter 提交</span>
        </div>
      </div>

      <Keyboard
        highlightKeys={highlightKeys}
        schemeLabels={schemeLabels}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
