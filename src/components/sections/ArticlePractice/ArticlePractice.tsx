import { useState, useCallback } from 'react'
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
  const [exerciseResults, setExerciseResults] = useState<{ correct: number; total: number }[]>([])

  const currentSentence = article.sentences[sentenceIndex]
  const isLastSentence = sentenceIndex >= article.sentences.length - 1

  const totalCorrect = exerciseResults.reduce((sum, r) => sum + (r.correct > 0 ? 1 : 0), 0)
  const totalExercises = exerciseResults.length

  const handleSentenceComplete = useCallback(
    (result: { correct: number; total: number; accuracy: number }) => {
      setExerciseResults(prev => [...prev, { correct: result.correct, total: result.total }])

      if (!isLastSentence) {
        setSentenceIndex(i => i + 1)
      } else {
        // All sentences done
        const allCorrect = totalCorrect + (result.correct > 0 ? 1 : 0)
        const allTotal = totalExercises + 1
        onComplete({
          correct: allCorrect,
          total: allTotal,
          accuracy: allTotal > 0 ? allCorrect / allTotal : 0,
        })
      }
    },
    [isLastSentence, onComplete, totalCorrect, totalExercises],
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
