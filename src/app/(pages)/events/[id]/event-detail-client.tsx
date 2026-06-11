'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface Event {
  id: string; title: string; description: string; location: string
  venue_address: string; date: string; price: string; category: string
  image: string; ticket_links: any; cityId: string; is_verified: boolean; featured: boolean
}
interface Rsvp  { profile_id: string; type: string }
interface Vibe  { id: string; type: string; url: string; created_at: string }

const CATEGORY_COLORS: Record<string, string> = {
  Techno: '#b48cff', Social: '#3ce6b4', Meetups: '#4A7FD4',
  'Art & Culture': '#f9643c', 'Food & Walk': '#C9A84C', Comedy: '#ffc83c', Sports: '#3DB865',
}

export default function EventDetailClient({ event, rsvps, vibes }: {
  event: Event; rsvps: Rsvp[]; vibes: Vibe[]
}) {
  const [rsvpType, setRsvpType] = useState<'none' | 'join' | 'bookmark'>('none')
  const going     = rsvps.filter(r => r.type === 'join').length
  const bookmarks = rsvps.filter(r => r.type === 'bookmark').length
  const accent    = CATEGORY_COLORS[event.category] || '#C9A84C'

  const handleRsvp = async (type: 'join' | 'bookmark') => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    await supabase.from('rsvps').upsert({ event_id: event.id, profile_id: user.id, type }, { onConflict: 'event_id,profile_id' })
    setRsvpType(type)
  }

  return (
    <section className="pt-24 pb-24 px-5 md:px-10 page-in">
      <div className="max-w-[1400px] mx-auto">

        {/* Breadcrumb */}
        <nav className="font-mono text-[10px] tracking-[.08em] uppercase mb-8 flex items-center gap-2"
          style={{ color: 'rgba(232,238,248,.3)' }}>
          <Link href="/events" className="hover:text-gold transition-colors">Events</Link>
          <span>/</span>
          {event.cityId && (
            <>
              <Link href={`/city/${event.cityId}`} className="hover:text-gold transition-colors capitalize">{event.cityId}</Link>
              <span>/</span>
            </>
          )}
          <span className="truncate max-w-[200px]" style={{ color: 'rgba(232,238,248,.5)' }}>{event.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main — 8 cols */}
          <div className="lg:col-span-8">
            {/* Hero image */}
            {event.image && (
              <div className="img-h rounded-2xl overflow-hidden mb-8 h-[280px] md:h-[420px]">
                <img src={event.image} alt={event.title}
                  className="w-full h-full object-cover opacity-55 mix-blend-lighten" />
              </div>
            )}

            {/* Badges + title */}
            <div className="mb-8">
              <div className="flex items-center flex-wrap gap-2 mb-4">
                {event.is_verified && (
                  <span className="font-mono text-[9px] tracking-[.1em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(60,230,180,.1)', color: '#3ce6b4', border: '0.5px solid rgba(60,230,180,.3)' }}>
                    ✓ Verified
                  </span>
                )}
                <span className="font-mono text-[9px] tracking-[.1em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: `${accent}18`, color: accent, border: `0.5px solid ${accent}44` }}>
                  {event.category}
                </span>
                {event.featured && (
                  <span className="font-mono text-[9px] tracking-[.1em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(201,168,76,.1)', color: '#C9A84C', border: '0.5px solid rgba(201,168,76,.3)' }}>
                    ★ Featured
                  </span>
                )}
              </div>
              <h1 className="font-d text-[clamp(26px,4vw,54px)] font-black leading-[.9] tracking-[-0.03em] mb-4"
                style={{ color: '#E8EEF8' }}>
                {event.title}
              </h1>
              {event.description && (
                <p className="font-b text-[15px] leading-[1.75] max-w-2xl"
                  style={{ color: 'rgba(232,238,248,.55)' }}>
                  {event.description}
                </p>
              )}
            </div>

            {/* Vibe checks */}
            {vibes.length > 0 && (
              <div className="mb-10">
                <h2 className="font-d text-[18px] font-bold mb-4" style={{ color: '#E8EEF8' }}>Vibe Checks</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {vibes.map(v => (
                    <div key={v.id} className="aspect-square rounded-xl overflow-hidden img-h">
                      {v.type === 'video' ? (
                        <video src={v.url} className="w-full h-full object-cover opacity-70" muted playsInline />
                      ) : (
                        <img src={v.url} alt="Vibe check" className="w-full h-full object-cover opacity-70" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket links */}
            {event.ticket_links && Array.isArray(event.ticket_links) && event.ticket_links.length > 0 && (
              <div className="glass noise rounded-2xl p-6 mb-8">
                <h2 className="font-d text-[16px] font-bold mb-4" style={{ color: '#E8EEF8' }}>Get Tickets</h2>
                <div className="flex flex-col gap-3">
                  {event.ticket_links.map((link: any, i: number) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="shim flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all hover:bg-white/[.04]"
                      style={{ borderColor: `${accent}33`, color: accent }}>
                      <span className="font-mono text-[11px] tracking-[.06em] uppercase">{link.label || `Buy Tickets`}</span>
                      <span style={{ fontSize: 14 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — 4 cols */}
          <div className="lg:col-span-4">
            <div className="glass noise rounded-2xl p-6 lg:sticky lg:top-24 space-y-6">
              {/* When */}
              <div>
                <span className="font-mono text-[9px] tracking-[.16em] uppercase block mb-1.5"
                  style={{ color: 'rgba(232,238,248,.28)' }}>When</span>
                <p className="font-d text-[18px] font-bold" style={{ color: '#E8EEF8' }}>
                  {event.date ? new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric' }) : 'TBA'}
                </p>
              </div>

              {/* Where */}
              <div>
                <span className="font-mono text-[9px] tracking-[.16em] uppercase block mb-1.5"
                  style={{ color: 'rgba(232,238,248,.28)' }}>Where</span>
                <p className="font-b text-[14px]" style={{ color: '#E8EEF8' }}>{event.location}</p>
                {event.venue_address && (
                  <p className="font-b text-[12px] mt-0.5" style={{ color: 'rgba(232,238,248,.38)' }}>{event.venue_address}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <span className="font-mono text-[9px] tracking-[.16em] uppercase block mb-1.5"
                  style={{ color: 'rgba(232,238,248,.28)' }}>Price</span>
                <p className="font-d text-[24px] font-black" style={{ color: accent }}>{event.price || 'Free'}</p>
              </div>

              {/* Attending count */}
              <div className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: 'rgba(255,255,255,.03)', borderColor: 'rgba(255,255,255,.06)' }}>
                <div className="flex -space-x-2">
                  {['#C9A84C', '#b48cff', '#3ce6b4'].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 flex-shrink-0"
                      style={{ background: `${c}33`, borderColor: 'rgba(5,5,5,.8)' }} />
                  ))}
                </div>
                <span className="font-mono text-[10px] tracking-[.04em]"
                  style={{ color: 'rgba(232,238,248,.45)' }}>
                  {going} going · {bookmarks} saved
                </span>
              </div>

              {/* RSVP buttons */}
              <button
                onClick={() => handleRsvp('join')}
                className="w-full font-mono text-[11px] font-bold tracking-[.1em] uppercase py-4 rounded-full transition-all duration-300"
                style={rsvpType === 'join'
                  ? { background: 'rgba(60,230,180,.15)', color: '#3ce6b4', border: '1px solid rgba(60,230,180,.3)' }
                  : { background: accent, color: '#050505', border: `1px solid ${accent}` }}
              >
                {rsvpType === 'join' ? '✓ You\'re Going' : 'Join Plan'}
              </button>
              <button
                onClick={() => handleRsvp('bookmark')}
                className="w-full font-mono text-[11px] tracking-[.1em] uppercase py-3 rounded-full border transition-all duration-300 hover:bg-white/[.04]"
                style={rsvpType === 'bookmark'
                  ? { borderColor: 'rgba(201,168,76,.35)', color: '#C9A84C' }
                  : { borderColor: 'rgba(255,255,255,.1)', color: 'rgba(232,238,248,.4)' }}
              >
                {rsvpType === 'bookmark' ? '★ Bookmarked' : '☆ Save for Later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
