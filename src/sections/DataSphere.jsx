import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const DISSOLVE_S = 0.15

// All five ball images are mounted in the DOM from the very first render — none of them ever
// unmount or get a new `key`. Switching is pure opacity. The previous version gave each swap a
// fresh `key`, which makes React tear down and recreate that <img> node every single time; even
// with the image bytes cached, a brand-new DOM node still has to go through a mount + paint +
// (re)compositing cycle, which is exactly the kind of thing that shows up as an occasional blank
// beat. Nothing left to (re)build now — just which opacity is 1.
export default function DataSphere({ balls, activeIndex = 0, onBallClick }) {
  const [decoded, setDecoded] = useState(false)

  useEffect(() => {
    Promise.all(
      balls.map(({ image }) => {
        const img = new Image()
        img.src = image
        return img.decode?.().catch(() => {}) ?? Promise.resolve()
      })
    ).then(() => setDecoded(true))
  }, [balls])

  return (
    <div className="relative w-full h-full" onClick={onBallClick} style={{ cursor: 'pointer' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle, rgba(0,181,255,0.15), transparent 70%)' }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: [0, 360, 360] }}
        transition={{ duration: 4, times: [0, 0.75, 1], ease: 'easeInOut', repeat: Infinity }}
      >
        {balls.map((b, i) => (
          <img
            key={b.image}
            src={b.image}
            alt={b.title}
            draggable={false}
            className="absolute inset-0 w-full h-full select-none object-contain"
            style={{
              filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))',
              opacity: decoded && i === activeIndex ? 1 : 0,
              transition: `opacity ${DISSOLVE_S}s cubic-bezier(${EASE.join(',')})`,
              zIndex: i === activeIndex ? 1 : 0,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
