import { useState, useCallback, useMemo } from 'react'
import { TopBar } from '../TopBar/TopBar'
import { LessonPath } from '../LessonPath/LessonPath'
import { Exercise } from '../Exercise/Exercise'
import { useProgress } from '../../hooks/useProgress'
import { lessons } from '../../data/lessons'
import { schemes, getSchemeById } from '../../data/schemes'
import styles from './App.module.css'

type Screen =
  | { type: 'home' }
  | { type: 'lesson'; lessonId: string }

export function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' })
  const [schemeId, setSchemeId] = useState('xiaohe')
  const { stats, completeLesson } = useProgress()

  const currentScheme = useMemo(
    () => getSchemeById(schemeId) ?? schemes[0]!,
    [schemeId],
  )

  const currentLesson = useMemo(
    () => lessons.find(l => l.id === (screen.type === 'lesson' ? screen.lessonId : undefined)),
    [screen],
  )

  const handleSelectLesson = useCallback((lessonId: string) => {
    setScreen({ type: 'lesson', lessonId })
  }, [])

  const handleComplete = useCallback(
    (result: { correct: number; total: number; accuracy: number }) => {
      if (screen.type === 'lesson') {
        completeLesson(screen.lessonId, result.accuracy, 0)
      }
      setScreen({ type: 'home' })
    },
    [screen, completeLesson],
  )

  const handleBack = useCallback(() => {
    setScreen({ type: 'home' })
  }, [])

  const schemeNames = useMemo(
    () => schemes.map(s => ({ id: s.id, name: s.name })),
    [],
  )

  return (
    <div className={styles.app}>
      <TopBar
        streak={stats.streaks}
        schemeId={schemeId}
        availableSchemes={schemeNames}
        onSchemeChange={setSchemeId}
      />

      <main className={styles.main}>
        {screen.type === 'home' && (
          <LessonPath
            lessons={lessons}
            progress={stats.lessonProgress}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {screen.type === 'lesson' && currentLesson && (
          <Exercise
            exercises={currentLesson.exercises}
            scheme={currentScheme}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}
