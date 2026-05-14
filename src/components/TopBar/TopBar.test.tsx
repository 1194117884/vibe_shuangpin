import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  const baseProps = {
    streak: 5,
    schemeId: 'xiaohe',
    availableSchemes: [
      { id: 'xiaohe', name: '小鹤' },
      { id: 'sougou', name: '搜狗' },
    ],
    onSchemeChange: vi.fn(),
    darkMode: false,
    onToggleDark: vi.fn(),
  }

  it('shows streak count', () => {
    render(<TopBar {...baseProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows current scheme name', () => {
    render(<TopBar {...baseProps} />)
    expect(screen.getByText('小鹤')).toBeInTheDocument()
  })

  it('opens scheme selector on click', () => {
    render(<TopBar {...baseProps} />)
    fireEvent.click(screen.getByText('小鹤'))
    expect(screen.getByText('搜狗')).toBeInTheDocument()
  })

  it('calls onSchemeChange when selecting a different scheme', () => {
    const onChange = vi.fn()
    render(<TopBar {...baseProps} onSchemeChange={onChange} />)
    fireEvent.click(screen.getByText('小鹤'))
    fireEvent.click(screen.getByText('搜狗'))
    expect(onChange).toHaveBeenCalledWith('sougou')
  })

  it('closes dropdown when scheme is selected', () => {
    render(<TopBar {...baseProps} />)
    fireEvent.click(screen.getByText('小鹤'))
    fireEvent.click(screen.getByText('搜狗'))
    // After selecting, dropdown should close
    expect(screen.queryByText('搜狗')).not.toBeInTheDocument()
  })
})
