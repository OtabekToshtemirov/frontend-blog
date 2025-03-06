import type { Metadata } from "next"
import type { Language } from "@/lib/constants"
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata"

// Generate dynamic metadata for each tag page
export async function generateMetadata({ params }: { params: { tag: string; lang: Language } }): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag)
  return {
    ...generateSiteMetadata(params.lang),
    title: `#${tag} - Posts`,
    description: `Posts tagged with #${tag}`,
    openGraph: {
      title: `#${tag} - Posts`,
      description: `Posts tagged with #${tag}`,
    },
  }
}

"use client"

import { useState, useEffect } from "react"
import { PostList } from "@/components/post-list"
import { useTranslation } from "@/hooks/use-translation"
import { getPostsByTag } from "@/lib/api/posts"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Post } from "@/lib/types"

export default function TagPage({ params }: { params: { tag: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const { toast } = useToast()
  const tag = decodeURIComponent(params.tag)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getPostsByTag(tag)
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setError(t('fetch_posts_error'))
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
  }, [tag, t, toast])

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
        {error}
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