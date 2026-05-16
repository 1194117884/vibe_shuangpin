import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Exercise } from './Exercise'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../types'

const mockExercises: ExerciseType[] = [
  { prompt: 'zhong', answer: 'vs', type: 'syllable', char: '中' },
  { prompt: 'guo', answer: 'go', type: 'syllable', char: '国' },
]

const mockScheme: ShuangpinScheme = {
  id: 'xiaohe',
  name: '小鹤',
  description: '',
  initials: { zh: 'v', ch: 'i', sh: 'u' },
  finals: { ong: 's', uo: 'o' },
  specials: {},
  zeroInitialFinals: {},
}

const baseProps = {
  exercises: mockExercises,
  scheme: mockScheme,
  onComplete: vi.fn(),
  onBack: vi.fn(),
}

describe('Exercise', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays the current character', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getByText('中')).toBeInTheDocument()
  })

  it('shows a placeholder in the pinyin box', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getAllByText('?')).toHaveLength(2)
  })

  it('accepts typed input', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByLabelText('输入双拼编码')
    fireEvent.change(input, { target: { value: 'v' } })
    expect(input).toHaveValue('v')
  })

  it('auto-submits on 2-character correct answer and advances', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByLabelText('输入双拼编码') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'vs' } })
    // Should advance to next exercise — next char '国' is shown in preview
    expect(screen.getByText('国')).toBeInTheDocument()
    // Input should be cleared
    expect(input.value).toBe('')
  })

  it('shows error and clears input on wrong answer', () => {
    vi.useFakeTimers()
    render(<Exercise {...baseProps} />)
    const input = screen.getByLabelText('输入双拼编码') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'xx' } })
    // Value is set momentarily before being cleared
    expect(input.value).toBe('xx')
    // After 500ms, input should be cleared
    act(() => { vi.advanceTimersByTime(500) })
    expect(input.value).toBe('')
  })

  it('submits via keyboard key press', () => {
    render(<Exercise {...baseProps} />)
    fireEvent.click(screen.getByLabelText('键 v'))
    const input = screen.getByLabelText('输入双拼编码') as HTMLInputElement
    expect(input.value).toBe('v')
    fireEvent.click(screen.getByLabelText('键 s'))
    // Should auto-submit and advance — next char '国' is shown in preview
    expect(screen.getByText('国')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('shows completion screen after all exercises', () => {
    render(<Exercise {...baseProps} />)
    // Answer first exercise
    fireEvent.change(screen.getByLabelText('输入双拼编码'), { target: { value: 'vs' } })
    // Answer second exercise
    fireEvent.change(screen.getByLabelText('输入双拼编码'), { target: { value: 'go' } })
    expect(screen.getByText('练习完成!')).toBeInTheDocument()
  })

  it('calls onComplete when returning after completion', () => {
    const onComplete = vi.fn()
    render(<Exercise {...baseProps} onComplete={onComplete} />)
    fireEvent.change(screen.getByLabelText('输入双拼编码'), { target: { value: 'vs' } })
    fireEvent.change(screen.getByLabelText('输入双拼编码'), { target: { value: 'go' } })
    fireEvent.click(screen.getByText('返回'))
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('renders keyboard keys', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getByLabelText('键 q')).toBeInTheDocument()
    expect(screen.getByLabelText('键 a')).toBeInTheDocument()
    expect(screen.getByLabelText('键 z')).toBeInTheDocument()
  })

  it('calls onBack when close button is clicked', () => {
    const onBack = vi.fn()
    render(<Exercise {...baseProps} onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('关闭'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('accepts longer input when maxLength is 0', () => {
    const exercises = [{ prompt: 'zhong guo', answer: 'vs go', type: 'word' as const, char: '中国' }]
    render(
      <Exercise
        {...baseProps}
        exercises={exercises}
        maxLength={0}
        inputFilter={/[^a-z; ]/g}
      />,
    )
    const input = screen.getByLabelText('输入双拼编码') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'vs ' } })
    expect(input.value).toBe('vs ')
    fireEvent.change(input, { target: { value: 'vs g' } })
    expect(input.value).toBe('vs g')
    // Should NOT auto-submit at 2 chars
    fireEvent.change(input, { target: { value: 'vs' } })
    expect(input.value).toBe('vs')
  })
})
