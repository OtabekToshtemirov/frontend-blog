export interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  slug: string;
  photo: string[];
  tags: string[];
  views: number;
  likes: string[];
  author: User;
  stats?: {
    likeCount: number;
    viewCount: number;
    commentCount: number;
  };
  anonymous: boolean;
  anonymousAuthor?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  post: string | Post;
  author: User | null;
  anonymous: boolean;
  anonymousAuthor?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortBy = 'latest' | 'popular';

export interface PostCreateInput {
  title: string;
  description: string;
  photo?: string[];
  tags: string[];
  isPublished?: boolean;
}

export interface PostUpdateInput extends PostCreateInput {}

// Yangi interfeys: pagination bilan ishlash uchun
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  posts: T[];
  pagination: Pagination;
}

