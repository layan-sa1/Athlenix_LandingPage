import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Building2, ShieldCheck } from 'lucide-react'
import { useNavigate } from "react-router-dom";

function useLiveNumber(target, decimals = 0, active = true) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const duration = 1200
    const t0 = Date.now()
    const tick = () => {
      const elapsed = Date.now() - t0
      const p = Math.min(1, elapsed / duration)
      const ease = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(target * ease * 10 ** decimals) / 10 ** decimals)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, decimals])
  return display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

const PORTALS = {
  clubs: {
    icon: Building2,
    title: 'Clubs & Academies',
    desc: 'Manage athletes, staff, and performance programs in one intelligent platform.',
    accent: '#00B5FF',
    features: ['Monitor athlete health and performance', 'Plan training and recovery programs', 'Track progress and engagement', 'Generate insights and reports'],
    stats: [
      { label: 'Live Players', value: 154 },
      { label: 'Current Risk', value: 12, suffix: '%' },
      { label: "Today's Sessions", value: 34 },
    ],
  },
  insurance: {
    icon: ShieldCheck,
    title: 'Insurance Providers',
    desc: 'Assess risk, automate underwriting, and optimize claims with confidence.',
    accent: '#14B8A6',
    features: ['AI-powered risk assessment', 'Automate underwriting decisions', 'Fraud detection and prevention', 'Claims analytics and forecasting'],
    stats: [
      { label: 'Active Policies', value: 2480 },
      { label: 'Premium Accuracy', value: 94, suffix: '%' },
      { label: 'Claims Reviewed', value: 183 },
    ],
  },
}

function PortalHalf({ portalKey, isWide, isHovered, isInView, onEnter, onPortalClick }) {
  const portal = PORTALS[portalKey]
  const Icon = portal.icon
  return (
    <div
      onMouseEnter={onEnter}
      onClick={onPortalClick}
      className="relative overflow-hidden cursor-pointer flex flex-col justify-center px-8 md:px-12 py-14"
      style={{
        flexGrow: isWide ? 3 : 2,
        flexBasis: 0,
        minWidth: 0,
        transition: 'flex-grow 0.6s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ background: `radial-gradient(ellipse at 30% 20%, ${portal.accent}22, transparent 65%)`, opacity: isHovered ? 1 : 0.35 }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `linear-gradient(${portal.accent}14 1px, transparent 1px), linear-gradient(90deg, ${portal.accent}14 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          opacity: isHovered ? 0.5 : 0,
          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />

      <div className="relative">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-5 border transition-all duration-500"
          style={{ background: `${portal.accent}1F`, borderColor: `${portal.accent}55`, transform: isHovered ? 'scale(1.12)' : 'scale(1)' }}
        >
          <Icon size={21} style={{ color: portal.accent }} />
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2 whitespace-nowrap">{portal.title}</h3>
        <p className="text-sm text-gray-600 dark:text-white/45 leading-relaxed mb-6 max-w-xs">{portal.desc}</p>

        <ul className="space-y-2 mb-8" style={{ opacity: isWide ? 1 : 0.5, transition: 'opacity 0.5s ease' }}>
          {portal.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-white/60">
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: portal.accent }} />
              {f}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-3 gap-4 mb-8 transition-all duration-500" style={{ opacity: isWide ? 1 : 0.35 }}>
          {portal.stats.map((s) => (
            <StatBlock key={s.label} stat={s} active={isInView || isHovered} />
          ))}
        </div>

         <button
  onClick={onPortalClick}
  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-all duration-500"
  style={{
    color: isHovered ? "#fff" : "rgba(255,255,255,0.6)",
    background: isHovered ? portal.accent : "transparent",
    borderColor: isHovered
      ? portal.accent
      : "rgba(255,255,255,0.15)",
  }}
        >
          Enter Portal <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}

function StatBlock({ stat, active }) {
  const value = useLiveNumber(stat.value, 0, active)
  return (
    <div>
      <p className="text-lg font-display font-semibold text-gray-900 dark:text-white tabular-nums">
        {value}
        {stat.suffix || ''}
      </p>
      <p className="text-[10px] text-gray-400 dark:text-white/35 uppercase tracking-wide mt-0.5">{stat.label}</p>
    </div>
  )
}

export default function ChoosePortal() {
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate();
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="relative pt-6 pb-24 lg:pb-28 bg-[#F2F2F4] dark:bg-athlonix-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-medium text-athlonix-blue tracking-widest uppercase mb-4 block">
            Choose Your Portal
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white">
            Access Athlenix Based on Your Role
          </h2>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden flex flex-col md:flex-row bg-white/80 dark:bg-[rgba(17,17,24,0.85)] backdrop-blur-2xl border border-gray-200 dark:border-white/[0.08]"
          onMouseLeave={() => setHovered(null)}
        >
          <PortalHalf
  portalKey="clubs"
  isWide={hovered === "clubs"}
  isHovered={hovered === "clubs"}
  onEnter={() => setHovered("clubs")}
  isInView={isInView}
  onPortalClick={() => navigate("/clubs")}
/>

          <div className="relative w-px hidden md:block" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                background: `linear-gradient(180deg, transparent, ${hovered ? PORTALS[hovered].accent : '#00B5FF'}, transparent)`,
                boxShadow: `0 0 16px ${hovered ? PORTALS[hovered].accent : '#00B5FF'}`,
                transform: hovered === 'clubs' ? 'translateX(6px)' : hovered === 'insurance' ? 'translateX(-6px)' : 'translateX(0)',
                transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          </div>
          <div className="h-px w-full md:hidden bg-gray-200 dark:bg-white/10" />

          <PortalHalf
  portalKey="insurance"
  isWide={hovered === "insurance"}
  isHovered={hovered === "insurance"}
  onEnter={() => setHovered("insurance")}
  isInView={isInView}
  onPortalClick={() => navigate("/insurance")}
/>
        </div>
      </div>
    </section>
  )
}
