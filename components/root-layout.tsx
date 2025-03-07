"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { AuthProvider } from "@/context/auth-context"
import { LanguageProvider } from "@/context/language-context"
import { GoogleAnalytics } from "@/components/google-analytics"
import type { Language } from "@/lib/constants"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutContentProps {
  children: React.ReactNode
  lang: Language
}

export function RootLayoutContent({ children, lang }: RootLayoutContentProps) {
  const pathname = usePathname()
  
  // Create absolute URL for canonical and hreflang tags
  const baseUrl = "https://otablog.uz"
  
  // Get path without language prefix for hreflang alternates
  const pathWithoutLang = useMemo(() => {
    // Remove language prefix from path
    if (pathname === `/${lang}`) return "/"
    if (pathname.startsWith(`/${lang}/`)) {
      return pathname.substring(lang.length + 1)
    }
    return pathname
  }, [pathname, lang])
  
  // Build canonical URL - current page with language
  const canonicalUrl = `${baseUrl}${pathname}`
  
  // Generate hreflang URLs for all supported languages
  const hreflangUrls = {
    en: `${baseUrl}${lang === "en" ? pathname : `/en${pathWithoutLang}`}`,
    uz: `${baseUrl}${lang === "uz" ? pathname : `/uz${pathWithoutLang}`}`,
    ru: `${baseUrl}${lang === "ru" ? pathname : `/ru${pathWithoutLang}`}`,
  }

  return (
    <html lang={lang} suppressHydrationWarning>
    <head>
      <GoogleAnalytics />
      {/* Canonical URL - always point to the current page URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags with absolute URLs */}
      <link rel="alternate" hrefLang="en" href={hreflangUrls.en} />
      <link rel="alternate" hrefLang="uz" href={hreflangUrls.uz} />
      <link rel="alternate" hrefLang="ru" href={hreflangUrls.ru} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
      
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:site_name" content="Otablog" />
      <meta property="og:locale" content={lang} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@otablog" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLang={lang}>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
                <footer className="border-t py-6 min-h-[60px]">
                  <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Otablog. All rights reserved. Built with ❤️ in Uzbekistan by <a href="https://otabekengineer.site" className="text-primary">Otabek</a>
                  </div>
                </footer>
              </div>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}