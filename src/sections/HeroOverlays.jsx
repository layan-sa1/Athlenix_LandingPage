import React, { useState, useEffect, useMemo, useRef } from 'react'

// These overlays are pure DOM/CSS — no WebGL, no dependency on the 3D scene. Shared between
// the WebGL Hero and the CSS-only fallback Hero so both tell the identical logo/text/dashboard
// moment, and there is only one place to maintain them.

// ─── SCREEN-SPACE LOGO REVEAL (outside Canvas) ───
function LogoRevealScreen({ visible }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!visible) return
    const start = Date.now()
    const duration = 1000
    const animate = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setProgress(ease)
      if (p < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
      style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      {/* The logo itself is the particle formation in the 3D/CSS scene behind this overlay —
      it stays as points, it never resolves into a solid image. Only the readable wordmark
      lives here — no wordmark underneath anymore, the dots are the whole mark. */}
    </div>
  )
}

// ─── SCREEN-SPACE HERO TEXT (outside Canvas) ───
function HeroTextScreen({ visible }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!visible) return
    const start = Date.now()
    const duration = 1000
    const animate = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setProgress(ease)
      if (p < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [visible])

  if (!visible) return null

  return (
    <div className="pointer-events-auto max-w-md min-w-0" style={{ opacity: progress }}>
      <h2
        className="font-display text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
        style={{
          transform: `translateY(${(1 - progress) * 40}px)`,
          transition: 'none',
        }}
      >
        <span className="whitespace-nowrap">The Future Changes</span> <br />Before It Happens
      </h2>
      <p
        className="text-sm md:text-base text-white/50 mb-8 leading-relaxed max-w-md"
        style={{
          transform: `translateY(${(1 - progress) * 30}px)`,
          opacity: progress * 0.9,
          transition: 'none',
        }}
      >
        We read the signal in every stride, every strike, every decision —
        so the smallest correction can happen before the moment ever needs it.
      </p>
      <div
        className="flex flex-wrap gap-3"
        style={{
          transform: `translateY(${(1 - progress) * 20}px)`,
          opacity: progress,
          transition: 'none',
        }}
      >
        <a
          href="#demo"
          className="px-6 py-2.5 text-sm font-medium bg-athlonix-blue text-white rounded-full hover:bg-athlonix-blue/90 transition-all duration-300"
        >
          Request Demo
        </a>
        <a
          href="#platform"
          className="px-6 py-2.5 text-sm font-medium text-white/70 border border-white/15 rounded-full hover:border-white/30 hover:text-white transition-all duration-300"
        >
          Explore What We Offer
        </a>
      </div>
    </div>
  )
}

