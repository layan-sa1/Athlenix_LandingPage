import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Building2, Shield, GraduationCap } from 'lucide-react'

const stakeholders = [
  {
    icon: Building2,
    title: 'For Clubs',
    caption: 'Understand player risk before it becomes a crisis.',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1400&q=80&auto=format&fit=crop',
    points: [
      'Real-time squad health dashboards',
      'Injury cost forecasting and budget planning',
      'Return-to-play timeline management',
      'Transfer risk assessment profiles',
    ],
    stat: 'SAR 4.2M',
    statDesc: 'average annual injury cost reduction',
  },
  {
    icon: Shield,
    title: 'For Insurance Companies',
    caption: 'Underwrite sports risk with real data, not guesswork.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=80&auto=format&fit=crop',
    points: [
      'Dynamic risk-based premium pricing',
      'Portfolio-level exposure monitoring',
      'Claims prediction and fraud detection',
      'Automated underwriting intelligence',
    ],
    stat: '23%',
    statDesc: 'improvement in loss ratio',
  },
  {
    icon: GraduationCap,
    title: 'For Federations & Academies',
    caption: 'Standardize athlete protection across every level.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=80&auto=format&fit=crop',
    points: [
      'National team health monitoring',
      'Youth development pathway tracking',
      'Multi-club data federation',
      'Regulatory compliance reporting',
    ],
    stat: '340+',
    statDesc: 'athletes monitored across leagues',
  },
]

const OVERVIEW_IMAGE = 'https://images.unsplash.com/photo-1671631981648-94ccf5623255?w=1600&q=80&auto=format&fit=crop'

// One stakeholder card: image with a caption underneath by default. On hover, the image narrows
// and a details panel (bullet points + stat) slides in beside it within the same card.
function StakeholderCard({ s }) {
  const [hovered, setHovered] = useState(false)
  const Icon = s.icon
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-athlonix-graphite border border-gray-200 dark:border-white/5 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minHeight: 320 }}
    >
      <div className="flex h-full">
        <div className="relative shrink-0 overflow-hidden transition-all duration-500 ease-athlonix" style={{ width: hovered ? '38%' : '100%' }}>
          <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-athlonix-dark/70 via-athlonix-dark/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="w-8 h-8 rounded-lg bg-white/70 dark:bg-athlonix-dark/60 backdrop-blur border border-gray-200 dark:border-white/10 flex items-center justify-center mb-2">
              <Icon size={14} className="text-athlonix-blue" />
            </div>
            <h3 className="font-display text-base font-semibold text-gray-900 dark:text-white leading-tight">{s.title}</h3>
            {!hovered && <p className="text-xs text-gray-500 dark:text-white/50 mt-1.5 leading-relaxed">{s.caption}</p>}
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-500 ease-athlonix flex flex-col justify-center p-5"
          style={{ width: hovered ? '62%' : '0%', opacity: hovered ? 1 : 0 }}
        >
          <ul className="space-y-2.5 mb-5">
            {s.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-athlonix-blue mt-1.5 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-white/70 leading-relaxed whitespace-normal">{point}</span>
              </li>
            ))}
          </ul>
          <div>
            <p className="font-display text-xl font-bold text-athlonix-blue mb-0.5 whitespace-nowrap">{s.stat}</p>
            <p className="text-[11px] text-gray-500 dark:text-white/40 leading-relaxed">{s.statDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Narrative scroll intro (unchanged): an overview image zooms into fullscreen, fades away, and
// — instead of cycling through stakeholders one at a time — all three appear together as a row,
// each revealing its detail on hover instead of on a scroll timer.
export default function Stakeholders() {
  const containerRef = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  const T_TEXT_GONE = 0.28
  const T_FULLSCREEN = 0.55
  const T_IMAGE_GONE = 0.72
  const T_CARDS_IN = 0.82

  const overviewTextOpacity = useTransform(p, [0, T_TEXT_GONE], [1, 0])
  const overviewTextY = useTransform(p, [0, T_TEXT_GONE], [0, -20])

  const imgWidth = useTransform(p, [0, T_FULLSCREEN], ['46%', '100%'])
  const imgHeight = useTransform(p, [0, T_FULLSCREEN], ['58%', '100%'])
  const imgTop = useTransform(p, [0, T_FULLSCREEN], ['21%', '0%'])
  const imgRight = useTransform(p, [0, T_FULLSCREEN], ['4%', '0%'])
  const imgRadius = useTransform(p, [0, T_FULLSCREEN], [20, 0])
  const imgScaleInner = useTransform(p, [0, T_FULLSCREEN], [1, 1.08])
  const portalOpacity = useTransform(p, [T_FULLSCREEN, T_IMAGE_GONE], [1, 0])
  const portalBlur = useTransform(p, [T_FULLSCREEN, T_IMAGE_GONE], [0, 10])
  const ambientBlur = useTransform(p, [0, T_FULLSCREEN], [0, 3])

  const cardsOpacity = useTransform(p, [T_IMAGE_GONE, T_CARDS_IN], [0, 1])
  const cardsY = useTransform(p, [T_IMAGE_GONE, T_CARDS_IN], [24, 0])

  return (
    <section id="stakeholders" ref={containerRef} className="relative bg-[#FAFBFC] dark:bg-athlonix-dark" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-20" />

        {/* overview text */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center max-w-xl px-6 lg:px-16 z-10"
          style={{ opacity: overviewTextOpacity, y: overviewTextY, filter: useTransform(ambientBlur, (b) => `blur(${b}px)`) }}
        >
          <span className="text-xs font-medium text-athlonix-blue tracking-widest uppercase mb-4 block">
            Who We Serve
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built for the People<br />Who Protect Athletes
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm max-w-md leading-relaxed">
            Different roles. Different pressures. One platform that speaks every language
            of the sports ecosystem.
          </p>
        </motion.div>

        {/* the portal image: card → fullscreen → fades/blurs away */}
        <motion.div
          className="absolute overflow-hidden z-10"
          style={{ width: imgWidth, height: imgHeight, top: imgTop, right: imgRight, borderRadius: imgRadius, opacity: portalOpacity, filter: useTransform(portalBlur, (b) => `blur(${b}px)`) }}
        >
          <motion.img
            src={OVERVIEW_IMAGE}
            alt="Athlenix platform"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale: imgScaleInner }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-athlonix-dark/50 via-transparent to-transparent" />
        </motion.div>

        {/* all three stakeholders, side by side, appearing together once the intro clears */}
        <motion.div
          className="absolute inset-0 flex items-center px-6 lg:px-12 z-10"
          style={{ opacity: cardsOpacity, y: cardsY }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-7xl mx-auto">
            {stakeholders.map((s) => (
              <StakeholderCard key={s.title} s={s} />
            ))}
          </div>
        </motion.div>

        {/* scroll hint, fades out once the journey begins */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-gray-400 dark:text-white/30 tracking-widest uppercase z-20"
          style={{ opacity: useTransform(p, [0, 0.05], [1, 0]) }}
        >
          Scroll to explore
        </motion.div>
      </div>
    </section>
  )
}
