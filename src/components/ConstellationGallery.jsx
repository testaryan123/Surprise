import { useRef, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

const PHOTOS = [
  { id: 1, src: '/photos/photo1.jpg', caption: 'that smile that lights up everything ✦' },
  { id: 2, src: '/photos/photo2.jpg', caption: 'a moment I keep coming back to' },
  { id: 3, src: '/photos/photo3.jpg', caption: 'effortlessly radiant, always' },
  { id: 4, src: '/photos/photo4.jpg', caption: 'you & your quiet magic ✨' },
  { id: 5, src: '/photos/photo5.jpg', caption: 'the universe in your eyes' },
  { id: 6, src: '/photos/photo6.jpg', caption: 'golden hour, golden you' },
  { id: 7, src: '/photos/photo7.jpg', caption: 'soft & extraordinary' },
  { id: 8, src: '/photos/photo8.jpg', caption: 'a frame worth remembering forever' },
  { id: 9, src: '/photos/photo9.jpg', caption: 'my favorite kind of beautiful' },
  { id: 10, src: '/photos/photo10.jpg', caption: 'you make every moment cinematic ✦' },
]

// Star positions in 3D
const STAR_POSITIONS = [
  [-4, 2, -3], [3, -1, -2], [-2, -3, -1], [5, 3, -4], [-5, 1, -2],
  [1, 4, -3], [-3, -2, -4], [4, -3, -2], [0, 2, -5], [-1, -4, -3],
]

// Constellation lines connecting star pairs
const LINES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[6,7],[7,8],[8,9],[9,6],[2,7]]

function ConstellationLines({ stars }) {
  const points = useMemo(() => {
    return LINES.map(([a, b]) => {
      const pa = new THREE.Vector3(...STAR_POSITIONS[a % STAR_POSITIONS.length])
      const pb = new THREE.Vector3(...STAR_POSITIONS[b % STAR_POSITIONS.length])
      const geometry = new THREE.BufferGeometry().setFromPoints([pa, pb])
      return geometry
    })
  }, [])

  return (
    <>
      {points.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#a8d8ff" transparent opacity={0.12} />
        </line>
      ))}
    </>
  )
}

function StarPoint({ position, index, onHover, onLeave, isHovered }) {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.scale.setScalar(isHovered ? 1.8 : 1 + Math.sin(t * 2 + index) * 0.15)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = isHovered ? 0.6 : 0.2 + Math.sin(t * 1.5 + index) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ff2d78" transparent opacity={0.2} />
      </mesh>
      {/* Core star */}
      <mesh
        ref={meshRef}
        onPointerOver={() => onHover(index)}
        onPointerOut={onLeave}
      >
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={isHovered ? '#ff2d78' : '#a8d8ff'} />
      </mesh>
    </group>
  )
}

function Scene({ onHover, onLeave, hoveredIndex, mouseRef }) {
  const groupRef = useRef()
  const { size } = useThree()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.04
    // Mouse parallax
    if (mouseRef?.current) {
      groupRef.current.rotation.x += (mouseRef.current.y * 0.3 - groupRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <ConstellationLines />
      {STAR_POSITIONS.map((pos, i) => (
        <StarPoint
          key={i}
          position={pos}
          index={i}
          onHover={onHover}
          onLeave={onLeave}
          isHovered={hoveredIndex === i}
        />
      ))}
    </group>
  )
}

export default function ConstellationGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    mouseRef.current = {
      x: (e.clientX - cx) / cx,
      y: (e.clientY - cy) / cy,
    }
    setCardPos({ x: e.clientX, y: e.clientY })
  }, [])

  const photo = hoveredIndex !== null ? PHOTOS[hoveredIndex % PHOTOS.length] : null

  return (
    <section
      id="constellation"
      style={{ height: '100vh', position: 'relative', background: '#020008', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
    >
      {/* Section label */}
      <motion.div
        style={{
          position: 'absolute',
          top: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p style={{ color: 'rgba(255,45,120,0.7)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ✦ your constellation ✦
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          background: 'linear-gradient(135deg, #fff 0%, #a8d8ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          A Map of Your Moments
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          hover a star to reveal a memory
        </p>
      </motion.div>

      {/* Three.js canvas */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          onHover={setHoveredIndex}
          onLeave={() => setHoveredIndex(null)}
          hoveredIndex={hoveredIndex}
          mouseRef={mouseRef}
        />
      </Canvas>

      {/* Photo card that appears on hover */}
      <AnimatePresence>
        {photo && (
          <motion.div
            key={hoveredIndex}
            style={{
              position: 'fixed',
              left: Math.min(cardPos.x + 20, window.innerWidth - 220),
              top: Math.min(cardPos.y - 120, window.innerHeight - 260),
              zIndex: 10,
              pointerEvents: 'none',
              width: 200,
            }}
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="polaroid" style={{ transform: `rotate(${(hoveredIndex % 7) - 3}deg)` }}>
              <img
                src={photo.src}
                alt={`memory ${hoveredIndex + 1}`}
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #1a0533, #ff2d78)'
                  e.target.style.height = '160px'
                  e.target.removeAttribute('src')
                }}
              />
              <p className="polaroid-caption">{photo.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
