import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MOMENTS = [
  { id: 1, photo: '/photos/photo1.jpg', date: 'The Beginning', front: 'Where it all started', back: 'Every great story has that first page — this was ours. I still remember the exact moment I realized you were someone truly special.' },
  { id: 2, photo: '/photos/photo2.jpg', date: 'A Quiet Afternoon', front: 'The little things', back: 'It wasn\'t the grand gestures — it was the way you laughed at the smallest things, the way time slowed when you were around.' },
  { id: 3, photo: '/photos/photo3.jpg', date: 'Golden Days', front: 'Light follows you', back: 'You have this rare ability to make everything feel warmer, brighter. Like the sun decided to follow you around.' },
  { id: 4, photo: '/photos/photo4.jpg', date: 'A Moment Frozen', front: 'Worth a thousand words', back: 'Some moments you just want to press pause and live in forever. This was one of them.' },
  { id: 5, photo: '/photos/photo5.jpg', date: 'Your Universe', front: 'Stars in your eyes', back: 'I\'ve looked at a lot of beautiful things, but nothing compares to the way you look when you\'re genuinely happy.' },
  { id: 6, photo: '/photos/photo6.jpg', date: 'Pure Joy', front: 'That laugh ✦', back: 'Your laugh is the kind of sound that makes everything okay. I could listen to it forever and never get tired.' },
  { id: 7, photo: '/photos/photo7.jpg', date: 'Soft Light', front: 'Effortlessly you', back: 'You don\'t try to be extraordinary — you just are. That\'s what makes you so remarkable, Vartika.' },
]

function TimelineCard({ moment, index }) {
  const [flipped, setFlipped] = useState(false)
  const tilt = ((index % 7) - 3) * 1.2

  return (
    <motion.div
      style={{ minWidth: 240, maxWidth: 260, flexShrink: 0 }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="flip-card"
        style={{ height: 360 }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`} style={{
          position: 'relative', width: '100%', height: '100%',
          transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: `rotate(${tilt}deg)`,
          }}>
            <div className="polaroid" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <img
                src={moment.photo}
                alt={moment.date}
                loading="lazy"
                style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.style.background = `linear-gradient(135deg, #1a0533, rgba(255,45,120,0.4))`
                  e.target.removeAttribute('src')
                }}
              />
              <div style={{ padding: '8px 4px' }}>
                <p style={{ fontFamily: "'Dancing Script', cursive", color: '#8b6a3a', fontSize: '0.8rem', marginBottom: 4 }}>
                  {moment.date}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#2a1a0a', fontSize: '0.75rem', opacity: 0.7 }}>
                  {moment.front}
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#ff2d78', fontSize: '0.65rem', marginTop: 4, opacity: 0.8 }}>
                  tap to reveal ✦
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: `rotateY(180deg) rotate(${-tilt}deg)`,
            background: 'linear-gradient(135deg, #1a0533, #2d0a4e)',
            borderRadius: 8,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid rgba(255,45,120,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 40px rgba(255,45,120,0.03)',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✦</div>
            <p style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              lineHeight: 1.7,
            }}>
              {moment.back}
            </p>
            <div style={{
              marginTop: '1.5rem',
              width: 40, height: 1,
              background: 'linear-gradient(90deg, transparent, #ff2d78, transparent)',
            }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CinematicTimeline() {
  const sectionRef = useRef()
  const trackRef = useRef()
  const progressRef = useRef()
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const totalScroll = track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          onUpdate: (self) => setScrollPct(self.progress),
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="timeline"
      style={{ overflow: 'hidden', background: '#020008', position: 'relative' }}
    >
      {/* Nebula background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(26,5,51,0.9) 0%, transparent 70%), radial-gradient(ellipse at 70% 50%, rgba(255,45,120,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        position: 'absolute', top: '3rem', left: 0, right: 0,
        textAlign: 'center', zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{ color: 'rgba(255,45,120,0.7)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          ✦ our timeline ✦
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          background: 'linear-gradient(135deg, #fff, #e2a84b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Moments Worth Keeping
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
          scroll to travel through time →
        </p>
      </div>

      {/* Scrolling track */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div
          ref={trackRef}
          className="timeline-track"
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '6rem 4rem 4rem',
            willChange: 'transform',
          }}
        >
          {MOMENTS.map((m, i) => (
            <TimelineCard key={m.id} moment={m} index={i} />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '4rem', right: '4rem',
        height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99, zIndex: 2,
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #ff2d78, #e2a84b)',
            borderRadius: 99,
            width: `${scrollPct * 100}%`,
            boxShadow: '0 0 8px rgba(255,45,120,0.6)',
          }}
        />
      </div>
    </section>
  )
}
