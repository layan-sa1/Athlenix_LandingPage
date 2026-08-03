import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const Logo = ({ isScrolled }) => (
  <div className="flex items-end overflow-hidden">
    <img src="/brand/logo-mark-ath.png" alt="" className="h-[19px] md:h-[21px] w-auto shrink-0" />
    {/* "LENIX" — the mark's own L (merged into the H's leg) is too subtle to read on its own.
        items-end + marginBottom lines the text's visual baseline up with the mark's own bottom
        edge (a font's line-box reserves descender space even when the word has no descenders,
        which is what pushes plain items-end alignment off by a few px on its own). */}
    <span
      className="font-display font-black uppercase overflow-hidden inline-block leading-none text-[24px] md:text-[27px] mb-[-4.5px] md:mb-[-5.5px]"
      style={{
        color: '#00B5FF',
        maxWidth: isScrolled ? '0px' : '160px',
        marginLeft: isScrolled ? '0px' : '2px',
        opacity: isScrolled ? 0 : 1,
        transition: 'max-width 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s cubic-bezier(0.16,1,0.3,1), margin-left 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      LENIX
    </span>
    <span
      className="shrink-0 rounded-[1.5px]"
      style={{
        width: '6px',
        height: '6px',
        marginLeft: '3px',
        marginBottom: '0px',
        background: '#00B5FF',
        transition: 'margin-left 0.3s ease',
      }}
    />
  </div>
)

const navLinks = [
  {
    label: 'Solution',
    href: '#solution',
    menu: [
      { label: 'Athlete Data', desc: 'Every movement captured' },
      { label: 'Risk Engine', desc: 'Predict before it happens' },
      { label: 'Medical Intelligence', desc: 'Clinical-grade insight' },
      { label: 'Insurance Intelligence', desc: 'Price the risk precisely' },
      { label: 'Executive Analytics', desc: 'Decisions at a glance' },
    ],
  },
  {
    label: 'Stakeholders',
    href: '#stakeholders',
    menu: [
      { label: 'For Clubs', desc: 'Understand player risk' },
      { label: 'For Insurance Companies', desc: 'Underwrite with precision' },
      { label: 'For Federations & Academies', desc: 'Standardize athlete protection' },
    ],
  },
  {
    label: 'Platform',
    href: '#platform',
    menu: [
      { label: 'Live Dashboard', desc: 'Real-time risk overview' },
      { label: 'Risk Distribution', desc: 'Team-wide breakdown' },
    ],
  },
]

export default function Navbar({ scrollY }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const closeTimer = useRef(null)
  const isScrolled = scrollY > 80

  const handleEnter = (i) => {
    clearTimeout(closeTimer.current)
    setOpenMenu(i)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 ease-athlonix border-b ${
        isScrolled ? 'bg-white/90 dark:bg-athlonix-dark/90 backdrop-blur-xl' : 'bg-transparent'
      }`}
      style={{
        borderColor: isScrolled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0)',
        transition: 'background-color 0.7s, border-color 0.7s, backdrop-filter 0.7s',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* three-column grid: logo | centered nav | CTA, so the nav links are truly centered
            regardless of logo/button width */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 lg:h-20">
          <Logo isScrolled={isScrolled} />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 tracking-wide py-2"
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-300"
                    style={{ transform: openMenu === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </a>

                {/* dropdown mega-menu */}
                <div
                  className="absolute left-1/2 top-full pt-3"
                  style={{
                    opacity: openMenu === i ? 1 : 0,
                    visibility: openMenu === i ? 'visible' : 'hidden',
                    transition: 'opacity 0.25s cubic-bezier(0.16,1,0.3,1), transform 0.25s cubic-bezier(0.16,1,0.3,1)',
                    transform: `translateX(-50%) translateY(${openMenu === i ? 0 : -6}px)`,
                  }}
                >
                  <div className="w-64 rounded-xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-athlonix-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {link.menu.map((item) => (
                      <a
                        key={item.label}
                        href={link.href}
                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 border-b border-gray-100 dark:border-white/5 last:border-b-0"
                      >
                        <p className="text-sm text-gray-900 dark:text-white/90">{item.label}</p>
                        <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">{item.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center justify-end gap-3">
            <Link
              to="/control-center"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              Control Center
            </Link>
            <a
              href="#demo"
              className="px-5 py-2 text-sm font-medium bg-athlonix-blue/10 text-athlonix-blueText dark:text-athlonix-blue border border-athlonix-blueText/30 dark:border-athlonix-blue/30 rounded-full hover:bg-athlonix-blue/20 transition-all duration-300"
            >
              Request Demo
            </a>
          </div>

          <button
            className="md:hidden text-white/80 col-start-3 justify-self-end"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="block px-5 py-2.5 text-center text-sm font-medium bg-athlonix-blue text-white rounded-full"
            onClick={() => setMobileOpen(false)}
          >
            Request Demo
          </a>
        </div>
      )}
    </nav>
  )
}
