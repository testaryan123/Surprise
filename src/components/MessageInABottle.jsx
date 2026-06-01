import { useRef } from 'react'
import { motion } from 'framer-motion'

const LETTER_TEXT = [
  "Dear Vartika,",
  "",
  "I don't know if there's a word in any language that quite captures what it's like to know someone like you.",
  "",
  "You carry something rare — a kind of quiet brilliance that doesn't announce itself, but fills every room you walk into.",
  "It's in the way you speak, the way you think, the way you notice things others walk right past.",
  "",
  "I built this little universe as a way of saying: you deserve to be celebrated.",
  "Not just on the big days, but on the ordinary Tuesday afternoons and the 2am thoughts.",
  "Every single day, without exception.",
  "",
  "So here it is — a universe made of starlight and memories and everything I wanted to say",
  "but never quite found the right moment for.",
  "",
  "Thank you for existing exactly as you are.",
  "The world is softer, brighter, and infinitely more beautiful because you're in it.",
  "",
  "With love,",
  "Lakshya ✦",
]

const wordVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: 'easeOut' },
  }),
}

function AnimatedParagraph({ text, startIndex }) {
  if (!text) return <br />
  const words = text.split(' ')
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={startIndex + i}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.35em' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

// Floating bubbles
function Bubbles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
            borderRadius: '50%',
            border: `1px solid rgba(255,${45 + Math.random() * 100},${120 + Math.random() * 100},0.2)`,
            left: `${Math.random() * 90}%`,
            bottom: -40,
          }}
          animate={{ y: [0, -600], opacity: [0.3, 0] }}
          transition={{
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// Wax seal SVG
function WaxSeal({ inView }) {
  return (
    <motion.div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '3rem',
      }}
      initial={{ scale: 0, rotate: -20 }}
      animate={inView ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
    >
      <div style={{
        width: 80, height: 80,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #ff6fa8, #c41454)',
        boxShadow: '0 0 30px rgba(255,45,120,0.6), 0 4px 16px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        filter: 'drop-shadow(0 0 10px rgba(255,45,120,0.5))',
      }}>
        ✦
      </div>
    </motion.div>
  )
}

export default function MessageInABottle() {
  const sectionRef = useRef()

  // Build flat word list with paragraph breaks
  let wordIndex = 0
  const paragraphs = LETTER_TEXT.map((para, pIdx) => {
    const start = wordIndex
    wordIndex += para.split(' ').length
    return { text: para, startIndex: start, pIdx }
  })

  return (
    <section
      ref={sectionRef}
      id="letter"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #020008 0%, #0d0318 30%, #1a0533 60%, #0d0318 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem',
      }}
    >
      <Bubbles />

      {/* Radial light */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,45,120,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content container */}
      <motion.div
        style={{ maxWidth: 680, width: '100%', position: 'relative', zIndex: 2 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section label */}
        <motion.p
          style={{
            textAlign: 'center',
            color: 'rgba(255,45,120,0.7)',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ✦ a letter ✦
        </motion.p>

        <motion.h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            textAlign: 'center',
            marginBottom: '3rem',
            background: 'linear-gradient(135deg, #fff, #a8d8ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Words I Meant to Say
        </motion.h2>

        {/* Wax seal */}
        <WaxSeal inView={true} />

        {/* Letter card */}
        <motion.div
          style={{
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,45,120,0.1)',
            borderRadius: 20,
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4), inset 0 0 60px rgba(255,45,120,0.02)',
          }}
        >
          {paragraphs.map(({ text, startIndex, pIdx }) => (
            <p
              key={pIdx}
              style={{
                fontFamily: text.startsWith('Dear') || text.startsWith('With') || text.startsWith('Lakshya')
                  ? "'Dancing Script', cursive"
                  : "'DM Sans', sans-serif",
                fontSize: text.startsWith('Dear') ? '1.4rem' : text.startsWith('Lakshya') ? '1.6rem' : text.startsWith('With') ? '1.1rem' : '1rem',
                lineHeight: 1.9,
                color: text.startsWith('Dear') || text.startsWith('With') || text.startsWith('Lakshya')
                  ? '#e2a84b'
                  : 'rgba(255,255,255,0.8)',
                fontWeight: text.startsWith('Lakshya') ? 700 : 'normal',
                marginBottom: text === '' ? '1.2rem' : '0.2rem',
                minHeight: text === '' ? '0.5rem' : 'auto',
              }}
            >
              {text ? (
                <AnimatedParagraph text={text} startIndex={startIndex} />
              ) : null}
            </p>
          ))}

          {/* Decorative divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '2rem 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,45,120,0.3))' }} />
            <span style={{ color: 'rgba(255,45,120,0.5)', fontSize: '0.8rem' }}>✦</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,45,120,0.3), transparent)' }} />
          </div>

          {/* Glowing name */}
          <motion.p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '2.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ff2d78, #e2a84b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(255,45,120,0.5))',
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Vartika ✦
          </motion.p>
        </motion.div>

        {/* Reply button */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="mailto:?subject=To%20You%2C%20Vartika%20%E2%9C%A6&body=Dear%20Vartika%2C%20..."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(226,168,75,0.1))',
              border: '1px solid rgba(255,45,120,0.3)',
              borderRadius: 99,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,45,120,0.3), rgba(226,168,75,0.2))'
              e.target.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(226,168,75,0.1))'
              e.target.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            ✉ write back
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
