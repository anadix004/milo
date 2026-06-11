import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — The Milo Circuit',
  description: "Guides, spotlights, and stories from India's going-out scene. City guides, event tips, and behind-the-scenes from Milo.",
}

const POSTS = [
  {
    slug: 'delhi-techno-guide',
    title: "The Complete Guide to Delhi's Underground Techno Scene",
    excerpt: "From Auro to warehouse raves in Okhla — your definitive guide to the capital's electronic music circuit.",
    date: '2025-01-15',
    tag: 'City Guide',
    city: 'Delhi',
    accent: '#4A7FD4',
  },
  {
    slug: 'mumbai-sunset-spots',
    title: "Mumbai's Best Sunset Spots (That Aren't Marine Drive)",
    excerpt: "Secret rooftops, hidden beaches, and the spots the locals actually go to when the sky turns gold.",
    date: '2025-01-10',
    tag: 'Listicle',
    city: 'Mumbai',
    accent: '#f9643c',
  },
  {
    slug: 'how-milo-works',
    title: 'How Milo Works: From Radar to RSVP',
    excerpt: 'A deep dive into the three steps that take you from scrolling to showing up. No more "send me the link".',
    date: '2025-01-05',
    tag: 'Feature',
    city: 'All',
    accent: '#C9A84C',
  },
  {
    slug: 'bangalore-indie-gigs',
    title: "Bangalore's Indie Gig Scene Is Booming — Here's Where to Start",
    excerpt: "Church Street basements to Indiranagar rooftops. BLR's live music circuit is the country's best-kept secret.",
    date: '2024-12-28',
    tag: 'City Guide',
    city: 'Bangalore',
    accent: '#3DB865',
  },
  {
    slug: 'art-of-showing-up',
    title: 'The Art of Showing Up: Why Solo Event-Going Slaps',
    excerpt: "You don't need a crew. You need curiosity and a good playlist for the auto ride. Here's why going alone is the move.",
    date: '2024-12-15',
    tag: 'Culture',
    city: 'All',
    accent: '#b48cff',
  },
  {
    slug: 'hauz-khas-village',
    title: 'Hauz Khas Village After Dark: A Survival Guide',
    excerpt: "Craft beer, open mics, rooftop bars, and the heritage lake at midnight. The village that never sleeps.",
    date: '2024-12-05',
    tag: 'City Guide',
    city: 'Delhi',
    accent: '#4A7FD4',
  },
]

export default function BlogPage() {
  const [featured, ...rest] = POSTS

  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-14 page-in">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>
            The Circuit Blog
          </span>
          <h1 className="font-d text-[clamp(36px,6vw,88px)] font-black leading-[.86] tracking-[-0.04em]"
            style={{ color: '#E8EEF8' }}>
            Stories from<br />
            <span style={{ color: 'rgba(232,238,248,.22)', WebkitTextStroke: '1px rgba(232,238,248,.15)' }}>
              the circuit.
            </span>
          </h1>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`}
          className="group glass noise rounded-2xl overflow-hidden flex flex-col md:flex-row mb-8">
          <div className="img-h md:w-[45%] h-[220px] md:h-auto flex-shrink-0 relative"
            style={{ background: `linear-gradient(135deg, ${featured.accent}22 0%, rgba(5,5,5,.9) 100%)`, minHeight: '220px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-d text-[80px] font-black opacity-10" style={{ color: featured.accent }}>01</span>
            </div>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[9px] tracking-[.12em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${featured.accent}18`, color: featured.accent, border: `0.5px solid ${featured.accent}44` }}>
                {featured.tag}
              </span>
              <span className="font-mono text-[9px]" style={{ color: 'rgba(232,238,248,.3)' }}>
                {new Date(featured.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="font-d text-[clamp(20px,2.5vw,32px)] font-bold leading-tight tracking-[-0.02em] mb-4 group-hover:opacity-80 transition-opacity"
              style={{ color: '#E8EEF8' }}>
              {featured.title}
            </h2>
            <p className="font-b text-[14px] leading-[1.7]" style={{ color: 'rgba(232,238,248,.45)' }}>
              {featured.excerpt}
            </p>
            <div className="mt-6 font-mono text-[10px] tracking-[.1em] uppercase transition-colors"
              style={{ color: featured.accent }}>
              Read more →
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="group glass noise rounded-2xl overflow-hidden flex flex-col">
              <div className="h-[160px] flex-shrink-0 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${p.accent}18 0%, rgba(5,5,5,.95) 100%)` }}>
                <span className="font-d text-[60px] font-black opacity-8"
                  style={{ color: p.accent, opacity: 0.08 }}>
                  {String(i + 2).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[8px] tracking-[.1em] uppercase px-2 py-1 rounded-full"
                    style={{ background: `${p.accent}18`, color: p.accent, border: `0.5px solid ${p.accent}33` }}>
                    {p.tag}
                  </span>
                  <span className="font-mono text-[9px]" style={{ color: 'rgba(232,238,248,.25)' }}>
                    {new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-d text-[16px] font-bold leading-tight group-hover:opacity-75 transition-opacity"
                  style={{ color: '#E8EEF8' }}>
                  {p.title}
                </h3>
                <p className="font-b text-[12px] leading-[1.65] line-clamp-2 mt-auto"
                  style={{ color: 'rgba(232,238,248,.38)' }}>
                  {p.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
