import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/api/posts'
import { getComments } from '@/lib/api/comments'
import { notFound } from 'next/navigation'
import { ClientPage } from './client'

interface PostPageProps {
  params: {
    slug: string
    lang: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug)
    
    return {
      title: post.title,
      description: post.description.slice(0, 160),
      openGraph: {
        title: post.title,
        description: post.description.slice(0, 160),
        images: post.photo?.length ? [`${process.env.NEXT_PUBLIC_API_URL}${post.photo[0]}`] : [],
      }
    }
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Parallel data fetching
    const [post, comments] = await Promise.all([
      getPostBySlug(params.slug),
      getComments(params.slug)
    ])

    if (!post) {
      notFound()
    }

    return <ClientPage post={post} initialComments={comments} />
  } catch (error) {
    notFound()
  }
}