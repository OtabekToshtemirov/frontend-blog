"use client"

import { useEffect, useState } from "react"
import { getPostsByTag } from "@/lib/api/posts"
import { PostList } from "@/components/post-list"
import { useTranslation } from "@/hooks/use-translation"
import type { Post } from "@/lib/types"

export default function TagPage({ params }: { params: { tag: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const { tag } = params

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsByTag(tag)
        setPosts(data)
      } catch (error) {
        console.error("Failed to fetch posts by tag:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [tag])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">#{tag}</h1>
      <PostList posts={posts} isLoading={isLoading} />
    </div>
  )
}