import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKonamiListener } from '../hooks/useKonamiListener'

const SECRET_WORD = 'vartika'
const PETAL_COUNT = 50

function generatePetals() {
  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 3,
    drift: `${(Math.random() - 0.5) * 200}px`,
    color: ['#ff2d78', '#e2a84b', '#c41454', '#ff6fa8', '#ffb347'][Math.floor(Math.random() * 5)],
    rotate: Math.random() * 360,
  }))
}

function RosePetal({ petal }) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        left: `${petal.x}%`,
        top: -60,
        width: petal.size,
        height: petal.size * 0.7,
        borderRadius: '50% 0 50% 0',
        background: petal.color,
        opacity: 0.85,
        zIndex: 10003,
        pointerEvents: 'none',
        boxShadow: `0 0 8px ${petal.color}88`,
        '--drift': petal.drift,
      }}
      initial={{ y: -60, rotate: petal.rotate, opacity: 0.9, x: 0 }}
      animate={{
        y: '110vh',
        rotate: petal.rotate + 720,
        opacity: 0,
        x: petal.drift,
      }}
      transition={{
        duration: petal.duration,
        delay: petal.delay,
        ease: 'easeIn',
      }}
    />
  )
}

export default function EasterEgg({ onTitleTap }) {
  const [active, setActive] = useState(false)
  const [petals, setPetals] = useState([])
  const tapCount = useRef(0)
  const tapTimer = useRef(null)
  const resetTimer = useRef(null)

  const trigger = useCallback(() => {
    if (active) return
    setPetals(generatePetals())
    setActive(true)
    resetTimer.current = setTimeout(() => {
      setActive(false)
      setPetals([])
    }, 7000)
  }, [active])

  // Keyboard listener
  useKonamiListener(SECRET_WORD, trigger)

  // Mobile — 5 taps on title
  useEffect(() => {
    if (onTitleTap) {
      tapCount.current += 1
      clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => { tapCount.current = 0 }, 2000)
      if (tapCount.current >= 5) {
        tapCount.current = 0
        trigger()
      }
    }
  }, [onTitleTap, trigger])

  useEffect(() => {
    return () => {
      clearTimeout(resetTimer.current)
      clearTimeout(tapTimer.current)
    }
  }, [])

  return (
    <>
      {/* Petals */}
      <AnimatePresence>
        {active && petals.map(p => <RosePetal key={p.id} petal={p} />)}
      </AnimatePresence>

      {/* Center message */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="easter-egg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => { setActive(false); setPetals([]) }}
          >
            <motion.div
              style={{ textAlign: 'center', padding: '2rem', maxWidth: 500 }}
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              {/* Glowing rose SVG */}
              <motion.div
                style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(255,45,120,0.8))' }}
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌹
              </motion.div>

              <motion.p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                  background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                you found the secret ✦
              </motion.p>

              <motion.p
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '1.2rem',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                You typed your own name — because the universe
                <br />always finds a way back to you, Vartika.
                <br />And so do I. ✦
              </motion.p>

              {/* Glowing name */}
              <motion.p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: '2rem',
                  color: '#ff2d78',
                  textShadow: '0 0 30px rgba(255,45,120,0.8), 0 0 60px rgba(255,45,120,0.4)',
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Vartika
              </motion.p>

              <motion.p
                style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', marginTop: '2rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                tap anywhere to close
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
