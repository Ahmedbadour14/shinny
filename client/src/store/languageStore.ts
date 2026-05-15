import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n'

interface LangState {
  lang: 'en' | 'ar'
  setLang: (lang: 'en' | 'ar') => void
}

export const useLangStore = create<LangState>()(
  persist(
    set => ({
      lang: 'en',
      setLang: lang => {
        i18n.changeLanguage(lang)
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
        set({ lang })
      },
    }),
    { name: 'shinny-lang' }
  )
)
