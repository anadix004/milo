'use client'

import { useEffect } from 'react'

/**
 * Animates elements with class `.sr` on scroll.
 * Works with CSS: `.sr { opacity: 0; transform: translateY(32px); }`
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sr')
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.style.transition = 'opacity .65s cubic-bezier(.25,1,.5,1), transform .65s cubic-bezier(.25,1,.5,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
