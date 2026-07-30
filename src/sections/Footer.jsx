import React from 'react'

export default function Footer() {
  return (
    <footer className="relative bg-athlonix-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <img src="/brand/logo-mark.png" alt="Athlenix" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm mb-8">
              Turning athlete movement into executive decisions. 
              Built for the people who protect the world's most valuable players.
            </p>
            <a 
              href="#demo" 
              className="inline-flex px-6 py-2.5 text-sm font-medium bg-athlonix-blue text-white rounded-full hover:bg-athlonix-blue/90 transition-all duration-300"
            >
              Request Demo
            </a>
          </div>

          <div>
            <h4 className="text-xs font-medium text-white/50 tracking-widest uppercase mb-6">Platform</h4>
            <ul className="space-y-3">
              {['Athlete Data', 'Risk Engine', 'Medical Intelligence', 'Insurance Pricing', 'Executive Analytics'].map((item) => (
                <li key={item}>
                  <a href="#solution" className="text-sm text-white/30 hover:text-white/60 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-white/50 tracking-widest uppercase mb-6">Company</h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © 2024 Athlenix. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with precision for elite sports organizations worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
