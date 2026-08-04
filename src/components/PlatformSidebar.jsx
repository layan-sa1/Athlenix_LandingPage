import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart3, FileText, FileWarning, Home, ShieldAlert } from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: Home, to: "/insurance" },
  { label: "Policies", icon: FileText, to: "/insurance/policies" },
  { label: "Claims", icon: FileWarning, to: "/insurance/claims" },
  { label: "Risk Engine", icon: ShieldAlert, to: "/insurance/risk-engine" },
  { label: "Reports", icon: BarChart3, to: "/insurance/reports" },
];

export function PlatformSidebar() {
  const { pathname } = useLocation();
  const isActive = (to) =>
    to === "/insurance" ? pathname === "/insurance" : pathname.startsWith(to);

  return (
    <aside
      className="group fixed inset-y-0 left-0 z-40 hidden w-[84px] flex-col border-r border-[#1E2640] py-5 transition-[width] duration-300 ease-out hover:w-64 lg:flex select-none shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #0B0F1D 0%, #060811 100%)",
      }}
    >
      {/* Ambient background glow matched to dashboard panels */}
      <div 
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
      />

      {/* Logo Section */}
      <div className="relative flex h-10 items-center gap-3 px-[22px]">
        <img
          src="/brand/Athlonix-logo.png"
          alt=""
          aria-hidden="true"
          className="relative z-10 h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <span className="font-heading z-10 whitespace-nowrap text-lg font-bold tracking-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ATHLONIX
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex-1 space-y-1.5 px-3 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#1E2640]">
        {NAV.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          return (
            <Link
              key={label}
              to={to}
              className={`group/item relative flex w-full items-center gap-3.5 rounded-xl px-[13px] py-3 text-[14px] font-medium transition-all duration-200 ${
                active
                  ? "bg-[#2563EB]/15 text-white border border-[#2563EB]/40 shadow-sm"
                  : "text-slate-400 border border-transparent hover:bg-[#11162B] hover:border-[#1E2640] hover:text-white"
              }`}
            >
              {/* Active Indicator Bar */}
              {active && (
                <div className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#3B82F6]" />
              )}

              <Icon
                size={19}
                className={`shrink-0 transition-colors duration-200 ${
                  active
                    ? "text-[#3B82F6]"
                    : "text-slate-400 group-hover/item:text-slate-200"
                }`}
              />
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Back to Website */}
      <div className="relative px-3">
        <div className="mb-3 h-px bg-[#1E2640]" />
        <Link
          to="/"
          className="group/back flex items-center gap-3.5 rounded-xl px-[13px] py-3 text-[13px] font-medium text-slate-400 border border-transparent transition-all duration-200 hover:bg-[#11162B] hover:border-[#1E2640] hover:text-white"
        >
          <ArrowLeft
            size={18}
            className="shrink-0 text-slate-400 transition-transform duration-200 group-hover/back:-translate-x-1 group-hover/back:text-[#3B82F6]"
          />
          <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Back to Website
          </span>
        </Link>
      </div>
    </aside>
  );
}