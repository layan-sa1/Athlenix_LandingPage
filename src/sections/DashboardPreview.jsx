import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { TrendingUp, AlertTriangle, Sparkles, Building2, ShieldCheck } from 'lucide-react'

// Two datasets, one dashboard shell — the pills above swap the org name, KPIs, list, distribution,
// AI insight copy, and accent color underneath them. Same data shape as the Hero's mini card, so
// both places feel like the same product.
const MODES = {
  clubs: {
    label: 'Clubs & Academies',
    icon: Building2,
    accent: '#00B5FF',
    accentSoft: 'rgba(42,111,214,0.15)',
    orgName: 'Al-Hilal FC',
    kpis: [
      { label: 'ACWR', value: 0.94, decimals: 2, color: 'text-white', tag: 'Optimal', tagColor: 'text-emerald-400' },
      { label: 'Injury Prediction', value: 94, suffix: '%', color: 'text-amber-400', tag: 'High Risk', tagColor: 'text-amber-400' },
      { label: 'Monthly Premium', value: 2450, prefix: 'SAR ', color: 'text-white', tag: 'Estimated', tagColor: 'text-white/30' },
    ],
    listTitle: 'High Risk Athletes',
    list: [
      { name: 'Salem Al-Dawsari', sub: 'Forward', risk: 87, status: 'High' },
      { name: 'Yasser Al-Shahrani', sub: 'Defender', risk: 81, status: 'High' },
      { name: 'André Carrillo', sub: 'Midfielder', risk: 76, status: 'High' },
      { name: 'Firas Al-Buraikan', sub: 'Forward', risk: 54, status: 'Moderate' },
      { name: 'Mohammed Kanno', sub: 'Midfielder', risk: 38, status: 'Low' },
    ],
    dist: [
      { label: 'Low Risk', pct: 62, color: '#34D399' },
      { label: 'Moderate', pct: 26, color: '#FBBF24' },
      { label: 'High Risk', pct: 12, color: '#F87171' },
    ],
    insight: 'Increased injury risk detected in midfield line. Recommended workload adjustment in the next 7 days.',
  },
  insurance: {
    label: 'Insurance Providers',
    icon: ShieldCheck,
    accent: '#14B8A6',
    accentSoft: 'rgba(20,184,166,0.15)',
    orgName: 'Sports Risk Portfolio',
    kpis: [
      { label: 'Portfolio Risk', value: 41, suffix: '/100', color: 'text-white', tag: 'Stable', tagColor: 'text-emerald-400' },
      { label: 'Claims Ratio', value: 0.62, decimals: 2, color: 'text-amber-400', tag: 'Watch', tagColor: 'text-amber-400' },
      { label: 'Active Policies', value: 1284, color: 'text-white', tag: 'This month', tagColor: 'text-white/30' },
    ],
    listTitle: 'Flagged Policies',
    list: [
      { name: 'Al-Hilal FC', sub: 'Policy #4421', risk: 82, status: 'High' },
      { name: 'Al-Nassr Academy', sub: 'Policy #3987', risk: 74, status: 'High' },
      { name: 'Al-Ittihad FC', sub: 'Policy #4102', risk: 68, status: 'Moderate' },
      { name: 'Al-Ahli Academy', sub: 'Policy #2890', risk: 45, status: 'Moderate' },
      { name: 'Al-Shabab FC', sub: 'Policy #3341', risk: 22, status: 'Low' },
    ],
    dist: [
      { label: 'Approved', pct: 71, color: '#34D399' },
      { label: 'Under Review', pct: 21, color: '#FBBF24' },
      { label: 'Disputed', pct: 8, color: '#F87171' },
    ],
    insight: 'Al-Ittihad FC policy shows rising claim frequency. Recommended premium re-pricing this cycle.',
  },
}

const riskColor = (status) =>
  status === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' : status === 'Moderate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'

function AnimatedStat({ value, decimals = 0, suffix = '', prefix = '', start }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!start) return
    const duration = 900
    const t0 = Date.now()
    const animate = () => {
      const elapsed = Date.now() - t0
      const p = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(value * ease * 10 ** decimals) / 10 ** decimals)
      if (p < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [start, value, decimals])
  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

