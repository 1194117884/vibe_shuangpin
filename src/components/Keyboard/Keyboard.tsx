import styles from './Keyboard.module.css'

interface KeyboardProps {
  highlightKeys: string[]
  schemeLabels: Record<string, { initials: string[]; finals: string[] }>
  onKeyPress: (key: string) => void
}

/** 21-column grid positioning for each key */
const KEY_POSITIONS: { key: string; col: number }[] = [
  // Row 1: columns 1-20
  { key: 'q', col: 1 }, { key: 'w', col: 3 }, { key: 'e', col: 5 },
  { key: 'r', col: 7 }, { key: 't', col: 9 }, { key: 'y', col: 11 },
  { key: 'u', col: 13 }, { key: 'i', col: 15 }, { key: 'o', col: 17 }, { key: 'p', col: 19 },
  // Row 2: columns 2-20
  { key: 'a', col: 2 }, { key: 's', col: 4 }, { key: 'd', col: 6 },
  { key: 'f', col: 8 }, { key: 'g', col: 10 }, { key: 'h', col: 12 },
  { key: 'j', col: 14 }, { key: 'k', col: 16 }, { key: 'l', col: 18 },
  { key: ';', col: 20 },
  // Row 3: columns 4-16
  { key: 'z', col: 4 }, { key: 'x', col: 6 }, { key: 'c', col: 8 },
  { key: 'v', col: 10 }, { key: 'b', col: 12 }, { key: 'n', col: 14 }, { key: 'm', col: 16 },
]

export function Keyboard({ highlightKeys, schemeLabels, onKeyPress }: KeyboardProps) {
  const highlightSet = new Set(highlightKeys)

  return (
    <div className={styles.keyboard}>
      <div className={styles.grid}>
        {KEY_POSITIONS.map(({ key: k, col }) => {
          const labels = schemeLabels[k]
          const initials = labels?.initials ?? []
          const finals = labels?.finals ?? []
          const showFinal = finals.length > 0
          const showInitial = initials.length > 0

          return (
            <button
              key={k}
              className={`${styles.key} ${highlightSet.has(k) ? styles.highlighted : ''}`}
              style={{ gridColumn: `${col} / span 2` }}
              onClick={() => onKeyPress(k)}
              aria-label={`键 ${k}`}
            >
              <span className={styles.keyUpper}>{k === ';' ? ';' : k.toUpperCase()}</span>
              {k === ';' && !showInitial && !showFinal ? (
                <span className={styles.keyLower}>;</span>
              ) : (
                <div className={styles.keyBody}>
                  {showInitial ? (
                    <span className={styles.keyInitial}>{initials.join(' ')}</span>
                  ) : (
                    <span className={styles.keyLower}>{k}</span>
                  )}
                  {showFinal && (
                    <span className={styles.keyFinal}>{finals.join(' ')}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>声母</span>
        <span className={styles.legendItem}>韵母</span>
        <span className={styles.legendItem}>提示</span>
      </div>
    </div>
  )
}
