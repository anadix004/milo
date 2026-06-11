export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
      <div className="flex flex-col items-center gap-6">
        {/* Animated gradient bars */}
        <div className="flex items-end gap-1.5 h-10">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                background: 'linear-gradient(to top, #C9A84C, #b48cff)',
                animation: `bar-bounce 1.1s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes bar-bounce {
            0%, 100% { height: 8px; opacity: .35; }
            50%       { height: 40px; opacity: 1; }
          }
        `}</style>
        <p className="font-mono text-[9px] tracking-[.22em] uppercase"
          style={{ color: 'rgba(201,168,76,.4)' }}>
          Loading
        </p>
      </div>
    </div>
  )
}
