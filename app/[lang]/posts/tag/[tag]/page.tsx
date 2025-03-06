import type { Metadata } from "next"
import type { Language } from "@/lib/constants"
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata"
import { getPostsByTag } from "@/lib/api/posts"
import { TagPageClient } from "./client"

// Generate dynamic metadata for each tag page
export async function generateMetadata({ params }: { params: { tag: string; lang: Language } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const tag = decodeURIComponent(resolvedParams.tag)
  return {
    ...generateSiteMetadata(resolvedParams.lang),
    title: `#${tag} - Posts`,
    description: `Posts tagged with #${tag}`,
    openGraph: {
      title: `#${tag} - Posts`,
      description: `Posts tagged with #${tag}`,
    },
  }
}

// Server Component
export default async function TagPage({ params }: { params: { tag: string } }) {
  const resolvedParams = await Promise.resolve(params)
  const tag = decodeURIComponent(resolvedParams.tag)
  
  try {
    const posts = await getPostsByTag(tag)
    return <TagPageClient initialPosts={posts} tag={tag} />
  } catch (error) {
    return <TagPageClient initialPosts={[]} tag={tag} error={true} />
  }
}