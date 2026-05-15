import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      dark: false,
      toggle: () => set(s => {
        const next = !s.dark
        if (next) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
        return { dark: next }
      }),
    }),
    { name: 'shinny-theme' }
  )
)

export function initTheme() {
  const stored = JSON.parse(localStorage.getItem('shinny-theme') || '{}')
  if (stored?.state?.dark) document.documentElement.classList.add('dark')
}
