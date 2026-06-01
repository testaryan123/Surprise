import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const raf = useRef(null)
  const start = useRef(null)

  useEffect(() => {
    const duration = 2800
    const animate = (ts) => {
      if (!start.current) start.current = ts
      const elapsed = ts - start.current
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(Math.floor(p))
      if (p < 100) {
        raf.current = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 600)
        }, 300)
      }
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Stars bg */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {Array.from({ length: 80 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  borderRadius: '50%',
                  background: '#fff',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.1,
                }}
                animate={{ opacity: [null, Math.random() * 0.8 + 0.2, Math.random() * 0.2] }}
                transition={{ duration: Math.random() * 3 + 1, repeat: Infinity, repeatType: 'mirror' }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glowing orb */}
            <motion.div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ff2d78 0%, rgba(255,45,120,0.2) 70%, transparent 100%)',
                boxShadow: '0 0 40px rgba(255,45,120,0.8), 0 0 80px rgba(255,45,120,0.4)',
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>
                preparing your universe...
              </p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '1.6rem',
                background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Vartika
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ width: 280 }}>
              <div className="loading-bar-track">
                <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '0.7rem',
                textAlign: 'right',
                marginTop: '6px',
                fontFamily: 'monospace',
              }}>{progress}%</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
