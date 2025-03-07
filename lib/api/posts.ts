import { api } from './axios';
import type { Post, PaginatedResponse } from '../types';
import { adaptPost, adaptPosts } from '../adapters/post-adapter';

export async function getPosts(sortBy?: string): Promise<Post[]> {
  try {
    // Map the sortBy values to what backend expects
    let sortParam = '';
    if (sortBy === 'popular') {
      sortParam = 'views';
    }
    
    const { data } = await api.get(`/posts${sortParam ? `?sortBy=${sortParam}` : ''}`);
    
    // Yangi response formatiga moslashish - agar posts maydoni mavjud bo'lsa, uni qaytarish
    if (data && data.posts && Array.isArray(data.posts)) {
      return adaptPosts(data.posts);
    }
    
    // Eski format uchun - agar data o'zi array bo'lsa
    if (Array.isArray(data)) {
      return adaptPosts(data);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Pagination bilan ishlaydigan alohida funksiya
export async function getPostsPaginated(page: number = 1, limit: number = 10, sortBy?: string): Promise<PaginatedResponse<Post>> {
  try {
    // Map the sortBy values to what backend expects
    let sortParam = '';
    if (sortBy === 'popular') {
      sortParam = 'views';
    }
    
    const { data } = await api.get(`/posts?page=${page}&limit=${limit}${sortParam ? `&sortBy=${sortParam}` : ''}`);
    
    if (data && data.posts && data.pagination) {
      return {
        posts: adaptPosts(data.posts),
        pagination: data.pagination
      };
    }
    
    // Agar response to'g'ri formatda bo'lmasa
    return {
      posts: Array.isArray(data) ? adaptPosts(data) : [],
      pagination: {
        total: 0,
        page,
        limit,
        pages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching paginated posts:', error);
    return {
      posts: [],
      pagination: {
        total: 0,
        page,
        limit,
        pages: 0
      }
    };
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await api.get(`/posts/${slug}`);
    return data ? adaptPost(data) : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data } = await api.get(`/posts/${slug}`);
  return adaptPost(data);
}

export async function getLatestPosts(limit: number = 5): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/latest?limit=${limit}`);
    return Array.isArray(data) ? adaptPosts(data) : [];
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export async function getMostViewedPosts(limit: number = 5): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/popular?limit=${limit}`);
    return Array.isArray(data) ? adaptPosts(data) : [];
  } catch (error) {
    console.error('Error fetching most viewed posts:', error);
    return [];
  }
}

export async function createPost(postData: {
  title: string;
  description: string;
  tags?: string[];
  photo?: string[];
  anonymous?: boolean;
  isPublished?: boolean;
}): Promise<Post> {
  const { data } = await api.post('/posts', postData);
  return adaptPost(data);
}

export async function updatePost(
  slug: string,
  postData: {
    title?: string;
    description?: string;
    tags?: string[];
    photo?: string[];
    anonymous?: boolean;
    isPublished?: boolean;
  }
): Promise<Post> {
  const { data } = await api.patch(`/posts/${slug}`, postData);
  return adaptPost(data);
}

export async function deletePost(slug: string): Promise<void> {
  await api.delete(`/posts/${slug}`);
}

export async function likePost(slug: string): Promise<Post> {
  const { data } = await api.post(`/posts/${slug}/like`);
  return adaptPost(data);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/tag/${tag}`);
    return Array.isArray(data) ? adaptPosts(data) : [];
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

export async function getLastTags(): Promise<{name: string, count: number}[]> {
  try {
    const { data } = await api.get('/tags');
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

