import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/podcast', '/blueprint'].map((path) => ({
    url: `${WEBSITE_URL}${path}`,
    changeFrequency: 'weekly',
  }))
}
