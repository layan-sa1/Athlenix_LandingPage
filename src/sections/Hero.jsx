import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import Hero3DScene from './Hero3DScene'
import { LogoRevealScreen, HeroContentScreen, RewindSweep } from './HeroOverlays'
import { useTheme } from '../ThemeContext'

// ─── MAIN HERO COMPONENT ───
export default function Hero({ onComplete }) {
  const { theme } = useTheme()
  const vBase = theme === 'dark' ? '10,10,15' : '255,255,255'
  const [phase, setPhase] = useState('freeze')
  const [canvasReady, setCanvasReady] = useState(false)
  const containerRef = useRef()
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Orchestrate the cinematic sequence — runs exactly once per mount (empty dependency array),
  // regardless of whether the parent re-renders and passes a new onComplete reference (e.g. on
  // every scroll event). Previously this restarted the whole sequence mid-playback.
  useEffect(() => {
    const sequence = [
      { phase: 'freeze', duration: 2000 },   // total stillness — the frozen moment
      { phase: 'glimpse', duration: 700 },   // time resumes briefly, hints at an undesirable outcome
      { phase: 'rewind', duration: 900 },    // time eases back, calmly, to the exact frozen instant
      { phase: 'correct', duration: 700 },   // the one subtle intervention
      { phase: 'push', duration: 1400 },     // time plays forward again, confidently
      { phase: 'transform', duration: 2000 },// the moment becomes signal
      { phase: 'settle', duration: 1200 },   // the mark forms
    ]

    let currentIndex = 0
    let startTime = Date.now()
    let rafId

    const tick = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const current = sequence[currentIndex]
      const p = Math.min(1, elapsed / current.duration)

      setPhase(current.phase)

      if (p >= 1) {
        currentIndex++
        if (currentIndex >= sequence.length) {
          onCompleteRef.current?.()
          return
        }
        startTime = now
      }

      rafId = requestAnimationFrame(tick)
    }

    // Small delay before starting to ensure canvas is mounted
    const startDelay = setTimeout(() => {
      setCanvasReady(true)
      rafId = requestAnimationFrame(tick)
    }, 300)

    return () => {
      clearTimeout(startDelay)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const showOverlays = phase === 'settle'
  const showCrossGlow = phase === 'push' || phase === 'transform'

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen min-h-[820px] overflow-hidden bg-gradient-to-b from-[#FAFBFC] via-[#F8FBFE] to-[#F4F9FD] dark:bg-athlonix-dark dark:bg-none"
    >
      {/* ─── WEBGL CANVAS (pure 3D, no HTML inside) ─── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={() => setCanvasReady(true)}
        >
          <Hero3DScene phase={phase} theme={theme} />
        </Canvas>
      </div>

      {/* ─── SCREEN-SPACE OVERLAYS (CSS positioned, pixel-perfect) ─── */}

      {/* Bottom gradient for text — no full radial vignette, just enough darkening at the bottom
          for the headline to stay readable */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(${vBase},0.85) 0%, rgba(${vBase},0.4) 30%, transparent 65%)`
        }}
      />

      {/* "Athlenix" glows in above the sphere for the beat where the connecting lines cross over
          it — this never existed in the WebGL version at all, only in the CSS one, which is why
          it never showed up here regardless of phase timing. Plain screen-space HTML, since it
          doesn't need to live inside the 3D scene. */}
      <div
        className="absolute inset-x-0 z-10 flex justify-center pointer-events-none"
        style={{ top: '20%' }}
      >
        <span
          className="font-display font-extrabold tracking-[0.2em] uppercase"
          style={{
            fontSize: '38px',
            color: theme === 'light' ? '#0D2E5C' : '#EAF2F8',
            opacity: showCrossGlow ? 1 : 0,
            filter: showCrossGlow
              ? theme === 'light'
                ? 'drop-shadow(0 0 10px rgba(0,181,255,0.35))'
                : 'drop-shadow(0 0 14px #7FB3F0) drop-shadow(0 0 30px #00B5FF)'
              : 'none',
            transition: 'opacity 0.35s ease',
          }}
        >
          ATHLENIX
        </span>
      </div>

      {/* Rewind cue — a single calm light sweep, only during the rewind phase */}
      <RewindSweep active={phase === 'rewind'} />

      {/* Logo reveal — centered */}
      <LogoRevealScreen visible={showOverlays} />

      {/* Hero text — bottom left */}

      {/* Mini dashboard — right side */}
      <HeroContentScreen visible={showOverlays} />

      {/* Loading state — shown until canvas is ready. Plain dark background, no icon, to match
          the CSS hero and avoid any visual "blip" before the sequence begins. */}
      {!canvasReady && <div className="absolute inset-0 z-30 bg-[#FAFBFC] dark:bg-athlonix-dark" />}
    </section>
  )
}
