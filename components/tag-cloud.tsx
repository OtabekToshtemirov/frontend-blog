"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { getLastTags } from "@/lib/api/posts"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function TagCloud() {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getLastTags()
        setTags(data)
      } catch (error) {
        
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Sort tags by count and filter out empty tags
  const sortedTags = useMemo(() => {
    return tags
      .filter(tag => tag.name.trim().length > 0)
      .sort((a, b) => b.count - a.count)
  }, [tags])

  // Common container style with minimum height to prevent layout shift
  const containerClassName = "space-y-4 min-h-[120px]"

  if (isLoading) {
    return (
      <div className={containerClassName}>
        <h2 className="text-xl font-bold">{t('popular_tags')}</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>
    )
  }

  if (sortedTags.length === 0) {
    return (
      <div className={containerClassName}>
        <h2 className="text-xl font-bold">{t('popular_tags')}</h2>
        <p className="text-muted-foreground">{t('no_tags')}</p>
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <h2 className="text-xl font-bold">{t('popular_tags')}</h2>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Link 
            key={tag.name} 
            href={`/posts/tag/${encodeURIComponent(tag.name)}`}
            className="no-underline"
          >
            <Badge 
              variant="secondary" 
              className="hover:bg-secondary/80"
            >
              #{tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}

