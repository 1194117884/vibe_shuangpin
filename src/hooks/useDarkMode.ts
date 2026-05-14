import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'vibe-shuangpin-dark-mode'

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem(STORAGE_KEY, String(dark))
  }, [dark])

  const toggle = useCallback(() => setDark(d => !d), [])

  return [dark, toggle]
}
