"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { AuthProvider } from "@/context/auth-context"
import { LanguageProvider } from "@/context/language-context"
import { GoogleAnalytics } from "@/components/google-analytics"
import Head from 'next/head';
import type { Language } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutContentProps {
  children: React.ReactNode
  lang: Language
}

export function RootLayoutContent({ children, lang }: RootLayoutContentProps) {
  const canonicalUrl = `https://otablog.uz${typeof window !== 'undefined' ? window.location.pathname : ''}`

  return (
    <html lang={lang} suppressHydrationWarning>
    <head>
      <GoogleAnalytics />
      <link rel="canonical" href={canonicalUrl} />
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
                <footer className="border-t py-6">
                  <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Otablog. All rights reserved.
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