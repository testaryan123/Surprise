import { useState, useEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import AudioToggle from './components/AudioToggle'
import StarfieldLanding from './components/StarfieldLanding'
import ConstellationGallery from './components/ConstellationGallery'
import CinematicTimeline from './components/CinematicTimeline'
import FloatingObjects from './components/FloatingObjects'
import EasterEgg from './components/EasterEgg'
import MessageInABottle from './components/MessageInABottle'
import CarePackage from './components/CarePackage'

// Navigation dots
function NavDots({ sections, activeSection }) {
  const labels = ['✦', '◎', '◈', '◇', '✉']
  const tooltips = ['Entrance', 'Constellation', 'Timeline', 'Reasons', 'Letter']

  return (
    <div style={{
      position: 'fixed',
      right: '1.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 8000,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
    }}>
      {labels.map((label, i) => (
        <button
          key={i}
          title={tooltips[i]}
          onClick={() => {
            const el = document.getElementById(sections[i])
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: activeSection === i
              ? 'linear-gradient(135deg, #ff2d78, #e2a84b)'
              : 'rgba(255,255,255,0.08)',
            border: activeSection === i
              ? 'none'
              : '1px solid rgba(255,255,255,0.15)',
            cursor: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            color: activeSection === i ? '#fff' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.3s ease',
            boxShadow: activeSection === i ? '0 0 12px rgba(255,45,120,0.5)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// Global scroll progress bar at top
function GlobalProgressBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) setPct(window.scrollY / total)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2,
      zIndex: 9999, background: 'rgba(255,255,255,0.04)',
    }}>
      <div style={{
        height: '100%',
        width: `${pct * 100}%`,
        background: 'linear-gradient(90deg, #ff2d78, #e2a84b)',
        transition: 'width 0.1s linear',
        boxShadow: '0 0 8px rgba(255,45,120,0.7)',
      }} />
    </div>
  )
}

const SECTION_IDS = ['landing', 'constellation', 'timeline', 'reasons', 'letter']

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [warpActive, setWarpActive] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [titleTapCount, setTitleTapCount] = useState(0)
  const lenisRef = useRef(null)

  // Init Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [loaded])

  // Detect active section with IntersectionObserver
  useEffect(() => {
    if (!loaded) return
    const observers = []
    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(i) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [loaded])

  // Warp effect on first scroll
  useEffect(() => {
    if (!loaded) return
    let triggered = false
    const handleScroll = () => {
      if (!triggered && window.scrollY > 50) {
        triggered = true
        setWarpActive(true)
        setTimeout(() => setWarpActive(false), 1500)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loaded])

  const handleTitleTap = useCallback(() => {
    setTitleTapCount(c => c + 1)
  }, [])

  return (
    <>
      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Main content */}
      {loaded && (
        <>
          <CustomCursor />
          <AudioToggle />
          <GlobalProgressBar />
          <NavDots sections={SECTION_IDS} activeSection={activeSection} />
          <EasterEgg onTitleTap={titleTapCount} />
          <CarePackage />

          <main>
            {/* Section 1 */}
            <StarfieldLanding warpActive={warpActive} />

            {/* Transition gradient */}
            <div style={{
              height: 120,
              background: 'linear-gradient(180deg, #020008 0%, #0a0118 100%)',
              marginTop: -2,
            }} />

            {/* Section 2 */}
            <ConstellationGallery />

            {/* Transition */}
            <div style={{
              height: 120,
              background: 'linear-gradient(180deg, #020008 0%, #080112 100%)',
            }} />

            {/* Section 3 */}
            <CinematicTimeline />

            {/* Transition */}
            <div style={{
              height: 120,
              background: 'linear-gradient(180deg, #020008 0%, #050010 100%)',
            }} />

            {/* Section 4 */}
            <FloatingObjects />

            {/* Transition */}
            <div style={{
              height: 120,
              background: 'linear-gradient(180deg, #020008 0%, #0d0318 100%)',
            }} />

            {/* Section 6 */}
            <MessageInABottle />
          </main>

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#020008',
            borderTop: '1px solid rgba(255,45,120,0.08)',
          }}>
            <p
              onClick={handleTitleTap}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              ✦ Vartika ✦
            </p>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
              made with love · type "vartika" anywhere for a surprise
            </p>
          </footer>
        </>
      )}
    </>
  )
}
