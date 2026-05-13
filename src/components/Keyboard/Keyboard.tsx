import type { KeyboardEvent, MouseEvent } from 'react'
import styles from './Keyboard.module.css'

interface KeyboardProps {
  highlightKeys: string[]
  schemeLabels: Record<string, string>
  onKeyPress: (key: string) => void
}

const KEY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export function Keyboard({ highlightKeys, schemeLabels, onKeyPress }: KeyboardProps) {
  const highlightSet = new Set(highlightKeys)

  const handleClick = (key: string) => (e: MouseEvent) => {
    ;(e.currentTarget as HTMLButtonElement).blur()
    onKeyPress(key)
  }

  const handleKeyDown = (key: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onKeyPress(key)
    }
  }

  return (
    <div className={styles.keyboard} role="group" aria-label="键盘">
      {KEY_ROWS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {ri === 2 && <div className={styles.spacer} />}
          {row.map(k => (
            <div key={k} className={styles.keyWrapper}>
              <button
                className={`${styles.key} ${highlightSet.has(k) ? styles.highlighted : ''}`}
                onClick={handleClick(k)}
                onKeyDown={handleKeyDown(k)}
                aria-label={`键 ${k}`}
                aria-pressed={highlightSet.has(k)}
              >
                {k}
              </button>
              {schemeLabels[k] && (
                <span className={styles.schemeLabel}>{schemeLabels[k]}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
