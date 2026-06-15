/**
 * @/components/UnifiedEventCard.tsx
 *
 * PHASE 4 FIX: Single source of truth for event cards.
 *
 * Root cause of original divergence:
 *   EventListing.tsx → EventGridCard   (App DS, .milo-card CSS classes)
 *   events-client.tsx → EventCard      (Marketing DS, .glass CSS classes)
 *   city-client.tsx   → inline card    (Marketing DS, inline styles)
 *
 * All three showed the same data but looked completely different. A user
 * navigating /events → /explore/delhi experienced visual whiplash.
 *
 * Fix: One component, two variants:
 *   variant="app"       → .milo-card classes, city accent system (--ac)
 *   variant="marketing" → .glass classes, gold accent (#C9A84C)
 *
 * Both variants share:
 *   - Identical data interface (EventCardData)
 *   - Same image/video handling
 *   - Same category pill colors
 *   - Same price/date formatting
 *   - Same hover behavior
 *   - Accessible alt text
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import clsx from 'clsx'

// ── Data shape ────────────────────────────────────────────────────────────────
export interface EventCardData {
  id: string
  title: string
  description?: string
  location?: string
  date?: string
  time?: string
  price?: string
  category?: string
  image?: string
  video_url?: string
  featured?: boolean
  is_verified?: boolean
  cityId?: string
}

// ── Category color system ─────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  club:        '#f9643c',
  dj_night:    '#f9643c',
  house_party: '#e83ca0',
  comedy:      '#ffc83c',
  open_mic:    '#b48cff',
  networking:  '#b48cff',
  sports:      '#3ce6b4',
  other:       '#50a0ff',
  // Legacy labels (from Marketing DS)
  Techno:          '#b48cff',
  Social:          '#3ce6b4',
  Meetups:         '#4A7FD4',
  'Art & Culture': '#f9643c',
  'Food & Walk':   '#C9A84C',
  Comedy:          '#ffc83c',
  Sports:          '#3DB865',
}

function getCategoryColor(category?: string): string {
  if (!category) return '#4A7FD4'
  return CATEGORY_COLORS[category] || CATEGORY_COLORS[category.toLowerCase()] || '#50a0ff'
}

// ── Price formatter ───────────────────────────────────────────────────────────
function formatPrice(price?: string): string {
  if (!price || price.toLowerCase() === 'free') return 'Free'
  return price
}

// ── Date formatter ────────────────────────────────────────────────────────────
function formatDate(date?: string): string {
  if (!date) return 'TBA'
  try {
    return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch {
    return date
  }
}

// ── Stable attendee count (no Math.random in render) ─────────────────────────
function stableCount(seed: string, min: number, range: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return min + (Math.abs(h) % range)
}

// ── Avatar letters from title ─────────────────────────────────────────────────
const AVATAR_COLORS = ['#4A7FD4', '#3DB865', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6']

// ── Props ─────────────────────────────────────────────────────────────────────
interface UnifiedEventCardProps {
  event: EventCardData
  variant?: 'app' | 'marketing'
  /** If provided, clicking the card calls this instead of navigating */
  onClick?: (event: EventCardData) => void
  /** href override — defaults to /events/[id] */
  href?: string
  className?: string
  /** Animation delay for staggered grid entry */
  animationDelay?: number
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UnifiedEventCard({
  event,
  variant = 'app',
  onClick,
  href,
  className,
  animationDelay = 0,
}: UnifiedEventCardProps) {
  const accentColor = getCategoryColor(event.category)
  const goCount = stableCount(event.id, 8, 40)
  const words = (event.title || '').split(' ').filter(Boolean)
  const avatarLetters = words.slice(0, 3).map((w, i) => ({
    letter: w[0]?.toUpperCase() ?? 'M',
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }))

  // ── App DS variant (uses .milo-card CSS classes) ──────────────────────────
  if (variant === 'app') {
    const inner = (
      <motion.div
        className={clsx('milo-card', className)}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick ? () => onClick(event) : undefined}
        style={{ cursor: onClick ? 'pointer' : undefined }}
      >
        {/* Image */}
        <div className="milo-card-img">
          {event.video_url ? (
            <video
              src={event.video_url}
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter .3s, transform .35s' }}
            />
          ) : event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, (max-width:1280px) 33vw, 25vw"
              className="object-cover"
              style={{ transition: 'filter .3s, transform .35s' }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, rgba(0,0,0,.8) 100%)` }}
            />
          )}
          <div className="milo-card-img-overlay" />
          <div className="milo-ctime">{event.time || formatDate(event.date)}</div>
          <div className="milo-ctag-wrap">
            <span className="milo-ctag milo-ctag--default" style={{ background: `${accentColor}22`, color: accentColor }}>
              {event.category || 'Event'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="milo-card-body">
          <div className="milo-cname">{event.title}</div>
          <div className="milo-cloc">
            <span className="milo-cloc-pin">📍</span>
            {event.location || 'Location TBA'}
          </div>
        </div>

        {/* Footer */}
        <div className="milo-cfoot">
          <div className="milo-cgo">{goCount} people going</div>
          <div className="milo-avs">
            {avatarLetters.map((av, i) => (
              <div key={i} className="milo-av" style={{ background: av.color }}>
                {av.letter}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )

    if (onClick) return inner
    return <Link href={href || `/events/${event.id}`}>{inner}</Link>
  }

  // ── Marketing DS variant (uses .glass CSS classes) ────────────────────────
  const marketingInner = (
    <motion.div
      className={clsx('group glass rounded-2xl overflow-hidden flex flex-col', className)}
      style={{ animationDelay: `${animationDelay * 0.04}s` }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={onClick ? () => onClick(event) : undefined}
    >
      {/* Image */}
      <div className="img-h relative h-[180px] flex-shrink-0">
        {event.video_url ? (
          <video
            src={event.video_url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-lighten"
          />
        ) : event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover opacity-60 mix-blend-lighten"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, rgba(5,5,5,.8) 100%)` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,5,5,.75) 0%, transparent 55%)' }}
        />
        {/* Category pill */}
        <span
          className="absolute top-3 left-3 font-mono text-[8px] tracking-[.1em] uppercase px-2.5 py-1 rounded-full"
          style={{ background: `${accentColor}22`, color: accentColor, border: `0.5px solid ${accentColor}44` }}
        >
          {event.category || 'Event'}
        </span>
        {event.is_verified && (
          <span
            className="absolute top-3 right-3 font-mono text-[8px] tracking-[.08em] uppercase px-2 py-1 rounded-full"
            style={{ background: 'rgba(60,230,180,.12)', color: '#3ce6b4', border: '0.5px solid rgba(60,230,180,.3)' }}
          >
            ✓ Verified
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3
          className="font-d text-[15px] font-bold leading-tight group-hover:text-gold transition-colors duration-300"
          style={{ color: '#E8EEF8' }}
        >
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: 'rgba(232,238,248,.38)' }}>
          <span style={{ fontSize: 11 }}>📍</span>
          <span className="truncate">{event.location || 'TBA'}</span>
        </div>
        <div
          className="mt-auto pt-3 flex items-center justify-between border-t"
          style={{ borderColor: 'rgba(255,255,255,.05)' }}
        >
          <span className="font-d text-[13px] font-bold" style={{ color: accentColor }}>
            {formatPrice(event.price)}
          </span>
          <span
            className="font-mono text-[9px] tracking-[.08em] uppercase"
            style={{ color: 'rgba(232,238,248,.35)' }}
          >
            {formatDate(event.date)}
          </span>
        </div>
      </div>
    </motion.div>
  )

  if (onClick) return marketingInner
  return (
    <Link href={href || `/events/${event.id}`} style={{ cursor: 'pointer' }}>
      {marketingInner}
    </Link>
  )
}
