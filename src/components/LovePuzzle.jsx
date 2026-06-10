import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Use your real photo! Drop any square-ish photo in public/photos/ and update this path
const IMAGE_URL = '/photos/photo1.jpg'
const GRID_SIZE = 3
const PIECE_SIZE = 110

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LovePuzzle() {
  // slots[i] = piece id placed there, or null
  const [slots, setSlots] = useState(Array(GRID_SIZE * GRID_SIZE).fill(null))
  // tray: list of piece ids not yet placed
  const [tray, setTray] = useState([])
  const [dragging, setDragging] = useState(null) // { pieceId, from: 'tray'|slotIndex }
  const [isSolved, setIsSolved] = useState(false)

  useEffect(() => {
    const ids = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)
    setTray(shuffle(ids))
  }, [])

  const checkSolved = (newSlots) => {
    const solved = newSlots.every((pid, i) => pid === i)
    if (solved) setIsSolved(true)
  }

  const handleDragStart = (pieceId, from) => {
    setDragging({ pieceId, from })
  }

  const handleDropOnSlot = (slotIndex) => {
    if (!dragging) return
    const { pieceId, from } = dragging

    setSlots(prev => {
      const newSlots = [...prev]
      // If slot is occupied, swap or return to tray
      const existingPiece = newSlots[slotIndex]

      // Remove piece from its source
      if (from === 'tray') {
        setTray(t => {
          const newTray = t.filter(id => id !== pieceId)
          if (existingPiece !== null) newTray.push(existingPiece)
          return newTray
        })
      } else {
        newSlots[from] = existingPiece !== null ? null : null
        if (existingPiece !== null) {
          // put existing piece back at the source slot or tray
          newSlots[from] = existingPiece
        } else {
          newSlots[from] = null
        }
        // Clear old slot
        newSlots[from] = existingPiece // swap: put existing in old slot
      }

      newSlots[slotIndex] = pieceId
      if (from !== 'tray') newSlots[from] = existingPiece

      checkSolved(newSlots)
      return newSlots
    })
    setDragging(null)
  }

  const handleDropOnTray = () => {
    if (!dragging) return
    const { pieceId, from } = dragging
    if (from === 'tray') { setDragging(null); return }
    // Remove from slot, add to tray
    setSlots(prev => {
      const newSlots = [...prev]
      newSlots[from] = null
      return newSlots
    })
    setTray(t => [...t, pieceId])
    setDragging(null)
  }

  const renderPiece = (pieceId, from, style = {}) => (
    <div
      draggable
      onDragStart={() => handleDragStart(pieceId, from)}
      onDragEnd={() => setDragging(null)}
      key={pieceId}
      style={{
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        backgroundImage: `url(${IMAGE_URL})`,
        backgroundSize: `${GRID_SIZE * PIECE_SIZE}px ${GRID_SIZE * PIECE_SIZE}px`,
        backgroundPosition: `-${(pieceId % GRID_SIZE) * PIECE_SIZE}px -${Math.floor(pieceId / GRID_SIZE) * PIECE_SIZE}px`,
        cursor: 'grab',
        borderRadius: 8,
        boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        flexShrink: 0,
        transition: 'transform 0.15s, box-shadow 0.15s',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,45,120,0.5)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)' }}
    />
  )

  const totalWidth = GRID_SIZE * PIECE_SIZE

  return (
    <section id="love-puzzle" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      position: 'relative',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.75rem',
        }}>
          The Love Puzzle
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
          Drag the pieces from below into the board to reveal a hidden message 💖
        </p>
      </motion.div>

      {/* Puzzle Board */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDropOnTray}
        style={{ position: 'relative', marginBottom: '2rem' }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          border: '2px solid rgba(255,255,255,0.15)',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: '0 0 40px rgba(255,45,120,0.1)',
        }}>
          {slots.map((pieceId, slotIndex) => (
            <div
              key={slotIndex}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.stopPropagation(); handleDropOnSlot(slotIndex) }}
              style={{
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                border: '1px dashed rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: pieceId === null ? 'rgba(255,255,255,0.02)' : 'transparent',
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              {pieceId !== null && renderPiece(pieceId, slotIndex, { borderRadius: 0, boxShadow: 'none' })}
              {pieceId === null && (
                <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.5rem' }}>◌</span>
              )}
            </div>
          ))}
        </div>

        {/* Solved Overlay */}
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                backdropFilter: 'blur(4px)',
                zIndex: 10,
              }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'linear-gradient(135deg, rgba(255,45,120,0.25), rgba(226,168,75,0.25))',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  boxShadow: '0 0 40px rgba(255,45,120,0.5)',
                  maxWidth: 300,
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 10 }}>💖</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  color: '#fff',
                  marginBottom: 10,
                }}>
                  You Complete Me
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Just like this puzzle, my world is only whole when you are in it. I love you so much! ✨
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tray of remaining pieces */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDropOnTray}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          maxWidth: totalWidth + 60,
          minHeight: PIECE_SIZE + 24,
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 16,
        }}
      >
        {tray.length === 0 && !isSolved && (
          <p style={{ color: 'rgba(255,255,255,0.3)', alignSelf: 'center', margin: 0 }}>All pieces placed!</p>
        )}
        {tray.map(pieceId => renderPiece(pieceId, 'tray'))}
      </div>
    </section>
  )
}
