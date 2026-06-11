import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Milo',
  description: "Milo is India's premier going-out platform. Learn about our mission, values, and the team building the anti-boring radar.",
  openGraph: { title: 'About Milo', description: 'The anti-boring platform for real plans.' },
}

const VALUES = [
  {
    icon: '⚡',
    title: 'Spontaneity > Planning',
    desc: "We don't do 2-week advance bookings. Milo is for tonight, this weekend, right now. Scroll, decide, go.",
  },
  {
    icon: '🛡',
    title: 'Verified, Not Curated',
    desc: 'Every event on Milo is real. We verify venues, check organisers, and surface genuine experiences — no paid listings.',
  },
  {
    icon: '🌐',
    title: 'Community First',
    desc: "Milo isn't a listings board. It's a circuit. City-specific WhatsApp communities, vibe checks, friends-going features.",
  },
  {
    icon: '📍',
    title: 'Hyper-Local',
    desc: "Hauz Khas isn't Connaught Place. Bandra isn't Colaba. Milo understands neighbourhoods, not just cities.",
  },
]

export default function AboutPage() {
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Hero */}
        <div className="max-w-3xl mb-20 page-in">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>
            About Milo
          </span>
          <h1 className="font-d text-[clamp(36px,6vw,88px)] font-black leading-[.86] tracking-[-0.04em] mb-7"
            style={{ color: '#E8EEF8' }}>
            The anti-boring<br />
            platform for{' '}
            <span style={{ color: '#C9A84C' }}>real</span> plans.
          </h1>
          <p className="font-b text-[15px] leading-[1.8]" style={{ color: 'rgba(232,238,248,.52)' }}>
            Milo was born from a simple frustration: finding something to do tonight shouldn't take 40 minutes of
            scrolling through Instagram stories and WhatsApp forwards. We built the radar we wished existed —
            a living, breathing map of your city's social circuit.
          </p>
        </div>

        {/* Divider */}
        <div className="mb-16 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,.3), transparent)' }} />

        {/* Values grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-20">
          {VALUES.map((v, i) => (
            <div key={v.title} className="glass noise rounded-2xl p-8 md:p-10">
              <div className="text-[28px] mb-5">{v.icon}</div>
              <h3 className="font-d text-[20px] font-bold mb-3" style={{ color: '#E8EEF8' }}>{v.title}</h3>
              <p className="font-b text-[13px] leading-[1.75]" style={{ color: 'rgba(232,238,248,.48)' }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="glass noise rounded-2xl p-8 md:p-10 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: '3', label: 'Cities' },
              { val: '200+', label: 'Events Live' },
              { val: '10k+', label: 'Community Members' },
              { val: '0', label: 'Boring Nights' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-d text-[clamp(28px,4vw,52px)] font-black leading-none mb-2"
                  style={{ color: '#C9A84C' }}>
                  {s.val}
                </div>
                <div className="font-mono text-[9px] tracking-[.16em] uppercase"
                  style={{ color: 'rgba(232,238,248,.32)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="max-w-2xl">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>
            The Team
          </span>
          <h2 className="font-d text-[clamp(24px,3.5vw,44px)] font-black tracking-[-0.03em] leading-[.92] mb-5"
            style={{ color: '#E8EEF8' }}>
            Built by people<br />who go out.
          </h2>
          <p className="font-b text-[14px] leading-[1.75] mb-8" style={{ color: 'rgba(232,238,248,.48)' }}>
            Small team of students, designers, and engineers who got tired of missing the good stuff.
            Based in Delhi, building for all of India.
          </p>
          <Link href="/contact"
            className="shim inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.12em] uppercase px-6 py-3 rounded-full border transition-all hover:bg-white/[.04]"
            style={{ borderColor: 'rgba(201,168,76,.3)', color: '#C9A84C' }}>
            Get in touch <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
