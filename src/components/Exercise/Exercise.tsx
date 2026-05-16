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
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex, feedback])

  const totalProgress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0

  const expectedKeys = useMemo(
    () => currentExercise?.answer.split('') ?? [],
    [currentExercise],
  )

  const highlightKeys = useMemo(() => {
    if (feedback === 'incorrect') return []
    if (input.length === 0) return []
    if (input.length === 1 && expectedKeys[1]) return [expectedKeys[1]]
    return []
  }, [input, expectedKeys, feedback])

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
      let isCorrectVal = false

      if ((ml > 0 ? val.length === ml : false) && currentExercise) {
        if (val.replace(/ /g, '') === currentExercise.answer.replace(/ /g, '')) {
          isCorrectVal = true
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
      if (shouldSubmit && isCorrectVal) {
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
  }, [feedback, input, currentExercise, submitCorrect, playCorrect, playIncorrect, setInput])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      const ml = maxLength ?? 2
      if (ml > 0) return
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

  const displayChar = currentExercise.char || ''
  const nextExercise = exercises[currentIndex + 1]
  const nextChar = nextExercise?.char || nextExercise?.prompt.split(' ')[0] || ''
  const inputLabel = input || (maxLength !== 0 ? '' : '')

  return (
    <div className={styles.container}>
      {/* Desktop header: close + progress + hearts */}
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={onBack} aria-label="关闭">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className={styles.progressArea}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${Math.round(totalProgress)}%` }}>
              <div className={styles.progressSparkle} />
            </div>
          </div>
        </div>
        <div className={styles.heartsDisplay}>
          <span className={`material-symbols-outlined ${styles.heartsIcon}`}>favorite</span>
          5
        </div>
      </header>

      {/* Practice Canvas */}
      <div className={styles.canvas}>
        {/* Type Target */}
        <div className={styles.typeTarget}>
          <div className={styles.typeLabel}>基础练习</div>
          <div className={styles.characters}>
            <div className={styles.charBlock} key={currentIndex}>
              <div className={styles.charMain}>{displayChar}</div>
              <div
                className={`${styles.pinyinBox} ${feedback === 'incorrect' ? styles.pinyinBoxError : ''}`}
              >
                {inputLabel || '?'}
              </div>
            </div>
            {nextExercise && (
              <div className={styles.charBlock}>
                <div className={styles.charDimmed}>{nextChar}</div>
                <div className={styles.pinyinBoxDimmed}>?</div>
              </div>
            )}
          </div>
        </div>

        {/* Keyboard */}
        <div className={styles.keyboardContainer}>
          <Keyboard
            highlightKeys={highlightKeys}
            schemeLabels={schemeLabels}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>

      {/* Hidden input for physical keyboard */}
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        autoComplete="off"
        autoFocus
        spellCheck={false}
        aria-label="输入双拼编码"
      />

      {/* Mascot overlay */}
      {(feedback === 'correct' || feedback === 'incorrect') && (
        <div className={styles.mascotOverlay}>
          <div className={styles.speechBubble}>
            <p className={feedback === 'correct' ? styles.speechText : styles.speechTextIncorrect}>
              {feedback === 'correct' ? '太棒了！' : '再试一次！'}
            </p>
          </div>
          <img
            className={styles.mascotImage}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEAerZEGWIbanF6E4zNyy_bY_FaiVMuOmNb_Iu-bKfo88CC5IUrgbBLjzbTHOSBe1J95bIYW9ktuPrCby65kV3kBhMFKF7hHaR1JwRnrZy_s8Ot2BWhD4HrB2zdz_Yva1qtupPbGZEBPoG1_vK4BciMcJXKRb8DeiRd7j2uU_SGzh0hVORMOjRwX__fE1oPEWnvgQiGe8S6RqO0mRgSTl2RnNs21ontXfjYq-bp7EOOT6NZekh00BAG2zXc1AdaFmIN28wBylidXcA"
            alt="Mascot"
          />
        </div>
      )}
    </div>
  )
}
