import { useMemo } from 'react'
import type { ExerciseMode, UserStats, LessonProgress } from '../../types'
import { lessons } from '../../data/lessons'
import styles from './Dashboard.module.css'

interface DashboardProps {
  streak: number
  stats?: UserStats
  onNavigate: (mode: ExerciseMode) => void
}

const PRACTICE_CARDS: {
  mode: ExerciseMode
  icon: string
  title: string
  desc: string
  variant: 'primary' | 'secondary' | 'tertiary' | 'surface'
}[] = [
  { mode: 'basic', icon: 'keyboard', title: '基础练习', desc: '掌握声母和韵母的键位映射', variant: 'primary' },
  { mode: 'phrase', icon: 'subject', title: '词组练习', desc: '通过常用词组提升输入速度', variant: 'secondary' },
  { mode: 'article', icon: 'article', title: '文章练习', desc: '流畅地输入完整段落', variant: 'tertiary' },
  { mode: 'game', icon: 'sports_esports', title: '打字游戏', desc: '在游戏中快乐学习！', variant: 'surface' },
]

function getProgressPercent(lessonProgress: Record<string, LessonProgress>): number {
  const total = lessons.length
  if (total === 0) return 0
  const completed = lessons.filter(l => lessonProgress[l.id]?.completed).length
  return Math.round((completed / total) * 100)
}

function getLevelInfo(totalCompleted: number): { level: number; xpInLevel: number; xpToNext: number; xpPercent: number } {
  const XP_PER_LEVEL = 10
  const level = Math.floor(totalCompleted / XP_PER_LEVEL) + 1
  const xpInLevel = totalCompleted % XP_PER_LEVEL
  const xpToNext = XP_PER_LEVEL - xpInLevel
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100
  return { level, xpInLevel, xpToNext, xpPercent }
}

export function Dashboard({ streak, stats, onNavigate }: DashboardProps) {
  const basicProgress = useMemo(
    () => getProgressPercent(stats?.lessonProgress ?? {}),
    [stats?.lessonProgress],
  )

  const { level, xpPercent, xpToNext } = useMemo(
    () => getLevelInfo(stats?.totalExercisesCompleted ?? 0),
    [stats?.totalExercisesCompleted],
  )

  return (
    <div className={styles.dashboard}>
      {/* Desktop header — hidden on mobile (TopNav handles mobile) */}
      <header className={styles.desktopHeader}>
        <h2 className={styles.greeting}>开始练习吧！</h2>
        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span className={`material-symbols-outlined ${styles.statIcon}`}>local_fire_department</span>
            连续 {streak} 天
          </div>
          <div className={styles.statPill}>
            <span className={`material-symbols-outlined ${styles.statIcon}`}>favorite</span>
            5
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left column: Practice cards (2/3) */}
        <div className={styles.cardsColumn}>
          <div className={styles.bentoGrid}>
            {PRACTICE_CARDS.map(card => (
              <button
                key={card.mode}
                className={`${styles.card} ${styles[`card_${card.variant}`]}`}
                onClick={() => onNavigate(card.mode)}
              >
                <div className={styles.cardIconWrap}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>{card.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>

                {card.variant === 'primary' && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${basicProgress}%` }} />
                    </div>
                  </div>
                )}

                {card.variant === 'secondary' && (
                  <div className={styles.progressBar}>
                    <div className={styles.progressTrackSecondary}>
                      <div className={styles.progressFillSecondary} style={{ width: '0%' }} />
                    </div>
                  </div>
                )}

                {card.variant === 'tertiary' && (
                  <span className={styles.lockedBadge}>达到 5 级解锁</span>
                )}

                {card.variant === 'surface' && (
                  <span className={styles.playBtn}>开始游戏</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Level + Mascot (1/3) */}
        <div className={styles.sideColumn}>
          {/* Level widget */}
          <div className={styles.levelWidget}>
            <h3 className={styles.levelLabel}>当前等级</h3>
            <div className={styles.levelCircle}>
              <svg className={styles.levelSvg} viewBox="0 0 36 36">
                <path
                  className={styles.levelTrack}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="4"
                />
                <path
                  className={styles.levelProgress}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${xpPercent}, 100`}
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <div className={styles.levelNumber}>
                <span className={styles.levelValue}>{level}</span>
                <span className={styles.levelUnit}>级</span>
              </div>
            </div>
            <p className={styles.levelXp}>还需 {xpToNext} XP 升至 {level + 1} 级</p>
          </div>

          {/* Mascot bubble */}
          <div className={styles.mascotSection}>
            <div className={styles.mascotBubble}>
              <p className={styles.mascotText}>
                "继续加油！你的打字速度每天都在进步，试试词组练习吧！"
              </p>
            </div>
            <div className={styles.mascotTail} />
            <div className={styles.mascotImageWrap}>
              <img
                className={styles.mascotImage}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEAerZEGWIbanF6E4zNyy_bY_FaiVMuOmNb_Iu-bKfo88CC5IUrgbBLjzbTHOSBe1J95bIYW9ktuPrCby65kV3kBhMFKF7hHaR1JwRnrZy_s8Ot2BWhD4HrB2zdz_Yva1qtupPbGZEBPoG1_vK4BciMcJXKRb8DeiRd7j2uU_SGzh0hVORMOjRwX__fE1oPEWnvgQiGe8S6RqO0mRgSTl2RnNs21ontXfjYq-bp7EOOT6NZekh00BAG2zXc1AdaFmIN28wBylidXcA"
                alt="双拼吉祥物"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
