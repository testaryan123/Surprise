import { useRef, useEffect } from 'react'

export function useMouseParallax(strength = 0.02) {
  const ref = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      ref.current.x = (e.clientX - cx) * strength
      ref.current.y = (e.clientY - cy) * strength
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [strength])

  return ref
}
