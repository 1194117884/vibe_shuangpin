import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Keyboard } from './Keyboard'

describe('Keyboard', () => {
  const baseProps = {
    highlightKeys: [] as string[],
    schemeLabels: {} as Record<string, string>,
    onKeyPress: () => {},
  }

  it('renders standard keyboard layout', () => {
    render(<Keyboard {...baseProps} />)
    expect(screen.getByText('q')).toBeInTheDocument()
    expect(screen.getByText('p')).toBeInTheDocument()
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('l')).toBeInTheDocument()
    expect(screen.getByText('z')).toBeInTheDocument()
    expect(screen.getByText('m')).toBeInTheDocument()
  })

  it('highlights specified keys', () => {
    render(
      <Keyboard {...baseProps} highlightKeys={['a', 's']} />,
    )
    const aKey = screen.getByText('a').closest('button')
    const sKey = screen.getByText('s').closest('button')
    expect(aKey).toHaveAttribute('aria-pressed', 'true')
    expect(sKey).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows scheme labels on keys', () => {
    render(
      <Keyboard
        {...baseProps}
        schemeLabels={{ v: 'zh', i: 'ch', u: 'sh' }}
      />,
    )
    expect(screen.getByText('zh')).toBeInTheDocument()
    expect(screen.getByText('ch')).toBeInTheDocument()
  })

  it('calls onKeyPress when a key is clicked', () => {
    const onKeyPress = vi.fn()
    render(<Keyboard {...baseProps} onKeyPress={onKeyPress} />)
    screen.getByText('a').click()
    expect(onKeyPress).toHaveBeenCalledWith('a')
  })
})
