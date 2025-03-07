import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/api/posts'
import { LANGUAGES } from '@/lib/constants'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://otablog.uz'
  
  // Base routes for all languages
  const routes = ['', '/posts', '/login', '/register']
  const locales = Object.keys(LANGUAGES)
  
  const staticRoutes = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: locale === 'uz' ? 1 : 0.9, // Higher priority for default language
    }))
  )

  // Get all posts
  try {
    const posts = await getPosts()
    
    // Generate post URLs for each language
    const postRoutes = locales.flatMap(locale => 
      posts.map(post => ({
        url: `${baseUrl}/${locale}/posts/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: locale === 'uz' ? 0.8 : 0.7, // Higher priority for default language
      }))
    )

    return [...staticRoutes, ...postRoutes]
  } catch (error) {
    console.error('Failed to fetch posts for sitemap:', error)
    return staticRoutes
  }
}