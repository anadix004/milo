import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center"
      style={{ background: '#050505' }}>
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,.05) 0%, transparent 65%)' }} />

      <div className="relative z-10 page-in">
        <div className="font-d text-[120px] md:text-[180px] font-black leading-none tracking-[-0.06em] mb-4"
          style={{ color: 'rgba(232,238,248,.06)', WebkitTextStroke: '1px rgba(201,168,76,.12)' }}>
          404
        </div>
        <p className="font-mono text-[10px] tracking-[.22em] uppercase mb-3"
          style={{ color: '#C9A84C' }}>
          Page not found
        </p>
        <h1 className="font-d text-[clamp(24px,4vw,48px)] font-black tracking-[-0.03em] leading-[.92] mb-5"
          style={{ color: '#E8EEF8' }}>
          Looks like this event<br />got cancelled.
        </h1>
        <p className="font-b text-[14px] mb-10 max-w-sm mx-auto leading-[1.8]"
          style={{ color: 'rgba(232,238,248,.4)' }}>
          The page you're looking for doesn't exist. But there's plenty happening tonight.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/events"
            className="shim font-mono text-[11px] font-bold tracking-[.1em] uppercase px-8 py-3.5 rounded-full transition-all"
            style={{ background: '#C9A84C', color: '#050505' }}>
            Browse Events
          </Link>
          <Link href="/"
            className="font-mono text-[11px] tracking-[.1em] uppercase px-8 py-3.5 rounded-full border transition-all hover:bg-white/[.04]"
            style={{ borderColor: 'rgba(255,255,255,.1)', color: 'rgba(232,238,248,.5)' }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
