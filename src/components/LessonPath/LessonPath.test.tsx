import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LessonPath } from './LessonPath'
import type { Lesson, LessonProgress } from '../../types'

const mockLessons: Lesson[] = [
  { id: 'l1', title: '声母练习', description: '练习声母', schemeId: 'xiaohe', exercises: [], prerequisites: [] },
  { id: 'l2', title: '韵母练习', description: '练习韵母', schemeId: 'xiaohe', exercises: [], prerequisites: ['l1'] },
  { id: 'l3', title: '进阶练习', description: '综合练习', schemeId: 'xiaohe', exercises: [], prerequisites: ['l2'] },
]

describe('LessonPath', () => {
  it('renders all lessons', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('声母练习')).toBeInTheDocument()
    expect(screen.getByText('韵母练习')).toBeInTheDocument()
    expect(screen.getByText('进阶练习')).toBeInTheDocument()
  })

  it('shows first lesson as unlocked when no progress', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('声母练习').closest('button')).not.toBeDisabled()
  })

  it('shows locked lesson as disabled', () => {
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('韵母练习').closest('button')).toBeDisabled()
  })

  it('unlocks next lesson when prerequisite is complete', () => {
    const progress: Record<string, LessonProgress> = {
      l1: { lessonId: 'l1', completed: true, bestAccuracy: 1, bestWpm: 0, attempts: 1, lastPracticed: '2024-01-01' },
    }
    render(
      <LessonPath
        lessons={mockLessons}
        progress={progress}
        onSelectLesson={vi.fn()}
      />,
    )
    expect(screen.getByText('韵母练习').closest('button')).not.toBeDisabled()
  })

  it('calls onSelectLesson when clicking an unlocked lesson', () => {
    const onSelect = vi.fn()
    render(
      <LessonPath
        lessons={mockLessons}
        progress={{}}
        onSelectLesson={onSelect}
      />,
    )
    screen.getByText('声母练习').click()
    expect(onSelect).toHaveBeenCalledWith('l1')
  })
})