// ─── COMBINED CONTENT ROW: headline (left) + wide dashboard (right), together below the logo ───
function HeroContentScreen({ visible }) {
  if (!visible) return null
  return (
    <div className="absolute inset-x-0 z-20 px-6" style={{ top: '57%' }}>
      <div className="max-w-7xl mx-auto">
        {/* Explicit width split (not flex-1) — the text and the card each get a fixed share of
            the row, so neither can grow into the other's space no matter the viewport width. */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 ml-6 md:ml-10 lg:ml-16">
          <div className="w-full lg:w-[48%] lg:shrink-0">
            <HeroTextScreen visible={visible} />
          </div>
          <div className="w-full lg:w-[48%] lg:min-w-0">
            <MiniDashboardScreen visible={visible} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCREEN-SPACE MINI DASHBOARD (outside Canvas) ───
// Signature element: a Predictive Signal Timeline — a solid line for recent performance that
// trails off into a dashed AI-projected line with a pulsing "intervention point", instead of a
// generic particle-build intro (that overlay was removed deliberately: it was the one thing
// consistently tied to the Hero freezing/crashing earlier in this project).
// ─── NETWORK FRAME INTRO (screen-space) ───
// AI-network nodes scattered around the card converge, via a plain CSS transition (not a Canvas
// render loop), onto the card's own rounded-rect border — the card frame "assembles itself"
// before its content fades in. Same safe technique as the Hero logo's point formation: fixed
// target coordinates + CSS transition, no per-frame JS work, so it can't reintroduce the
// hang/crash the old Canvas-based particle intro caused.
const FRAME_W = 288
const FRAME_H = 320
const FRAME_R = 16

function usePerimeterNodesCompute(count) {
  const w = FRAME_W
  const h = FRAME_H
  const r = FRAME_R
  const straightPerimeter = 2 * (w - 2 * r) + 2 * (h - 2 * r)
  const cornerPerimeter = 2 * Math.PI * r
  const totalPerimeter = straightPerimeter + cornerPerimeter

  const pointAt = (dist) => {
    let d = ((dist % totalPerimeter) + totalPerimeter) % totalPerimeter
    const segs = [
      { len: w - 2 * r, fn: (t) => ({ x: r + t * (w - 2 * r), y: 0 }) },
      { len: (Math.PI * r) / 2, fn: (t) => ({ x: w - r + r * Math.sin(t * (Math.PI / 2)), y: r - r * Math.cos(t * (Math.PI / 2)) }) },
      { len: h - 2 * r, fn: (t) => ({ x: w, y: r + t * (h - 2 * r) }) },
      { len: (Math.PI * r) / 2, fn: (t) => ({ x: w - r + r * Math.cos(t * (Math.PI / 2)), y: h - r + r * Math.sin(t * (Math.PI / 2)) }) },
      { len: w - 2 * r, fn: (t) => ({ x: w - r - t * (w - 2 * r), y: h }) },
      { len: (Math.PI * r) / 2, fn: (t) => ({ x: r - r * Math.sin(t * (Math.PI / 2)), y: h - r + r * Math.cos(t * (Math.PI / 2)) }) },
      { len: h - 2 * r, fn: (t) => ({ x: 0, y: h - r - t * (h - 2 * r) }) },
      { len: (Math.PI * r) / 2, fn: (t) => ({ x: r - r * Math.cos(t * (Math.PI / 2)), y: r - r * Math.sin(t * (Math.PI / 2)) }) },
    ]
    for (const seg of segs) {
      if (d <= seg.len) return seg.fn(d / seg.len)
      d -= seg.len
    }
    return { x: 0, y: 0 }
  }

  return Array.from({ length: count }, (_, i) => {
    const target = pointAt((i / count) * totalPerimeter)
    const angle = Math.random() * Math.PI * 2
    const dist = 60 + Math.random() * 70
    return {
      startX: target.x + Math.cos(angle) * dist,
      startY: target.y + Math.sin(angle) * dist,
      targetX: target.x,
      targetY: target.y,
      delay: (i / count) * 0.35,
    }
  })
}

function NetworkFrameIntro({ playing, hovered }) {
  const nodes = useMemo(() => usePerimeterNodesCompute(22), [])
  const straightPerimeter = 2 * (FRAME_W - 2 * FRAME_R) + 2 * (FRAME_H - 2 * FRAME_R)
  const cornerPerimeter = 2 * Math.PI * FRAME_R
  const totalPerimeter = straightPerimeter + cornerPerimeter
  // same geometry as the <rect>, expressed as a path so a pulse can travel along it
  const borderPath = `M ${FRAME_R},0.75 H ${FRAME_W - FRAME_R} A ${FRAME_R},${FRAME_R} 0 0 1 ${FRAME_W - 0.75},${FRAME_R} V ${FRAME_H - FRAME_R} A ${FRAME_R},${FRAME_R} 0 0 1 ${FRAME_W - FRAME_R},${FRAME_H - 0.75} H ${FRAME_R} A ${FRAME_R},${FRAME_R} 0 0 1 0.75,${FRAME_H - FRAME_R} V ${FRAME_R} A ${FRAME_R},${FRAME_R} 0 0 1 ${FRAME_R},0.75 Z`

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      preserveAspectRatio="none"
      style={{ overflow: 'visible' }}
    >
      <path id="mini-frame-path" d={borderPath} fill="none" opacity="0" />

      {/* the border itself "draws" — glows brighter on hover, so the card visibly responds
          instead of sitting static */}
      <rect
        x="0.75"
        y="0.75"
        width={FRAME_W - 1.5}
        height={FRAME_H - 1.5}
        rx={FRAME_R}
        fill="none"
        stroke="#2A6FD6"
        strokeWidth={hovered ? 2 : 1.5}
        strokeDasharray={totalPerimeter}
        strokeDashoffset={playing ? 0 : totalPerimeter}
        style={{
          transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1), stroke-width 0.4s ease, filter 0.4s ease',
          filter: hovered ? 'drop-shadow(0 0 7px rgba(42,111,214,0.95))' : 'drop-shadow(0 0 3px rgba(42,111,214,0.7))',
        }}
      />

      {/* a signal pulse that continuously travels the border once it's drawn — reads as "live
          AI system," not a one-time intro. Runs faster on hover. */}
      {playing && (
        <circle r={hovered ? 3.2 : 2.4} fill="#EAF2F8">
          <animateMotion dur={hovered ? '2.2s' : '3.6s'} repeatCount="indefinite" rotate="auto">
            <mpath href="#mini-frame-path" />
          </animateMotion>
        </circle>
      )}

      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={playing ? n.targetX : n.startX}
          cy={playing ? n.targetY : n.startY}
          r={2.2}
          fill="#7FB3F0"
          opacity={playing ? 0 : 1}
          style={{
            transition: `cx 0.8s cubic-bezier(0.16,1,0.3,1) ${n.delay}s, cy 0.8s cubic-bezier(0.16,1,0.3,1) ${n.delay}s, opacity 0.3s ease ${n.delay + 0.7}s`,
          }}
        />
      ))}
    </svg>
  )
}

