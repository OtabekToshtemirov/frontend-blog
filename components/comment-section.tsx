"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Trash2, Loader2, User, MoreVertical, Edit } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/context/language-context"
import { useTranslation } from "@/hooks/use-translation"
import { formatTimeAgo } from "@/lib/utils"
import { getComments, addComment, editComment, deleteComment } from "@/lib/api/comments"
import type { Comment } from "@/lib/types"
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CommentSectionProps {
  postSlug: string
  initialComments: Comment[]
  onCommentCountChange?: (count: number) => void
}

export function CommentSection({ postSlug, initialComments, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const { language } = useLanguage()
  const { t } = useTranslation()

  // Commentlarni olish va sonini yangilash
  const fetchAndUpdateComments = async () => {
    setIsLoading(true)
    try {
      const data = await getComments(postSlug)
      setComments(data)
      onCommentCountChange?.(data.length)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndUpdateComments()
  }, [postSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (editingCommentId) {
        const updatedComment = await editComment(editingCommentId, newComment)
        const updatedComments = comments.map(comment => 
          comment._id === editingCommentId ? updatedComment : comment
        )
        setComments(updatedComments)
        setEditingCommentId(null)
        toast({
          title: "Comment updated",
          description: "Your comment has been updated successfully",
        })
      } else {
        const newCommentData = await addComment(postSlug, newComment, isAnonymous)
        const updatedComments = [newCommentData, ...comments]
        setComments(updatedComments)
        onCommentCountChange?.(updatedComments.length)
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
        })
      }
      setNewComment("")
      setIsAnonymous(false)
    } catch (error) {
      toast({
        title: "Error",
        description: editingCommentId ? "Failed to update comment" : "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id)
    setNewComment(comment.text)
  }

  const handleDelete = async (commentId: string) => {
    setIsDeleting(true)
    try {
      await deleteComment(commentId)
      const updatedComments = comments.filter(comment => comment._id !== commentId)
      setComments(updatedComments)
      onCommentCountChange?.(updatedComments.length)
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelEdit = () => {
    setEditingCommentId(null)
    setNewComment("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('comments')}</h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('comment_placeholder')}
            className="min-h-[100px]"
          />
          
          {!editingCommentId && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous-comment"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <Label htmlFor="anonymous-comment" className="text-sm cursor-pointer">
                {t('post_anonymously')}
              </Label>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingCommentId ? t('update_comment') : t('submit_comment')}
              </>
            ) : editingCommentId ? (
              t('update_comment')
            ) : (
              t('submit_comment')
            )}
          </Button>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-muted-foreground">{t('login_to_comment')}</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/login">{t('login')}</Link>
          </Button>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            {comment.anonymous ? (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author?.avatar || ""} />
                <AvatarFallback>{comment.author?.fullname.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {comment.anonymous ? comment.anonymousAuthor : comment.author?.fullname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(comment.createdAt, language)}
                  </p>
                </div>
                {/* Only show edit/delete if not anonymous and is author */}
                {!comment.anonymous && user && comment.author && user._id === comment.author._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(comment)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('update_comment')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('delete_comment')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

