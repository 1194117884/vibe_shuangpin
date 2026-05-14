import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TimedChallenge } from './TimedChallenge'
import { xiaohe } from '../../../data/xiaohe'

describe('TimedChallenge', () => {
  it('shows start screen', () => {
    render(<TimedChallenge scheme={xiaohe} onComplete={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('限时挑战')).toBeInTheDocument()
    expect(screen.getByText('开始')).toBeInTheDocument()
  })

  it('shows timer after starting', () => {
    render(<TimedChallenge scheme={xiaohe} onComplete={vi.fn()} onBack={vi.fn()} />)
    fireEvent.click(screen.getByText('开始'))
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('shows an exercise after starting', () => {
    render(<TimedChallenge scheme={xiaohe} onComplete={vi.fn()} onBack={vi.fn()} />)
    fireEvent.click(screen.getByText('开始'))
    expect(screen.getByLabelText('输入双拼编码')).toBeInTheDocument()
  })

  it('calls onComplete when time runs out', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<TimedChallenge scheme={xiaohe} onComplete={onComplete} onBack={vi.fn()} />)
    fireEvent.click(screen.getByText('开始'))
    act(() => {
      vi.advanceTimersByTime(61000)
    })
    expect(onComplete).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
