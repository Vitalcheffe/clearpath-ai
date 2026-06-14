import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app', '/dashboard', '/settings', '/profile', '/history', '/api/'],
    },
    sitemap: 'https://clearpath-ai.org/sitemap.xml',
  }
}
