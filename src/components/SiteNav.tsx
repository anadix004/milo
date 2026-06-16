'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const CITIES = [
  { slug: 'delhi',     label: 'DEL' },
  { slug: 'mumbai',    label: 'BOM' },
  { slug: 'bengaluru', label: 'BLR' },
]

const NAV_LINKS = [
  { href: '/events',    label: 'Events'  },
  { href: '/about',     label: 'About'   },
  { href: '/blog',      label: 'Blog'    },
  { href: '/contact',   label: 'Contact' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[900] transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,5,.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(255,255,255,.06)' : '0.5px solid transparent',
      }}
    >
      <nav className="max-w-[1400px] mx-auto px-5 md:px-10 h-[64px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="font-d text-[20px] font-black tracking-[-0.04em] text-white flex-shrink-0">
          mil<span style={{ color: '#C9A84C' }}>o</span>
        </Link>

        {/* City pills — desktop */}
        <div className="hidden md:flex items-center gap-1.5">
          {CITIES.map(c => (
            <Link
              key={c.slug}
              href={`/city/${c.slug}`}
              className="font-mono text-[9px] tracking-[.12em] uppercase px-3 py-1.5 rounded-full border transition-all duration-300"
              style={{
                borderColor: pathname.includes(c.slug) ? 'var(--ac)' : 'rgba(255,255,255,.08)',
                color: pathname.includes(c.slug) ? 'var(--ac)' : 'rgba(255,255,255,.45)',
                background: pathname.includes(c.slug) ? 'rgba(var(--ac-raw),.08)' : 'transparent',
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="site-nav-link font-mono text-[11px] tracking-[.08em] uppercase transition-colors duration-300"
              style={{ color: pathname.startsWith(l.href) ? '#E8EEF8' : 'rgba(232,238,248,.42)' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="font-mono text-[11px] tracking-[.06em] uppercase transition-colors"
            style={{ color: 'rgba(232,238,248,.42)' }}>
            Log in
          </Link>
          <Link
            href="/contact"
            className="shim font-mono text-[10px] font-bold tracking-[.08em] uppercase px-4 py-2 rounded-full transition-all border"
            style={{
              background: 'rgba(201,168,76,.1)',
              borderColor: 'rgba(201,168,76,.25)',
              color: '#C9A84C',
            }}
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-[1.5px] bg-white/60 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : undefined }} />
          <span className="block w-5 h-[1.5px] bg-white/60 transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-[1.5px] bg-white/60 transition-all duration-300"
            style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : undefined }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{ maxHeight: menuOpen ? '320px' : '0', background: 'rgba(5,5,5,.95)' }}
      >
        <div className="px-5 pb-6 pt-2 flex flex-col gap-4 border-t border-white/[.05]">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[13px] tracking-[.08em] uppercase py-1"
              style={{ color: pathname.startsWith(l.href) ? '#C9A84C' : 'rgba(255,255,255,.55)' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/[.05]">
            {CITIES.map(c => (
              <Link key={c.slug} href={`/city/${c.slug}`} onClick={() => setMenuOpen(false)}
                className="font-mono text-[10px] tracking-[.1em] uppercase px-3 py-1.5 rounded-full border border-white/10"
                style={{ color: 'rgba(255,255,255,.4)' }}>
                {c.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" onClick={() => setMenuOpen(false)}
            className="font-mono text-[11px] font-bold tracking-[.1em] uppercase text-center py-3 rounded-full border border-goldBdr bg-goldDim text-gold">
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  )
}
