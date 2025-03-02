"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getLastTags } from "@/lib/api/posts"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/hooks/use-translation"

export function TagCloud() {
  const [tags, setTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true)
      try {
        const data = await getLastTags()
        setTags(data)
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-5 sm:h-6 w-14 sm:w-16" />
        ))}
      </div>
    )
  }

  if (tags.length === 0) {
    return <div className="text-center py-2 text-sm text-muted-foreground">{t('no_tags')}</div>
  }

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {tags.map((tag) => (
        <Link href={`/posts/tag/${encodeURIComponent(tag)}`} key={tag}>
          <Badge 
            variant="secondary" 
            className="text-[10px] leading-relaxed sm:text-xs hover:bg-secondary/80 whitespace-nowrap transition-colors px-2 py-0 sm:px-2.5 sm:py-0.5"
          >
            #{tag}
          </Badge>
        </Link>
      ))}
    </div>
  )
}

