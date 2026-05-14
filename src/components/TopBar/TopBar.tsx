import { useState, useRef, useEffect } from 'react'
import styles from './TopBar.module.css'

interface AvailableScheme {
  id: string
  name: string
}

interface TopBarProps {
  streak: number
  schemeId: string
  availableSchemes: AvailableScheme[]
  onSchemeChange: (id: string) => void
  darkMode: boolean
  onToggleDark: () => void
}

export function TopBar({ streak, schemeId, availableSchemes, onSchemeChange, darkMode, onToggleDark }: TopBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentScheme = availableSchemes.find(s => s.id === schemeId)

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <div className={styles.streak}>
          <span className={styles.streakIcon}>🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className={styles.right} ref={ref}>
        <button
          className={styles.themeToggle}
          onClick={onToggleDark}
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <button
          className={styles.schemeButton}
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {currentScheme?.name ?? '选择方案'}
          <span>{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className={styles.dropdown} role="listbox">
            {availableSchemes.map(s => (
              <button
                key={s.id}
                className={`${styles.dropdownItem} ${
                  s.id === schemeId ? styles.dropdownItemActive : ''
                }`}
                onClick={() => {
                  onSchemeChange(s.id)
                  setOpen(false)
                }}
                role="option"
                aria-selected={s.id === schemeId}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
