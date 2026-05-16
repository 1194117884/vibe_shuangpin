import type { Section } from '../../types'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  section: Section
  onSectionChange: (s: Section) => void
}

const TABS: { id: Section; icon: string; label: string }[] = [
  { id: 'practice', icon: 'exercise', label: '练习' },
  { id: 'leaderboard', icon: 'leaderboard', label: '排行' },
  { id: 'shop', icon: 'shopping_cart', label: '我的' },
]

export function BottomNav({ section, onSectionChange }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      {TABS.map(tab => {
        const isActive = section === tab.id
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onSectionChange(tab.id)}
          >
            <span
              className={`material-symbols-outlined ${styles.tabIcon} ${!isActive ? styles.tabIconInactive : ''}`}
            >
              {tab.icon}
            </span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
