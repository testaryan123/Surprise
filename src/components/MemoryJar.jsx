import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MEMORIES = [
  "That time we laughed so hard our stomachs hurt! 😂",
  "Our very first date, I was so nervous but you were perfect.",
  "When we stayed up all night just talking about everything.",
  "Your smile that morning we had coffee together. ☕️",
  "The way you held my hand during that movie.",
  "When you surprised me and made my whole week!",
  "Just sitting in comfortable silence, knowing I'm with you."
]

export default function MemoryJar() {
  const [activeMemory, setActiveMemory] = useState(null)
  const [droppedTokens, setDroppedTokens] = useState(0)
  
  // Create 5 tokens
  const [tokens, setTokens] = useState([
    { id: 1, emoji: '✨', dropped: false },
    { id: 2, emoji: '💖', dropped: false },
    { id: 3, emoji: '🌟', dropped: false },
    { id: 4, emoji: '🧸', dropped: false },
    { id: 5, emoji: '💌', dropped: false },
  ])

  const jarRef = useRef(null)
  const tokenRefs = useRef({})

  const handleDragEnd = (event, info, token) => {
    if (!jarRef.current) return
    const jarRect = jarRef.current.getBoundingClientRect()
    const tokenEl = tokenRefs.current[token.id]
    if (!tokenEl) return
    const tokenRect = tokenEl.getBoundingClientRect()
    
    const tokenCenterX = tokenRect.left + tokenRect.width / 2
    const tokenCenterY = tokenRect.top + tokenRect.height / 2
    
    // Check if the center of the token is within the jar (with some tolerance)
    if (
      tokenCenterX > jarRect.left - 50 &&
      tokenCenterX < jarRect.right + 50 &&
      tokenCenterY > jarRect.top - 50 &&
      tokenCenterY < jarRect.bottom + 50
    ) {
      // Mark token as dropped
      setTokens(prev => prev.map(t => t.id === token.id ? { ...t, dropped: true } : t))
      setDroppedTokens(prev => prev + 1)
      
      // Reveal a random memory
      const randomMemory = MEMORIES[Math.floor(Math.random() * MEMORIES.length)]
      setActiveMemory(randomMemory)
    }
  }

  return (
    <section id="memory-jar" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 10 }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
        }}>
          The Memory Jar
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Drag and drop a token into the jar to unlock a cherished memory.
        </p>
      </motion.div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4rem',
        width: '100%',
        maxWidth: '900px',
        flexWrap: 'wrap',
      }}>
        
        {/* Jar Container */}
        <div ref={jarRef} style={{
          width: '240px',
          height: '320px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px 20px 40px 40px',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '20px',
          boxShadow: 'inset 0 0 40px rgba(255, 45, 120, 0.1), 0 10px 30px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
        }}>
          {/* Jar Lid styling */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            width: '110%',
            height: '30px',
            background: 'linear-gradient(90deg, #8a5a19, #e2a84b, #8a5a19)',
            borderRadius: '10px',
            boxShadow: '0 5px 10px rgba(0,0,0,0.3)',
          }} />

          {/* Dropped tokens indicator inside jar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap-reverse',
            justifyContent: 'center',
            gap: '10px',
            width: '80%',
            maxHeight: '80%',
          }}>
            {Array.from({ length: droppedTokens }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -200, opacity: 0, rotate: -50 }}
                animate={{ y: 0, opacity: 1, rotate: Math.random() * 40 - 20 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{ fontSize: '2rem' }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tokens Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {tokens.map(token => (
            !token.dropped && (
              <motion.div
                ref={el => tokenRefs.current[token.id] = el}
                key={token.id}
                drag
                dragConstraints={{ left: -500, right: 50, top: -300, bottom: 300 }}
                dragElastic={1}
                onDragEnd={(e, info) => handleDragEnd(e, info, token)}
                whileHover={{ scale: 1.2 }}
                whileDrag={{ scale: 1.3, cursor: 'grabbing' }}
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: 'grab',
                  boxShadow: '0 0 15px rgba(226, 168, 75, 0.3)',
                  zIndex: 20,
                }}
              >
                {token.emoji}
              </motion.div>
            )
          ))}
          {droppedTokens === 5 && (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              The jar is full of love!
            </div>
          )}
        </div>
      </div>

      {/* Memory Reveal Modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(10, 2, 5, 0.95)',
              border: '1px solid rgba(255, 45, 120, 0.4)',
              padding: '3rem',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              zIndex: 9999,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255, 45, 120, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              color: '#fff',
              lineHeight: '1.6',
              marginBottom: '2rem',
            }}>
              "{activeMemory}"
            </p>
            <button
              onClick={() => setActiveMemory(null)}
              style={{
                background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '30px',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Keep Memory Safe
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dim background when modal is open */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 9998,
            }}
            onClick={() => setActiveMemory(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
