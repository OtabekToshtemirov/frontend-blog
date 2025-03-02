"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Eye, Edit, Trash2 } from "lucide-react"
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

  const isAuthor = user && user._id === currentPost.author._id
  const hasLiked = user && currentPost.likes.includes(user._id)

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
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
        title: "Error",
        description: "Failed to like the post",
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
        title: "Success",
        description: "Post deleted successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post",
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
        </div>

        {isAuthor && (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/edit/${currentPost.slug}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
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

      <div className="flex items-center gap-6 pt-4 border-t">
        <Button 
          variant={hasLiked ? "default" : "outline"} 
          size="sm" 
          onClick={handleLike} 
          disabled={isLiking || !user}
          className="transition-all duration-200"
        >
          <Heart className={`h-4 w-4 mr-1 transition-all duration-200 ${hasLiked ? "fill-current" : ""}`} />
          {formatCount(currentPost.likes.length, 'n_likes', language)}
        </Button>

        <div className="flex items-center gap-1 text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>
            {formatCount(commentCount, 'n_comments', language)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>
            {formatCount(currentPost.views, 'n_views', language)}
          </span>
        </div>
      </div>
    </article>
  )
}

