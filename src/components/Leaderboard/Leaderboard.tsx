import { useMemo } from 'react'
import type { UserStats, Lesson } from '../../types'
import styles from './Leaderboard.module.css'

interface LeaderboardProps {
  stats: UserStats
  lessons: Lesson[]
}

export function Leaderboard({ stats, lessons }: LeaderboardProps) {
  const completedLessons = useMemo(
    () => lessons
      .map(l => ({ lesson: l, progress: stats.lessonProgress[l.id] }))
      .filter(x => x.progress?.completed),
    [lessons, stats.lessonProgress],
  )

  const sortedLessons = useMemo(
    () => [...completedLessons].sort((a, b) => (b.progress?.bestAccuracy ?? 0) - (a.progress?.bestAccuracy ?? 0)),
    [completedLessons],
  )

  return (
    <div className={styles.container}>
      {/* Summary */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{completedLessons.length}/{lessons.length}</div>
          <div className={styles.summaryLabel}>已完成课程</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{stats.streaks}</div>
          <div className={styles.summaryLabel}>最长连续</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{stats.totalExercisesCompleted}</div>
          <div className={styles.summaryLabel}>总练习数</div>
        </div>
      </div>

      {/* Per-lesson accuracy table */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>课程表现</h3>
        {sortedLessons.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={`material-symbols-outlined ${styles.emptyIcon}`}>leaderboard</span>
            <p className={styles.emptyText}>还没有完成任何课程，开始练习吧！</p>
          </div>
        ) : (
          <div className={styles.lessonList}>
            {sortedLessons.map(({ lesson, progress }) => (
              <div key={lesson.id} className={styles.lessonRow}>
                <div className={styles.lessonInfo}>
                  <div className={styles.lessonTitle}>{lesson.title}</div>
                  <div className={styles.lessonMeta}>
                    尝试 {progress?.attempts ?? 0} 次
                    {progress?.lastPracticed && ` · ${progress.lastPracticed}`}
                  </div>
                </div>
                <div className={styles.accuracyBadge}>
                  {Math.round((progress?.bestAccuracy ?? 0) * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
