import React, { useState } from 'react'
import { Linkedin, Twitter, Github, ArrowUpRight, BadgeCheck, Users, ShieldCheck, Wallet } from 'lucide-react'

const LINK_GROUPS = [
  {
    title: 'Platform',
    links: ['Athlete Data', 'Risk Engine', 'Medical Intelligence', 'Insurance Pricing', 'Executive Analytics'],
  },
  {
    title: 'Solutions',
    links: ['For Clubs & Academies', 'For Insurance Providers', 'For Federations'],
  },
  {
    title: 'Resources',
    links: ['Blog', 'Documentation', 'Case Studies'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact'],
  },
]

const LEGAL_LINKS = ['Privacy', 'Terms', 'Cookies', 'Security']

const TRUST_STATS = [
  { value: '98.7%', label: 'AI Accuracy', icon: BadgeCheck },
  { value: '20M+', label: 'Athletes Analyzed', icon: Users },
  { value: '35%', label: 'Risk Reduction', icon: ShieldCheck },
  { value: '2.4M+', label: 'Claims Prevented', icon: Wallet },
]

const SOCIALS = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'X (Twitter)' },
  { icon: Github, href: '#', label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#F2F6FA] dark:bg-athlonix-dark overflow-hidden">
      {/* soft blue-tinted transition right before the footer starts, so it doesn't just cut
          from the previous section — a glass-like hand-off instead of a hard edge */}
      <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-athlonix-blue/[0.03] dark:to-athlonix-blue/[0.06] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-athlonix-blue/[0.05] dark:bg-athlonix-blue/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,23,42,0.08)] dark:via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* CTA — a self-contained card with its own weight, not a text line with a button
            floating next to it. This is what actually earns "focus" on a busy last section. */}
        <div className="pt-16 lg:pt-20">
          <div className="rounded-3xl border border-[rgba(15,23,42,0.08)] dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] dark:shadow-none px-8 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-xs font-medium text-athlonix-blueText dark:text-athlonix-blue tracking-widest uppercase mb-3">
                Ready when you are
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-[#0F172A] dark:text-white max-w-lg mb-2">
                Ready to build a healthier team?
              </h3>
              <p className="text-sm text-[#475569] dark:text-white/40 max-w-md">
                Schedule a live demo and see Athlenix work on your own data.
              </p>
            </div>
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 shrink-0 px-7 py-3.5 text-sm font-semibold bg-athlonix-blue text-white rounded-full hover:bg-athlonix-blue/90 transition-all duration-300 shadow-[0_20px_50px_-15px_rgba(0,181,255,0.5)]"
            >
              Request Demo
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* proof, as small cards with an icon each — not a flat row of numbers that are all
            the same blue and blur together */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_STATS.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-[rgba(15,23,42,0.06)] dark:border-white/5 bg-white/60 dark:bg-white/[0.02] px-5 py-5"
              >
                <Icon size={16} className="text-athlonix-blueText dark:text-athlonix-blue mb-3" />
                <p className="font-display text-2xl font-bold text-[#0F172A] dark:text-white tabular-nums">{s.value}</p>
                <p className="text-xs text-[#475569] dark:text-white/40 mt-1">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* main grid — brand story on the left (with socials, not a newsletter form; B2B
            audiences follow companies, they don't sign up for footer newsletters), link groups
            on the right */}
        <div className="py-14 lg:py-16 grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-8 border-t border-[rgba(15,23,42,0.08)] dark:border-white/5">
          <div className="col-span-2 lg:col-span-1 lg:pr-8">
            <p className="font-display text-3xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight">ATHLENIX.</p>
            <p className="text-sm text-[#475569] dark:text-white/40 leading-relaxed mb-6 max-w-xs">
              Turning athlete movement into executive decisions.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-[rgba(15,23,42,0.1)] dark:border-white/10 flex items-center justify-center text-[#475569] dark:text-white/40 hover:text-athlonix-blueText dark:hover:text-athlonix-blue hover:border-athlonix-blueText/40 dark:hover:border-athlonix-blue/40 transition-colors duration-300"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-medium text-[#475569] dark:text-white/50 tracking-widest uppercase mb-6">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm text-[#475569] dark:text-white/40 hover:text-athlonix-blueText dark:hover:text-white transition-colors duration-300"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="py-6 border-t border-[rgba(15,23,42,0.08)] dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8] dark:text-white/25">© 2026 Athlenix. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((l) => (
              <a key={l} href="#" className="text-xs text-[#94A3B8] dark:text-white/25 hover:text-athlonix-blueText dark:hover:text-white transition-colors duration-300">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
