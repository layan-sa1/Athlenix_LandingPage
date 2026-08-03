import React, { useEffect, useState, useMemo, useRef } from 'react'
import { LogoRevealScreen, HeroContentScreen, RewindSweep } from './HeroOverlays'
import { LOGO_POINTS } from '../data/logoPointsCSS'
import { useTheme } from '../ThemeContext'

const SIGNATURE_BLUE = '#00B5FF'
const LIGHT_ACCENT = '#0369A1' // the ONE unified deep blue for light mode — navbar, heading accent, and every particle color derive from this
const DIM_COLOR = '#5A6478'
const DIM_COLOR_LIGHT = '#264A73' // darkened further for real contrast on white
const CENTRAL_COUNT = 555
const DISPERSE_FRACTION = 0.22
const SATELLITE_COUNT = 4

// Pure SVG/CSS re-interpretation of the same "data sphere" story as the WebGL Hero — an ellipse
// of points standing in for a sphere viewed at an angle, animated with CSS transitions instead of
// a render loop. No <canvas>, no WebGL, works on any device.
function useCentralPoints() {
  return useMemo(() => {
    const arr = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < CENTRAL_COUNT; i++) {
      const y = 1 - (i / (CENTRAL_COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r // used only to bias size/opacity for a fake-depth feel
      const logoPt = LOGO_POINTS[i] || [0, 0]
      arr.push({
        home: { x: x * 175, y: y * 175 * 0.62 },
        disperse: { x: x * 300, y: y * 300 * 0.62 },
        logoTarget: { x: logoPt[0] * 160, y: -logoPt[1] * 160 - 85 }, // SVG y-axis is flipped; shifted upward, scaled up to match the bigger 3D version
        isDisperse: i > 0 && i % Math.round(1 / DISPERSE_FRACTION) === 0,
        depth: z,
        seed: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])
}

function useSatellites() {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < SATELLITE_COUNT; i++) {
      const angle = (i / SATELLITE_COUNT) * Math.PI * 2 + Math.PI / 4
      arr.push({ x: Math.cos(angle) * 260, y: Math.sin(angle) * 150 })
    }
    return arr
  }, [])
}

export default function HeroCSS({ onComplete }) {
  const { theme } = useTheme()
  const vBase = theme === 'dark' ? '10,10,15' : '255,255,255'
  const [phase, setPhase] = useState('freeze')
  const [canvasReady, setCanvasReady] = useState(false)
  const points = useCentralPoints()
  const satellites = useSatellites()
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Local, proximity-based hover glow: only the points actually near the cursor brighten, not
  // the whole logo at once. Driven entirely by direct DOM writes on the circle refs (no React
  // state, no re-renders) so it stays as cheap as the rest of this deliberately JS-light scene.
  const pointRefs = useRef([])
  const GLOW_RADIUS = 24
  const rafPendingRef = useRef(false)
  const lastMouseRef = useRef(null)

  const applyGlow = () => {
    rafPendingRef.current = false
    const mouse = lastMouseRef.current
    points.forEach((p, i) => {
      const el = pointRefs.current[i]
      if (!el) return
      if (!mouse) {
        el.style.filter = ''
        return
      }
      const cx = Number(el.getAttribute('cx'))
      const cy = Number(el.getAttribute('cy'))
      const dist = Math.hypot(cx - mouse.x, cy - mouse.y)
      if (dist < GLOW_RADIUS) {
        const t = 1 - dist / GLOW_RADIUS
        if (theme === 'light') {
          // Brightening a dark dot pushes it toward white — invisible on a white background.
          // Instead: boost saturation/contrast and add a solid-color glow in the brand blue, so
          // hovered points get more vivid, not lighter.
          el.style.filter = `saturate(${1 + t * 1.2}) contrast(${1 + t * 0.3}) drop-shadow(0 0 ${t * 5}px rgba(3,105,161,${t * 0.7}))`
        } else {
          el.style.filter = `brightness(${1 + t * 1.4}) drop-shadow(0 0 ${t * 4}px rgba(127,179,240,${t * 0.9}))`
        }
      } else {
        el.style.filter = ''
      }
    })
  }

  const handleLogoMouseMove = (e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    // convert screen coordinates into the SVG's own viewBox coordinate space
    const vx = -350 + ((e.clientX - rect.left) / rect.width) * 700
    const vy = -250 + ((e.clientY - rect.top) / rect.height) * 500
    lastMouseRef.current = { x: vx, y: vy }
    if (!rafPendingRef.current) {
      rafPendingRef.current = true
      requestAnimationFrame(applyGlow)
    }
  }

  const handleLogoMouseLeave = () => {
    lastMouseRef.current = null
    if (!rafPendingRef.current) {
      rafPendingRef.current = true
      requestAnimationFrame(applyGlow)
    }
  }

  useEffect(() => {
    const sequence = [
      { phase: 'freeze', duration: 2000 },
      { phase: 'glimpse', duration: 700 },
      { phase: 'rewind', duration: 900 },
      { phase: 'correct', duration: 700 },
      { phase: 'push', duration: 1400 },
      { phase: 'transform', duration: 2000 },
      { phase: 'settle', duration: 1200 },
    ]
    let currentIndex = 0
    let startTime = Date.now()
    let rafId

    const tick = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const current = sequence[currentIndex]
      setPhase((prev) => (prev === current.phase ? prev : current.phase))
      if (elapsed >= current.duration) {
        currentIndex++
        if (currentIndex >= sequence.length) {
          onCompleteRef.current?.()
          return
        }
        startTime = now
      }
      rafId = requestAnimationFrame(tick)
    }

    const startDelay = setTimeout(() => {
      setCanvasReady(true)
      rafId = requestAnimationFrame(tick)
    }, 200)

    return () => {
      clearTimeout(startDelay)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const showOverlays = phase === 'settle'
  const isDispersed = phase === 'glimpse'
  const isSettling = phase === 'settle'
  const showSatellites = phase === 'push' || phase === 'transform' || phase === 'settle'
  const showLines = phase === 'push' || phase === 'transform' || phase === 'settle'
  const showCrossGlow = phase === 'push' || phase === 'transform'

  // The point-cloud holds its "assembled into the logo" shape for a moment before fading, instead
  // of fading the instant 'settle' begins — otherwise the assembly is never actually seen.
  // Points assemble into the logo shape and STAY as points — no fade-out, no hand-off to a
  // solid image, matching the WebGL version.
  const sceneOpacity = 1
  const sceneScale = phase === 'push' || phase === 'transform' ? 0.5 : phase === 'settle' ? 0.44 : 1

  return (
    <section className="relative w-full h-screen min-h-[820px] overflow-hidden bg-gradient-to-b from-[#FAFBFC] via-[#F8FBFE] to-[#F4F9FD] dark:bg-athlonix-dark dark:bg-none flex items-center justify-center">
      {/* a soft blue ambient glow behind the particles — light mode only. Not a dark fog, just
          enough warmth so the blue dots read as "glowing" against white instead of "sitting on
          top of" a flat background */}
      {theme === 'light' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(0,181,255,0.08) 0%, rgba(0,181,255,0.03) 35%, transparent 65%)' }}
        />
      )}

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: sceneOpacity,
          transform: `scale(${sceneScale})`,
          transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <svg
          width="700"
          height="500"
          viewBox="-350 -250 700 500"
          style={{ overflow: 'visible' }}
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
        >
          <defs>
            {/* subtle bloom for the points against a light background — glow only, radius/size
                of each point is untouched */}
            <filter id="lightBloom" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* satellite connecting lines */}
          {satellites.map((s, i) => (
            <line
              key={`line-${i}`}
              x1={0}
              y1={0}
              x2={s.x}
              y2={s.y}
              stroke={theme === 'light' ? LIGHT_ACCENT : SIGNATURE_BLUE}
              strokeWidth={1}
              opacity={showLines ? 0.35 : 0}
              style={{ transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)' }}
            />
          ))}
          {/* satellite nodes */}
          {satellites.map((s, i) => (
            <circle
              key={`sat-${i}`}
              cx={s.x}
              cy={s.y}
              r={5}
              fill={theme === 'light' ? DIM_COLOR_LIGHT : DIM_COLOR}
              opacity={showSatellites ? 0.7 : 0}
              style={{ transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)' }}
            />
          ))}
          {/* the central sphere of points — a cheap, pure-CSS "breathing" pulse (no JS loop, so
              it never adds to the per-frame work that was causing crashes on unstable GPUs) */}
          <g
            style={{ animation: 'sphere-breathe 4.5s ease-in-out infinite', transformOrigin: '0px 0px' }}
            filter={theme === 'light' ? 'url(#lightBloom)' : undefined}
          >
            {points.map((p, i) => {
            const pos = isSettling ? p.logoTarget : p.isDisperse && isDispersed ? p.disperse : p.home
            const isCorrection = i === 0 && phase === 'correct'
            const gradT = Math.max(0, Math.min(1, (p.logoTarget.x / 160 + 1) / 2))
            // One unified deep blue family for light mode (#0369A1), matching the navbar and
            // heading accent exactly instead of several close-but-different blues.
            const gradColor = theme === 'light'
              ? `rgb(${Math.round(8 + gradT * (3 - 8))}, ${Math.round(38 + gradT * (105 - 38))}, ${Math.round(72 + gradT * (161 - 72))})` // #08264C -> #03699A, both dark enough to read on white
              : `rgb(${Math.round(18 + gradT * (127 - 18))}, ${Math.round(58 + gradT * (179 - 58))}, ${Math.round(107 + gradT * (240 - 107))})`
            const dimColor = theme === 'light' ? DIM_COLOR_LIGHT : DIM_COLOR
            const dispersedColor = theme === 'light' ? '#0B3A6B' : '#EAF2F8'
            const color = isSettling ? gradColor : isCorrection ? (theme === 'light' ? LIGHT_ACCENT : SIGNATURE_BLUE) : p.isDisperse && isDispersed ? dispersedColor : dimColor
            const size = theme === 'light' ? 2.7 + p.depth * 1.3 : 2.2 + p.depth * 1.1
            return (
              <circle
                key={i}
                ref={(el) => (pointRefs.current[i] = el)}
                cx={pos.x}
                cy={pos.y}
                r={isCorrection ? size * 2 : size}
                fill={color}
                opacity={theme === 'light' ? 0.85 + p.depth * 0.15 : 0.55 + p.depth * 0.25}
                style={{ transition: 'cx 0.9s cubic-bezier(0.16,1,0.3,1), cy 0.9s cubic-bezier(0.16,1,0.3,1), fill 0.6s ease, r 0.6s ease' }}
              />
            )
          })}
          </g>

          {/* "Athlenix" glows in above the sphere for the one beat where the connecting lines
              cross over it. Rendered LAST (not first) so it paints on top of the point-sphere —
              it was directly under the 555 circles before, which is why it never actually showed. */}
          <text
            x="0"
            y="-215"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontWeight="800"
            fontSize="38"
            letterSpacing="5"
            fill={theme === 'light' ? '#0D2E5C' : '#EAF2F8'}
            style={{
              opacity: showCrossGlow ? 1 : 0,
              filter: showCrossGlow
                ? theme === 'light'
                  ? 'drop-shadow(0 0 10px rgba(0,181,255,0.35))'
                  : 'drop-shadow(0 0 14px #7FB3F0) drop-shadow(0 0 30px #00B5FF)'
                : 'none',
              transition: 'opacity 0.35s ease',
              pointerEvents: 'none',
            }}
          >
            ATHLENIX
          </text>
        </svg>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to top, rgba(${vBase},0.85) 0%, rgba(${vBase},0.4) 30%, transparent 65%)` }}
      />

      <RewindSweep active={phase === 'rewind'} />
      <LogoRevealScreen visible={showOverlays} />
      <HeroContentScreen visible={showOverlays} />

      {!canvasReady && <div className="absolute inset-0 z-30 bg-[#FAFBFC] dark:bg-athlonix-dark" />}
    </section>
  )
}
