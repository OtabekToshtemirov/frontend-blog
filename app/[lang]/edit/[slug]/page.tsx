import { PostEditor } from "@/components/post-editor"
import { getPost } from "@/lib/api/posts"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug)

    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
        <PostEditor post={post} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}

