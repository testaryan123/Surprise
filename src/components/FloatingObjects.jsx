import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const REASONS = [
  { emoji: '✨', title: 'Your Light', text: 'You have this rare gift of making everyone around you feel like the most important person in the room.' },
  { emoji: '🌊', title: 'Your Depth', text: 'Conversations with you feel like diving into an ocean — there\'s always something more beautiful beneath the surface.' },
  { emoji: '🌸', title: 'Your Kindness', text: 'The gentle way you care for the world around you is one of the most extraordinary things I\'ve ever witnessed.' },
  { emoji: '⚡', title: 'Your Brilliance', text: 'The way your mind works — the way you see connections others miss — leaves me genuinely in awe.' },
  { emoji: '🎨', title: 'Your Soul', text: 'You feel everything so deeply, and that sensitivity isn\'t a weakness — it\'s your greatest superpower.' },
  { emoji: '🌙', title: 'Your Mystery', text: 'There\'s something about you that feels like a beautiful enigma — the more I know you, the more I want to know.' },
]

// Low-poly rose (simplified as geometrical shapes)
function FloatingRose() {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.4
    group.current.rotation.z = Math.sin(t * 0.3) * 0.1
    group.current.position.y = Math.sin(t * 0.5) * 0.4
  })

  return (
    <group ref={group} position={[-3, 0, 0]}>
      {/* Petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0.4]} position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.25, 6, 6]} />
          <meshStandardMaterial color="#ff2d78" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
      {/* Center */}
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#c41454" roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#2d6a20" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Central glowing orb with orbiting stars
function CentralOrb() {
  const group = useRef()
  const orbitRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.4) * 0.3
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 0.8
      orbitRef.current.rotation.x = t * 0.3
    }
  })

  return (
    <group ref={group} position={[1.5, 0, 0]}>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#e2a84b"
          emissive="#e2a84b"
          emissiveIntensity={0.6}
          roughness={0}
          metalness={0.8}
        />
      </mesh>
      {/* Glow ring 1 */}
      <mesh>
        <torusGeometry args={[0.8, 0.02, 8, 64]} />
        <meshBasicMaterial color="#ff2d78" transparent opacity={0.4} />
      </mesh>
      {/* Glow ring 2 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.015, 8, 64]} />
        <meshBasicMaterial color="#a8d8ff" transparent opacity={0.25} />
      </mesh>
      {/* Orbiting stars */}
      <group ref={orbitRef}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial color="#fff" />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// Floating hearts
function FloatingHeart({ position }) {
  const ref = useRef()
  const speed = 0.3 + Math.random() * 0.4
  const offset = Math.random() * Math.PI * 2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.5 + t * 0.1 % 6 - 3
      ref.current.rotation.z = Math.sin(t * 0.5 + offset) * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#ff2d78" />
    </mesh>
  )
}

function FlipCard({ reason, index }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      style={{
        perspective: 1000,
        cursor: 'pointer',
        width: '100%',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div style={{
        position: 'relative',
        height: 200,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,45,120,0.15)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '2rem' }}>{reason.emoji}</span>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '1.1rem',
            fontStyle: 'italic',
          }}>{reason.title}</p>
          <p style={{ color: 'rgba(255,45,120,0.6)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>tap to reveal</p>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #1a0533, #2d0a4e)',
          border: '1px solid rgba(226,168,75,0.25)',
          borderRadius: 16,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{reason.emoji}</span>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.82rem',
            lineHeight: 1.7,
            textAlign: 'center',
          }}>{reason.text}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function FloatingObjects() {
  return (
    <section
      id="reasons"
      style={{ minHeight: '100vh', position: 'relative', background: '#020008', overflow: 'hidden', padding: '6rem 0' }}
    >
      {/* Three.js scene */}
      <div style={{ height: '50vh', position: 'relative' }}>
        <Canvas
          style={{ position: 'absolute', inset: 0 }}
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#ff2d78" />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#e2a84b" />
          <FloatingRose />
          <CentralOrb />
          {Array.from({ length: 12 }).map((_, i) => (
            <FloatingHeart
              key={i}
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 4 - 2,
                (Math.random() - 0.5) * 4,
              ]}
            />
          ))}
        </Canvas>
      </div>

      {/* Text content */}
      <div style={{ padding: '0 2rem', maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p style={{ color: 'rgba(255,45,120,0.7)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ✦ written for you ✦
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            background: 'linear-gradient(135deg, #fff, #ff2d78)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Reasons I Think You're Extraordinary
          </h2>
        </motion.div>

        {/* Flip cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {REASONS.map((r, i) => (
            <FlipCard key={i} reason={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
