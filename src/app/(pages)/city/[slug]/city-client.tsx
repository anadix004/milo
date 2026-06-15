'use client'

import Link from 'next/link'
import Image from 'next/image'
import EmptyState from "@/components/EmptyState";

// Three city colour schemes as decided:
// Delhi   → Nocturnal Aura   (deep indigo-blue)
// Mumbai  → Sunset Coral     (vibrant orange)
// Bangalore → Mint Electric  (electric green)
const CITY_CONFIG: Record<string, {
  name: string; accent: string; accentDim: string; accentBdr: string
  desc: string; count: number
  hoods: { code: string; name: string; desc: string }[]
  identity: string
}> = {
  delhi: {
    name: 'Delhi',
    accent: '#4A7FD4',
    accentDim: 'rgba(74,127,212,.12)',
    accentBdr: 'rgba(74,127,212,.28)',
    desc: "From Hauz Khas open mics to Mehrauli rooftop sessions. The capital doesn't do boring.",
    identity: 'Nocturnal Aura',
    count: 14,
    hoods: [
      { code: 'HKV', name: 'Hauz Khas', desc: 'Open mics & art spaces' },
      { code: 'CP',  name: 'Connaught Place', desc: 'Jazz clubs & rooftops' },
      { code: 'SHD', name: 'Saket', desc: 'Underground gigs' },
      { code: 'MBD', name: 'Mehrauli', desc: 'Heritage parties' },
    ],
  },
  mumbai: {
    name: 'Mumbai',
    accent: '#f9643c',
    accentDim: 'rgba(249,100,60,.12)',
    accentBdr: 'rgba(249,100,60,.28)',
    desc: "Bandra fleas to Lower Parel jazz. Mumbai's scene is relentless — and so are you.",
    identity: 'Sunset Coral',
    count: 22,
    hoods: [
      { code: 'BDW', name: 'Bandra West', desc: 'Flea markets & gigs' },
      { code: 'LP',  name: 'Lower Parel', desc: 'Jazz & warehouse' },
      { code: 'CLB', name: 'Colaba', desc: 'Gallery openings' },
      { code: 'ADH', name: 'Andheri', desc: 'Comedy & improv' },
    ],
  },
  bangalore: {
    name: 'Bangalore',
    accent: '#3DB865',
    accentDim: 'rgba(61,184,101,.12)',
    accentBdr: 'rgba(61,184,101,.28)',
    desc: 'Indie gigs in Indiranagar, startup socials in Koramangala. BLR always evolves.',
    identity: 'Mint Electric',
    count: 9,
    hoods: [
      { code: 'IND', name: 'Indiranagar', desc: 'Indie gigs & vinyl bars' },
      { code: 'KMG', name: 'Koramangala', desc: 'Tech meetups & socials' },
      { code: 'HSR', name: 'HSR Layout', desc: 'Terrace sessions' },
      { code: 'CUB', name: 'Cubbon Park', desc: 'Cycling & art walks' },
    ],
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  Techno: '#b48cff', Social: '#3ce6b4', Meetups: '#4A7FD4',
  'Art & Culture': '#f9643c', 'Food & Walk': '#C9A84C',
}

export default function CityClient({ slug, events }: { slug: string; events: any[] }) {
  const cfg = CITY_CONFIG[slug]
  if (!cfg) return null

  return (
    <>
      {/* City hero */}
      <section className="pt-28 pb-14 px-5 md:px-10 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 40%, ${cfg.accentDim} 0%, transparent 60%)` }} />

        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Identity tag */}
          <div className="flex items-center gap-2 mb-5 page-in">
            <div className="accent-dot" style={{ background: cfg.accent, animation: 'milo-blink 1.4s ease-in-out infinite' }} />
            <span className="font-mono text-[9px] tracking-[.2em] uppercase"
              style={{ color: cfg.accent }}>
              {cfg.count} live right now · {cfg.identity}
            </span>
          </div>

          <h1 className="font-d text-[clamp(48px,8vw,120px)] font-black leading-[.84] tracking-[-0.04em] mb-6 page-in"
            style={{ color: '#E8EEF8' }}>
            {cfg.name}&apos;s<br />
            <span style={{ color: cfg.accent }}> Circuit</span>
          </h1>
          <p className="font-b text-[15px] leading-[1.75] max-w-lg page-in"
            style={{ color: 'rgba(232,238,248,.52)' }}>
            {cfg.desc}
          </p>
        </div>
      </section>

      {/* Neighbourhood codes */}
      <section className="px-5 md:px-10 mb-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {cfg.hoods.map((h, i) => (
            <div key={h.code} className="glass rounded-2xl p-5 text-center sr"
              style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="font-d text-[clamp(20px,2.5vw,34px)] font-black leading-none mb-1"
                style={{ color: cfg.accent }}>
                {h.code}
              </div>
              <div className="font-b text-[12px] font-semibold mb-0.5" style={{ color: '#E8EEF8' }}>{h.name}</div>
              <div className="font-mono text-[9px] tracking-[.06em]" style={{ color: 'rgba(232,238,248,.3)' }}>{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider line */}
      <div className="mx-5 md:mx-10 mb-12 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}44, transparent)` }} />

      {/* Events grid */}
      <section className="px-5 md:px-10 mb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-d text-[clamp(18px,2.5vw,30px)] font-bold tracking-[-0.02em]"
              style={{ color: '#E8EEF8' }}>
              On right now
            </h2>
            <Link href="/events"
              className="font-mono text-[10px] tracking-[.1em] uppercase transition-colors"
              style={{ color: cfg.accent }}>
              View all →
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="glass rounded-2xl overflow-hidden">
              <EmptyState
                icon="📍"
                heading={`Events dropping soon in ${cfg.name}`}
                subtext="Our curators are sourcing the best events. Check back or join the WhatsApp group for real-time updates."
                variant="marketing"
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {events.map((e: any, idx) => {
                const aColor = CATEGORY_COLORS[e.category] || cfg.accent
                return (
                  <Link key={e.id} href={`/events/${e.id}`}
                    className="group glass rounded-2xl overflow-hidden flex flex-col"
                    style={{ animationDelay: `${idx * 0.04}s` }}>
                    <div className="img-h relative h-[160px] flex-shrink-0">
                      {e.image ? (
                        <Image src={e.image} alt={e.title} fill
                          className="object-cover opacity-55 mix-blend-lighten" />
                      ) : (
                        <div className="w-full h-full"
                          style={{ background: `linear-gradient(135deg, ${aColor}22 0%, rgba(5,5,5,.9) 100%)` }} />
                      )}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,5,.8) 0%, transparent 50%)' }} />
                      <span className="absolute top-2.5 left-2.5 font-mono text-[8px] tracking-[.1em] uppercase px-2 py-1 rounded-full"
                        style={{ background: `${aColor}22`, color: aColor, border: `0.5px solid ${aColor}44` }}>
                        {e.category || 'Event'}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="font-d text-[14px] font-bold leading-tight group-hover:opacity-80 transition-opacity"
                        style={{ color: '#E8EEF8' }}>
                        {e.title}
                      </h3>
                      <p className="font-mono text-[9px] truncate" style={{ color: 'rgba(232,238,248,.35)' }}>
                        {e.location || 'Location TBA'}
                      </p>
                      <div className="mt-auto pt-3 flex items-center justify-between border-t"
                        style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                        <span className="font-d text-[13px] font-bold" style={{ color: aColor }}>
                          {e.price || 'Free'}
                        </span>
                        <span className="font-mono text-[8px] tracking-[.06em]" style={{ color: 'rgba(232,238,248,.3)' }}>
                          {e.date ? new Date(e.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'TBA'}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-5 md:px-10 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="glass noise rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${cfg.accentDim} 0%, transparent 65%)` }} />
            <h3 className="font-d text-[clamp(20px,3vw,36px)] font-black tracking-[-0.02em] mb-3 relative z-10"
              style={{ color: '#E8EEF8' }}>
              Join {cfg.name}&apos;s WhatsApp Circuit
            </h3>
            <p className="font-b text-[13px] leading-[1.7] mb-7 relative z-10 max-w-sm mx-auto"
              style={{ color: 'rgba(232,238,248,.45)' }}>
              Real-time plans, after-hours invites, and the people who actually show up.
            </p>
            <button className="shim font-mono text-[11px] font-bold tracking-[.1em] uppercase px-10 py-4 rounded-full transition-all relative z-10 hover:opacity-90"
              style={{ background: cfg.accent, color: '#050505' }}>
              Join {cfg.name} Group
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
