import { useState, useCallback, useMemo } from 'react'
import { TopBar } from '../TopBar/TopBar'
import { NavBar } from '../NavBar/NavBar'
import { LessonPath } from '../LessonPath/LessonPath'
import { Exercise } from '../Exercise/Exercise'
import { PhraseHome } from '../sections/PhrasePractice/PhraseHome'
import { PhraseExercise } from '../sections/PhrasePractice/PhraseExercise'
import { ArticleHome } from '../sections/ArticlePractice/ArticleHome'
import { ArticlePractice } from '../sections/ArticlePractice/ArticlePractice'
import { GamesHome } from '../sections/Games/GamesHome'
import { TimedChallenge } from '../sections/Games/TimedChallenge'
import { useProgress } from '../../hooks/useProgress'
import { useDarkMode } from '../../hooks/useDarkMode'
import { lessons } from '../../data/lessons'
import { phraseCategories } from '../../data/phrases'
import { articles } from '../../data/articles'
import { schemes, getSchemeById } from '../../data/schemes'
import type { SectionId } from '../../types'
import styles from './App.module.css'

const TABS = [
  { id: 'basic' as SectionId, label: '基础练习' },
  { id: 'phrase' as SectionId, label: '词组练习' },
  { id: 'article' as SectionId, label: '文章练习' },
  { id: 'games' as SectionId, label: '游戏' },
]

type Screen =
  | { type: 'home' }
  | { type: 'lesson'; lessonId: string }

export function App() {
  const [section, setSection] = useState<SectionId>('basic')
  const [screen, setScreen] = useState<Screen>({ type: 'home' })
  const [schemeId, setSchemeId] = useState('xiaohe')
  const [phraseCategoryId, setPhraseCategoryId] = useState<string | null>(null)
  const [articleId, setArticleId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const { stats, completeLesson } = useProgress()
  const [darkMode, toggleDarkMode] = useDarkMode()

  const currentScheme = useMemo(
    () => getSchemeById(schemeId) ?? schemes[0]!,
    [schemeId],
  )

  const currentLesson = useMemo(
    () => lessons.find(l => l.id === (screen.type === 'lesson' ? screen.lessonId : undefined)),
    [screen],
  )

  const handleSelectLesson = useCallback((lessonId: string) => {
    setScreen({ type: 'lesson', lessonId })
  }, [])

  const handleComplete = useCallback(
    (result: { correct: number; total: number; accuracy: number }) => {
      if (screen.type === 'lesson') {
        completeLesson(screen.lessonId, result.accuracy, 0)
      }
      setScreen({ type: 'home' })
    },
    [screen, completeLesson],
  )

  const handleBack = useCallback(() => {
    setScreen({ type: 'home' })
  }, [])

  const handlePhraseCategory = useCallback((categoryId: string) => {
    setPhraseCategoryId(categoryId)
  }, [])

  const handlePhraseBack = useCallback(() => {
    setPhraseCategoryId(null)
  }, [])

  const handlePhraseComplete = useCallback(() => {
    setPhraseCategoryId(null)
  }, [])

  const handleSelectArticle = useCallback((id: string) => {
    setArticleId(id)
  }, [])

  const handleArticleBack = useCallback(() => {
    setArticleId(null)
  }, [])

  const handleArticleComplete = useCallback(() => {
    setArticleId(null)
  }, [])

  const handleSelectGame = useCallback((id: string) => {
    setGameId(id)
  }, [])

  const handleGameBack = useCallback(() => {
    setGameId(null)
  }, [])

  const handleTabChange = useCallback((tabId: string) => {
    setSection(tabId as SectionId)
    setPhraseCategoryId(null)
    setArticleId(null)
    setGameId(null)
    setScreen({ type: 'home' })
  }, [])

  const schemeNames = useMemo(
    () => schemes.map(s => ({ id: s.id, name: s.name })),
    [],
  )

  return (
    <div className={styles.app}>
      <TopBar
        streak={stats.streaks}
        schemeId={schemeId}
        availableSchemes={schemeNames}
        onSchemeChange={setSchemeId}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />

      <main className={styles.main}>
        {section === 'basic' && screen.type === 'home' && (
          <LessonPath
            lessons={lessons}
            progress={stats.lessonProgress}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {section === 'basic' && screen.type === 'lesson' && currentLesson && (
          <Exercise
            exercises={currentLesson.exercises}
            scheme={currentScheme}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}

        {section === 'phrase' && !phraseCategoryId && (
          <PhraseHome
            onSelectCategory={handlePhraseCategory}
            onBack={() => {}}
          />
        )}

        {section === 'phrase' && phraseCategoryId && (
          <PhraseExercise
            exercises={phraseCategories.find(c => c.id === phraseCategoryId)?.exercises ?? []}
            scheme={currentScheme}
            onComplete={handlePhraseComplete}
            onBack={handlePhraseBack}
          />
        )}

        {section === 'article' && !articleId && (
          <ArticleHome onSelectArticle={handleSelectArticle} onBack={() => {}} />
        )}

        {section === 'article' && articleId && (() => {
          const article = articles.find(a => a.id === articleId)
          if (!article) return null
          return (
            <ArticlePractice
              article={article}
              scheme={currentScheme}
              onComplete={handleArticleComplete}
              onBack={handleArticleBack}
            />
          )
        })()}

        {section === 'games' && !gameId && (
          <GamesHome onSelectGame={handleSelectGame} onBack={() => {}} />
        )}

        {section === 'games' && gameId === 'timed' && (
          <TimedChallenge
            scheme={currentScheme}
            onComplete={() => setGameId(null)}
            onBack={handleGameBack}
          />
        )}
      </main>

      <NavBar tabs={TABS} activeTab={section} onTabChange={handleTabChange} />
    </div>
  )
}
