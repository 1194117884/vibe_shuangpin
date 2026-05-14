import { articles } from '../../../data/articles'
import styles from './ArticleHome.module.css'

interface ArticleHomeProps {
  onSelectArticle: (articleId: string) => void
  onBack: () => void
}

export function ArticleHome({ onSelectArticle, onBack }: ArticleHomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1 className={styles.title}>文章练习</h1>
      </div>
      {articles.map(article => (
        <button
          key={article.id}
          className={styles.card}
          onClick={() => onSelectArticle(article.id)}
        >
          <div className={styles.cardTitle}>{article.title}</div>
          <div className={styles.cardDesc}>{article.description}</div>
        </button>
      ))}
    </div>
  )
}
