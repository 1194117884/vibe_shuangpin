import { useState, useCallback, useMemo } from 'react'
import { SideNav } from '../SideNav/SideNav'
import { TopNav } from '../TopNav/TopNav'
import { BottomNav } from '../BottomNav/BottomNav'
import { Dashboard } from '../Dashboard/Dashboard'
import { Exercise } from '../Exercise/Exercise'
import { ArticleTyping } from '../sections/ArticlePractice/ArticleTyping'
import { SchemeSelect } from '../SchemeSelect/SchemeSelect'
import { Profile } from '../Profile/Profile'
import { Leaderboard } from '../Leaderboard/Leaderboard'
import { useProgress } from '../../hooks/useProgress'
import { useDarkMode } from '../../hooks/useDarkMode'
import { lessons } from '../../data/lessons'
import { phraseCategories } from '../../data/phrases'
import { schemes, getSchemeById } from '../../data/schemes'
import type { Section, PracticeScreen, ExerciseMode, Exercise as ExerciseType } from '../../types'
import styles from './App.module.css'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i]!, a[j]!] = [a[j]!, a[i]!]
  }
  return a
}

function generateExercises(mode: ExerciseMode): { exercises: ExerciseType[]; label: string } {
  switch (mode) {
    case 'basic': {
      const exercises = lessons.flatMap(l => l.exercises)
      return { exercises, label: '基础练习' }
    }
    case 'phrase': {
      const exercises = shuffle(phraseCategories.flatMap(c => c.exercises))
      return { exercises, label: '词组练习' }
    }
    case 'article': {
      // Article mode — exercises generated dynamically by ArticleTyping
      return { exercises: [], label: '文章练习' }
    }
    case 'game': {
      const exercises = shuffle([
        ...lessons.flatMap(l => l.exercises),
        ...phraseCategories.flatMap(c => c.exercises),
      ])
      return { exercises, label: '打字游戏' }
    }
  }
}

function getExerciseConfig(exercises: ExerciseType[]) {
  const hasMultiWord = exercises.some(e => e.answer.includes(' '))
  return {
    maxLength: hasMultiWord ? 0 : 2,
    inputFilter: hasMultiWord ? /[^a-z; ]/g : undefined,
  }
}

export function App() {
  const [section, setSection] = useState<Section>('practice')
  const [practiceScreen, setPracticeScreen] = useState<PracticeScreen>('home')
  const [schemeId, setSchemeId] = useState(() => localStorage.getItem('vibe-shuangpin-scheme') ?? 'xiaohe')
  const [exerciseMode, setExerciseMode] = useState<ExerciseMode | null>(null)
  const [exercises, setExercises] = useState<ExerciseType[]>([])
  const [exerciseLabel, setExerciseLabel] = useState('')
  const { stats, resetProgress } = useProgress()
  const [darkMode, toggleDarkMode] = useDarkMode()

  const currentScheme = useMemo(
    () => getSchemeById(schemeId) ?? schemes[0]!,
    [schemeId],
  )

  const exerciseConfig = useMemo(
    () => getExerciseConfig(exercises),
    [exercises],
  )

  const handleSectionChange = useCallback((s: Section) => {
    setSection(s)
    setPracticeScreen('home')
    setExerciseMode(null)
    setExercises([])
  }, [])

  const handleDashboardNavigate = useCallback((mode: ExerciseMode) => {
    const { exercises: exs, label } = generateExercises(mode)
    setExerciseMode(mode)
    setExercises(exs)
    setExerciseLabel(label)
    setPracticeScreen('exercise')
  }, [])

  const handleComplete = useCallback(() => {
    setPracticeScreen('home')
    setExerciseMode(null)
    setExercises([])
    setExerciseLabel('')
  }, [])

  const handleBack = useCallback(() => {
    setPracticeScreen('home')
    setExerciseMode(null)
    setExercises([])
    setExerciseLabel('')
  }, [])

  const handleSelectScheme = useCallback(() => {
    setPracticeScreen('scheme-select')
  }, [])

  const handleSchemeChange = useCallback((id: string) => {
    setSchemeId(id)
    localStorage.setItem('vibe-shuangpin-scheme', id)
    setPracticeScreen('home')
  }, [])

  const handleSchemeBack = useCallback(() => {
    setPracticeScreen('home')
  }, [])

  const topNavTitle = useMemo(() => {
    if (section === 'leaderboard') return '排行榜'
    if (section === 'shop') return '我的'
    if (section !== 'practice') return ''
    if (practiceScreen === 'exercise') return exerciseLabel
    if (practiceScreen === 'scheme-select') return '选择方案'
    return ''
  }, [section, practiceScreen, exerciseLabel])

  const showSimpleTopNav = section !== 'practice' || practiceScreen !== 'home'

  return (
    <div className={styles.app}>
      <SideNav
        section={section}
        onSectionChange={handleSectionChange}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
        schemeId={schemeId}
        onSelectScheme={handleSelectScheme}
      />

      <div className={styles.mainArea}>
        <TopNav
          streak={stats.streaks}
          darkMode={darkMode}
          onToggleDark={toggleDarkMode}
          title={showSimpleTopNav ? topNavTitle : undefined}
          simple={showSimpleTopNav}
        />

        <main className={styles.main}>
          {section === 'practice' && practiceScreen === 'home' && (
            <Dashboard
              streak={stats.streaks}
              stats={stats}
              onNavigate={handleDashboardNavigate}
            />
          )}

          {section === 'practice' && practiceScreen === 'exercise' && exerciseMode === 'article' && (
            <ArticleTyping
              scheme={currentScheme}
              onBack={handleBack}
            />
          )}

          {section === 'practice' && practiceScreen === 'exercise' && exerciseMode !== 'article' && exercises.length > 0 && (
            <Exercise
              key={exerciseLabel}
              exercises={exercises}
              scheme={currentScheme}
              onComplete={handleComplete}
              onBack={handleBack}
              maxLength={exerciseConfig.maxLength}
              inputFilter={exerciseConfig.inputFilter}
            />
          )}

          {section === 'practice' && practiceScreen === 'scheme-select' && (
            <SchemeSelect
              schemes={schemes}
              currentSchemeId={schemeId}
              onSchemeChange={handleSchemeChange}
              onBack={handleSchemeBack}
            />
          )}

          {section === 'leaderboard' && (
            <Leaderboard
              stats={stats}
              lessons={lessons}
            />
          )}

          {section === 'shop' && (
            <Profile
              stats={stats}
              darkMode={darkMode}
              onToggleDark={toggleDarkMode}
              schemes={schemes}
              currentSchemeId={schemeId}
              onSelectScheme={handleSelectScheme}
              onResetProgress={resetProgress}
            />
          )}
        </main>

        <BottomNav
          section={section}
          onSectionChange={handleSectionChange}
        />
      </div>
    </div>
  )
}
