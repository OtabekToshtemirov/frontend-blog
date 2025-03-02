import type { Post } from "@/lib/types"
import { API_URL } from "@/lib/constants"

export type SortBy = 'latest' | 'popular';

// Define the TagCount interface
export interface TagCount {
  name: string;
  count: number;
}

export async function getPosts(sortBy: SortBy = 'latest'): Promise<Post[]> {
  return getAllPosts();
}

export async function getPost(slug: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${slug}`)

  if (!response.ok) {
    throw new Error("Failed to fetch post")
  }

  return await response.json()
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts/tag/${encodeURIComponent(tag)}`)

  if (!response.ok) {
    throw new Error("Failed to fetch posts by tag")
  }

  return await response.json()
}

// Updated to return an array of strings instead of TagCount objects
export async function getLastTags(): Promise<string[]> {
  const response = await fetch(`${API_URL}/tags`)

  if (!response.ok) {
    throw new Error("Failed to fetch tags")
  }

  const tags = await response.json()
  // If the API returns tag objects with name and count properties, extract just the names
  if (tags.length > 0 && typeof tags[0] === 'object' && 'name' in tags[0]) {
    return tags.map((tag: { name: string, count: number }) => tag.name)
  }
  return tags
}

export async function createPost(postData: {
  title: string
  description: string
  tags: string[]
  photo: string[]
}): Promise<Post> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  // Convert tags array to comma-separated string
  const formattedData = {
    ...postData,
    tags: postData.tags.join(", ")
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to create post")
  }

  return await response.json()
}

export async function updatePost(
  slug: string,
  postData: {
    title: string
    description: string
    tags: string[]
    photo: string[]
  },
): Promise<Post> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  // Convert tags array to comma-separated string
  const formattedData = {
    ...postData,
    tags: postData.tags.join(", ")
  }

  const response = await fetch(`${API_URL}/posts/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update post")
  }

  return await response.json()
}

export async function deletePost(slug: string): Promise<void> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/posts/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete post")
  }
}

export async function likePost(slug: string): Promise<Post> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/posts/${slug}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to like post")
  }

  return await response.json()
}

// getAllPosts funksiyasini qo'shish
export async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`)

  if (!response.ok) {
    throw new Error("Failed to fetch all posts")
  }

  return await response.json()
}

