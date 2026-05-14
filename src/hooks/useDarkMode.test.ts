import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('starts with light mode by default', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current[0]).toBe(false)
  })

  it('toggles dark mode', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => result.current[1]())
    expect(result.current[0]).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('toggles back to light mode', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => result.current[1]())
    act(() => result.current[1]())
    expect(result.current[0]).toBe(false)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useDarkMode())
    act(() => result.current[1]())
    expect(localStorage.getItem('vibe-shuangpin-dark-mode')).toBe('true')
  })

  it('reads persisted value from localStorage', () => {
    localStorage.setItem('vibe-shuangpin-dark-mode', 'true')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current[0]).toBe(true)
  })

  it('sets data-theme attribute on mount', () => {
    renderHook(() => useDarkMode())
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
