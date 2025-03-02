"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Trash2, Loader2 } from "lucide-react"
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

interface CommentSectionProps {
  postSlug: string
  onCommentCountChange?: (count: number) => void
}

export function CommentSection({ postSlug, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [editingComment, setEditingComment] = useState<{ id: string; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      })
      return
    }

    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (editingComment) {
        const updatedComment = await editComment(editingComment.id, commentText)
        const updatedComments = comments.map(comment => 
          comment._id === editingComment.id ? updatedComment : comment
        )
        setComments(updatedComments)
        setEditingComment(null)
        toast({
          title: "Comment updated",
          description: "Your comment has been updated successfully",
        })
      } else {
        const newComment = await addComment(postSlug, commentText)
        const updatedComments = [newComment, ...comments]
        setComments(updatedComments)
        onCommentCountChange?.(updatedComments.length)
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
        })
      }
      setCommentText("")
    } catch (error) {
      toast({
        title: "Error",
        description: editingComment ? "Failed to update comment" : "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (comment: Comment) => {
    setEditingComment({ id: comment._id, text: comment.text })
    setCommentText(comment.text)
  }

  const handleDeleteComment = async (commentId: string) => {
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
    setEditingComment(null)
    setCommentText("")
  }

  return (
    <div className="space-y-6">
      {user ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder={t('write_comment')}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingComment ? t('update_comment') : t('submit_comment')}
                </>
              ) : (
                editingComment ? t('update_comment') : t('submit_comment')
              )}
            </Button>
            {editingComment && (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                {t('cancel')}
              </Button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-lg text-center">
          {t('login_to_comment')}{" "}
          <Button variant="link" className="p-0" asChild>
            <a href="/login">{t('login')}</a>
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('loading_comments')}</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || ""} alt={comment.author.fullname} />
                    <AvatarFallback>{comment.author.fullname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{comment.author.fullname}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.createdAt, language)}
                    </p>
                  </div>
                </div>
                {user && user._id === comment.author._id && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditComment(comment)}
                      className="h-8 px-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('delete_comment')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('delete_confirm')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteComment(comment._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? 
                              <Loader2 className="h-4 w-4 animate-spin" /> : 
                              t('delete_comment')
                            }
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          {t('no_comments')}
        </div>
      )}
    </div>
  )
}

