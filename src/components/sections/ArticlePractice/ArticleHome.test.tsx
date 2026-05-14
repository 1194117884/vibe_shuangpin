import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ArticleHome } from './ArticleHome'

describe('ArticleHome', () => {
  it('renders all articles', () => {
    render(<ArticleHome onSelectArticle={() => {}} onBack={() => {}} />)
    expect(screen.getByText('日常对话')).toBeInTheDocument()
    expect(screen.getByText('自我介绍')).toBeInTheDocument()
  })

  it('calls onSelectArticle when clicking an article', () => {
    const onSelectArticle = vi.fn()
    render(<ArticleHome onSelectArticle={onSelectArticle} onBack={() => {}} />)
    fireEvent.click(screen.getByText('日常对话'))
    expect(onSelectArticle).toHaveBeenCalledWith('daily-dialog')
  })
})
