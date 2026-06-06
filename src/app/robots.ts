import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app', '/dashboard', '/settings', '/profile', '/history'],
    },
    sitemap: 'https://clearpath-ai.org/sitemap.xml',
  }
}
