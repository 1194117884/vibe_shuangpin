import { useState, useCallback, useRef } from 'react'
import { Exercise } from '../../Exercise/Exercise'
import type { ShuangpinScheme } from '../../../types'
import type { Article } from '../../../data/articles'
import styles from './ArticlePractice.module.css'

interface ArticlePracticeProps {
  article: Article
  scheme: ShuangpinScheme
  onComplete: (results: { correct: number; total: number; accuracy: number }) => void
  onBack: () => void
}

export function ArticlePractice({ article, scheme, onComplete, onBack }: ArticlePracticeProps) {
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const exerciseResultsRef = useRef<{ correct: number; total: number }[]>([])

  const currentSentence = article.sentences[sentenceIndex]
  const isLastSentence = sentenceIndex >= article.sentences.length - 1

  const handleSentenceComplete = useCallback(
    (result: { correct: number; total: number; accuracy: number }) => {
      const newResult = { correct: result.correct, total: result.total }
      exerciseResultsRef.current = [...exerciseResultsRef.current, newResult]

      if (!isLastSentence) {
        setSentenceIndex(i => i + 1)
      } else {
        const results = exerciseResultsRef.current
        const allCorrect = results.filter(r => r.correct > 0).length
        const allTotal = results.length
        onComplete({
          correct: allCorrect,
          total: allTotal,
          accuracy: allTotal > 0 ? allCorrect / allTotal : 0,
        })
      }
    },
    [isLastSentence, onComplete],
  )

  if (!currentSentence) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.sentenceDisplay}>
        {currentSentence.text}
      </div>
      <Exercise
        key={sentenceIndex}
        exercises={currentSentence.exercises}
        scheme={scheme}
        onComplete={handleSentenceComplete}
        onBack={onBack}
        maxLength={0}
        inputFilter={/[^a-z; ]/g}
      />
    </div>
  )
}
