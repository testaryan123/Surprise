import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TRAIL_LENGTH = 10

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [trail, setTrail] = useState([])
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const raf = useRef(null)

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      setTrail(prev => {
        const next = [{ x: e.clientX, y: e.clientY, id: Date.now() + Math.random() }, ...prev]
        return next.slice(0, TRAIL_LENGTH)
      })
    }

    const animate = () => {
      if (ringRef.current) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top = ringPos.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move, { passive: true })
    raf.current = requestAnimationFrame(animate)

    // Hide cursor on leave, show on enter
    document.addEventListener('mouseleave', () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    })
    document.addEventListener('mouseenter', () => {
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <AnimatePresence>
        {trail.map((p, i) => (
          <motion.div
            key={p.id}
            className="cursor-trail"
            style={{
              left: p.x,
              top: p.y,
              width: Math.max(2, 8 - i),
              height: Math.max(2, 8 - i),
              background: `rgba(255,45,120,${(1 - i / TRAIL_LENGTH) * 0.4})`,
              boxShadow: `0 0 ${6 - i}px rgba(255,45,120,${(1 - i / TRAIL_LENGTH) * 0.3})`,
            }}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
