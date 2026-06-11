'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SitePreloader() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate fast ramp-up
    const steps = [
      { val: 15, delay: 0 },
      { val: 40, delay: 120 },
      { val: 65, delay: 280 },
      { val: 85, delay: 450 },
      { val: 100, delay: 620 },
    ]
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach(({ val, delay }) => {
      timers.push(setTimeout(() => setProgress(val), delay))
    })
    timers.push(setTimeout(() => setShow(false), 1400))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(16px)' }}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050505' }}
        >
          {/* Ambient radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,.08) 0%, transparent 65%)' }} />
          </div>

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 mb-12 flex flex-col items-center gap-3"
          >
            <span className="font-d text-[56px] font-black tracking-[-0.04em] text-white leading-none">
              mil<span style={{ color: '#C9A84C' }}>o</span>
            </span>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.38, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-mono text-[10px] tracking-[0.28em] uppercase text-white"
            >
              Your city's social radar
            </motion.p>
          </motion.div>

          {/* Gradient loading bar — the sick one */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/[.06]">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full relative overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #C9A84C 0%, #f9b432 30%, #b48cff 65%, #3ce6b4 100%)',
                boxShadow: '0 0 24px rgba(201,168,76,.6), 0 0 8px rgba(180,140,255,.4)',
              }}
            >
              {/* Moving shimmer on the bar */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.35) 50%, transparent 100%)',
                  backgroundSize: '60% 100%',
                }}
                animate={{ backgroundPosition: ['-60% 0%', '160% 0%'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* Progress number */}
          <motion.div
            className="absolute bottom-5 right-6 font-mono text-[10px] tracking-[.1em]"
            style={{ color: 'rgba(201,168,76,.5)' }}
          >
            <motion.span
              key={progress}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {progress.toString().padStart(3, '0')}
            </motion.span>
          </motion.div>

          {/* Bottom-left city line */}
          <div className="absolute bottom-5 left-6 font-mono text-[9px] tracking-[.18em] uppercase"
            style={{ color: 'rgba(255,255,255,.18)' }}>
            Delhi · Mumbai · Bangalore
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
