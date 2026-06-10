import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────
// ADD YOUR PHOTOS HERE — just drop files in public/photos/
// and list them below with a caption!
// ─────────────────────────────────────────────────────────────────
const PHOTOS = [
  { src: '/photos/photo1.jpg',  caption: 'My favourite memory of us 🌸' },
  { src: '/photos/photo2.jpg',  caption: 'You looked so beautiful here 💖' },
  { src: '/photos/photo3.jpg',  caption: 'This smile is my whole world ✨' },
  { src: '/photos/photo4.jpg',  caption: 'I never want this to end 🫂' },
  { src: '/photos/photo5.jpg',  caption: 'Every moment with you is magic 🌙' },
  { src: '/photos/photo6.jpg',  caption: 'You make everything better 🌼' },
  { src: '/photos/photo7.jpg',  caption: 'My heart belongs to you 💝' },
  { src: '/photos/photo8.jpg',  caption: 'I love your laugh so much 😄' },
  { src: '/photos/photo9.jpg',  caption: 'Forever would not be enough ♾️' },
  { src: '/photos/photo10.jpg', caption: 'My person, always 🥺❤️' },
]

// ─────────────────────────────────────────────────────────────────
// ADD YOUR VIDEOS HERE — drop files in public/videos/ and list them!
// ─────────────────────────────────────────────────────────────────
const VIDEOS = [
  { src: '/videos/WhatsApp Video 2026-06-01 at 12.21.19 AM.mp4', caption: 'A beautiful moment together 🎥✨' },
  { src: '/videos/WhatsApp Video 2026-06-01 at 12.21.21 AM.mp4', caption: 'You make every second magical 💖' },
  { src: '/videos/WhatsApp Video 2026-06-01 at 12.21.25 AM.mp4', caption: 'Forever captured in time 🌙' },
]

export default function OurGallery() {
  const [lightbox, setLightbox] = useState(null) // { type: 'photo'|'video', index }
  const [tab, setTab]           = useState('photos') // 'photos' | 'videos'
  const videoRef                = useRef(null)

  const items = tab === 'photos' ? PHOTOS : VIDEOS
  const current = lightbox !== null ? items[lightbox] : null

  const goNext = () => setLightbox(i => (i + 1) % items.length)
  const goPrev = () => setLightbox(i => (i - 1 + items.length) % items.length)

  return (
    <section id="our-gallery" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '5rem 2rem',
      position: 'relative',
    }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '1.5rem' }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.75rem',
        }}>
          Our Universe 📸
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
          Every photo a star, every video a galaxy — this is us.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        {['photos', 'videos'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.5rem 1.8rem',
              borderRadius: 30,
              border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.15)',
              background: tab === t
                ? 'linear-gradient(135deg, #ff2d78, #e2a84b)'
                : 'rgba(255,255,255,0.05)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: tab === t ? 700 : 400,
              fontSize: '0.95rem',
              transition: 'all 0.3s',
              textTransform: 'capitalize',
            }}
          >
            {t === 'photos' ? `📷 Photos (${PHOTOS.length})` : `🎬 Videos (${VIDEOS.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: 900,
      }}>
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                gridColumn: '1/-1',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.3)',
                padding: '3rem',
                fontStyle: 'italic',
              }}
            >
              {tab === 'videos'
                ? "Add your videos to public/videos/ and update the VIDEOS array in OurGallery.jsx 🎥"
                : "No photos found."}
            </motion.div>
          ) : (
            items.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.04, zIndex: 2 }}
                onClick={() => setLightbox(i)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {tab === 'photos' ? (
                  <img
                    src={item.src}
                    alt={item.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.75rem',
                  transition: 'opacity 0.25s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <p style={{ color: '#fff', fontSize: '0.75rem', margin: 0, lineHeight: 1.3 }}>
                    {item.caption}
                  </p>
                </div>
                {tab === 'videos' && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontSize: '2.5rem', pointerEvents: 'none',
                  }}>▶️</div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && current && (
          <>
            {/* Dim overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.92)',
                zIndex: 9500,
                backdropFilter: 'blur(6px)',
              }}
            />

            {/* Lightbox Content */}
            <motion.div
              key="lightbox"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: 9600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '90vw',
                maxHeight: '90vh',
              }}
            >
              {tab === 'photos' ? (
                <img
                  src={current.src}
                  alt={current.caption}
                  style={{
                    maxWidth: '80vw',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 16,
                    boxShadow: '0 0 60px rgba(255,45,120,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={current.src}
                  controls
                  autoPlay
                  style={{
                    maxWidth: '80vw',
                    maxHeight: '70vh',
                    borderRadius: 16,
                    boxShadow: '0 0 60px rgba(255,45,120,0.3)',
                  }}
                />
              )}

              {/* Caption */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem',
                  color: '#fff',
                  textAlign: 'center',
                  textShadow: '0 0 20px rgba(255,45,120,0.6)',
                  margin: 0,
                }}
              >
                {current.caption}
              </motion.p>

              {/* Navigation */}
              {items.length > 1 && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={e => { e.stopPropagation(); goPrev() }} style={navBtnStyle}>← Prev</button>
                  <span style={{ color: 'rgba(255,255,255,0.4)', alignSelf: 'center', fontSize: '0.85rem' }}>
                    {lightbox + 1} / {items.length}
                  </span>
                  <button onClick={e => { e.stopPropagation(); goNext() }} style={navBtnStyle}>Next →</button>
                </div>
              )}

              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'fixed', top: '1.5rem', right: '1.5rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: 44, height: 44,
                  color: '#fff', fontSize: '1.2rem',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

const navBtnStyle = {
  padding: '0.5rem 1.5rem',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 30,
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.9rem',
  backdropFilter: 'blur(4px)',
}
