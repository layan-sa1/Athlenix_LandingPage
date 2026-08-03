import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart3, Building2, FileText, FileWarning, Home, ShieldAlert, Wallet } from "lucide-react";

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
    <aside className="group fixed inset-y-0 left-0 z-40 hidden w-[84px] flex-col border-r border-white/[0.06] bg-[#070b11] py-5 transition-[width] duration-300 hover:w-64 lg:flex">
      <div className="flex h-10 items-center gap-3 px-[22px]">
        <img src="/brand/Athlonix-logo.png" alt="" aria-hidden="true" className="h-10 w-10 shrink-0 object-contain" />
        <span className="font-heading whitespace-nowrap text-lg font-bold tracking-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ATHLENIX
        </span>
      </div>

      <nav className="mt-8 flex-1 space-y-1.5 px-3">
        {NAV.map(({ label, icon: Icon, to }) => {
          const active = isActive(to);
          return (
            <Link
              key={label}
              to={to}
              className={`flex w-full items-center gap-3.5 rounded-xl px-[13px] py-3 text-[14px] transition-colors ${
                active ? "bg-[#00B5FF]/12 text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon size={19} className={`shrink-0 ${active ? "text-[#22D3EE]" : ""}`} />
              <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3">
        <div className="mb-2 h-px bg-white/[0.06]" />
        <Link to="/" className="flex items-center gap-3.5 rounded-xl px-[13px] py-3 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white">
          <ArrowLeft size={18} className="shrink-0" />
          <span className="whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">Back to Website</span>
        </Link>
      </div>
    </aside>
  );
}