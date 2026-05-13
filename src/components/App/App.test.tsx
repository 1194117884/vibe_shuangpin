import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { App } from './App'

function mockStorage() {
  const store: Record<string, string> = {}
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation((k: string) => store[k] ?? null)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k: string, v: string) => { store[k] = v })
}

describe('App', () => {
  beforeEach(() => { mockStorage() })

  it('renders the lesson path screen by default', () => {
    render(<App />)
    expect(screen.getByText('声母 zh ch sh')).toBeInTheDocument()
  })

  it('shows TopBar with streak', () => {
    render(<App />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('allows clicking a lesson to start practicing', () => {
    render(<App />)
    const lesson = screen.getByText('声母 zh ch sh')
    fireEvent.click(lesson)
    expect(screen.getByPlaceholderText('输入双拼...')).toBeInTheDocument()
  })

  it('switches between home and lesson screens', () => {
    render(<App />)
    fireEvent.click(screen.getByText('声母 zh ch sh'))
    expect(screen.getByPlaceholderText('输入双拼...')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
