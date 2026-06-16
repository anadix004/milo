import Link from 'next/link'

const FOOTER_LINKS = {
  Discover: [
    { href: '/events',         label: 'All Events'  },
    { href: '/city/delhi',     label: 'Delhi'       },
    { href: '/city/mumbai',    label: 'Mumbai'      },
    { href: '/city/bengaluru', label: 'Bengaluru'   },
  ],
  Company: [
    { href: '/about',   label: 'About'   },
    { href: '/blog',    label: 'Blog'    },
    { href: '/press',   label: 'Press'   },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms',   label: 'Terms of Service' },
  ],
}

export default function SiteFooter() {
  return (
    <footer className="relative border-t mt-20" style={{ borderColor: 'rgba(255,255,255,.05)' }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,.3), transparent)' }} />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-d text-[28px] font-black tracking-[-0.04em] text-white mb-3">
              mil<span style={{ color: '#C9A84C' }}>o</span>
            </div>
            <p className="font-b text-[12px] leading-[1.75]" style={{ color: 'rgba(232,238,248,.38)' }}>
              India's premier going-out platform. Don't miss tonight.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              <div className="gold-dot" />
              <span className="font-mono text-[9px] tracking-[.14em] uppercase" style={{ color: 'rgba(201,168,76,.6)' }}>
                Live in Delhi, Mumbai & Bengaluru
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-[9px] tracking-[.16em] uppercase mb-4"
                style={{ color: 'rgba(232,238,248,.28)' }}>
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="font-b text-[13px] transition-colors duration-300 hover:text-white"
                      style={{ color: 'rgba(232,238,248,.45)' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,.04)' }}>
          <p className="font-mono text-[9px] tracking-[.1em] uppercase"
            style={{ color: 'rgba(232,238,248,.2)' }}>
            © {new Date().getFullYear()} Milo · Built in Delhi
          </p>
          <p className="font-mono text-[9px] tracking-[.08em] uppercase"
            style={{ color: 'rgba(232,238,248,.14)' }}>
            Bahar Niklo · دل سے
          </p>
        </div>
      </div>
    </footer>
  )
}
