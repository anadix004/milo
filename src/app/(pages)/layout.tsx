import type { Metadata } from 'next'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Grain from '@/components/Grain'
import SitePreloader from '@/components/SitePreloader'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata: Metadata = {
  metadataBase: new URL('https://baharmilo.com'),
}

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SitePreloader />
      <Grain />
      <SiteNav />
      <ScrollReveal />
      <main className="min-h-screen" style={{ background: '#050505' }}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
