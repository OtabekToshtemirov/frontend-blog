import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"
import type { Language } from "@/lib/constants"

export function useTranslation() {
  const { language } = useLanguage()
  const t = (key: keyof typeof translations[Language]) => {
    const translation = translations[language][key]
    return typeof translation === 'function' ? translation(1) : translation
  }
  return { t, language }
}