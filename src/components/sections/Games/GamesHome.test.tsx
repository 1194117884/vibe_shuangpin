import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GamesHome } from './GamesHome'

describe('GamesHome', () => {
  it('renders game options', () => {
    render(<GamesHome onSelectGame={() => {}} onBack={() => {}} />)
    expect(screen.getByText('限时挑战')).toBeInTheDocument()
  })

  it('calls onSelectGame when clicking a game', () => {
    const onSelectGame = vi.fn()
    render(<GamesHome onSelectGame={onSelectGame} onBack={() => {}} />)
    fireEvent.click(screen.getByText('限时挑战'))
    expect(onSelectGame).toHaveBeenCalledWith('timed')
  })
})
