import { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react'
import { useSound } from '../../../hooks/useSound'
import { fetchRandomArticle, textToExercises, getChinesePositions } from '../../../utils/articleUtils'
import type { ShuangpinScheme, Exercise, ExerciseResult } from '../../../types'
import styles from './ArticleTyping.module.css'

interface ArticleTypingProps {
  scheme: ShuangpinScheme
  onBack: () => void
}

export function ArticleTyping({ scheme, onBack }: ArticleTypingProps) {
  const { playCorrect, playIncorrect } = useSound()

  // Article state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articleTitle, setArticleTitle] = useState('')
  const [articleText, setArticleText] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [charPositions, setCharPositions] = useState<number[]>([])

  // Exercise state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [complete, setComplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentExercise = exercises[currentIndex]
  const totalProgress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0
  const currentCharPos = charPositions[currentIndex] ?? -1

  // Fetch article on mount
  const loadArticle = useCallback(async () => {
    setLoading(true)
    setError(null)
    setCurrentIndex(0)
    setInput('')
    setResults([])
    setFeedback(null)
    setComplete(false)

    try {
      const article = await fetchRandomArticle()
      const exs = textToExercises(article.text, scheme)
      if (exs.length === 0) throw new Error('未能从文章中提取到有效汉字')

      setExercises(exs)
      setArticleTitle(article.title)
      setArticleText(article.text)
      setCharPositions(getChinesePositions(article.text))
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取文章失败')
    } finally {
      setLoading(false)
    }
  }, [scheme])

  useEffect(() => {
    loadArticle()
  }, [loadArticle])

  // Focus input on mount and after feedback
  useEffect(() => {
    if (!loading && !complete) {
      inputRef.current?.focus()
    }
  }, [loading, complete, currentIndex, feedback])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (feedback === 'incorrect') return

      const raw = e.target.value.toLowerCase().replace(/[^a-z;]/g, '')
      const val = raw.slice(0, 2)

      if (val.length === 2 && currentExercise) {
        if (val === currentExercise.answer) {
          setInput(val)
          setFeedback('correct')
          playCorrect()
          setTimeout(() => {
            const newResult: ExerciseResult = {
              exercise: currentExercise,
              input: val,
              correct: true,
              timeMs: 0,
            }
            setResults(prev => [...prev, newResult])
            const nextIndex = currentIndex + 1
            if (nextIndex >= exercises.length) {
              setComplete(true)
            } else {
              setCurrentIndex(nextIndex)
              setInput('')
            }
            setFeedback(null)
          }, 200)
        } else {
          setInput(val)
          setFeedback('incorrect')
          playIncorrect()
          setTimeout(() => {
            setFeedback(null)
            setInput('')
          }, 500)
        }
      } else {
        setInput(val)
      }
    },
    [feedback, currentExercise, currentIndex, exercises.length, playCorrect, playIncorrect],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.length > 0 && currentExercise) {
        if (input === currentExercise.answer) {
          setFeedback('correct')
          playCorrect()
          setTimeout(() => {
            const newResult: ExerciseResult = {
              exercise: currentExercise,
              input,
              correct: true,
              timeMs: 0,
            }
            setResults(prev => [...prev, newResult])
            const nextIndex = currentIndex + 1
            if (nextIndex >= exercises.length) {
              setComplete(true)
            } else {
              setCurrentIndex(nextIndex)
              setInput('')
            }
            setFeedback(null)
          }, 200)
        } else {
          setFeedback('incorrect')
          playIncorrect()
          setTimeout(() => {
            setFeedback(null)
            setInput('')
          }, 500)
        }
      }
    },
    [input, currentExercise, currentIndex, exercises.length, playCorrect, playIncorrect],
  )

  // Render article text with highlighted current character
  const renderedText = (() => {
    if (currentCharPos < 0) return <>{articleText}</>
    return (
      <>
        <span className={styles.dimText}>{articleText.slice(0, currentCharPos)}</span>
        <span className={feedback === 'incorrect' ? styles.charHighlightError : styles.charHighlight}>
          {articleText[currentCharPos]}
        </span>
        <span>{articleText.slice(currentCharPos + 1)}</span>
      </>
    )
  })()

  const correctCount = results.filter(r => r.correct).length
  const accuracy = results.length > 0 ? correctCount / results.length : 0

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.closeBtn} onClick={onBack} aria-label="关闭">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className={styles.progressArea}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: '0%' }} />
            </div>
          </div>
        </header>
        <div className={styles.centerContent}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16 }}>globe</span>
          <p className={styles.loadingText}>正在获取文章...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.closeBtn} onClick={onBack} aria-label="关闭">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <div className={styles.centerContent}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16, color: 'var(--color-error)' }}>error</span>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={loadArticle}>重试</button>
          <button className={styles.backBtn} onClick={onBack}>返回</button>
        </div>
      </div>
    )
  }

  // Completion state
  if (complete) {
    return (
      <div className={styles.container}>
        <div className={styles.centerContent}>
          <div className={styles.completionCard}>
            <div className={styles.completionTitle}>文章练习完成！</div>
            <div className={styles.completionStats}>
              {correctCount}/{exercises.length} 正确 · {Math.round(accuracy * 100)}% 准确率
            </div>
            <div className={styles.completionActions}>
              <button className={styles.nextBtn} onClick={loadArticle}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>refresh</span>
                下一篇文章
              </button>
              <button className={styles.doneBtn} onClick={onBack}>返回首页</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
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
      </header>

      {/* Article title */}
      <div className={styles.titleBar}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, marginRight: 6 }}>article</span>
        {articleTitle}
      </div>

      {/* Article text display */}
      <div className={styles.textArea}>
        <div className={styles.articleText}>
          {renderedText}
        </div>
      </div>

      {/* Input area */}
      <div className={styles.inputArea}>
        <div className={styles.pinyinDisplay}>
          {currentExercise?.char && (
            <>
              <span className={styles.currentChar}>{currentExercise.char}</span>
              <span className={styles.pinyinHint}>{currentExercise.prompt}</span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          className={`${styles.input} ${feedback === 'incorrect' ? styles.inputError : ''} ${feedback === 'correct' ? styles.inputCorrect : ''}`}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
          spellCheck={false}
          placeholder={currentExercise ? '输入双拼编码...' : ''}
          aria-label="输入双拼编码"
        />
        <div className={styles.progressText}>
          第 {currentIndex + 1}/{exercises.length} 字
        </div>
      </div>

      {/* Feedback overlay */}
      {feedback === 'correct' && (
        <div className={styles.feedbackCorrect}>✓</div>
      )}
      {feedback === 'incorrect' && (
        <div className={styles.feedbackIncorrect}>
          ✗ {currentExercise?.answer}
        </div>
      )}
    </div>
  )
}
