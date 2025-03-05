"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function NotFound() {
  const { t, language } = useTranslation()
  
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">{t('page_not_found')}</p>
      <Button asChild>
        <Link href={`/${language}`}>{t('back_to_home')}</Link>
      </Button>
    </div>
  )
}