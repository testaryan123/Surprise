import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CarePackage() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  // Floating particles (hearts, sparkles, etc.)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (isOpen) {
      // Generate particles
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        emoji: ['❤️', '💖', '✨', '🍲', '🧸', '🫂', '🌸', '🪄'][Math.floor(Math.random() * 8)],
        x: Math.random() * 100, // percentage
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
        size: 1 + Math.random() * 2,
      }))
      setParticles(newParticles)

      // Sequence of messages
      const timers = [
        setTimeout(() => setStep(1), 3000),
        setTimeout(() => setStep(2), 7000),
        setTimeout(() => setStep(3), 11000),
        setTimeout(() => setStep(4), 15000),
      ]
      return () => timers.forEach(clearTimeout)
    } else {
      setStep(0)
    }
  }, [isOpen])

  const messages = [
    "I heard you're not feeling well... 🥺",
    "Let me send some virtual magic to heal you...",
    "Sending infinite warm hugs... 🫂",
    "And a bowl of the most magical soup! 🍲✨",
    "Get well soon, my love ❤️ You're the strongest!"
  ]

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 8500,
          background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(255, 45, 120, 0.4)',
        }}
        title="Emergency Care Package"
      >
        🧸
      </motion.button>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(20, 5, 10, 0.85)',
              zIndex: 9000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Particles */}
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ y: '100vh', x: `${p.x}vw`, opacity: 0, scale: 0 }}
                animate={{
                  y: '-10vh',
                  x: `${p.x + (Math.random() * 20 - 10)}vw`,
                  opacity: [0, 1, 1, 0],
                  scale: p.size,
                  rotate: 360 * Math.random(),
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: 'absolute',
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 0 10px rgba(255,45,120,0.5))',
                }}
              >
                {p.emoji}
              </motion.div>
            ))}

            {/* Glowing magical orb behind text */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255,45,120,0.4) 0%, rgba(255,45,120,0) 70%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
              }}
            />

            {/* Message Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  color: '#fff',
                  textAlign: 'center',
                  maxWidth: '80%',
                  textShadow: '0 0 20px rgba(255,45,120,0.8)',
                  lineHeight: '1.4',
                }}
              >
                {messages[step]}
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 4 ? 1 : 0 }}
              transition={{ delay: 1 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                bottom: '10%',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)',
                pointerEvents: step === 4 ? 'auto' : 'none',
              }}
              whileHover={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              Close Care Package
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
