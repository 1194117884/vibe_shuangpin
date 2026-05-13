import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Exercise } from './Exercise'
import type { Exercise as ExerciseType, ShuangpinScheme } from '../../types'

const mockExercises: ExerciseType[] = [
  { prompt: 'zhong', answer: 'vs', type: 'syllable' },
  { prompt: 'guo', answer: 'go', type: 'syllable' },
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
  it('displays the current prompt', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getByText('zhong')).toBeInTheDocument()
  })

  it('shows progress (1/2)', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getByText(/1.*2/)).toBeInTheDocument()
  })

  it('accepts typed input', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'v' } })
    expect(input).toHaveValue('v')
  })

  it('submits on Enter key and moves to next exercise', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // After correct answer, should show 'guo' as next prompt
    expect(screen.getByText('guo')).toBeInTheDocument()
  })

  it('shows correct feedback after submission', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('正确!')).toBeInTheDocument()
  })

  it('shows incorrect feedback with correct answer', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'xx' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/正确: vs/)).toBeInTheDocument()
  })

  it('shows completion screen after all exercises', () => {
    render(<Exercise {...baseProps} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'go' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/太棒了/)).toBeInTheDocument()
  })

  it('calls onComplete when continuing after completion', () => {
    const onComplete = vi.fn()
    render(<Exercise {...baseProps} onComplete={onComplete} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'vs' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'go' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    // Wait for completion view to appear, then click continue
    fireEvent.click(screen.getByText('继续'))
    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('renders keyboard', () => {
    render(<Exercise {...baseProps} />)
    expect(screen.getByRole('group', { name: '键盘' })).toBeInTheDocument()
  })
})
