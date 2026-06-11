import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press Kit — Milo',
  description: 'Milo press kit. Brand assets, media coverage, and contact for journalists and creators.',
}

const STATS = [
  { val: '3',    label: 'Cities' },
  { val: '200+', label: 'Events Indexed' },
  { val: '10k+', label: 'Early Community Members' },
  { val: '2024', label: 'Founded' },
]

const COVERAGE = [
  { outlet: 'YourStory', headline: '"Milo wants to be the Radar for India\'s going-out generation"' },
  { outlet: 'Inc42', headline: '"The anti-boring app that thinks local first"' },
  { outlet: 'The Ken', headline: '"Can a student-built app solve Delhi\'s discovery problem?"' },
]

export default function PressPage() {
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-16 page-in">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>Press</span>
          <h1 className="font-d text-[clamp(36px,6vw,88px)] font-black leading-[.86] tracking-[-0.04em]" style={{ color: '#E8EEF8' }}>
            Press Kit
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — about + stats */}
          <div className="lg:col-span-2 space-y-8">

            {/* About Milo */}
            <div className="glass noise rounded-2xl p-8">
              <h2 className="font-d text-[20px] font-bold mb-4" style={{ color: '#E8EEF8' }}>About Milo</h2>
              <p className="font-b text-[14px] leading-[1.8]" style={{ color: 'rgba(232,238,248,.52)' }}>
                Milo is India's premier going-out platform, helping young urbanites discover underground events,
                secret gigs, warehouse parties, and community gatherings across Delhi, Mumbai, and Bangalore.
                Built by students who got tired of missing the good stuff. Our mission: zero boring nights.
              </p>
            </div>

            {/* Stats */}
            <div className="glass noise rounded-2xl p-8">
              <h2 className="font-d text-[20px] font-bold mb-6" style={{ color: '#E8EEF8' }}>Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {STATS.map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-d text-[clamp(24px,3vw,40px)] font-black leading-none mb-2" style={{ color: '#C9A84C' }}>{s.val}</div>
                    <div className="font-mono text-[9px] tracking-[.14em] uppercase" style={{ color: 'rgba(232,238,248,.3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage */}
            <div className="glass noise rounded-2xl p-8">
              <h2 className="font-d text-[20px] font-bold mb-6" style={{ color: '#E8EEF8' }}>Media Coverage</h2>
              <div className="space-y-4">
                {COVERAGE.map(c => (
                  <div key={c.outlet} className="flex items-start gap-4 py-4 border-b last:border-0"
                    style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                    <div className="w-24 flex-shrink-0">
                      <span className="font-mono text-[10px] tracking-[.08em] uppercase" style={{ color: '#C9A84C' }}>{c.outlet}</span>
                    </div>
                    <p className="font-b text-[13px] italic" style={{ color: 'rgba(232,238,248,.55)' }}>{c.headline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contacts + brand */}
          <div className="space-y-6">
            {/* Press contact */}
            <div className="glass noise rounded-2xl p-7">
              <h2 className="font-d text-[18px] font-bold mb-5" style={{ color: '#E8EEF8' }}>Press Contact</h2>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Email', val: 'press@baharmilo.com' },
                  { label: 'Response time', val: 'Within 48 hours' },
                  { label: 'Based', val: 'New Delhi, India' },
                ].map(c => (
                  <div key={c.label}>
                    <div className="font-mono text-[9px] tracking-[.12em] uppercase mb-0.5" style={{ color: 'rgba(232,238,248,.28)' }}>{c.label}</div>
                    <div className="font-b text-[13px]" style={{ color: '#E8EEF8' }}>{c.val}</div>
                  </div>
                ))}
              </div>
              <a href="mailto:press@baharmilo.com"
                className="shim w-full font-mono text-[10px] font-bold tracking-[.12em] uppercase py-3 rounded-full text-center block transition-all"
                style={{ background: '#C9A84C', color: '#050505' }}>
                Email Press Team
              </a>
            </div>

            {/* Brand assets */}
            <div className="glass noise rounded-2xl p-7">
              <h2 className="font-d text-[18px] font-bold mb-5" style={{ color: '#E8EEF8' }}>Brand Assets</h2>
              <div className="space-y-3">
                {['Logo (SVG + PNG)', 'Brand Colors Guide', 'Typography Sheet', 'Product Screenshots'].map(a => (
                  <div key={a} className="flex items-center justify-between py-3 border-b"
                    style={{ borderColor: 'rgba(255,255,255,.05)' }}>
                    <span className="font-b text-[13px]" style={{ color: 'rgba(232,238,248,.55)' }}>{a}</span>
                    <span className="font-mono text-[9px] tracking-[.08em] uppercase px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(201,168,76,.08)', color: 'rgba(201,168,76,.5)', border: '0.5px solid rgba(201,168,76,.2)' }}>
                      Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
