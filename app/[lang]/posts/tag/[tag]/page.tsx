"use client"

import { useState, useEffect } from "react"
import { PostList } from "@/components/post-list"
import { useTranslation } from "@/hooks/use-translation"
import { getPostsByTag } from "@/lib/api/posts"
import type { Post } from "@/lib/types"

export default function TagPage({ params }: { params: { tag: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const tag = decodeURIComponent(params.tag)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsByTag(tag)
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [tag])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">#{tag}</h1>
      <PostList posts={posts} isLoading={isLoading} />
    </div>
  )
}