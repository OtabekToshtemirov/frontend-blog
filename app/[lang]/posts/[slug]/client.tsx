'use client'

import { useState } from "react"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"
import type { Post, Comment } from "@/lib/types"
import { useTranslation } from "@/hooks/use-translation"

interface ClientPageProps {
  post: Post
  initialComments: Comment[]
}

export function ClientPage({ post, initialComments }: ClientPageProps) {
  const [commentCount, setCommentCount] = useState(initialComments.length)
  const { t } = useTranslation()

  return (
    <div className="container space-y-8 py-6">
      <PostDetail post={post} commentCount={commentCount} />
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">{t('comments')} ({commentCount})</h2>
        <CommentSection 
          postSlug={post.slug} 
          initialComments={initialComments}
          onCommentCountChange={setCommentCount}
        />
      </div>
    </div>
  )
}