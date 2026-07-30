import React, { useState } from 'react'
import {
  Sparkles,
  Camera,
  KeyRound,
  ShieldCheck,
  Smartphone,
  History,
  Sun,
  Moon,
  MonitorSmartphone,
  Watch,
  Battery,
  RefreshCw,
  Plug,
  Slack,
  Webhook,
  CreditCard,
  Download,
  Trash2,
} from 'lucide-react'
import { Toggle, SegmentedControl, Slider, SettingCard, SettingRow } from './Controls'

// ─────────────────────────────── AI PREFERENCES ───────────────────────────────
export function AISection() {
  const [level, setLevel] = useState('advanced')
  const [reportStyle, setReportStyle] = useState('detailed')
  const [frequency, setFrequency] = useState('realtime')
  const [sensitivity, setSensitivity] = useState(72)
  const [confidence, setConfidence] = useState(85)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5 mb-1">
        <Sparkles size={18} className="text-athlonix-blue" />
        <h2 className="font-display text-xl font-semibold text-white">AI Preferences</h2>
      </div>
      <p className="text-sm text-white/40 -mt-3 mb-2">
        Tune how Athlenix's models analyze, predict, and report on athlete risk.
      </p>

      <SettingCard title="AI Analysis Level" description="Higher levels use more compute and take longer, but surface subtler patterns.">
        <SegmentedControl
          value={level}
          onChange={setLevel}
          options={[
            { value: 'standard', label: 'Standard' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'maximum', label: 'Maximum' },
          ]}
        />
      </SettingCard>

      <SettingCard title="Prediction Sensitivity" description="How readily the model flags an athlete as at-risk.">
        <Slider value={sensitivity} onChange={setSensitivity} />
      </SettingCard>

      <SettingCard title="Injury Detection Confidence" description="Minimum confidence threshold before a prediction is surfaced to staff.">
        <Slider value={confidence} onChange={setConfidence} />
      </SettingCard>

      <SettingCard title="Report Style" description="How AI-generated summaries are written.">
        <SegmentedControl
          value={reportStyle}
          onChange={setReportStyle}
          options={[
            { value: 'concise', label: 'Concise' },
            { value: 'detailed', label: 'Detailed' },
            { value: 'clinical', label: 'Clinical' },
          ]}
        />
      </SettingCard>

      <SettingCard title="Recommendation Frequency" description="How often Athlenix proactively surfaces new recommendations.">
        <SegmentedControl
          value={frequency}
          onChange={setFrequency}
          options={[
            { value: 'realtime', label: 'Real-time' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── ACCOUNT ───────────────────────────────
export function AccountSection() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Account</h2>
      <SettingCard title="Account Information" description="Your identity across Athlenix.">
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-athlonix-blue/30 to-athlonix-blue/5 border border-white/10 flex items-center justify-center text-lg font-display font-semibold text-white">
              LA
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-athlonix-blue flex items-center justify-center border-2 border-athlonix-dark">
              <Camera size={11} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm text-white font-medium">Layan Al-Tamimi</p>
            <p className="text-xs text-white/40">Performance Analyst · Al-Hilal FC</p>
          </div>
        </div>
        <SettingRow label="Full name">
          <span className="text-sm text-white/50">Layan Al-Tamimi</span>
        </SettingRow>
        <SettingRow label="Email address">
          <span className="text-sm text-white/50">layan@alhilal.sa</span>
        </SettingRow>
        <SettingRow label="Role" description="Assigned by your organization admin">
          <span className="text-sm text-white/50">Performance Analyst</span>
        </SettingRow>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── ORGANIZATION ───────────────────────────────
export function OrganizationSection() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Organization</h2>
      <SettingCard title="Al-Hilal FC" description="Your organization's workspace on Athlenix.">
        <SettingRow label="Plan" description="Club Enterprise, billed annually">
          <span className="text-xs px-2.5 py-1 rounded-full bg-athlonix-blue/15 text-athlonix-blue border border-athlonix-blue/25">Enterprise</span>
        </SettingRow>
        <SettingRow label="Seats" description="14 of 25 seats used">
          <span className="text-sm text-white/50">14 / 25</span>
        </SettingRow>
        <SettingRow label="Squad size" description="Athletes currently monitored">
          <span className="text-sm text-white/50">32 athletes</span>
        </SettingRow>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── NOTIFICATIONS ───────────────────────────────
export function NotificationsSection() {
  const [prefs, setPrefs] = useState({ email: true, push: true, sms: false, injury: true, digest: true })
  const set = (key) => (val) => setPrefs((p) => ({ ...p, [key]: val }))

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Notifications</h2>
      <SettingCard title="Notification Preferences" description="Choose how Athlenix reaches you.">
        <SettingRow label="Email notifications">
          <Toggle checked={prefs.email} onChange={set('email')} />
        </SettingRow>
        <SettingRow label="Push notifications">
          <Toggle checked={prefs.push} onChange={set('push')} />
        </SettingRow>
        <SettingRow label="SMS alerts" description="For critical injury risk only">
          <Toggle checked={prefs.sms} onChange={set('sms')} />
        </SettingRow>
        <SettingRow label="Injury risk alerts">
          <Toggle checked={prefs.injury} onChange={set('injury')} />
        </SettingRow>
        <SettingRow label="Weekly digest">
          <Toggle checked={prefs.digest} onChange={set('digest')} />
        </SettingRow>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── SECURITY ───────────────────────────────
export function SecuritySection() {
  const [twoFA, setTwoFA] = useState(true)
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Security</h2>

      <SettingCard>
        <SettingRow label="Password" description="Last changed 3 months ago">
          <div className="flex items-center gap-2 text-white/40">
            <KeyRound size={14} />
            <button className="text-xs text-athlonix-blue hover:underline">Change</button>
          </div>
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Adds an extra layer of protection at sign-in">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className={twoFA ? 'text-emerald-400' : 'text-white/30'} />
            <Toggle checked={twoFA} onChange={setTwoFA} />
          </div>
        </SettingRow>
      </SettingCard>

      <SettingCard title="Active Sessions">
        {[
          { device: 'MacBook Pro · Riyadh', time: 'Active now', current: true },
          { device: 'iPhone 15 · Riyadh', time: '2 hours ago', current: false },
        ].map((s) => (
          <SettingRow key={s.device} label={s.device} description={s.time}>
            {s.current ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">This device</span>
            ) : (
              <button className="text-xs text-red-400 hover:underline">Revoke</button>
            )}
          </SettingRow>
        ))}
      </SettingCard>

      <SettingCard title="Trusted Devices">
        <SettingRow label="MacBook Pro" description="Added Jun 12, 2026">
          <Smartphone size={14} className="text-white/30" />
        </SettingRow>
      </SettingCard>

      <SettingCard title="Login History">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <History size={13} />
          <span>Last sign-in: Today at 9:14 AM from Riyadh, Saudi Arabia</span>
        </div>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── PRIVACY ───────────────────────────────
export function PrivacySection() {
  const [share, setShare] = useState(false)
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Privacy</h2>
      <SettingCard title="Data Sharing" description="Control how athlete data is used across Athlenix.">
        <SettingRow label="Share anonymized data for model improvement" description="Helps improve prediction accuracy across all clubs">
          <Toggle checked={share} onChange={setShare} />
        </SettingRow>
      </SettingCard>
      <SettingCard title="Your Data">
        <SettingRow label="Export all data" description="Download a full copy of your organization's data">
          <button className="flex items-center gap-1.5 text-xs text-athlonix-blue hover:underline">
            <Download size={13} /> Export
          </button>
        </SettingRow>
        <SettingRow label="Delete account" description="Permanently remove your account and all associated data">
          <button className="flex items-center gap-1.5 text-xs text-red-400 hover:underline">
            <Trash2 size={13} /> Delete
          </button>
        </SettingRow>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── APPEARANCE ───────────────────────────────
export function AppearanceSection() {
  const [theme, setTheme] = useState('dark')
  const [accent, setAccent] = useState('#2A6FD6')
  const [compact, setCompact] = useState(false)
  const accents = ['#2A6FD6', '#56A9BF', '#D4A855', '#D9824B', '#7C5CD9']

  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon, bg: '#0A0A0F', fg: '#1A1A24' },
    { id: 'light', label: 'Light', icon: Sun, bg: '#F4F1EA', fg: '#FFFFFF' },
    { id: 'system', label: 'System', icon: MonitorSmartphone, bg: 'linear-gradient(90deg, #0A0A0F 50%, #F4F1EA 50%)', fg: '#1A1A24' },
  ]

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Appearance</h2>
      <SettingCard title="Theme" description="Choose how Athlenix looks on this device.">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="rounded-xl overflow-hidden border transition-all duration-300"
                style={{ borderColor: isActive ? '#2A6FD6' : 'rgba(255,255,255,0.1)' }}
              >
                <div className="h-16" style={{ background: t.bg }} />
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03]">
                  <Icon size={12} className={isActive ? 'text-athlonix-blue' : 'text-white/40'} />
                  <span className={`text-xs ${isActive ? 'text-white' : 'text-white/40'}`}>{t.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </SettingCard>

      <SettingCard title="Accent Color">
        <div className="flex items-center gap-3">
          {accents.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className="w-8 h-8 rounded-full transition-transform duration-200"
              style={{ backgroundColor: c, transform: accent === c ? 'scale(1.15)' : 'scale(1)', boxShadow: accent === c ? `0 0 0 2px #0A0A0F, 0 0 0 4px ${c}` : 'none' }}
            />
          ))}
        </div>
      </SettingCard>

      <SettingCard>
        <SettingRow label="Compact mode" description="Reduce spacing for denser information display">
          <Toggle checked={compact} onChange={setCompact} />
        </SettingRow>
      </SettingCard>
    </div>
  )
}

// ─────────────────────────────── CONNECTED DEVICES ───────────────────────────────
export function DevicesSection() {
  const devices = [
    { name: 'WHOOP 4.0', athletes: 18, battery: 82, sync: '2 min ago', connected: true },
    { name: 'Garmin Forerunner', athletes: 9, battery: 64, sync: '11 min ago', connected: true },
    { name: 'Apple Watch Ultra', athletes: 4, battery: 91, sync: '1 min ago', connected: true },
    { name: 'Polar Vantage', athletes: 0, battery: null, sync: 'Never', connected: false },
  ]

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Connected Devices</h2>
      <p className="text-sm text-white/40 -mt-3 mb-2">Wearables feeding live biometric data into Athlenix.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((d) => (
          <SettingCard key={d.name} className="hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-athlonix-blue/10 border border-athlonix-blue/20 flex items-center justify-center">
                  <Watch size={16} className="text-athlonix-blue" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{d.name}</p>
                  <p className="text-[11px] text-white/40">{d.athletes} athletes connected</p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  d.connected ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'
                }`}
              >
                {d.connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            {d.connected ? (
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <Battery size={13} /> {d.battery}%
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw size={13} /> {d.sync}
                </span>
                <button className="text-red-400 hover:underline">Disconnect</button>
              </div>
            ) : (
              <button className="text-xs text-athlonix-blue hover:underline">Connect device</button>
            )}
          </SettingCard>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────── INTEGRATIONS ───────────────────────────────
export function IntegrationsSection() {
  const integrations = [
    { name: 'Slack', desc: 'Send risk alerts to a channel', icon: Slack, connected: true },
    { name: 'Zapier', desc: 'Automate workflows across tools', icon: Plug, connected: false },
    { name: 'Custom Webhook', desc: 'Push events to your own systems', icon: Webhook, connected: false },
  ]
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Integrations</h2>
      <div className="space-y-4">
        {integrations.map((i) => {
          const Icon = i.icon
          return (
            <SettingCard key={i.name}>
              <SettingRow label={i.name} description={i.desc}>
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-white/40" />
                  {i.connected ? (
                    <button className="text-xs text-red-400 hover:underline">Disconnect</button>
                  ) : (
                    <button className="text-xs text-athlonix-blue hover:underline">Connect</button>
                  )}
                </div>
              </SettingRow>
            </SettingCard>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────── BILLING ───────────────────────────────
export function BillingSection() {
  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-semibold text-white mb-1">Billing</h2>
      <SettingCard title="Current Plan">
        <SettingRow label="Club Enterprise" description="Billed annually · renews Mar 1, 2027">
          <span className="font-display text-sm font-semibold text-white">SAR 8,400/yr</span>
        </SettingRow>
      </SettingCard>
      <SettingCard title="Payment Method">
        <SettingRow label="Visa ending in 4242" description="Expires 09/28">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-white/40" />
            <button className="text-xs text-athlonix-blue hover:underline">Update</button>
          </div>
        </SettingRow>
      </SettingCard>
    </div>
  )
}
