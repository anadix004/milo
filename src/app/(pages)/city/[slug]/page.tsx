import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import CityClient from './city-client'

const VALID_CITIES = ['delhi', 'mumbai', 'bangalore', 'bengaluru'] as const

const CITY_META: Record<string, { title: string; description: string }> = {
  delhi: {
    title: 'Delhi Events — The Circuit | Milo',
    description: 'Discover underground events in Delhi. From Hauz Khas open mics to Mehrauli rooftop sessions, Chandni Chowk chai walks to Lodhi Art District openings.',
  },
  mumbai: {
    title: 'Mumbai Events — The Circuit | Milo',
    description: 'Discover events in Mumbai. Bandra flea markets, Lower Parel jazz, Marine Drive sunset sessions, and Colaba gallery openings.',
  },
  bengaluru: {
    title: 'Bengaluru Events — The Circuit | Milo',
    description: 'Discover events in Bengaluru. Indie gigs in Indiranagar, startup socials in Koramangala, Cubbon Park cycling, and HSR terrace sessions.',
  },
  bangalore: {
    title: 'Bengaluru Events — The Circuit | Milo',
    description: 'Discover events in Bengaluru. Indie gigs in Indiranagar, startup socials in Koramangala, Cubbon Park cycling, and HSR terrace sessions.',
  },
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CITY_META[slug]
  if (!meta) return { title: 'City Not Found' }
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  }
}

export function generateStaticParams() {
  return VALID_CITIES.map(slug => ({ slug }))
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  if (!VALID_CITIES.includes(slug as any)) notFound()

  const canonicalSlug = slug === 'bangalore' ? 'bengaluru' : slug

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('cityId', canonicalSlug)
    .order('created_at', { ascending: false })
    .limit(24)

  return <CityClient slug={canonicalSlug} events={events || []} />
}
