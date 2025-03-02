import type { Comment } from "@/lib/types"
import { API_URL } from "@/lib/constants"

export async function getComments(postSlug: string): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/posts/${postSlug}/comments`)

  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  return await response.json()
}

export async function addComment(postSlug: string, text: string): Promise<Comment> {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/posts/${postSlug}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error("Failed to add comment")
  }

  return await response.json()
}

export async function editComment(commentId: string, text: string): Promise<Comment> {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error("Failed to edit comment")
  }

  return await response.json()
}

export async function deleteComment(commentId: string): Promise<void> {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete comment")
  }
}

export async function getAllComments(): Promise<Comment[]> {
  const response = await fetch(`${API_URL}/comments`)

  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }

  const comments = await response.json()
  return comments.sort((a: Comment, b: Comment) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

