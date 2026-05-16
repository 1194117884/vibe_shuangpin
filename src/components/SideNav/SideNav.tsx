import { useMemo } from 'react'
import { schemes, getSchemeById } from '../../data/schemes'
import type { Section } from '../../types'
import styles from './SideNav.module.css'

interface SideNavProps {
  section: Section
  onSectionChange: (s: Section) => void
  darkMode: boolean
  onToggleDark: () => void
  schemeId: string
  onSelectScheme?: () => void
}

const NAV_ITEMS: { id: Section; icon: string; label: string }[] = [
  { id: 'practice', icon: 'exercise', label: '练习' },
  { id: 'leaderboard', icon: 'leaderboard', label: '排行' },
  { id: 'shop', icon: 'shopping_cart', label: '我的' },
]

export function SideNav({
  section,
  onSectionChange,
  darkMode,
  onToggleDark,
  schemeId,
  onSelectScheme,
}: SideNavProps) {
  const currentScheme = useMemo(
    () => getSchemeById(schemeId) ?? schemes[0]!,
    [schemeId],
  )

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <h1 className={styles.brandName}>Vibe 双拼</h1>
          <p className={styles.brandTagline}>掌握双拼布局</p>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => {
            const isActive = section === item.id
            return (
              <button
                key={item.id}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span
                  className={`material-symbols-outlined ${styles.navIcon} ${!isActive ? styles.navIconInactive : ''}`}
                >
                  {item.icon}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className={styles.bottom}>
        <button className={styles.themeBtn} onClick={onToggleDark}>
          <span className={`material-symbols-outlined ${styles.navIcon}`}>
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span className={styles.navLabel}>
            {darkMode ? '浅色模式' : '深色模式'}
          </span>
        </button>

        <button
          className={styles.layoutWidget}
          onClick={onSelectScheme}
          aria-label="选择方案"
        >
          <div className={styles.layoutIcon}>
            {currentScheme.name.charAt(0)}
          </div>
          <div>
            <div className={styles.layoutLabel}>当前方案</div>
            <div className={styles.layoutName}>{currentScheme.name}</div>
          </div>
        </button>
      </div>
    </aside>
  )
}
