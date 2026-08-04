import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  Brain,
  Calendar,
  FileClock,
  Layers,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { EASE, RippleButton, useCountUp } from "../../components/ui-motion";
import { POLICIES, POLICY_STATUS_STYLE, SPORT_COLORS } from "../../components/policyData";

/* ══════════════════════ UNIFIED COLOR SYSTEM ══════════════════════ */
const BLUE = "#3B82F6";       // Primary Accent (Headers, icons)
const CYAN = "#22D3EE";       // Intelligence Accent
const ACTION_BLUE = "#2563EB"; // Primary Buttons (Fill)

/* ══════════════════════ DATA ══════════════════════ */

const KPIS = [
  { label: "Active Policies", value: 1237, decimals: 0, delta: "+3.2%", up: true, icon: ShieldCheck, spark: [30, 34, 33, 38, 40, 44, 48, 52] },
  { label: "Pending Requests", value: 46, decimals: 0, delta: "+8", up: true, icon: FileClock, spark: [30, 33, 35, 38, 40, 43, 45, 46] },
  { label: "Policies Pending Renewal", value: 34, decimals: 0, delta: "+6", up: false, icon: RefreshCw, spark: [20, 22, 25, 27, 28, 30, 32, 34] },
  { label: "Coverage Rate", value: 92.4, suffix: "%", decimals: 1, delta: "+1.2%", up: true, icon: Layers, spark: [88, 89, 90, 90, 91, 91, 92, 92.4] },
];

const APPROVAL = [
  { label: "Approved", value: 74, color: "#10B981" }, // Unified Success Green
  { label: "Rejected", value: 9, color: "#EF4444" },  // Unified Danger Red
  { label: "Pending", value: 17, color: "#EAB308" },  // Unified Warning Yellow
];

const COVERAGE_BY_SPORT = [
  { label: "Football", value: 612, color: SPORT_COLORS.Football },
  { label: "Basketball", value: 268, color: SPORT_COLORS.Basketball },
  { label: "Volleyball", value: 174, color: SPORT_COLORS.Volleyball },
  { label: "Swimming", value: 118, color: SPORT_COLORS.Swimming },
  { label: "Tennis", value: 65, color: SPORT_COLORS.Tennis },
];

const REQUESTS = [
  { club: "Al Hilal", player: "Salem Al-Dawsari", sport: "Football", status: "Under Review", date: "Aug 16, 2026", initials: "SD" },
  { club: "Al Nassr", player: "Sultan Al-Ghannam", sport: "Football", status: "Approved", date: "Aug 15, 2026", initials: "SG" },
  { club: "Al Ahli", player: "Ziyad Al-Sahafi", sport: "Basketball", status: "Pending", date: "Aug 14, 2026", initials: "ZS" },
];

const ACTIVITY = {
  approved: [42, 48, 45, 52, 58, 63, 68, 74],
  rejected: [6, 5, 8, 7, 9, 6, 8, 7],
  pending: [18, 22, 20, 25, 23, 28, 26, 30],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
};

const COVERAGE_BREAKDOWN = [
  { label: "Basic", value: 210, color: "#22D3EE" },
  { label: "Standard", value: 486, color: "#3B82F6" },
  { label: "Elite", value: "#8B5CF6" },
  { label: "Premium Plus", value: 229, color: "#EAB308" },
];

const RISK_LEVELS = [
  { label: "Low", value: 58, color: "#10B981" },
  { label: "Moderate", value: 30, color: "#EAB308" },
  { label: "High", value: 12, color: "#EF4444" },
];

const AI_RECS = [
  "3 policies flagged for coverage upgrade",
  "Al Nassr renewal recommended within 30 days",
  "Volleyball surgery-coverage gap detected",
];

const REQ_STATUS_STYLE = {
  Approved: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
  "Under Review": "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
  Pending: "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
};

/* ══════════════════════ SHELLS ══════════════════════ */

