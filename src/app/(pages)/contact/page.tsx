import type { Metadata } from 'next'

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
            <form className="glass noise rounded-2xl p-8 md:p-10 space-y-5">
              {[
                { id: 'name',  label: 'Full Name',  type: 'text',  placeholder: 'Your name'     },
                { id: 'email', label: 'Email',       type: 'email', placeholder: 'you@email.com' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="font-mono text-[9px] tracking-[.14em] uppercase block mb-2"
                    style={{ color: 'rgba(232,238,248,.35)' }}>
                    {f.label}
                  </label>
                  <input id={f.id} type={f.type} required placeholder={f.placeholder}
                    className="w-full rounded-xl px-4 py-3 font-b text-[14px] outline-none transition-colors duration-300"
                    style={{
                      background: 'rgba(255,255,255,.03)',
                      border: '0.5px solid rgba(255,255,255,.08)',
                      color: '#E8EEF8',
                    }}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="city" className="font-mono text-[9px] tracking-[.14em] uppercase block mb-2"
                  style={{ color: 'rgba(232,238,248,.35)' }}>
                  City
                </label>
                <select id="city" required defaultValue=""
                  className="w-full rounded-xl px-4 py-3 font-b text-[14px] outline-none transition-colors duration-300 appearance-none"
                  style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', color: '#E8EEF8' }}>
                  <option value="" disabled>Select your city</option>
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[.14em] uppercase block mb-3"
                  style={{ color: 'rgba(232,238,248,.35)' }}>
                  What are you into?
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Techno', 'Comedy', 'Art', 'Food Walks', 'Meetups', 'Rooftops'].map(tag => (
                    <label key={tag} className="cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <span className="font-mono text-[9px] tracking-[.08em] uppercase px-3 py-2 rounded-full border block transition-all duration-200 peer-checked:bg-goldDim peer-checked:border-goldBdr peer-checked:text-gold"
                        style={{ borderColor: 'rgba(255,255,255,.08)', color: 'rgba(232,238,248,.35)' }}>
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit"
                className="w-full font-mono text-[11px] font-bold tracking-[.12em] uppercase py-4 rounded-full transition-all hover:opacity-90 mt-2"
                style={{ background: '#C9A84C', color: '#050505' }}>
                Join Waitlist
              </button>
              <p className="font-mono text-[9px] text-center tracking-[.06em]"
                style={{ color: 'rgba(232,238,248,.2)' }}>
                Zero spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
