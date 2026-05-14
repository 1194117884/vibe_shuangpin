import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PhraseHome } from './PhraseHome'

describe('PhraseHome', () => {
  it('renders all phrase categories', () => {
    render(<PhraseHome onSelectCategory={() => {}} onBack={() => {}} />)
    expect(screen.getByText('日常动词')).toBeInTheDocument()
    expect(screen.getByText('日常名词')).toBeInTheDocument()
    expect(screen.getByText('出行旅游')).toBeInTheDocument()
  })

  it('calls onSelectCategory when clicking a category', () => {
    const onSelectCategory = vi.fn()
    render(<PhraseHome onSelectCategory={onSelectCategory} onBack={() => {}} />)
    fireEvent.click(screen.getByText('日常动词'))
    expect(onSelectCategory).toHaveBeenCalledWith('daily-verbs')
  })

  it('calls onBack when back is clicked', () => {
    const onBack = vi.fn()
    render(<PhraseHome onSelectCategory={() => {}} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: '返回' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
