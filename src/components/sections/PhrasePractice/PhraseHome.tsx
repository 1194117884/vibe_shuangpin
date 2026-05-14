import { phraseCategories } from '../../../data/phrases'
import styles from './PhraseHome.module.css'

interface PhraseHomeProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

export function PhraseHome({ onSelectCategory, onBack }: PhraseHomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1 className={styles.title}>词组练习</h1>
      </div>
      {phraseCategories.map(cat => (
        <button
          key={cat.id}
          className={styles.card}
          onClick={() => onSelectCategory(cat.id)}
        >
          <div className={styles.cardTitle}>{cat.title}</div>
          <div className={styles.cardDesc}>{cat.description}</div>
        </button>
      ))}
    </div>
  )
}
