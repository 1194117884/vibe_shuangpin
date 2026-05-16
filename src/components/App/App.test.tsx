import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the Dashboard by default', () => {
    render(<App />)
    // Dashboard cards
    expect(screen.getByText('基础练习')).toBeInTheDocument()
    expect(screen.getByText('打字游戏')).toBeInTheDocument()
  })

  it('shows TopNav with streak', () => {
    render(<App />)
    // Streak value '0' appears in TopNav and Dashboard — use getAllByText
    const streaks = screen.getAllByText('0')
    expect(streaks.length).toBeGreaterThanOrEqual(1)
  })

  it('shows BottomNav with three tabs', () => {
    render(<App />)
    // All labels appear in both SideNav and BottomNav
    expect(screen.getAllByText('练习')).toHaveLength(2)
    expect(screen.getAllByText('排行')).toHaveLength(2)
    expect(screen.getAllByText('我的')).toHaveLength(2)
  })

  it('switches section when clicking a nav tab', () => {
    render(<App />)
    // Click '排行' in BottomNav (both SideNav and BottomNav have it)
    fireEvent.click(screen.getAllByText('排行')[0]!)
    // Leaderboard shows '排行榜' in both TopNav title and content
    expect(screen.getAllByText('排行榜').length).toBeGreaterThanOrEqual(1)
  })

  it('starts basic exercise directly when clicking 基础练习 card', () => {
    render(<App />)
    fireEvent.click(screen.getByText('基础练习'))
    // Exercise component shows the hidden input
    expect(screen.getByLabelText('输入双拼编码')).toBeInTheDocument()
  })

  it('starts phrase exercise directly when clicking 词组练习 card', () => {
    render(<App />)
    fireEvent.click(screen.getByText('词组练习'))
    expect(screen.getByLabelText('输入双拼编码')).toBeInTheDocument()
  })

  it('returns to dashboard when closing exercise', () => {
    render(<App />)
    fireEvent.click(screen.getByText('基础练习'))
    expect(screen.getByLabelText('输入双拼编码')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('关闭'))
    expect(screen.getByText('基础练习')).toBeInTheDocument()
  })
})
