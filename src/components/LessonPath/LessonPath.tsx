import { useMemo } from 'react'
import type { Lesson, LessonProgress } from '../../types'
import styles from './LessonPath.module.css'

interface LessonPathProps {
  lessons: Lesson[]
  progress: Record<string, LessonProgress>
  onSelectLesson: (lessonId: string) => void
}

export function LessonPath({ lessons, progress, onSelectLesson }: LessonPathProps) {
  const completedIds = useMemo(
    () => new Set(
      Object.values(progress)
        .filter(p => p.completed)
        .map(p => p.lessonId),
    ),
    [progress],
  )

  const isUnlocked = (lesson: Lesson): boolean =>
    lesson.prerequisites.every(p => completedIds.has(p))

  return (
    <div className={styles.container}>
      {lessons.map((lesson, i) => {
        const completed = completedIds.has(lesson.id)
        const unlocked = isUnlocked(lesson)

        return (
          <div key={lesson.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {i > 0 && (
              <div
                className={`${styles.connector} ${completed ? styles.connectorCompleted : ''}`}
              />
            )}
            <button
              className={`${styles.lessonCard} ${completed ? styles.completed : ''} ${unlocked && !completed ? styles.unlocked : ''}`}
              disabled={!unlocked}
              onClick={() => onSelectLesson(lesson.id)}
            >
              <div className={`${styles.icon} ${completed ? styles.iconCompleted : ''}`}>
                {completed ? '✓' : String(i + 1)}
              </div>
              <div className={styles.lessonInfo}>
                <div className={styles.title}>{lesson.title}</div>
                <div className={styles.description}>{lesson.description}</div>
              </div>
              <span className={styles.chevron}>{'>'}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
