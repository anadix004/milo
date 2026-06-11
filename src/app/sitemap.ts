import { MetadataRoute } from 'next'
import { supabase } from '@/utils/supabase'

export const revalidate = 3600 // re-generate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://baharmilo.com'
  const now = new Date()

  // Fetch dynamic event IDs
  let eventUrls: MetadataRoute.Sitemap = []
  try {
    const { data: events } = await supabase
      .from('events')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200)
    if (events) {
      eventUrls = events.map(e => ({
        url: `${baseUrl}/events/${e.id}`,
        lastModified: e.updated_at ? new Date(e.updated_at) : now,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // Silently skip if Supabase unavailable during build
  }

  const staticPages: MetadataRoute.Sitemap = [
    // Core
    { url: baseUrl,                      lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/events`,          lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    // Cities
    { url: `${baseUrl}/city/delhi`,      lastModified: now, changeFrequency: 'daily',   priority: 0.85 },
    { url: `${baseUrl}/city/mumbai`,     lastModified: now, changeFrequency: 'daily',   priority: 0.85 },
    { url: `${baseUrl}/city/bangalore`,  lastModified: now, changeFrequency: 'daily',   priority: 0.85 },
    // Company
    { url: `${baseUrl}/about`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/press`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Legal (low priority, still indexed)
    { url: `${baseUrl}/privacy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    // Blog posts
    { url: `${baseUrl}/blog/delhi-techno-guide`,   lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog/mumbai-sunset-spots`,  lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog/how-milo-works`,       lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog/bangalore-indie-gigs`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog/art-of-showing-up`,    lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/blog/hauz-khas-village`,    lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
  ]

  return [...staticPages, ...eventUrls]
}

