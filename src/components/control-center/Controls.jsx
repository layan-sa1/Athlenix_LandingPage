import React from 'react'

// ─── premium switch ───
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0"
      style={{ backgroundColor: checked ? '#2A6FD6' : 'rgba(255,255,255,0.12)' }}
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
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
          style={{
            color: value === opt.value ? '#fff' : 'rgba(255,255,255,0.5)',
            backgroundColor: value === opt.value ? '#2A6FD6' : 'transparent',
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
      <div className="relative flex-1 h-1.5 rounded-full bg-white/10">
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
      <span className="text-xs font-medium text-white/70 w-10 text-right shrink-0">
        {value}
        {unit}
      </span>
    </div>
  )
}

// ─── card wrapper every setting group sits in ───
export function SettingCard({ title, description, children, className = '' }) {
  return (
    <div
      className={`glass-panel-strong rounded-2xl p-5 md:p-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 ${className}`}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>}
          {description && <p className="text-xs text-white/40 leading-relaxed">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── one row inside a card: label on the left, control on the right ───
export function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0 border-b border-white/5 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm text-white/85">{label}</p>
        {description && <p className="text-[11px] text-white/35 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
