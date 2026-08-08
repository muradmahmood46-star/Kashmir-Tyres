import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../utils/gsap'

/**
 * Wraps page content and fades/slides it in smoothly on route change.
 * Uses the `key` prop on the wrapper to re-trigger the animation
 * whenever the route changes.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform',
        },
      )
    }
  }, [])

  return (
    <div ref={ref} className="min-h-screen">
      {children}
    </div>
  )
}