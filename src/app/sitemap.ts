import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clearpath-ai.org'

  const routes = [
    '',
    '/about',
    '/how-it-works',
    '/pricing',
    '/responsible-ai',
    '/privacy',
    '/terms',
    '/verification',
    '/team',
    '/contact',
    '/blog',
    '/api-docs',
    '/login',
    '/signup',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/about' || route === '/how-it-works' ? 0.9 : 0.7,
  }))
}
