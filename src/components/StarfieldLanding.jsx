import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// 3000 star particles
function Stars() {
  const ref = useRef()
  const trailRef = useRef(0)

  const { positions, sizes } = useMemo(() => {
    const count = 3000
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 80 + 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      sz[i] = Math.random() * 2.5 + 0.5
    }
    return { positions: pos, sizes: sz }
  }, [])

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    // Gentle camera drift
    camera.position.x = Math.sin(t * 0.05) * 3
    camera.position.y = Math.cos(t * 0.04) * 2
    camera.lookAt(0, 0, 0)

    if (ref.current) {
      ref.current.rotation.y = t * 0.01
      ref.current.rotation.x = Math.sin(t * 0.007) * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        color="#a8d8ff"
        transparent
        opacity={0.85}
        vertexColors={false}
      />
    </points>
  )
}

// Warp stars effect (on scroll)
function WarpStars({ active }) {
  const ref = useRef()
  const { positions } = useMemo(() => {
    const count = 400
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = -(Math.random() * 80)
    }
    return { positions: pos }
  }, [])

  useFrame(() => {
    if (!ref.current || !active) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] += 3
      if (pos[i + 2] > 10) {
        pos[i + 2] = -80
        pos[i] = (Math.random() - 0.5) * 20
        pos[i + 1] = (Math.random() - 0.5) * 20
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.15} sizeAttenuation color="#ffffff" transparent opacity={active ? 0.9 : 0} />
    </points>
  )
}

const NAME = 'Vartika'

export default function StarfieldLanding({ warpActive }) {
  return (
    <section id="landing" style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#020008' }}>
      {/* Three.js canvas */}
      <Canvas
        className="canvas-full"
        camera={{ position: [0, 0, 20], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Stars />
        <WarpStars active={warpActive} />
        <ambientLight intensity={0.2} />
      </Canvas>

      {/* Overlay content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {/* Name — letter by letter */}
        <div style={{ display: 'flex', gap: '0.05em', overflow: 'hidden' }}>
          {NAME.split('').map((ch, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff2d78 0%, #e2a84b 60%, #ff2d78 100%)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255,45,120,0.6))',
                display: 'inline-block',
              }}
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.5 + i * 0.12,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: 'rgba(168,216,255,0.8)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginTop: '1rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          a universe built just for you
        </motion.p>

        {/* Glowing ring around name */}
        <motion.div
          style={{
            position: 'absolute',
            width: 320,
            height: 160,
            borderRadius: '50%',
            border: '1px solid rgba(255,45,120,0.15)',
            boxShadow: '0 0 60px rgba(255,45,120,0.08), inset 0 0 60px rgba(255,45,120,0.04)',
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        />
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="scroll-chevron"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>scroll</span>
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M1 1L10 10L19 1" stroke="rgba(255,45,120,0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  )
}
