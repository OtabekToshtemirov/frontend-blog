"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Eye, Edit, Trash2, Loader2, User } from "lucide-react"
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
import { isPostLikedByUser, getLikesCount } from "@/lib/adapters/post-adapter"

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

  const isAuthor = user && user._id === currentPost.author._id && !currentPost.anonymous
  const hasLiked = user ? isPostLikedByUser(currentPost, user._id) : false;

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
      // O'zgartirilgan postni olish
      const updatedPost = await likePost(currentPost.slug)
      // Adapteri to'g'ri ishlagan bo'lsa, post ma'lumotlari to'g'ri formatda bo'lishi kerak
      setCurrentPost(updatedPost)
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

  // Stats obyektidan ma'lumotlarni adapter orqali olish
  const likeCount = getLikesCount(currentPost);
  const viewCount = currentPost.stats?.viewCount !== undefined 
    ? currentPost.stats.viewCount 
    : currentPost.views;

  return (
    <article className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">{currentPost.title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPost.anonymous ? (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{currentPost.anonymousAuthor || t('anonymous_user')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(currentPost.createdAt, language)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentPost.author.avatar || ""} />
                  <AvatarFallback>{currentPost.author.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentPost.author.fullname}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(currentPost.createdAt, language)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {isAuthor && (
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
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted">
            <Image
              src={currentPost.photo[0].startsWith('http') 
                ? currentPost.photo[0] 
                : `${process.env.NEXT_PUBLIC_API_URL}${currentPost.photo[0]}`}
              alt={currentPost.title}
              fill
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIj48L3JlY3Q+PC9zdmc+"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <span className="hidden sm:inline">{formatCount(likeCount, 'n_likes', language)}</span>
                <span className="sm:hidden">{likeCount}</span>
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
              <span className="hidden sm:inline">{formatCount(viewCount, 'n_views', language)}</span>
              <span className="sm:hidden">{viewCount}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

