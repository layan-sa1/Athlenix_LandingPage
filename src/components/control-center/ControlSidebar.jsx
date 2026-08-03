import React from 'react'
import {
  Sparkles,
  User,
  Building2,
  Bell,
  ShieldCheck,
  Lock,
  Palette,
  Watch,
  Plug,
  CreditCard,
} from 'lucide-react'
import { useTheme } from '../../ThemeContext'

export const SECTIONS = [
  { id: 'ai', label: 'AI Preferences', icon: Sparkles },
  { id: 'account', label: 'Account', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'devices', label: 'Connected Devices', icon: Watch },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function ControlSidebar({ active, onSelect }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <nav className="w-56 space-y-1">
      {SECTIONS.map((s) => {
          const Icon = s.icon
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-300 ease-athlonix relative"
              style={{
                color: isActive ? (isDark ? '#fff' : '#111827') : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(17,24,39,0.5)'),
                backgroundColor: isActive ? 'rgba(0,181,255,0.12)' : 'transparent',
                boxShadow: isActive ? '0 4px 20px -6px rgba(0,181,255,0.4), inset 0 0 0 1px rgba(0,181,255,0.25)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-athlonix-blue" />
              )}
              <Icon size={16} strokeWidth={2} className={isActive ? 'text-athlonix-blue' : ''} />
              <span className="font-medium">{s.label}</span>
            </button>
          )
        })}
    </nav>
  )
}
