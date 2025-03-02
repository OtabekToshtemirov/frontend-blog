"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Language } from "@/lib/constants"
import { DEFAULT_LANGUAGE } from "@/lib/constants"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLang?: Language
}

export function LanguageProvider({ children, initialLang = DEFAULT_LANGUAGE }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLang)

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && savedLang !== language) {
      setLanguage(savedLang)
    } else {
      localStorage.setItem("language", language)
    }
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // Update URL to reflect language change
    const pathname = window.location.pathname
    const newPathname = pathname.replace(/^\/(uz|en|ru)/, `/${lang}`)
    window.location.href = newPathname
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}