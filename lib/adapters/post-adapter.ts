import type { Post, User } from '../types';

/**
 * Post adapter functions for handling different backend API response formats
 */

interface BackendPostResponse {
  _id: string;
  title: string;
  description: string;
  slug: string;
  photo: string[];
  tags: string[];
  views: number;
  likes: any; // Bu API dan turli formatlarda kelishi mumkin
  likesCount?: number;
  commentsCount?: number;
  author: User | string;
  anonymous: boolean;
  anonymousAuthor?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get likes as an array, regardless of how the backend provided them
 */
export function getLikesArray(post: Post | BackendPostResponse): string[] {
  if (!post.likes) return [];
  if (Array.isArray(post.likes)) return post.likes;
  return [];
}

/**
 * Get likes count from different possible formats
 */
export function getLikesCount(post: Post | BackendPostResponse): number {
  if (typeof post.likes === 'number') return post.likes;
  if (typeof post.likesCount === 'number') return post.likesCount;
  if (post.stats?.likeCount !== undefined) return post.stats.likeCount;
  if (Array.isArray(post.likes)) return post.likes.length;
  return 0;
}

/**
 * Check if current user has liked the post - Backend API likes sonini qaytarganligi 
 * sababli, foydalanuvchi like bosgani yoki yo'qligini amalda bilish mumkin emas
 */
export function isPostLikedByUser(post: Post | BackendPostResponse, userId?: string): boolean {
  if (!userId) return false;
  
  // Agar likes array bo'lsa, tekshiramiz
  if (Array.isArray(post.likes)) {
    return post.likes.includes(userId);
  }
  
  // Aks holda false qaytarish kerak, chunki aslida bilmaymiz
  return false;
}

/**
 * Transform backend post response to frontend Post model
 */
export function adaptPost(backendPost: BackendPostResponse): Post {
  // Make sure likes is always an array in our frontend model
  let likes: string[] = [];
  if (Array.isArray(backendPost.likes)) {
    likes = backendPost.likes;
  }
  
  // Calculate likes count from available data
  const likeCount = typeof backendPost.likes === 'number' ? backendPost.likes : 
                    typeof backendPost.likesCount === 'number' ? backendPost.likesCount : 
                    Array.isArray(backendPost.likes) ? backendPost.likes.length : 0;

  // Base post properties with proper type conversions
  const adaptedPost: Post = {
    ...backendPost,
    likes, // Array sifatida saqlash
    // Include additional properties like stats if needed
    stats: {
      likeCount,
      viewCount: backendPost.views,
      commentCount: backendPost.commentsCount || 0
    }
  };

  return adaptedPost;
}

/**
 * Transform multiple posts
 */
export function adaptPosts(backendPosts: BackendPostResponse[]): Post[] {
  return backendPosts.map(adaptPost);
}