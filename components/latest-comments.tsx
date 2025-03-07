"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { getLatestComments } from "@/lib/api/comments"
import type { Comment } from "@/lib/types"
import { MessageSquare, ArrowRight } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"
import { formatTimeAgo } from "@/lib/utils"

export function LatestComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const { language } = useLanguage()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getLatestComments(5)
        setComments(data)
      } catch (error) {
        console.error('Failed to fetch latest comments:', error)
        // Return empty array is already handled in getLatestComments
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg animate-pulse">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
              <Skeleton className="h-3 sm:h-4 w-24" />
              <Skeleton className="h-2.5 sm:h-3 w-full" />
              <div className="flex items-center gap-1 sm:gap-2">
                <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 shrink-0" />
                <Skeleton className="h-2.5 sm:h-3 w-2 sm:w-3 shrink-0" />
                <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-24 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">{t('no_comments')}</div>
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {comments.map((comment) => (
        <div key={comment._id} className="group">
          <Link 
            href={`/posts/${
              typeof comment.post === 'string' 
                ? comment.post 
                : comment.post?.slug || 'post-not-found'
            }`} 
            className="block p-2 sm:p-3 rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                <AvatarImage src={comment.author.avatar || ""} alt={comment.author.fullname} />
                <AvatarFallback>{comment.author.fullname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-medium truncate">{comment.author.fullname}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    {formatTimeAgo(comment.createdAt, language)}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">{comment.text}</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-primary group-hover:text-primary/80 transition-colors">
                  <span className="shrink-0">{t('view_post')}</span>
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                  <span className="font-medium truncate">
                    {typeof comment.post === 'object' && comment.post 
                      ? comment.post.title 
                      : comment.postTitle || t('no_posts')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}