function MiniDashboardScreen({ visible }) {
  const [counts, setCounts] = useState({ risk: 0, acwr: 0, injury: 0, premium: 0 })
  const [progress, setProgress] = useState(0)
  const [frameOn, setFrameOn] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    // tilt is intentionally restrained (max ~7deg) — a premium card that responds subtly to the
    // cursor, not a gimmick that swings wildly
    setTilt({ x: (py / 100 - 0.5) * -14, y: (px / 100 - 0.5) * 14, px, py })
  }

  useEffect(() => {
    if (!visible) return
    setFrameOn(true)

    const NETWORK_DELAY = 950 // lets the frame nodes converge before the content fades in

    // Entrance animation
    const start = Date.now() + NETWORK_DELAY
    const entranceDuration = 800
    const entrance = () => {
      const elapsed = Date.now() - start
      if (elapsed < 0) { requestAnimationFrame(entrance); return }
      const p = Math.min(1, elapsed / entranceDuration)
      const ease = 1 - Math.pow(1 - p, 3)
      setProgress(ease)
      if (p < 1) requestAnimationFrame(entrance)
    }
    entrance()

    // Count-up animation
    const targets = { risk: 72.4, acwr: 0.94, injury: 12.8, premium: 2450 }
    const countStart = Date.now() + NETWORK_DELAY + 300
    const countDuration = 1200
    const count = () => {
      const elapsed = Date.now() - countStart
      if (elapsed < 0) { requestAnimationFrame(count); return }
      const p = Math.min(1, elapsed / countDuration)
      const ease = 1 - Math.pow(1 - p, 3)
      setCounts({
        risk: Math.round(targets.risk * ease * 10) / 10,
        acwr: Math.round(targets.acwr * ease * 100) / 100,
        injury: Math.round(targets.injury * ease * 10) / 10,
        premium: Math.round(targets.premium * ease),
      })
      if (p < 1) requestAnimationFrame(count)
    }
    count()
  }, [visible])

  if (!visible) return null

  return (
    <div className="pointer-events-auto flex-1 min-w-0 w-full lg:max-w-xl">
      <div
        className="relative"
        style={{ width: '100%', maxWidth: 460 }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setHovered(false)
          setTilt({ x: 0, y: 0, px: 50, py: 50 })
        }}
      >
        <NetworkFrameIntro playing={frameOn} hovered={hovered} />
        <div
          style={{
            transform: `translateX(${(1 - progress) * 40}px)`,
            opacity: progress,
          }}
        >
          <div
            ref={cardRef}
            className="glass-panel-strong rounded-2xl p-4 w-full relative overflow-hidden shadow-2xl shadow-black/40"
            style={{
              transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
              transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* a light sheen that tracks the cursor — the single detail that makes the card feel
                like a physical, responsive surface instead of a flat screenshot */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.14), transparent 45%)`,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
            {/* Subtle background glows for depth */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-athlonix-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-athlonix-blue/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">Al-Hilal FC</p>
              <p className="text-[9px] text-white/30 mt-0.5 tracking-wide">Squad Telemetry</p>
            </div>
            <span className="text-[9px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Signature element: Predictive Risk Timeline */}
          <div className="relative w-full h-24 mb-4">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A6FD6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2A6FD6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4B8FE8" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#2A6FD6" />
                  <stop offset="100%" stopColor="#2A6FD6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <path d="M0,75 C40,75 70,35 120,45 C170,55 190,80 220,60 C250,40 270,25 300,30 L300,100 L0,100 Z" fill="url(#timelineGrad)" />
              <path d="M0,75 C40,75 70,35 120,45 C170,55 190,80 220,60" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M220,60 C250,40 270,25 300,30" fill="none" stroke="#2A6FD6" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.8" />

              <g transform="translate(250, 40)">
                {/* the live "ping" — kept as-is, it already reads well */}
                <circle cx="0" cy="0" r="10" fill="none" stroke="#2A6FD6" strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="2;12;2" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>
                {/* confidence ring — the arc drawn is literally the AI's confidence percentage
                    (94%), not a decorative circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="7"
                  fill="none"
                  stroke="#7FB3F0"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 7 * 0.94} ${2 * Math.PI * 7}`}
                  transform="rotate(-90)"
                  filter="url(#glow)"
                  opacity="0.9"
                />
                {/* the intervention point itself, built from a small cluster of dots — the same
                    particle language as the Athlenix logo mark, so any "AI moment" across the
                    product reads as the same signature, not a generic UI dot */}
                {Array.from({ length: 9 }).map((_, i) => {
                  const a = (i / 9) * Math.PI * 2
                  const r = i % 3 === 0 ? 0 : 2.4
                  return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="0.7" fill="#EAF2F8" />
                })}
              </g>
            </svg>

            <div className="absolute top-0 left-0 flex items-center gap-2">
              <p className="text-[9px] font-semibold text-white/50 tracking-widest uppercase">Predictive Signal</p>
              <span className="w-1 h-1 rounded-full bg-athlonix-blue animate-pulse" />
            </div>
            <div className="absolute bottom-0 left-0 text-[9px] text-white/20 font-medium tabular-nums">00:00</div>
            <div className="absolute bottom-0 right-0 text-[9px] text-white/20 font-medium tabular-nums">24:00</div>
            <div className="absolute top-2 right-0 text-[8px] text-athlonix-blue font-semibold tracking-wide bg-athlonix-blue/10 px-1.5 py-0.5 rounded-full border border-athlonix-blue/20">
              AI INTERVENTION
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Squad Risk</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">{counts.risk}</p>
                    <p className="text-[10px] text-white/30 font-medium">/100</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">ACWR</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">{counts.acwr}</p>
                    <p className="text-[10px] text-emerald-400 font-medium ml-1">Optimal</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Injury Prob</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-semibold text-amber-400 tracking-tight tabular-nums">{counts.injury}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Premium</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">{counts.premium.toLocaleString()}</p>
                    <p className="text-[10px] text-white/30 font-medium ml-1">SAR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interventions List */}
            <div className="md:border-l border-white/5 md:pl-5 border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] text-white/40 tracking-widest uppercase">Priority Interventions</p>
                <p className="text-[9px] text-white/20 font-medium">3 Active</p>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Salem Al-Dawsari', role: 'Forward', score: 87 },
                  { name: 'Yasser Al-Shahrani', role: 'Defender', score: 81 },
                  { name: 'André Carrillo', role: 'Midfielder', score: 76 },
                ].map((athlete, i) => (
                  <div
                    key={athlete.name}
                    className="flex items-center justify-between group"
                    style={{
                      opacity: progress > 0.05 ? 1 : 0,
                      transform: progress > 0.05 ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[9px] text-white/60 font-semibold tracking-wide">
                        {athlete.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[11px] text-white/80 font-medium leading-none">{athlete.name}</p>
                        <p className="text-[9px] text-white/30 mt-1">{athlete.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-14 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400/60 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${athlete.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold w-6 text-right tabular-nums">{athlete.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}

// ─── REWIND SWEEP (screen-space) ───
// A single soft light sweep, right-to-left, during the 'rewind' phase only — the visual cue that
// time is easing backward. Deliberately subtle: no jarring reverse-video effect, just one calm pass.
function RewindSweep({ active }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '35%',
          background: 'linear-gradient(90deg, transparent, rgba(42,111,214,0.10), transparent)',
          animation: 'rewind-sweep 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />
    </div>
  )
}

export { LogoRevealScreen, HeroContentScreen, RewindSweep }
