"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { likePost, deletePost } from "@/lib/api/posts"
import { formatTimeAgo, formatCount, cn } from "@/lib/utils"
import type { Post } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTranslation } from "@/hooks/use-translation"

interface PostDetailProps {
  post: Post
  commentCount?: number
}

export function PostDetail({ post, commentCount = 0 }: PostDetailProps) {
  const [currentPost, setCurrentPost] = useState(post)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { user } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()

  const isAuthor = user && user._id === currentPost.author._id
  const hasLiked = user && currentPost.likes.includes(user._id)

  const handleLike = async () => {
    if (!user) {
      toast({
        title: t('auth_like_required'),
        description: t('auth_like_message'),
        variant: "destructive",
      })
      return
    }

    setIsLiking(true)
    try {
      const updatedPost = await likePost(currentPost.slug)
      setCurrentPost(updatedPost)
      // Optimistically update likes count
      const newLikes = currentPost.likes.includes(user._id)
        ? currentPost.likes.filter(id => id !== user._id)
        : [...currentPost.likes, user._id]
      setCurrentPost(prev => ({ ...prev, likes: newLikes }))
    } catch (error) {
      toast({
        title: t('like_failed'),
        description: t('like_error'),
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePost(currentPost.slug)
      toast({
        title: t('success'),
        description: t('delete_post_success'),
      })
      router.push("/")
    } catch (error) {
      toast({
        title: t('error'),
        description: t('delete_post_error'),
        variant: "destructive",
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">{currentPost.title}</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentPost.anonymous ? (
            <div>
              <p className="font-medium">{currentPost.anonymousAuthor}</p>
              <p className="text-sm text-muted-foreground">
                {formatTimeAgo(currentPost.createdAt, language)}
              </p>
            </div>
          ) : (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentPost.author.avatar || ""} alt={currentPost.author.fullname} />
                <AvatarFallback>{currentPost.author.fullname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentPost.author.fullname}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTimeAgo(currentPost.createdAt, language)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Show edit/delete buttons only if not anonymous and is author */}
        {!currentPost.anonymous && isAuthor && (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/edit/${currentPost.slug}`}>
                <Edit className="h-4 w-4 mr-1" />
                {t('edit_button')}
              </Link>
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('delete_button')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete_post_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('delete_post_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? t('deleting_post') : t('delete_button')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {currentPost.photo && currentPost.photo.length > 0 && (
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${currentPost.photo[0]}`}
            alt={currentPost.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {currentPost.tags.map((tag) => (
          <Link href={`/posts/tag/${encodeURIComponent(tag)}`} key={tag}>
            <Badge variant="secondary" className="hover:bg-secondary/80">
              #{tag}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{currentPost.description}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={handleLike}
          disabled={isLiking}
        >
          <div className="flex items-center gap-1 group">
            {isLiking ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Heart 
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-all",
                  "group-hover:scale-110 group-hover:text-red-500",
                  hasLiked && "fill-current text-red-500"
                )} 
              />
            )}
            <span className="text-xs sm:text-sm group-hover:text-red-500 transition-colors">
              <span className="hidden sm:inline">{formatCount(currentPost.likes.length, 'n_likes', language)}</span>
              <span className="sm:hidden">{currentPost.likes.length}</span>
            </span>
          </div>
        </Button>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">
            <span className="hidden sm:inline">{formatCount(commentCount, 'n_comments', language)}</span>
            <span className="sm:hidden">{commentCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">
            <span className="hidden sm:inline">{formatCount(currentPost.views, 'n_views', language)}</span>
            <span className="sm:hidden">{currentPost.views}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

