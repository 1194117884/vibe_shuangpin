import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NavBar } from './NavBar'

const TABS = [
  { id: 'basic', label: '基础练习' },
  { id: 'phrase', label: '词组练习' },
  { id: 'article', label: '文章练习' },
  { id: 'games', label: '游戏' },
]

describe('NavBar', () => {
  it('renders all four tabs', () => {
    render(<NavBar tabs={TABS} activeTab="basic" onTabChange={() => {}} />)
    expect(screen.getByText('基础练习')).toBeInTheDocument()
    expect(screen.getByText('词组练习')).toBeInTheDocument()
    expect(screen.getByText('文章练习')).toBeInTheDocument()
    expect(screen.getByText('游戏')).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(<NavBar tabs={TABS} activeTab="phrase" onTabChange={() => {}} />)
    const phraseTab = screen.getByText('词组练习').closest('button')
    const basicTab = screen.getByText('基础练习').closest('button')
    expect(phraseTab?.className).toContain('active')
    expect(basicTab?.className).not.toContain('active')
  })

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn()
    render(<NavBar tabs={TABS} activeTab="basic" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('游戏'))
    expect(onTabChange).toHaveBeenCalledWith('games')
  })
})
