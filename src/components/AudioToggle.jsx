import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AudioToggle() {
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Create a simple ambient tone using Web Audio API as fallback
    // (since we may not have actual mp3 files)
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    // Try to load the audio file if it exists
    audioRef.current.src = '/audio/ambient.mp3'
    audioRef.current.addEventListener('canplaythrough', () => setLoaded(true))
    audioRef.current.addEventListener('error', () => {
      // Audio file not found — gracefully degrade
      setLoaded(false)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <motion.button
      onClick={toggle}
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 9000,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,45,120,0.3)',
        borderRadius: '50%',
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        color: playing ? '#ff2d78' : 'rgba(255,255,255,0.5)',
        fontSize: '1.1rem',
        transition: 'color 0.3s',
      }}
      whileHover={{ scale: 1.1, borderColor: 'rgba(255,45,120,0.8)' }}
      whileTap={{ scale: 0.95 }}
      title={playing ? 'Mute music' : 'Play ambient music'}
    >
      {playing ? '♪' : '♩'}
      {playing && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '1px solid rgba(255,45,120,0.4)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  )
}
