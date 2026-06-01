import { useEffect } from 'react'

export function useKonamiListener(secretWord, onMatch) {
  useEffect(() => {
    let buffer = ''
    const target = secretWord.toLowerCase()

    const handleKey = (e) => {
      buffer += e.key.toLowerCase()
      if (buffer.length > target.length) {
        buffer = buffer.slice(buffer.length - target.length)
      }
      if (buffer === target) {
        onMatch()
        buffer = ''
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [secretWord, onMatch])
}
