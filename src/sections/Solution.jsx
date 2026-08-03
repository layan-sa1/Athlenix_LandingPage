import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import DataSphere from './DataSphere'
import { useTheme } from '../ThemeContext'

const stages = [
  {
    title: 'Athlete Data',
    subtitle: 'Every movement captured',
    description: 'Biomechanical sensors, GPS tracking, and wearable integrations feed a unified athlete profile. No data silos. No blind spots.',
    stat: '2.4M',
    statLabel: 'data points per session',
    image: '/balls/soccer.png',
  },
  {
    title: 'Risk Engine',
    subtitle: 'Predict before it happens',
    description: 'Our proprietary models analyze load, fatigue, and biomechanical patterns to flag at-risk athletes days before symptoms appear.',
    stat: '94%',
    statLabel: 'injury prediction accuracy',
    image: '/balls/tennis.png',
  },
  {
    title: 'Medical Intelligence',
    subtitle: 'Clinical-grade insight',
    description: 'Sports physicians get automated risk reports, return-to-play timelines, and evidence-based intervention recommendations.',
    stat: '31%',
    statLabel: 'reduction in injury days',
    image: '/balls/basketball.png',
  },
  {
    title: 'Insurance Intelligence',
    subtitle: 'Price the risk precisely',
    description: 'Underwriters access real-time athlete risk portfolios, enabling dynamic premium adjustments and data-backed policy terms.',
    stat: '18%',
    statLabel: 'premium optimization',
    image: '/balls/volleyball.png',
  },
  {
    title: 'Executive Analytics',
    subtitle: 'Decisions at a glance',
    description: 'Club executives and federation directors see portfolio-level risk, financial exposure, and squad health in one unified command center.',
    stat: 'SAR 12M',
    statLabel: 'average annual savings',
    image: '/balls/baseball.png',
  },
]

function StageRow({ stage, index, active, registerRef }) {
  const { theme } = useTheme()
  const inactiveColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
  return (
    <div
      ref={(el) => registerRef?.(index, el)}
      className="py-10 lg:py-14 border-b border-gray-200 dark:border-white/5 last:border-b-0"
    >
      <div className="flex items-start gap-5">
        <span
          className="font-display text-3xl font-semibold tabular-nums shrink-0 transition-colors duration-500"
          style={{ color: active ? '#00B5FF' : inactiveColor }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <span className="text-xs font-medium text-athlonix-blue tracking-widest uppercase mb-2 block">
            {stage.subtitle}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            {stage.title}
          </h3>
          <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-5 max-w-md">
            {stage.description}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-athlonix-blue">{stage.stat}</span>
            <span className="text-xs text-gray-400 dark:text-white/40 tracking-wide">{stage.statLabel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true))
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isDesktop
}

// Measures, in real pixels, how far the wrapper actually sits from the true left edge of the
// browser window — this is what makes the "hangs off the viewport edge" effect reliable,
// instead of guessing with a CSS 50vw trick that breaks once there are positioned ancestors
// narrower than the full viewport (exactly what happened here).
function useDistanceFromViewportLeft(ref) {
  const [distance, setDistance] = useState(0)
  useLayoutEffect(() => {
    const measure = () => {
      if (ref.current) setDistance(ref.current.getBoundingClientRect().left)
    }
    measure()
    window.addEventListener('resize', measure)
    const interval = setInterval(measure, 500) // catches layout shifts from fonts/images loading
    return () => {
      window.removeEventListener('resize', measure)
      clearInterval(interval)
    }
  }, [ref])
  return distance
}

export default function Solution() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stageRefs = useRef([])
  const isDesktop = useIsDesktop()
  const ballColumnRef = useRef(null)
  const distanceFromEdge = useDistanceFromViewportLeft(ballColumnRef)

  // One deterministic calculation, not five independent "am I in the band" checks racing each
  // other — this is what was causing the wrong ball to win, especially scrolling upward: whoever
  // else was ALSO true that frame could overwrite the correct one, in either direction. Instead,
  // on every scroll, find whichever row's center is genuinely closest to a fixed reference line.
  useEffect(() => {
    const REFERENCE_FRACTION = 0.35 // 35% down the viewport
    let rafPending = false

    const computeActive = () => {
      rafPending = false
      const refY = window.innerHeight * REFERENCE_FRACTION
      let closestIndex = 0
      let closestDist = Infinity
      stageRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - refY)
        if (dist < closestDist) {
          closestDist = dist
          closestIndex = i
        }
      })
      setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex))
    }

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(computeActive)
      }
    }

    computeActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleBallClick = () => {
    stageRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="solution" className="relative py-24 lg:py-32 bg-[#FAFBFC] dark:bg-athlonix-dark">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-xs font-medium text-athlonix-blue tracking-widest uppercase mb-4 block">
            The Platform
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6">
            From Movement to Decision
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            Five integrated layers that transform raw athlete data into the kind of insight
            that changes seasons — and careers.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', gap: isDesktop ? 32 : 48, alignItems: 'stretch' }}>
          {isDesktop && (
            <div ref={ballColumnRef} style={{ width: '50%', position: 'relative' }}>
              <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
                {/* the ball hangs off the TRUE browser edge: marginLeft is the measured real
                    distance from this column to the viewport's left edge, negated, then offset
                    a little further so ~17% of the ball extends past x=0 of the window itself —
                    no CSS clipping box, the viewport boundary does the hiding. (A pure-CSS
                    calc(50vw...) version was tried instead of this JS measurement — it doesn't
                    account for the nesting inside the flex/sticky/absolute stack correctly here,
                    which is what massively over-cropped it. This measured version was the one
                    that actually looked right; the disappearing-ball bug was the sticky column
                    releasing too early near the last row, already fixed separately below.) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <div
                    onClick={handleBallClick}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: -(distanceFromEdge + 90),
                      transform: 'translateY(-50%)',
                      width: '600px',
                      height: '600px',
                      pointerEvents: 'auto',
                      cursor: 'pointer',
                    }}
                  >
                    <DataSphere balls={stages} activeIndex={activeIndex} onBallClick={handleBallClick} />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'none' }}>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-white/40 tracking-widest uppercase">
                      Solution {String(activeIndex + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-medium text-athlonix-blue tracking-widest uppercase">
                      {stages[activeIndex].title}
                    </span>
                  </div>
                </div>
              </div>
          )}

          <div style={{ width: isDesktop ? '50%' : '100%', paddingBottom: isDesktop ? '55vh' : 0 }}>
            {stages.map((stage, i) => (
              <StageRow
                key={stage.title}
                stage={stage}
                index={i}
                active={activeIndex === i}
                registerRef={(idx, el) => {
                  stageRefs.current[idx] = el
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
