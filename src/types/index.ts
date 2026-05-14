export type SectionId = 'basic' | 'phrase' | 'article' | 'games'

/** A Shuangpin key mapping scheme */
export interface ShuangpinScheme {
  id: string
  name: string
  description: string
  /** Initial consonant to key mapping, e.g. { zh: 'v', ch: 'i', sh: 'u' } */
  initials: Record<string, string>
  /** Final (rhyme) to key mapping, e.g. { ang: 'h', eng: 'g', ong: 's' } */
  finals: Record<string, string>
  /** Special single-syllable key sequences, e.g. { a: 'aa', o: 'oo' } */
  specials: Record<string, string>
  /** Zero-initial finals with their Shuangpin sequences */
  zeroInitialFinals: Record<string, string>
}

export type ExerciseType = 'initial' | 'final' | 'syllable' | 'word' | 'phrase'

/** A single question in an exercise */
export interface Exercise {
  prompt: string
  answer: string
  type: ExerciseType
  /** Optional Chinese character for display */
  char?: string
}

/** A lesson containing multiple exercises */
export interface Lesson {
  id: string
  title: string
  description: string
  schemeId: string
  exercises: Exercise[]
  prerequisites: string[]
}

/** Result of a single exercise attempt */
export interface ExerciseResult {
  exercise: Exercise
  input: string
  correct: boolean
  timeMs: number
}

/** Progress for a specific lesson */
export interface LessonProgress {
  lessonId: string
  completed: boolean
  bestAccuracy: number
  bestWpm: number
  attempts: number
  lastPracticed: string | null
}

/** Overall user statistics */
export interface UserStats {
  streaks: number
  lastPracticeDate: string | null
  totalExercisesCompleted: number
  lessonProgress: Record<string, LessonProgress>
}
