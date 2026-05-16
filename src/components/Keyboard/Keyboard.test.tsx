import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Keyboard } from './Keyboard'

describe('Keyboard', () => {
  const baseProps = {
    highlightKeys: [] as string[],
    schemeLabels: {} as Record<string, { initials: string[]; finals: string[] }>,
    onKeyPress: () => {},
  }

  it('renders standard keyboard layout', () => {
    render(<Keyboard {...baseProps} />)
    // Each key shows twice: keyUpper + keyMapping (when no scheme label)
    expect(screen.getAllByText('q')).toHaveLength(2)
    expect(screen.getAllByText('p')).toHaveLength(2)
    expect(screen.getAllByText('a')).toHaveLength(2)
    expect(screen.getAllByText('l')).toHaveLength(2)
    expect(screen.getAllByText('z')).toHaveLength(2)
    expect(screen.getAllByText('m')).toHaveLength(2)
  })

  it('highlights specified keys', () => {
    render(
      <Keyboard {...baseProps} highlightKeys={['a', 's']} />,
    )
    const aKey = screen.getByRole('button', { name: '键 a' })
    const sKey = screen.getByRole('button', { name: '键 s' })
    expect(aKey.className).toContain('highlighted')
    expect(sKey.className).toContain('highlighted')
  })

  it('shows scheme labels on keys', () => {
    render(
      <Keyboard
        {...baseProps}
        schemeLabels={{
          v: { initials: ['zh'], finals: [] },
          i: { initials: ['ch'], finals: [] },
        }}
      />,
    )
    expect(screen.getByText('zh')).toBeInTheDocument()
    expect(screen.getByText('ch')).toBeInTheDocument()
  })

  it('calls onKeyPress when a key is clicked', () => {
    const onKeyPress = vi.fn()
    render(<Keyboard {...baseProps} onKeyPress={onKeyPress} />)
    screen.getByRole('button', { name: '键 a' }).click()
    expect(onKeyPress).toHaveBeenCalledWith('a')
  })
})
