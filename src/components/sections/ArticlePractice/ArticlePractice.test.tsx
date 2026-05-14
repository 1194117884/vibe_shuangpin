import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ArticlePractice } from './ArticlePractice'
import { articles } from '../../../data/articles'
import { xiaohe } from '../../../data/xiaohe'

describe('ArticlePractice', () => {
  it('shows the first sentence and exercises', () => {
    render(
      <ArticlePractice
        article={articles[0]!}
        scheme={xiaohe}
        onComplete={vi.fn()}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText('你好吗？')).toBeInTheDocument()
  })

  it('shows pinyin for the current exercise', () => {
    render(
      <ArticlePractice
        article={articles[0]!}
        scheme={xiaohe}
        onComplete={vi.fn()}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText('ni hao ma')).toBeInTheDocument()
  })
})
