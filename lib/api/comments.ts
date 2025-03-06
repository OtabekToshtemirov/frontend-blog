import { api } from './axios';
import type { Comment } from '../types';

export async function getAllComments(page: number = 1, limit: number = 10): Promise<Comment[]> {
  const { data } = await api.get(`/comments?page=${page}&limit=${limit}`);
  return data;
}

export async function getComments(postSlug: string, page: number = 1, limit: number = 10): Promise<Comment[]> {
  const { data } = await api.get(`/posts/${postSlug}/comments?page=${page}&limit=${limit}`);
  return data;
}

export async function getPostComments(postSlug: string, page: number = 1, limit: number = 10): Promise<{ comments: Comment[]; total: number }> {
  const { data } = await api.get(`/posts/${postSlug}/comments?page=${page}&limit=${limit}`);
  return data;
}

export async function getLatestComments(limit: number = 5): Promise<Comment[]> {
  try {
    const { data } = await api.get(`/comments/latest?limit=${limit}`);
    return data;
  } catch (error) {
    console.error("Error fetching latest comments:", error);
    return [];
  }
}

export async function createComment(postSlug: string, text: string, anonymous: boolean = false): Promise<Comment> {
  const { data } = await api.post(`/posts/${postSlug}/comments`, {
    text,
    anonymous
  });
  return data;
}

export async function updateComment(commentId: string, text: string, anonymous: boolean = false): Promise<Comment> {
  const { data } = await api.patch(`/comments/${commentId}`, {
    text,
    anonymous
  });
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

// Add aliases for functions that might be used with different names
export const addComment = createComment;
export const editComment = updateComment;

