import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import ControlSidebar, { SECTIONS } from '../components/control-center/ControlSidebar'
import {
  AISection,
  AccountSection,
  OrganizationSection,
  NotificationsSection,
  SecuritySection,
  PrivacySection,
  AppearanceSection,
  DevicesSection,
  IntegrationsSection,
  BillingSection,
} from '../components/control-center/Sections'

const SECTION_COMPONENTS = {
  ai: AISection,
  account: AccountSection,
  organization: OrganizationSection,
  notifications: NotificationsSection,
  security: SecuritySection,
  privacy: PrivacySection,
  appearance: AppearanceSection,
  devices: DevicesSection,
  integrations: IntegrationsSection,
  billing: BillingSection,
}

export default function ControlCenter() {
  const [active, setActive] = useState('ai')
  const ActiveSection = SECTION_COMPONENTS[active]
  const activeLabel = SECTIONS.find((s) => s.id === active)?.label

  return (
    <div className="min-h-screen bg-athlonix-dark">
      {/* ambient background glow, quiet and consistent with the rest of the product */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-athlonix-blue/[0.04] blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-athlonix-dark/80 backdrop-blur-xl">
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-sm">
              <ArrowLeft size={15} />
              <img src="/brand/logo-mark.png" alt="Athlenix" className="h-6 w-auto" />
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm text-white/70 font-medium">Control Center</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-athlonix-blue/30 to-athlonix-blue/5 border border-white/10 flex items-center justify-center text-[11px] font-display font-semibold text-white">
              LA
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* the sidebar is pinned to the true left edge of the browser window, independent of
            the centered max-width content column next to it */}
        <div className="hidden lg:block fixed top-24 left-6 xl:left-10 z-20">
          <ControlSidebar active={active} onSelect={setActive} />
        </div>

        <div className="max-w-4xl mx-auto lg:ml-64 xl:ml-72 lg:mr-auto px-6 lg:px-8 py-10">
          {/* mobile section picker */}
          <div className="lg:hidden mb-6 -mx-6 px-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className="shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-300"
                  style={{
                    color: active === s.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    backgroundColor: active === s.id ? 'rgba(42,111,214,0.15)' : 'transparent',
                    borderColor: active === s.id ? 'rgba(42,111,214,0.4)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ActiveSection />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
