"use client"

import { useState, useEffect } from "react"
import { PostList } from "@/components/post-list"
import { useTranslation } from "@/hooks/use-translation"
import { getPostsByTag } from "@/lib/api/posts"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { Post } from "@/lib/types"

interface TagPageClientProps {
  initialPosts: Post[]
  tag: string
  error?: boolean
}

export function TagPageClient({ initialPosts, tag, error: initialError }: TagPageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<boolean>(initialError || false)
  const { t } = useTranslation()
  const { toast } = useToast()

  useEffect(() => {
    // If we have initial posts and no error, don't fetch again
    if (initialPosts.length > 0 && !initialError) return

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const data = await getPostsByTag(tag)
        setPosts(data)
        setError(false)
      } catch (error) {
        
        setError(true)
        toast({
          title: t('error'),
          description: t('fetch_posts_error'),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [tag, initialPosts, initialError, t, toast])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('loading_posts')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        {t('fetch_posts_error')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">#{tag}</h1>
      <PostList posts={posts} isLoading={isLoading} />
    </div>
  )
}