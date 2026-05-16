import { useCallback, useMemo } from 'react'
import type { UserStats, ShuangpinScheme } from '../../types'
import { lessons } from '../../data/lessons'
import styles from './Profile.module.css'

interface ProfileProps {
  stats: UserStats
  darkMode: boolean
  onToggleDark: () => void
  schemes: ShuangpinScheme[]
  currentSchemeId: string
  onSelectScheme: () => void
  onResetProgress: () => void
}

export function Profile({
  stats,
  darkMode,
  onToggleDark,
  schemes,
  currentSchemeId,
  onSelectScheme,
  onResetProgress,
}: ProfileProps) {
  const currentScheme = useMemo(
    () => schemes.find(s => s.id === currentSchemeId),
    [schemes, currentSchemeId],
  )

  const completedLessons = useMemo(
    () => lessons.filter(l => stats.lessonProgress[l.id]?.completed).length,
    [stats.lessonProgress],
  )

  const handleReset = useCallback(() => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可撤销。')) {
      onResetProgress()
    }
  }, [onResetProgress])

  return (
    <div className={styles.container}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={`material-symbols-outlined ${styles.statIcon}`}>local_fire_department</span>
          <div className={styles.statValue}>{stats.streaks}</div>
          <div className={styles.statLabel}>连续天数</div>
        </div>
        <div className={styles.statCard}>
          <span className={`material-symbols-outlined ${styles.statIcon}`}>exercise</span>
          <div className={styles.statValue}>{stats.totalExercisesCompleted}</div>
          <div className={styles.statLabel}>练习总数</div>
        </div>
        <div className={styles.statCard}>
          <span className={`material-symbols-outlined ${styles.statIcon}`}>checklist</span>
          <div className={styles.statValue}>{completedLessons}/{lessons.length}</div>
          <div className={styles.statLabel}>已完成课程</div>
        </div>
      </div>

      {/* Current Scheme */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>当前方案</h3>
        <button className={styles.schemeCard} onClick={onSelectScheme}>
          <div className={styles.schemeIcon}>
            {currentScheme?.name.charAt(0) ?? '?'}
          </div>
          <div className={styles.schemeInfo}>
            <div className={styles.schemeName}>{currentScheme?.name ?? '未知'}</div>
            <div className={styles.schemeDesc}>{currentScheme?.description ?? ''}</div>
          </div>
          <span className={`material-symbols-outlined ${styles.chevron}`}>chevron_right</span>
        </button>
      </div>

      {/* Settings */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>设置</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={`material-symbols-outlined ${styles.settingIcon}`}>
              {darkMode ? 'dark_mode' : 'light_mode'}
            </span>
            <span>深色模式</span>
          </div>
          <button
            className={`${styles.toggle} ${darkMode ? styles.toggleOn : ''}`}
            onClick={onToggleDark}
            aria-label="切换深色模式"
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>

        <button className={styles.dangerBtn} onClick={handleReset}>
          <span className={`material-symbols-outlined ${styles.dangerIcon}`}>delete_forever</span>
          重置所有进度
        </button>
      </div>

      {/* About */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>关于</h3>
        <p className={styles.aboutText}>Vibe 双拼 v1.0.0</p>
        <p className={styles.aboutText}>帮助 you 高效学习双拼输入法</p>
      </div>
    </div>
  )
}