function Card({
  title, subtitle, right, children, className = "", delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ y: -3 }}
      // Unified Border, background, boxShadow
      className={`group/card relative flex flex-col overflow-hidden rounded-3xl border border-[#1E2640] p-6 transition-colors duration-300 hover:border-[#2E395C] ${className}`}
      style={{ background: "#0B0F1D", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      {/* Unified inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ boxShadow: "inset 0 0 30px -10px rgba(59,130,246,0.15)" }} />
      {(title || right) && (
        <div className="relative mb-5 flex items-start justify-between">
          <div>
            {title && <p className="font-heading text-[15px] font-bold tracking-tight text-white">{title}</p>}
            {/* Unified Secondary Text color */}
            {subtitle && <p className="mt-0.5 text-[12px] text-slate-400">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="relative flex-1">{children}</div>
    </motion.section>
  );
}

function Pill({ children }) {
  return (
    // Unified Inner background, border, text
    <span className="flex items-center gap-1.5 rounded-full border border-[#1E2640] bg-[#11162B] px-3 py-1.5 text-[12px] text-slate-400">
      {children}
    </span>
  );
}

/* ══════════════════════ ROW 1 — KPIs ══════════════════════ */

function Sparkline({ data, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const W = 120, H = 30;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - ((v - min) / range) * H).toFixed(1)}`).join(" ");
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-8 w-full" fill="none" preserveAspectRatio="none">
      <motion.polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function KpiCard({ k, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const n = useCountUp(k.value, inView, k.decimals);
  const Icon = k.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
      whileHover={{ y: -4 }}
      // Unified Card styling
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#1E2640] p-6 transition-colors duration-300 hover:border-[#2E395C]"
      style={{ background: "#0B0F1D", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      {/* Unified radial glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(80% 60% at 50% 120%, rgba(59,130,246,0.12), transparent 70%)" }} />
      <div className="relative flex items-center justify-between">
        {/* Unified Icon background/border */}
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#1E2640] bg-[#11162B]">
          <Icon size={16} className="text-[#3B82F6]" />
        </div>
        <span className={`flex items-center gap-1 text-[12px] font-medium ${k.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
          <TrendingUp size={12} className={k.up ? "" : "rotate-180"} />{k.delta}
        </span>
      </div>
      <p className="relative mt-4 font-heading text-[28px] font-bold leading-none tracking-tight text-white">{n}{k.suffix ?? ""}</p>
      {/* Unified Secondary Text color */}
      <p className="relative mt-1.5 text-[13px] text-slate-400">{k.label}</p>
      <div className="relative mt-3 opacity-70"><Sparkline data={k.spark} color={k.up ? CYAN : "#EF4444"} /></div>
    </motion.div>
  );
}

/* ══════════════════════ ROW 2 LEFT — APPROVAL SEMI-GAUGE ══════════════════════ */

