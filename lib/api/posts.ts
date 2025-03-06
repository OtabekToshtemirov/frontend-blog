import { api } from './axios';
import type { Post } from '../types';

export async function getPosts(sortBy?: string): Promise<Post[]> {
  try {
    // Map the sortBy values to what backend expects
    let sortParam = '';
    if (sortBy === 'popular') {
      sortParam = 'views';
    }
    
    const { data } = await api.get(`/posts${sortParam ? `?sortBy=${sortParam}` : ''}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const { data } = await api.get(`/posts/${slug}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch post ${slug}:`, error);
    return null;
  }
}

export async function getLatestPosts(limit: number = 5): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/latest?limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    return [];
  }
}

export async function getMostViewedPosts(limit: number = 5): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/popular?limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch popular posts:', error);
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
  return data;
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
  return data;
}

export async function deletePost(slug: string): Promise<void> {
  await api.delete(`/posts/${slug}`);
}

export async function likePost(slug: string): Promise<Post> {
  const { data } = await api.post(`/posts/${slug}/like`);
  return data;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const { data } = await api.get(`/posts/tag/${tag}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch posts for tag ${tag}:`, error);
    return [];
  }
}

export async function getLastTags(): Promise<{name: string, count: number}[]> {
  try {
    const { data } = await api.get('/tags');
    return data;
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

