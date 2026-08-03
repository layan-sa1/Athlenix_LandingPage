import React from 'react'
import { useTheme } from '../ThemeContext'

const CLUBS = [
  'Al Hilal FC',
  'Al Nassr FC',
  'Al Ittihad FC',
  'Al Ahli FC',
  'Al Shabab FC',
  'Al Ettifaq FC',
]

// Infinite horizontal marquee — the list is duplicated back-to-back and the whole track slides
// left by exactly one copy's width, then jumps back to 0% seamlessly (a standard, reliable CSS
// technique — no JS animation loop needed, so it can't stutter or drift).
export default function TrustedBy() {
  const { theme } = useTheme()
  const bgHex = theme === 'dark' ? '#0A0A0F' : '#FFFFFF'

  return (
    <section className="relative py-10 lg:py-12 bg-[#FAFBFC] dark:bg-athlonix-dark border-y border-gray-200 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6">
        <p className="text-center text-[11px] font-medium text-gray-400 dark:text-white/30 tracking-[0.3em] uppercase">
          Trusted By Leading Sports Organizations
        </p>
      </div>

      <div className="relative">
        {/* fade masks on both edges so items don't pop in/out abruptly at the section boundary */}
        <div className="absolute inset-y-0 left-0 w-24 lg:w-40 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${bgHex}, transparent)` }} />
        <div className="absolute inset-y-0 right-0 w-24 lg:w-40 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${bgHex}, transparent)` }} />

        <div className="flex w-max" style={{ animation: 'marquee-scroll 28s linear infinite' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {CLUBS.map((club) => (
                <span
                  key={`${copy}-${club}`}
                  className="font-display text-lg md:text-xl font-medium text-gray-400 dark:text-white/25 hover:text-athlonix-blue transition-colors duration-300 whitespace-nowrap px-8 md:px-12"
                >
                  {club}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
