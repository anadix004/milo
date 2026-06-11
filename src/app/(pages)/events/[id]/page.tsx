import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import EventDetailClient from './event-detail-client'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('title,description,location,price,image,created_at').eq('id', id).single()
  if (!event) return { title: 'Event Not Found | Milo' }
  return {
    title: `${event.title} — Milo`,
    description: event.description || `${event.title} at ${event.location}. ${event.price === 'Free' ? 'Free entry.' : `From ${event.price}.`} Join the plan on Milo.`,
    openGraph: {
      title: event.title,
      description: event.description || `Find ${event.title} on Milo`,
      images: event.image ? [{ url: event.image }] : [],
      type: 'article',
      publishedTime: event.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description || '',
      images: event.image ? [event.image] : [],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [eventRes, rsvpsRes, vibesRes] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).single(),
    supabase.from('rsvps').select('profile_id, type').eq('event_id', id),
    supabase.from('vibe_checks').select('*').eq('event_id', id).order('created_at', { ascending: false }).limit(12),
  ])

  if (!eventRes.data) {
    return (
      <div className="pt-36 pb-20 text-center">
        <p className="font-d text-[20px]" style={{ color: 'rgba(232,238,248,.35)' }}>Event not found</p>
      </div>
    )
  }

  return (
    <EventDetailClient
      event={eventRes.data}
      rsvps={rsvpsRes.data || []}
      vibes={vibesRes.data || []}
    />
  )
}
