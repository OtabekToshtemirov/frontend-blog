import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPost } from "@/lib/api/posts"
import { ClientPost } from "./client"
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata"
import type { Language } from "@/lib/constants"

// Generate dynamic metadata for each post
export async function generateMetadata({ params }: { params: { slug: string; lang: Language } }): Promise<Metadata> {
  try {
    const post = await getPost(params.slug)
    const description = post.description.substring(0, 160)
    const ogImage = post.photo && post.photo[0] ? `${process.env.NEXT_PUBLIC_API_URL}${post.photo[0]}` : undefined

    // Merge with base metadata
    return {
      ...generateSiteMetadata(params.lang),
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.author.fullname],
        images: ogImage ? [ogImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    }
  } catch {
    return generateSiteMetadata(params.lang)
  }
}

// This is a Server Component
export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug)
    return <ClientPost initialPost={post} postSlug={params.slug} />
  } catch (error) {
    notFound()
  }
}