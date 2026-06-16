'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import EmptyState from "@/components/EmptyState";
import Link from 'next/link'
import Image from 'next/image'

interface EventData {
  id: string
  title: string
  category: string
  image?: string
  location?: string
  price?: string
  date?: string
  is_verified?: boolean
}

const FILTERS = ['All', 'Techno', 'Social', 'Meetups', 'Art & Culture', 'Food & Walk', 'Comedy', 'Sports']
const CITIES  = ['All Cities', 'Delhi', 'Mumbai', 'Bengaluru']

const CATEGORY_COLORS: Record<string, string> = {
  Techno:        '#b48cff',
  Social:        '#3ce6b4',
  Meetups:       '#4A7FD4',
  'Art & Culture': '#f9643c',
  'Food & Walk': '#C9A84C',
  Comedy:        '#ffc83c',
  Sports:        '#3DB865',
}

export default function EventsClient() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeCity,   setActiveCity]   = useState('All Cities')
  const [events,       setEvents]       = useState<EventData[]>([])
  const [loading,      setLoading]      = useState(true)
  const [offset,       setOffset]       = useState(0)
  const [hasMore,      setHasMore]      = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      if (offset === 0) {
        setLoading(true)
      }
      const supabase = createClient()
      let q = supabase.from('events').select('*').order('created_at', { ascending: false }).range(offset, offset + 39)
      if (activeCity !== 'All Cities') q = q.eq('cityId', activeCity.toLowerCase())
      if (activeFilter !== 'All')      q = q.eq('category', activeFilter)
      const { data } = await q
      const newEvents = (data || []) as EventData[]
      
      if (offset === 0) {
        setEvents(newEvents)
      } else {
        setEvents(prev => [...prev, ...newEvents])
      }
      
      if (newEvents.length < 40) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [activeFilter, activeCity, offset])

  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-10 page-in">
          <span className="font-mono text-[10px] tracking-[.18em] uppercase mb-3 block" style={{ color: '#C9A84C' }}>
            ALL EVENTS
          </span>
          <h1 className="font-d text-[clamp(36px,6vw,88px)] leading-[.86] tracking-[-0.04em] font-black mb-3"
            style={{ color: '#E8EEF8' }}>
            The Circuit.<br />
            <span style={{ color: 'rgba(232,238,248,.22)', WebkitTextStroke: '1px rgba(232,238,248,.15)' }}>
              Every night.
            </span>
          </h1>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f)
                  setOffset(0)
                  setHasMore(true)
                }}
                className="font-mono text-[9px] tracking-[.1em] uppercase px-3.5 py-2 rounded-full border transition-all duration-300"
                style={{
                  background: activeFilter === f ? 'rgba(201,168,76,.12)' : 'transparent',
                  borderColor: activeFilter === f ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.07)',
                  color: activeFilter === f ? '#C9A84C' : 'rgba(232,238,248,.38)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {/* City filter */}
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            {CITIES.map(c => (
              <button
                key={c}
                onClick={() => {
                  setActiveCity(c)
                  setOffset(0)
                  setHasMore(true)
                }}
                className="font-mono text-[9px] tracking-[.1em] uppercase px-3.5 py-2 rounded-full border transition-all duration-300"
                style={{
                  background: activeCity === c ? 'rgba(255,255,255,.06)' : 'transparent',
                  borderColor: activeCity === c ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.07)',
                  color: activeCity === c ? 'rgba(232,238,248,.85)' : 'rgba(232,238,248,.35)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.2), transparent)' }} />

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-[300px] animate-pulse"
                style={{ background: 'rgba(255,255,255,.03)' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="📡"
            heading="Nothing here yet"
            subtext="Try a different filter or check back soon — events drop daily."
            secondaryLabel={
              activeFilter !== 'All' || activeCity !== 'All Cities'
                ? 'Clear filters'
                : undefined
            }
            onSecondary={
              activeFilter !== 'All' || activeCity !== 'All Cities'
                ? () => { setActiveFilter('All'); setActiveCity('All Cities'); }
                : undefined
            }
            variant="marketing"
          />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {events.map((e, idx) => (
              <EventCard key={e.id} event={e} idx={idx} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && hasMore && events.length >= 40 && (
          <div className="text-center mt-14">
            <button 
              onClick={() => setOffset(prev => prev + 40)}
              className="shim font-mono text-[11px] tracking-[.1em] uppercase px-10 py-3.5 rounded-full border transition-all hover:bg-white/[.04]"
              style={{ borderColor: 'rgba(255,255,255,.1)', color: 'rgba(232,238,248,.5)' }}
            >
              Load more events
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function EventCard({ event, idx }: { event: EventData; idx: number }) {
  const accentColor = CATEGORY_COLORS[event.category] || '#C9A84C'

  return (
    <Link
      href={`/events/${event.id}`}
      className="group glass rounded-2xl overflow-hidden flex flex-col"
      style={{ animationDelay: `${idx * 0.04}s` }}
    >
      {/* Image */}
      <div className="img-h relative h-[180px] flex-shrink-0">
        {event.image ? (
          <Image src={event.image} alt={event.title} fill
            className="object-cover opacity-60 mix-blend-lighten" />
        ) : (
          <div className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, rgba(5,5,5,.8) 100%)` }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,5,.75) 0%, transparent 55%)' }} />
        {/* Category pill */}
        <span className="absolute top-3 left-3 font-mono text-[8px] tracking-[.1em] uppercase px-2.5 py-1 rounded-full"
          style={{ background: `${accentColor}22`, color: accentColor, border: `0.5px solid ${accentColor}44` }}>
          {event.category || 'Event'}
        </span>
        {event.is_verified && (
          <span className="absolute top-3 right-3 font-mono text-[8px] tracking-[.08em] uppercase px-2 py-1 rounded-full"
            style={{ background: 'rgba(60,230,180,.12)', color: '#3ce6b4', border: '0.5px solid rgba(60,230,180,.3)' }}>
            ✓ Verified
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-d text-[15px] font-bold leading-tight group-hover:text-gold transition-colors duration-300"
          style={{ color: '#E8EEF8' }}>
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 font-mono text-[10px]"
          style={{ color: 'rgba(232,238,248,.38)' }}>
          <span style={{ fontSize: 11 }}>📍</span>
          <span className="truncate">{event.location || 'TBA'}</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between border-t"
          style={{ borderColor: 'rgba(255,255,255,.05)' }}>
          <span className="font-d text-[13px] font-bold" style={{ color: accentColor }}>
            {event.price || 'Free'}
          </span>
          <span className="font-mono text-[9px] tracking-[.08em] uppercase transition-all duration-300"
            style={{ color: 'rgba(232,238,248,.35)' }}>
            {event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'TBA'}
          </span>
        </div>
      </div>
    </Link>
  )
}
