import { api } from './axios';
import type { Post, PostCreateInput, PostUpdateInput } from '../types';

export type SortBy = 'latest' | 'popular';

// Define the TagCount interface
export interface TagCount {
  name: string;
  count: number;
}

export async function getAllPosts(page: number = 1, limit: number = 10, sortBy: 'latest' | 'popular' = 'latest'): Promise<{ posts: Post[]; total: number }> {
  const { data } = await api.get(`/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
  return data;
}

export async function getPosts(sortBy: SortBy = 'latest'): Promise<Post[]> {
  const { data } = await api.get(`/posts?sortBy=${sortBy}`);
  return data;
}

export async function getLatestPosts(limit?: number): Promise<Post[]> {
  const { data } = await api.get(`/posts/latest${limit ? `?limit=${limit}` : ''}`);
  return data;
}

export async function getMostViewedPosts(limit?: number): Promise<Post[]> {
  const { data } = await api.get(`/posts/popular${limit ? `?limit=${limit}` : ''}`);
  return data;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const cleanTag = tag.replace(/^#/, ''); // Remove # if exists
  const { data } = await api.get(`/posts/tag/${encodeURIComponent(cleanTag)}`);
  return data;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
}

// Add alias for getPostBySlug as getPost
export const getPost = getPostBySlug;

export async function createPost(postData: PostCreateInput & { anonymous?: boolean }): Promise<Post> {
  const { data } = await api.post('/posts', {
    ...postData,
    anonymous: postData.anonymous ?? false,
  });
  return data;
}

export async function updatePost(slug: string, postData: PostUpdateInput & { anonymous?: boolean }): Promise<Post> {
  const { data } = await api.patch(`/posts/${slug}`, {
    ...postData,
    anonymous: postData.anonymous ?? false,
  });
  return data;
}

export async function deletePost(slug: string): Promise<void> {
  await api.delete(`/posts/${slug}`);
}

export async function likePost(slug: string): Promise<Post> {
  const { data } = await api.post(`/posts/${slug}/like`);
  return data;
}

export async function getPopularTags(): Promise<TagCount[]> {
  const { data } = await api.get('/tags');
  return data;
}

// Add the getLastTags function that's being used in tag-cloud.tsx
export async function getLastTags(): Promise<string[]> {
  const tags = await getPopularTags();
  return tags.map(tag => tag.name);
}

