import { redirect } from "next/navigation"
import { DEFAULT_LANGUAGE } from "@/lib/constants"
import { LanguageProvider } from "@/context/language-context"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root darajadagi page uchun default tilga redirect qilamiz
  if (typeof window !== 'undefined') {
    redirect(`/${DEFAULT_LANGUAGE}`)
  }
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}