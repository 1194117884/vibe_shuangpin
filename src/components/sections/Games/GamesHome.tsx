import styles from './GamesHome.module.css'

interface GamesHomeProps {
  onSelectGame: (gameId: string) => void
  onBack: () => void
}

const GAMES = [
  { id: 'timed', title: '限时挑战', description: '60秒内尽可能回答更多的练习' },
]

export function GamesHome({ onSelectGame, onBack }: GamesHomeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack} aria-label="返回">
          ← 返回
        </button>
        <h1 className={styles.title}>游戏</h1>
      </div>
      {GAMES.map(game => (
        <button
          key={game.id}
          className={styles.card}
          onClick={() => onSelectGame(game.id)}
        >
          <div className={styles.cardTitle}>{game.title}</div>
          <div className={styles.cardDesc}>{game.description}</div>
        </button>
      ))}
    </div>
  )
}
