import { useState, useCallback, useMemo, useEffect, useRef, type ChangeEvent } from 'react'
import { useTyping } from '../../hooks/useTyping'
import { useSound } from '../../hooks/useSound'
import { Keyboard } from '../Keyboard/Keyboard'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../types'
import styles from './Exercise.module.css'

interface ExerciseProps {
  exercises: ExerciseType[]
  scheme: ShuangpinScheme
  onComplete: (results: { correct: number; total: number; accuracy: number }) => void
  onBack: () => void
  /** Max input length. Default 2. Use 0 for unlimited (phrase/article mode). */
  maxLength?: number
  /** Regex to filter out disallowed chars. Default /[^a-z;]/g. For phrases use /[^a-z; ]/g to allow spaces. */
  inputFilter?: RegExp
}

export function Exercise({ exercises, scheme, onComplete, onBack, maxLength, inputFilter }: ExerciseProps) {
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

  const { playCorrect, playIncorrect } = useSound()
  const [showPinyin, setShowPinyin] = useState(true)
  const [showHints, setShowHints] = useState(true)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex, feedback])

  const expectedKeys = useMemo(
    () => currentExercise?.answer.split('') ?? [],
    [currentExercise],
  )

  const highlightKeys = useMemo(() => {
    if (feedback === 'incorrect') return []
    if (!showHints) return []
    if (input.length === 0) return []
    if (input.length === 1 && expectedKeys[1]) return [expectedKeys[1]]
    return []
  }, [input, expectedKeys, feedback, showHints])

  const schemeLabels = useMemo(() => {
    const labels: Record<string, { initials: string[]; finals: string[] }> = {}
    for (const [pinyin, key] of Object.entries(scheme.initials)) {
      if (!labels[key]) labels[key] = { initials: [], finals: [] }
      labels[key]!.initials.push(pinyin)
    }
    for (const [pinyin, key] of Object.entries(scheme.finals)) {
      if (pinyin.length > 1 && key.length === 1) {
        if (!labels[key]) labels[key] = { initials: [], finals: [] }
        labels[key]!.finals.push(pinyin)
      }
    }
    return labels
  }, [scheme])

  const submitCorrect = useCallback(
    (val: string) => {
      submitAnswer(val)
      setTransitioning(true)
      setTimeout(() => setTransitioning(false), 500)
    },
    [submitAnswer],
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (feedback === 'incorrect') return
      const filter = inputFilter ?? /[^a-z;]/g
      const raw = e.target.value.toLowerCase().replace(filter, '')
      const ml = maxLength ?? 2
      const val = ml > 0 ? raw.slice(0, ml) : raw
      let shouldSubmit = false
      let isCorrect = false

      if ((ml > 0 ? val.length === ml : false) && currentExercise) {
        if (val.replace(/ /g, '') === currentExercise.answer.replace(/ /g, '')) {
          isCorrect = true
          shouldSubmit = true
        } else {
          setInput(val)
          setFeedback('incorrect')
          playIncorrect()
          setTimeout(() => {
            setFeedback(null)
            setInput('')
            inputRef.current?.focus()
          }, 500)
          return
        }
      }

      setInput(val)
      if (shouldSubmit && isCorrect) {
        playCorrect()
        submitCorrect(val)
      }
    },
    [feedback, currentExercise, setInput, submitCorrect, playCorrect, playIncorrect, inputFilter, maxLength],
  )

  const handleKeyPress = useCallback(
    (key: string) => {
      if (feedback === 'incorrect') return
      if (!currentExercise) return
      const ml = maxLength ?? 2
      const newVal = input + key
      if (ml > 0 && newVal.length > ml) return

      if (ml > 0 && newVal.length === ml) {
        if (newVal.replace(/ /g, '') === currentExercise.answer.replace(/ /g, '')) {
          setInput(newVal)
          playCorrect()
          submitCorrect(newVal)
        } else {
          setInput(newVal)
          setFeedback('incorrect')
          playIncorrect()
          setTimeout(() => {
            setFeedback(null)
            setInput('')
            inputRef.current?.focus()
          }, 500)
        }
        return
      }

      setInput(newVal)
    },
    [feedback, input, currentExercise, setInput, submitCorrect, playCorrect, playIncorrect, maxLength],
  )

  const submitAnswer_ = useCallback(() => {
    if (!currentExercise || input.length === 0 || feedback === 'incorrect') return
    if (input.replace(/ /g, '') === currentExercise.answer.replace(/ /g, '')) {
      playCorrect()
      submitCorrect(input)
    } else {
      setFeedback('incorrect')
      playIncorrect()
      setTimeout(() => {
        setFeedback(null)
        setInput('')
        inputRef.current?.focus()
      }, 500)
    }
  }, [feedback, input, currentExercise, submitCorrect, playCorrect, playIncorrect])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      const ml = maxLength ?? 2
      if (ml > 0) return // auto-submit handles this
      submitAnswer_()
    },
    [maxLength, submitAnswer_],
  )

  const handleContinue = useCallback(() => {
    onComplete({
      correct: results.filter(r => r.correct).length,
      total: results.length,
      accuracy,
    })
  }, [results, accuracy, onComplete])

  if (isComplete) {
    const correctCount = results.filter(r => r.correct).length
    return (
      <div className={styles.container}>
        <div className={styles.completionCard}>
          <div className={styles.completionTitle}>练习完成!</div>
          <div className={styles.completionStats}>
            {correctCount}/{results.length} 正确 · {Math.round(accuracy * 100)}% 准确率
          </div>
          <button className={styles.continueButton} onClick={handleContinue}>
            返回
          </button>
        </div>
      </div>
    )
  }

  if (!currentExercise) return null

  const displayChar = currentExercise.char || currentExercise.prompt

  return (
    <div className={styles.container}>
      {/* Options bar */}
      <div className={styles.optionsBar}>
        <div className={styles.optionsLeft}>
          <button className={styles.backButton} onClick={onBack} aria-label="返回">
            ← 返回
          </button>
        </div>
        <div className={styles.optionsRight}>
          <label className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={showPinyin}
              onChange={() => setShowPinyin(p => !p)}
              className={styles.checkbox}
            />
            显示拼音
          </label>
          <label className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={showHints}
              onChange={() => setShowHints(h => !h)}
              className={styles.checkbox}
            />
            显示提示
          </label>
        </div>
      </div>

      {/* Practice card */}
      <div className={styles.practiceCard}>
        {/* Decorative circles */}
        <div className={styles.decoTL} />
        <div className={styles.decoBR} />

        {/* Ink-drop animation overlay */}
        {transitioning && <div className={styles.inkDrop} />}

        {/* Main content */}
        <div className={styles.practiceContent}>
          {showPinyin && <div className={styles.pinyin}>{currentExercise.prompt}</div>}
          <div className={styles.char}>{displayChar}</div>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              className={`${styles.input} ${feedback === 'incorrect' ? styles.inputError : ''}`}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              autoFocus
              spellCheck={false}
              maxLength={maxLength !== undefined && maxLength > 0 ? maxLength : undefined}
              aria-label="输入双拼编码"
            />
            {(maxLength ?? 2) === 0 && input.length > 0 && (
              <button className={styles.submitButton} onClick={submitAnswer_}>
                确认
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className={styles.keyboardWrapper}>
        <Keyboard
          highlightKeys={highlightKeys}
          schemeLabels={schemeLabels}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  )
}
