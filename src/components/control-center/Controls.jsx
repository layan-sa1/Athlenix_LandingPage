import React from 'react'
import { useTheme } from '../../ThemeContext'

// ─── premium switch ───
export function Toggle({ checked, onChange }) {
  const { theme } = useTheme()
  const offColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.15)'
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0"
      style={{ backgroundColor: checked ? '#00B5FF' : offColor }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-athlonix"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}

// ─── pill-style segmented control, used instead of plain dropdowns for AI settings ───
export function SegmentedControl({ options, value, onChange }) {
  const { theme } = useTheme()
  const inactiveText = theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)'
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
          style={{
            color: value === opt.value ? '#fff' : inactiveText,
            backgroundColor: value === opt.value ? '#00B5FF' : 'transparent',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── slider with a live value readout ───
export function Slider({ value, onChange, min = 0, max = 100, unit = '%' }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-white/10">
        <div className="absolute inset-y-0 left-0 rounded-full bg-athlonix-blue" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-athlonix-blue pointer-events-none transition-transform"
          style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-white/70 w-10 text-right shrink-0">
        {value}
        {unit}
      </span>
    </div>
  )
}

// ─── card wrapper every setting group sits in ───
// Uses its own theme-reactive surface (not the shared glass-panel-strong class) — that class is
// intentionally locked to always-dark for product-screenshot mockups elsewhere on the site, and
// reusing it here is what made every settings card render as a black box in light mode.
export function SettingCard({ title, description, children, className = '' }) {
  return (
    <div
      className={`rounded-2xl p-5 md:p-6 transition-all duration-300 border bg-white hover:bg-gray-50 border-gray-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.04] dark:border-white/5 hover:-translate-y-0.5 shadow-sm dark:shadow-none ${className}`}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>}
          {description && <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── one row inside a card: label on the left, control on the right ───
export function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0 border-b border-gray-100 dark:border-white/5 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm text-gray-700 dark:text-white/85">{label}</p>
        {description && <p className="text-[11px] text-gray-400 dark:text-white/35 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