function RiskRing({ segments, start, accent }) {
  const size = 108
  const stroke = 12
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  let offsetAccum = 0
  const primary = segments[0]

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {segments.map((s) => {
          const len = (s.pct / 100) * circumference
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${start ? len : 0} ${circumference}`}
              strokeDashoffset={-offsetAccum}
              strokeLinecap="butt"
              style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
            />
          )
          offsetAccum += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold text-white tabular-nums">
          <AnimatedStat value={primary.pct} suffix="%" start={start} />
        </span>
        <span className="text-[9px] text-white/40 text-center px-2">{primary.label}</span>
      </div>
    </div>
  )
}

function ModePill({ modeKey, active, onSelect }) {
  const m = MODES[modeKey]
  const Icon = m.icon
  return (
    <button
      onMouseEnter={() => onSelect(modeKey)}
      onClick={() => onSelect(modeKey)}
      className="flex items-center gap-2.5 rounded-full pl-2.5 pr-4 py-2 border transition-all duration-500"
      style={{
        borderColor: active ? m.accent : 'rgba(255,255,255,0.08)',
        background: active ? m.accentSoft : 'rgba(255,255,255,0.02)',
        boxShadow: active ? `0 4px 18px -6px ${m.accentSoft}` : 'none',
      }}
    >
      <span className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500" style={{ background: active ? m.accent : 'rgba(255,255,255,0.06)' }}>
        <Icon size={13} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)' }} />
      </span>
      <span className={`text-sm font-semibold ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/55'}`}>{m.label}</span>
    </button>
  )
}

export default function DashboardPreview() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [mode, setMode] = useState('clubs')
  const m = MODES[mode]

  // Same tilt-on-cursor + light-sheen treatment as the Hero's mini dashboard, so the two feel
  // like the same physical surface instead of two differently-built components.
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50 })
  const cardRef = useRef(null)
  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    setTilt({ x: (py / 100 - 0.5) * -6, y: (px / 100 - 0.5) * 6, px, py })
  }

  return (
    <section id="platform" ref={sectionRef} className="relative py-24 lg:py-32 bg-[#F2F2F4] dark:bg-athlonix-dark overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{ background: m.accentSoft }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <span className="text-xs font-medium text-athlonix-blue tracking-widest uppercase mb-4 block">
            Platform Preview
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6">
            See It in Action
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            A live look at how Athlenix surfaces risk across a squad, in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <ModePill modeKey="clubs" active={mode === 'clubs'} onSelect={setMode} />
          <ModePill modeKey="insurance" active={mode === 'insurance'} onSelect={setMode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHovered(false)
            setTilt({ x: 0, y: 0, px: 50, py: 50 })
          }}
          style={{ perspective: 1400 }}
        >
          <div
            ref={cardRef}
            className="relative glass-panel-strong rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-700"
            style={{
              borderColor: `${m.accent}33`,
              boxShadow: `0 0 60px -20px ${m.accentSoft}`,
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.006 : 1})`,
              transition: hovered ? 'transform 0.1s ease-out, border-color 0.7s, box-shadow 0.7s' : 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.7s, box-shadow 0.7s',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* same cursor-tracked sheen as the Hero's mini card */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: `radial-gradient(circle at ${tilt.px}% ${tilt.py}%, rgba(255,255,255,0.08), transparent 45%)`,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />

            <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode + '-header'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-white">{m.orgName}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border transition-colors duration-500"
                    style={{ color: m.accent, background: m.accentSoft, borderColor: `${m.accent}33` }}
                  >
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: m.accent }} />
                    Live
                  </span>
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center gap-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode + '-kpis'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="hidden md:flex items-center gap-8"
                  >
                    {m.kpis.map((k) => (
                      <div key={k.label} className="text-right">
                        <p className="text-[10px] text-white/40 uppercase tracking-wide">{k.label}</p>
                        <p className={`text-sm font-display font-semibold ${k.color}`}>
                          <AnimatedStat value={k.value} decimals={k.decimals || 0} suffix={k.suffix || ''} prefix={k.prefix || ''} start={isInView} />
                        </p>
                        <p className={`text-[9px] ${k.tagColor}`}>{k.tag}</p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-500"
                    style={{ background: m.accentSoft, borderColor: `${m.accent}55`, color: m.accent }}
                  >
                    <Sparkles size={13} />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/5">
                <div className="relative w-full h-24 mb-6">
                  <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="timelineGradBig" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={m.accent} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={m.accent} stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="lineGradBig" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={m.accent} stopOpacity="0.2" />
                        <stop offset="50%" stopColor={m.accent} />
                        <stop offset="100%" stopColor={m.accent} stopOpacity="0.8" />
                      </linearGradient>
                      <filter id="glowBig">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <path d="M0,75 C40,75 70,35 120,45 C170,55 190,80 220,60 C250,40 270,25 300,30 L300,100 L0,100 Z" fill="url(#timelineGradBig)" />
                    <path d="M0,75 C40,75 70,35 120,45 C170,55 190,80 220,60" fill="none" stroke="url(#lineGradBig)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M220,60 C250,40 270,25 300,30" fill="none" stroke={m.accent} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.8" />
                    <g transform="translate(250, 40)">
                      <circle cx="0" cy="0" r="10" fill="none" stroke={m.accent} strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" values="2;12;2" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                      <circle
                        cx="0" cy="0" r="7" fill="none" stroke={m.accent} strokeWidth="1.2" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 7 * 0.94} ${2 * Math.PI * 7}`}
                        transform="rotate(-90)" filter="url(#glowBig)" opacity="0.9"
                      />
                      {Array.from({ length: 9 }).map((_, i) => {
                        const a = (i / 9) * Math.PI * 2
                        const r = i % 3 === 0 ? 0 : 2.4
                        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="0.7" fill="#EAF2F8" />
                      })}
                    </g>
                  </svg>
                  <div className="absolute top-0 left-0 flex items-center gap-2">
                    <p className="text-[9px] font-semibold text-white/50 tracking-widest uppercase">Predictive Signal</p>
                    <span className="w-1 h-1 rounded-full animate-pulse transition-colors duration-500" style={{ background: m.accent }} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={mode + '-list'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-center gap-2 mb-5">
                      <AlertTriangle size={14} style={{ color: m.accent }} />
                      <span className="text-xs font-medium text-white/60 tracking-wide uppercase">{m.listTitle}</span>
                    </div>
                    <div className="space-y-3">
                      {m.list.map((a, i) => (
                        <motion.div
                          key={a.name}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-b-0"
                        >
                          <div>
                            <p className="text-sm text-white">{a.name}</p>
                            <p className="text-[11px] text-white/40">{a.sub}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-2 py-1 rounded-full border ${riskColor(a.status)}`}>{a.status}</span>
                            <span className="font-display text-sm font-semibold text-white w-8 text-right">{a.risk}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-6">
                <AnimatePresence mode="wait">
                  <motion.div key={mode + '-dist'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-center gap-2 mb-5">
                      <TrendingUp size={14} style={{ color: m.accent }} />
                      <span className="text-xs font-medium text-white/60 tracking-wide uppercase">Distribution</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <RiskRing segments={m.dist} start={isInView} accent={m.accent} />
                      <div className="flex-1 space-y-3">
                        {m.dist.map((r) => (
                          <div key={r.label} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs text-white/50">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                              {r.label}
                            </span>
                            <span className="text-xs font-medium text-white">{r.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="h-10" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode + '-insight'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-xl border p-4 transition-colors duration-500"
                    style={{ borderColor: `${m.accent}33`, background: m.accentSoft }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles size={13} style={{ color: m.accent }} />
                      <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: m.accent }}>AI Insight</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mb-3">{m.insight}</p>
                    <button className="inline-flex items-center gap-1.5 text-xs font-medium hover:gap-2.5 transition-all" style={{ color: m.accent }}>
                      View Full Insight <span aria-hidden="true">→</span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
