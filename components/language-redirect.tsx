'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { DEFAULT_LANGUAGE } from '@/lib/constants'

export function LanguageRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      router.replace(`/${DEFAULT_LANGUAGE}`)
    }
  }, [pathname, router])

  return null
}