function ApprovalGauge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const approved = APPROVAL[0].value;
  const n = useCountUp(approved, inView, 0);
  const R = 80, CX = 100, CY = 100;
  const semi = Math.PI * R;
  const frac = approved / 100;
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center">
      <div className="relative h-[120px] w-[200px]">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <defs>
            {/* Unified Blue to Cyan gradient */}
            <linearGradient id="gaugeUnified" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor={CYAN} />
            </linearGradient>
          </defs>
          {/* Unified border stroke color */}
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#1E2640" strokeWidth="12" strokeLinecap="round" />
          <motion.path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="url(#gaugeUnified)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={semi} initial={{ strokeDashoffset: semi }} animate={inView ? { strokeDashoffset: semi * (1 - frac) } : {}}
            transition={{ duration: 1.1, ease: EASE }} style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }} />
        </svg>
        <div className="absolute inset-x-0 bottom-1 text-center">
          <p className="font-heading text-[30px] font-bold leading-none text-white">{n}%</p>
          {/* Unified Secondary Text color */}
          <p className="mt-1 text-[11px] text-slate-400">Approved Policies</p>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-3 gap-2">
        {APPROVAL.map((a) => (
          // Unified Cell styling
          <div key={a.label} className="rounded-xl border border-[#1E2640] bg-[#11162B] px-2 py-2.5 text-center">
            <p className="font-heading text-[16px] font-bold text-white">{a.value}%</p>
            {/* Unified Secondary Text color */}
            <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />{a.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ ROW 2 RIGHT — RECENT POLICIES ══════════════════════ */

function RecentPolicies() {
  const rows = POLICIES.slice(0, 5);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-left">
        <thead>
          {/* Unified Secondary Text color */}
          <tr className="text-[11px] uppercase tracking-[0.1em] text-slate-400">
            {["Policy ID", "Club", "Coverage Type", "Status"].map((h) => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <motion.tr key={p.id} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              // Unified Border, row hover color
              className="border-t border-[#1E2640] text-[13px] transition-colors hover:bg-white/[0.03]">
              <td className="whitespace-nowrap py-3 pr-4 font-medium text-white">{p.id}</td>
              <td className="whitespace-nowrap py-3 pr-4 text-white/70">{p.club}</td>
              <td className="whitespace-nowrap py-3 pr-4 text-white/60">{p.coverage}</td>
              <td className="whitespace-nowrap py-3">
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${POLICY_STATUS_STYLE[p.status]}`}>{p.status}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════ ROW 3 LEFT — COVERAGE BY SPORT ══════════════════════ */

function CoverageBySport() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const max = Math.max(...COVERAGE_BY_SPORT.map((s) => s.value));
  return (
    <div ref={ref} className="space-y-4">
      {COVERAGE_BY_SPORT.map((s, i) => (
        <div key={s.label}>
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 text-white/65"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}</span>
            <span className="font-medium text-white/80">{s.value}</span>
          </div>
          {/* Unified inner background color */}
          <div className="h-2.5 overflow-hidden rounded-full bg-[#11162B]">
            <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(s.value / max) * 100}%` } : {}}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }} className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${s.color}99, ${s.color})`, boxShadow: `0 0 12px -2px ${s.color}66` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════ ROW 3 RIGHT — RECENT REQUESTS ══════════════════════ */

function RecentRequests() {
  return (
    <div className="space-y-3">
      {REQUESTS.map((r, i) => (
        <motion.div key={r.player} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }} whileHover={{ x: 3 }}
          // Unified Cell styling, hover border
          className="flex items-center gap-3 rounded-2xl border border-[#1E2640] bg-[#0B0F1D] p-3 transition-colors hover:border-[#2E395C]">
          {/* Unified Blue to Cyan gradient */}
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6]/25 to-[#22D3EE]/10 text-[13px] font-bold text-white">{r.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{r.club}</p>
            {/* Unified Secondary Text color */}
            <p className="truncate text-[12px] text-slate-400">{r.player} · {r.sport}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${REQ_STATUS_STYLE[r.status]}`}>{r.status}</span>
            {/* Unified Secondary Text color */}
            <span className="text-[10px] text-slate-500">{r.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════ ROW 4 LEFT — POLICY ACTIVITY LINE ══════════════════════ */

function PolicyActivity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hx, setHx] = useState(null);
  const W = 560, H = 220;
  const series = [
    { key: "approved", data: ACTIVITY.approved, color: "#10B981", label: "Approved" }, // Unified Success Green
    { key: "pending", data: ACTIVITY.pending, color: "#3B82F6", label: "Pending" },   // Unified Accent Blue
    { key: "rejected", data: ACTIVITY.rejected, color: "#EF4444", label: "Rejected" }, // Unified Danger Red
  ];
  const n = ACTIVITY.months.length;
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.2;
  const stepW = W / (n - 1);
  const px = (i) => i * stepW;
  const py = (v) => H - (v / max) * H;
  const smooth = (arr) => {
    const pts = arr.map((v, i) => [px(i), py(v)]);
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 0.18;
      d += ` C ${(p1[0] + (p2[0] - p0[0]) * t).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * t).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) * t).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * t).toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  };
  const area = (arr) => `${smooth(arr)} L ${W} ${H} L 0 ${H} Z`;
  return (
    <div ref={ref}>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[240px] w-full" fill="none" preserveAspectRatio="none" onMouseLeave={() => setHx(null)}>
          <defs>
            {/* CLIPPATH FOR DRAWING ANIMATION */}
            <clipPath id="drawClipPolicyActivity">
              <motion.rect x="0" y="0" height={H} initial={{ width: 0 }} animate={inView ? { width: W } : {}} transition={{ duration: 1.4, ease: EASE }} />
            </clipPath>

            {series.map((s) => (
              <linearGradient key={s.key} id={`paUnified-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.25" /><stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
            <filter id="paUnifiedGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {/* Unified Border color */}
          {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#1E2640" strokeWidth="1" />)}
          {series.map((s, si) => (
            <motion.path key={`a-${s.key}`} d={area(s.data)} fill={`url(#paUnified-${s.key})`} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.6 + si * 0.15 }} />
          ))}
          {/* DRAWN PATH VIA CLIPPATH AND UNIFIED GLOW */}
          {series.map((s) => (
            <path key={s.key} d={smooth(s.data)} stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#paUnifiedGlow)" clipPath="url(#drawClipPolicyActivity)" />
          ))}
          {ACTIVITY.months.map((_, i) => (
            <g key={i}>
              <rect x={px(i) - stepW / 2} y="0" width={stepW} height={H} fill="transparent" onMouseEnter={() => setHx(i)} style={{ cursor: "pointer" }} />
              {/* Unified hover line color */}
              {hx === i && <line x1={px(i)} x2={px(i)} y1="0" y2={H} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />}
              {/* Unified hover circle border/fill */}
              {hx === i && series.map((s) => <circle key={s.key} cx={px(i)} cy={py(s.data[i])} r="3.5" fill="#0B0F1D" stroke={s.color} strokeWidth="2.5" />)}
            </g>
          ))}
        </svg>
        {hx !== null && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            // Unified Tooltip styling
            className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-[#1E2640] px-3 py-2 text-[11px] shadow-2xl backdrop-blur-md"
            style={{ left: `${(hx / (n - 1)) * 100}%`, top: 4, background: "#11162B" }}>
            {/* Unified secondary text color */}
            <p className="mb-1 font-medium text-slate-300">{ACTIVITY.months[hx]}</p>
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3">
                {/* Unified secondary text color */}
                <span className="flex items-center gap-1.5 text-slate-400"><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
                <span className="font-medium text-white">{s.data[hx]}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-5">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="h-2 w-4 rounded-full" style={{ background: s.color }} />
            {/* Unified Secondary Text color */}
            <span className="text-[12px] text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>
      {/* Unified Secondary Text color */}
      <div className="mt-2 flex justify-between px-1 text-[10px] text-slate-500">{ACTIVITY.months.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
  );
}

/* ══════════════════════ ROW 4 RIGHT — COVERAGE BREAKDOWN DONUT ══════════════════════ */

function CoverageBreakdown() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hover, setHover] = useState(null);
  const total = COVERAGE_BREAKDOWN.reduce((a, b) => a + b.value, 0);
  const R = 58, C = 2 * Math.PI * R, GAP = 7;
  let offset = 0;
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center">
      <div className="relative h-[170px] w-[170px]">
        {/* Unified radial glow */}
        <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl" style={{ background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.12), transparent 65%)" }} />
        <svg viewBox="0 0 150 150" className="relative h-full w-full -rotate-90" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.45))" }}>
          <defs>
            {COVERAGE_BREAKDOWN.map((s, i) => (
              <linearGradient key={s.label} id={`cbUnifiedDonut-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.6" /><stop offset="100%" stopColor={s.color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>
          {/* Unified Border color */}
          <circle cx="75" cy="75" r={R} fill="none" stroke="#1E2640" strokeWidth="15" />
          {COVERAGE_BREAKDOWN.map((s, i) => {
            const len = (s.value / total) * C, arc = Math.max(len - GAP, 3), active = hover === i;
            const el = <motion.circle key={s.label} cx="75" cy="75" r={R} fill="none" stroke={`url(#cbUnifiedDonut-${i})`}
              strokeWidth={active ? 18 : 14} strokeLinecap="round" strokeDashoffset={-offset}
              initial={{ strokeDasharray: `0 ${C}` }} animate={inView ? { strokeDasharray: `${arc} ${C - arc}` } : {}}
              transition={{ duration: 1, delay: i * 0.12, ease: EASE }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", transition: "stroke-width .25s" }} />;
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-heading text-[24px] font-bold leading-none text-white">{hover !== null ? COVERAGE_BREAKDOWN[hover].value : total}</p>
            {/* Unified Secondary Text color */}
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">{hover !== null ? COVERAGE_BREAKDOWN[hover].label : "policies"}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {COVERAGE_BREAKDOWN.map((s, i) => (
          <button key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            // Unified hover background
            className={`flex items-center justify-between rounded-lg px-1.5 py-1 transition-colors ${hover === i ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"}`}>
            <span className="flex items-center gap-2 text-[12px] text-white/70"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}</span>
            <span className="text-[12px] font-medium text-white">{s.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ BOTTOM — AI PORTFOLIO OVERVIEW ══════════════════════ */

function MiniBars({ data, pct }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="space-y-2.5">
      {data.map((d, i) => (
        <div key={d.label}>
          {/* Unified Secondary/Secondary Text color */}
          <div className="mb-1 flex items-center justify-between text-[11px]"><span className="text-slate-400">{d.label}</span><span className="font-medium text-slate-300">{d.value}{pct ? "%" : ""}</span></div>
          {/* Unified inner background color */}
          <div className="h-1.5 overflow-hidden rounded-full bg-[#11162B]">
            <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(d.value / max) * 100}%` } : {}} transition={{ duration: 0.9, delay: i * 0.06, ease: EASE }} className="h-full rounded-full" style={{ background: d.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PortfolioOverview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const util = useCountUp(87, inView, 0);
  const sportBars = COVERAGE_BY_SPORT.slice(0, 4).map((s) => ({ label: s.label, value: s.value, color: s.color }));
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}
      // Unified Card styling, dynamic AI highlight border
      className="relative overflow-hidden rounded-3xl border border-[#3B82F6]/25 p-6 lg:p-8" style={{ background: "#0B0F1D", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 24px 60px -40px rgba(0,0,0,0.6)" }}>
      {/* Unified radial glow */}
      <motion.div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(59,130,246,0.15)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative mb-6 flex items-center gap-3">
        {/* Unified Icon background/border */}
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#3B82F6]/30 bg-[#11162B]">
          <Brain size={19} className="text-[#3B82F6]" /><span className="absolute inset-0 rounded-2xl border border-[#3B82F6]/40 motion-safe:animate-ping" />
        </div>
        <div>
          <p className="font-heading text-[16px] font-bold tracking-tight text-white">AI Insurance Portfolio Overview</p>
          {/* Unified Secondary Text color */}
          <p className="text-[12px] text-slate-400">Live portfolio intelligence · model v4.2</p>
        </div>
      </div>

      <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {/* Unified Cell styling */}
        <div className="rounded-2xl border border-[#1E2640] bg-[#0B0F1D] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-slate-400">Policies by Sport</p>
          <MiniBars data={sportBars} />
        </div>
        {/* Unified Cell styling */}
        <div className="rounded-2xl border border-[#1E2640] bg-[#0B0F1D] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-slate-400">Policies by Risk Level</p>
          <MiniBars data={RISK_LEVELS} pct />
        </div>
        {/* Unified Cell styling */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2640] bg-[#0B0F1D] p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Coverage Utilization</p>
          <div>
            <p className="font-heading text-[34px] font-bold leading-none text-white">{util}%</p>
            {/* Unified inner background color */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#11162B]">
              <motion.div initial={{ width: 0 }} animate={inView ? { width: "87%" } : {}} transition={{ duration: 1, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]" />
            </div>
            {/* Unified Secondary Text color */}
            <p className="mt-2 text-[11px] text-slate-400">of total portfolio capacity in use</p>
          </div>
        </div>
        {/* Unified Cell styling */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#1E2640] bg-[#0B0F1D] p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Pending Renewals</p>
          <div>
            <p className="font-heading text-[34px] font-bold leading-none text-white">34</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-[#EAB308]"><Calendar size={12} /> 6 due within 14 days</p>
          </div>
          {/* Unified Action Button styling */}
          <RippleButton className="mt-3 justify-center rounded-full bg-[#2563EB] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#1D4ED8]">Review renewals</RippleButton>
        </div>
        {/* Unified AI Highlight Cell styling */}
        <div className="rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.06] p-4 md:col-span-2 xl:col-span-1">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#3B82F6]"><Sparkles size={12} /> Recent AI Recommendations</p>
          <div className="space-y-2.5">
            {AI_RECS.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
                <span className="text-[12.5px] leading-snug text-white/80">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function Dashboard() {
  return (
    // Unified Page background color
    <main className="min-h-screen bg-[#060811] mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-heading text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[38px]">Policies</h1>
          {/* Unified Secondary Text color */}
          <p className="mt-2 max-w-[600px] text-[15px] leading-relaxed text-slate-400">
            Manage insurance policies, review AI-generated coverage recommendations and monitor policy status across all insured clubs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Unified Secondary Text color for standard elements */}
          <Pill><Calendar size={14} className="text-slate-400" /> 2025 – 2026</Pill>
          <Pill><Activity size={14} className="text-[#3B82F6]" /> All policies</Pill>
        </div>
      </motion.div>

      {/* ROW 1 — KPIs */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k, i) => <KpiCard key={k.label} k={k} i={i} />)}
      </div>

      {/* ROW 2 */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Policy Approval Rate" subtitle="Approved · Rejected · Pending"><ApprovalGauge /></Card>
        <Card title="Recent Policies" subtitle="Latest across all clubs" className="lg:col-span-2" delay={0.08}
          right={<Pill><Calendar size={13} /> 2025 – 2026</Pill>}><RecentPolicies /></Card>
      </div>

      {/* ROW 3 */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Coverage Distribution" subtitle="Policies by sport" className="lg:col-span-2"><CoverageBySport /></Card>
        <Card title="Recent Insurance Requests" subtitle="Latest club submissions" delay={0.08}><RecentRequests /></Card>
      </div>

      {/* ROW 4 */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Policy Activity" subtitle="Monthly approved · pending · rejected" className="lg:col-span-2"><PolicyActivity /></Card>
        <Card title="Coverage Breakdown" subtitle="By coverage tier" delay={0.08}><CoverageBreakdown /></Card>
      </div>

      {/* BOTTOM */}
      <div className="mt-5"><PortfolioOverview /></div>

      {/* Unified Secondary Text color */}
      <p className="mt-8 text-[12px] text-slate-500">Figures are illustrative sample data for the ATHLONIX platform preview.</p>
    </main>
  );
}