export interface User {
  _id: string
  fullname: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  _id: string
  title: string
  description: string
  slug: string
  photo?: string[]
  author: User
  tags: string[]
  likes: string[]
  views: number
  isPublished: boolean
  comments: Comment[]
  createdAt: string
  updatedAt: string
  anonymous?: boolean
  anonymousAuthor?: string
}

export interface Comment {
  _id: string
  text: string
  author: User
  post: string
  createdAt: string
  updatedAt: string
  anonymous?: boolean
  anonymousAuthor?: string
}

// Add the missing types used in posts.ts
export interface PostCreateInput {
  title: string
  description: string
  photo?: string[]
  tags: string[]
  isPublished?: boolean
}

export interface PostUpdateInput extends PostCreateInput {}

