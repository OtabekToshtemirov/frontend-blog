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
  slug: string
  description: string
  photo: string[]
  author: User
  tags: string[]
  likes: string[]
  views: number
  comments: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  text: string
  author: User
  post: Post | string // Can be either a Post object or a slug string
  postTitle?: string // Optional post title for the latest comments view
  createdAt: string
  updatedAt: string
}

