import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${title} — Milo Blog`,
    description: 'Read more on The Milo Circuit Blog.',
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  return (
    <article className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog"
          className="font-mono text-[10px] tracking-[.1em] uppercase mb-8 inline-flex items-center gap-2 transition-colors hover:text-white"
          style={{ color: 'rgba(232,238,248,.35)' }}>
          ← Back to Blog
        </Link>

        <div className="mb-8">
          <span className="font-mono text-[9px] tracking-[.16em] uppercase px-2.5 py-1 rounded-full mb-5 inline-block"
            style={{ background: 'rgba(201,168,76,.1)', color: '#C9A84C', border: '0.5px solid rgba(201,168,76,.3)' }}>
            City Guide
          </span>
          <h1 className="font-d text-[clamp(28px,4.5vw,56px)] font-black leading-[.9] tracking-[-0.03em] mt-4 mb-6"
            style={{ color: '#E8EEF8' }}>
            {slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full" style={{ background: 'rgba(201,168,76,.2)' }} />
            <div>
              <div className="font-b text-[13px]" style={{ color: '#E8EEF8' }}>Milo Team</div>
              <div className="font-mono text-[9px]" style={{ color: 'rgba(232,238,248,.3)' }}>January 2025</div>
            </div>
          </div>
        </div>

        {/* Hero placeholder */}
        <div className="rounded-2xl h-[300px] mb-10 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,.025)', border: '0.5px solid rgba(255,255,255,.06)' }}>
          <span className="font-d text-[14px]" style={{ color: 'rgba(232,238,248,.2)' }}>Article Hero Image</span>
        </div>

        {/* Body text */}
        <div className="prose prose-invert max-w-none">
          <p className="font-b text-[15px] leading-[1.9]" style={{ color: 'rgba(232,238,248,.6)' }}>
            In production, this is where the full blog post content renders — whether from MDX files, Supabase rich text, or a CMS.
            The slug for this post is: <code style={{ color: '#C9A84C' }}>{slug}</code>.
          </p>
        </div>
      </div>
    </article>
  )
}
