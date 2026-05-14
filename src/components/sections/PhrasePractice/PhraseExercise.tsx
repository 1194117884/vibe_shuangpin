import { Exercise } from '../../Exercise/Exercise'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../../types'

interface PhraseExerciseProps {
  exercises: ExerciseType[]
  scheme: ShuangpinScheme
  onComplete: (results: { correct: number; total: number; accuracy: number }) => void
  onBack: () => void
}

export function PhraseExercise(props: PhraseExerciseProps) {
  return <Exercise {...props} maxLength={0} inputFilter={/[^a-z; ]/g} />
}
