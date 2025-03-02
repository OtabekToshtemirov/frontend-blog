"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, Eye, Loader2 } from "lucide-react"
import { getPosts, getPostsByTag, likePost, type SortBy } from "@/lib/api/posts"
import { getComments } from "@/lib/api/comments"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import type { Post } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"
import { formatTimeAgo, formatCount } from "@/lib/utils"

interface PostListProps {
  tag?: string
}

export function PostList({ tag }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('latest')
  const [likingPostId, setLikingPostId] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const { t } = useTranslation()
  const { language } = useLanguage()

  // Fetch comment counts for each post
  const fetchCommentCounts = async (fetchedPosts: Post[]) => {
    const counts: Record<string, number> = {};
    await Promise.all(
      fetchedPosts.map(async (post) => {
        try {
          const comments = await getComments(post.slug);
          counts[post._id] = comments.length;
        } catch (error) {
          console.error(`Failed to fetch comments for post ${post.slug}:`, error);
          counts[post._id] = 0;
        }
      })
    );
    setCommentCounts(counts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const data = tag ? await getPostsByTag(tag) : await getPosts(sortBy)
        console.log(data)
        setPosts(data)
        fetchCommentCounts(data)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [tag, sortBy])

  const handleLike = async (post: Post) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    setLikingPostId(post._id)
    try {
      const updatedPost = await likePost(post.slug)
      setPosts(posts.map(p => p._id === post._id ? updatedPost : p))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the post",
        variant: "destructive",
      })
    } finally {
      setLikingPostId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('loading_posts')}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="text-center py-10">{t('no_posts')}</div>
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {!tag && (
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <Button 
            variant={sortBy === 'latest' ? "default" : "outline"}
            onClick={() => setSortBy('latest')}
            className="transition-all flex-1 sm:flex-none text-sm"
            size="sm"
          >
            {t('latest_posts')}
          </Button>
          <Button 
            variant={sortBy === 'popular' ? "default" : "outline"}
            onClick={() => setSortBy('popular')}
            className="transition-all flex-1 sm:flex-none text-sm"
            size="sm"
          >
            {t('popular_posts')}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="overflow-hidden hover:shadow-md transition-shadow">
            {post.photo && post.photo.length > 0 && (
              <div className="relative h-40 sm:h-48 md:h-40 lg:h-48 overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${post.photo[0]}`}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 33vw"
                />
              </div>
            )}

            <CardContent className="p-3 sm:p-4">
              <Link href={`/posts/${post.slug}`}>
                <CardTitle className="mb-3 sm:mb-4 hover:text-primary transition-colors line-clamp-2 text-base sm:text-lg">
                  {post.title}
                </CardTitle>
              </Link>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src={post.author.avatar || ""} alt={post.author.fullname} />
                  <AvatarFallback>{post.author.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs sm:text-sm font-medium">{post.author.fullname}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {formatTimeAgo(post.createdAt, language)}
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 prose prose-xs sm:prose-sm dark:prose-invert">
                <ReactMarkdown>{post.description}</ReactMarkdown>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                {post.tags.map((tag) => (
                  <Link href={`/posts/tag/${encodeURIComponent(tag)}`} key={tag}>
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-secondary/80 text-[10px] sm:text-xs px-2 py-0 sm:px-2.5 sm:py-0.5"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 sm:mt-4 sm:pt-4 border-t">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleLike(post)}
                    disabled={likingPostId === post._id}
                  >
                    <div className="flex items-center gap-1 text-muted-foreground group">
                      {likingPostId === post._id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Heart 
                          className={cn(
                            "h-3 w-3 sm:h-4 sm:w-4 transition-all",
                            "group-hover:scale-110 group-hover:text-red-500",
                            user && post.likes.includes(user._id) && "fill-current text-red-500"
                          )} 
                        />
                      )}
                      <span className="text-[10px] sm:text-xs group-hover:text-red-500 transition-colors">
                        {formatCount(post.likes.length, 'n_likes', language)}
                      </span>
                    </div>
                  </Button>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-[10px] sm:text-xs">
                      {formatCount(commentCounts[post._id] || 0, 'n_comments', language)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-[10px] sm:text-xs">
                      {formatCount(post.views, 'n_views', language)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

