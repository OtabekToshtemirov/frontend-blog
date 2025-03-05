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

// Fix getPosts function to handle response structure correctly
export async function getPosts(sortBy: SortBy = 'latest', page: number = 1, limit: number = 10): Promise<Post[]> {
  const { data } = await api.get(`/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
  return data; // The backend returns the posts array directly
}

// Add the getPostsByTag function that's also used in post-list.tsx
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
  const { data } = await api.post('/posts', postData);
  return data;
}

export async function updatePost(slug: string, postData: PostUpdateInput & { anonymous?: boolean }): Promise<Post> {
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

export async function getPopularTags(): Promise<{ name: string; count: number }[]> {
  const { data } = await api.get('/tags');
  return data;
}

// Add the getLastTags function that's being used in tag-cloud.tsx
export async function getLastTags(): Promise<string[]> {
  const tags = await getPopularTags();
  return tags.map(tag => tag.name);
}

