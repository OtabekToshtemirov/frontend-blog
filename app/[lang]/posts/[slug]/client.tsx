"use client"

import { useState } from "react"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"
import type { Post } from "@/lib/types"
import { useTranslation } from "@/hooks/use-translation"

export function ClientPost({ initialPost, postSlug }: { initialPost: Post; postSlug: string }) {
  const [post, setPost] = useState(initialPost)
  const [commentCount, setCommentCount] = useState(0)
  const { t } = useTranslation()

  const handleCommentCountChange = (count: number) => {
    setCommentCount(count)
    // Update post state without relying on comments array
    setPost(prev => ({
      ...prev,
      comments: [] // Keep the array empty as we're using separate count
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PostDetail post={post} commentCount={commentCount} />
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">{t('comments')} ({commentCount})</h2>
        <CommentSection 
          postSlug={postSlug} 
          onCommentCountChange={handleCommentCountChange}
        />
      </div>
    </div>
  )
}