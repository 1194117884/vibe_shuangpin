import styles from './TopNav.module.css'

interface TopNavProps {
  streak?: number
  darkMode: boolean
  onToggleDark: () => void
  onBack?: () => void
  title?: string
  simple?: boolean
}

export function TopNav({ streak, darkMode, onToggleDark, onBack, title, simple }: TopNavProps) {
  if (simple) {
    return (
      <nav className={styles.topBar}>
        {onBack ? (
          <button className={styles.backBtn} onClick={onBack}>
            <span className="material-symbols-outlined">arrow_back</span>
            返回
          </button>
        ) : <div />}
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.spacer} />
      </nav>
    )
  }

  return (
    <nav className={styles.topBar}>
      <div className={styles.brand}>Vibe 双拼</div>
      <div className={styles.right}>
        {streak != null && (
          <div className={styles.streak}>
            <span className={`material-symbols-outlined ${styles.streakIcon}`}>local_fire_department</span>
            {streak}
          </div>
        )}
        <div className={styles.hearts}>
          <span className={`material-symbols-outlined ${styles.heartsIcon}`}>favorite</span>
          5
        </div>
        <button className={styles.iconBtn} onClick={onToggleDark}>
          <span className="material-symbols-outlined">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </nav>
  )
}
