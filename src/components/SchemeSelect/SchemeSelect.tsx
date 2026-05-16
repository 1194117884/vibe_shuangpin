import type { ShuangpinScheme } from '../../types'
import styles from './SchemeSelect.module.css'

interface SchemeSelectProps {
  schemes: ShuangpinScheme[]
  currentSchemeId: string
  onSchemeChange: (schemeId: string) => void
  onBack: () => void
}

export function SchemeSelect({ schemes, currentSchemeId, onSchemeChange, onBack }: SchemeSelectProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.closeBtn} onClick={onBack} aria-label="关闭">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className={styles.title}>选择双拼方案</h2>
        <div className={styles.spacer} />
      </header>

      {/* Scheme Grid */}
      <div className={styles.grid}>
        {schemes.map(scheme => {
          const isSelected = scheme.id === currentSchemeId
          return (
            <button
              key={scheme.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => onSchemeChange(scheme.id)}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.icon} ${isSelected ? styles.iconSelected : ''}`}>
                  {scheme.name.charAt(0)}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.schemeName}>{scheme.name}</h3>
                  <p className={styles.schemeDesc}>{scheme.description}</p>
                </div>
              </div>

              {isSelected && (
                <div className={styles.badge}>
                  <span className="material-symbols-outlined">check_circle</span>
                  当前方案
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
