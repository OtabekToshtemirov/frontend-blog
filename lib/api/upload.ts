import { API_URL } from "@/lib/constants"

export async function uploadImage(formData: FormData): Promise<string> {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to upload image")
  }

  const data = await response.json()
  return data.url // Backend now returns { url: '/images/[id]', format: 'webp' }
}

