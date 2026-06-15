import type { Metadata } from 'next'
import ContactForm from './contact-form'

export const metadata: Metadata = {
  title: 'Join Waitlist — Milo',
  description: 'Join the Milo waitlist and be the first to know when we launch in your city. Early access, exclusive events, zero spam.',
}

export default function ContactPage() {
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-14 md:gap-24">

          {/* Left */}
          <div className="page-in">
            <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>
              Get In
            </span>
            <h1 className="font-d text-[clamp(36px,6vw,80px)] font-black leading-[.86] tracking-[-0.04em] mb-7"
              style={{ color: '#E8EEF8' }}>
              Join the<br />waitlist.
            </h1>
            <p className="font-b text-[15px] leading-[1.75] mb-12" style={{ color: 'rgba(232,238,248,.48)' }}>
              Be first in line when Milo drops in your city. Early access, exclusive events,
              and zero spam — we promise.
            </p>
            <div className="space-y-6">
              {[
                { icon: '✉', label: 'hello@baharmilo.com', sub: 'Partnerships & press' },
                { icon: '💬', label: 'WhatsApp Community', sub: 'City-specific groups' },
                { icon: '📍', label: 'Delhi, India', sub: 'Building from the capital' },
              ].map(c => (
                <div key={c.icon} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[16px]"
                    style={{ background: 'rgba(201,168,76,.08)', border: '0.5px solid rgba(201,168,76,.2)' }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-b text-[14px]" style={{ color: '#E8EEF8' }}>{c.label}</div>
                    <div className="font-mono text-[10px] tracking-[.06em]" style={{ color: 'rgba(232,238,248,.32)' }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="page-in">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
