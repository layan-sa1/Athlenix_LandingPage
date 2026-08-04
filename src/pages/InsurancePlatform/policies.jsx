import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Activity, Brain, Calendar, Check, CheckCircle2, ChevronRight, Download,
  FileText, FileClock, HeartPulse, Info, Layers, MessageSquare, Paperclip,
  RefreshCw, Send, ShieldAlert, ShieldCheck, Sparkles, TrendingUp, User, X, XCircle,
} from "lucide-react";

/* ============================================================
   ATHLONIX Insurance — Policies (self-contained plain JSX)
   Drop into src/pages/Policies.jsx
   Requires: framer-motion, lucide-react, Tailwind
   ============================================================ */

const EASE = [0.22, 1, 0.36, 1];

/* ---------- inlined motion helpers (were @/components/ui-motion) ---------- */
function useCountUp(to, run, decimals = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 1200);
      setN(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return n.toFixed(decimals);
}

function RippleButton({ children, className = "", onClick, style }) {
  const [ripples, setRipples] = useState([]);
  const idRef = useRef(0);
  const handle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = idRef.current++;
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), 650);
    onClick && onClick();
  };
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handle} style={style}
      className={`relative flex items-center gap-2 overflow-hidden ${className}`}>
      {ripples.map((r) => (
        <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute h-20 w-20 rounded-full bg-white/40" style={{ left: r.x - 40, top: r.y - 40 }} />
      ))}
      <span className="relative z-10 inline-flex items-center justify-center gap-2 w-full">{children}</span>
    </motion.button>
  );
}

/* ---------- inlined data (were @/components/policyData) ---------- */
const POLICIES = [
  { id: "POL-4021", club: "Al Hilal", sport: "Football", coverage: "Full + Recovery", status: "Active" },
  { id: "POL-4022", club: "Al Nassr", sport: "Football", coverage: "Full Season", status: "Pending Renewal" },
  { id: "POL-4023", club: "Al Ittihad", sport: "Football", coverage: "Full Season", status: "Active" },
  { id: "POL-4024", club: "Al Ahli", sport: "Basketball", coverage: "Full + Recovery", status: "Active" },
  { id: "POL-4025", club: "Al Shabab", sport: "Football", coverage: "Injury Only", status: "Suspended" },
  { id: "POL-4026", club: "Al Hilal", sport: "Volleyball", coverage: "Partial", status: "Active" },
  { id: "POL-4027", club: "Al Nassr", sport: "Tennis", coverage: "Full Season", status: "Pending Renewal" },
  { id: "POL-4028", club: "Al Ittihad", sport: "Swimming", coverage: "Partial", status: "Expired" },
];

const POLICY_STATUS_STYLE = {
  Active: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  "Pending Renewal": "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  Expired: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
  Suspended: "text-white/60 bg-white/[0.06] border-white/[0.15]",
};

const SPORT_COLORS = {
  Football: "#00B5FF", Basketball: "#22D3EE", Volleyball: "#8B5CF6", Tennis: "#EAB308", Swimming: "#22C55E",
};

/* ══════════════════════ DATA ══════════════════════ */

const KPIS = [
  { label: "Active Policies", value: 1237, decimals: 0, delta: "+3.2%", up: true, icon: ShieldCheck, spark: [30, 34, 33, 38, 40, 44, 48, 52] },
  { label: "Pending Requests", value: 46, decimals: 0, delta: "+8", up: true, icon: FileClock, spark: [30, 33, 35, 38, 40, 43, 45, 46] },
  { label: "Policies Pending Renewal", value: 34, decimals: 0, delta: "+6", up: false, icon: RefreshCw, spark: [20, 22, 25, 27, 28, 30, 32, 34] },
  { label: "Coverage Rate", value: 92.4, suffix: "%", decimals: 1, delta: "+1.2%", up: true, icon: Layers, spark: [88, 89, 90, 90, 91, 91, 92, 92.4] },
];

const APPROVAL = [
  { label: "Approved", value: 74, color: "#22C55E" },
  { label: "Rejected", value: 9, color: "#EF4444" },
  { label: "Pending", value: 17, color: "#EAB308" },
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
  { label: "Standard", value: 486, color: "#00B5FF" },
  { label: "Elite", value: 312, color: "#8B5CF6" },
  { label: "Premium Plus", value: 229, color: "#EAB308" },
];

const RISK_LEVELS = [
  { label: "Low", value: 58, color: "#22C55E" },
  { label: "Moderate", value: 30, color: "#EAB308" },
  { label: "High", value: 12, color: "#EF4444" },
];

const AI_RECS = [
  "3 policies flagged for coverage upgrade",
  "Al Nassr renewal recommended within 30 days",
  "Volleyball surgery-coverage gap detected",
];

const REQ_STATUS_STYLE = {
  Approved: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  "Under Review": "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
  Pending: "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
};

/* ── Pending Requests workflow data ── */

const REQUEST_STATUS_STYLE = {
  "Pending Review": "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  "Awaiting Documents": "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20",
  "Ready for Approval": "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  "Under Review": "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
};

const AI_STATUS_STYLE = {
  "Risk Analyzed": "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  Processing: "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
  "Needs Data": "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20",
};

const RISK_STYLE = {
  Low: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  Moderate: "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  High: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
};

const PENDING_REQUESTS = [
  {
    id: "REQ-5012", club: "Al Hilal", athlete: "Salem Al-Dawsari", initials: "SD", sport: "Football",
    date: "Aug 16, 2026", aiStatus: "Risk Analyzed", status: "Ready for Approval",
    position: "Left Winger", age: 34, clubContact: "Faisal Al-Otaibi", clubEmail: "insurance@alhilal.sa",
    medical: "Two prior hamstring strains (2023, 2024), both fully recovered. Clean cardiac screening. No surgical history.",
    reports: ["Medical clearance.pdf", "MRI left thigh.pdf", "Cardiac screening.pdf"],
    aiRisk: "Elevated soft-tissue risk due to recurrent hamstring history and high sprint load. Overall injury probability 22% this season.",
    riskLevel: "Moderate",
    aiCoverage: "Standard plan with a soft-tissue rider recommended for the first 90 days.",
    coverageTier: "Premium Plus", coverageLimit: "SAR 4,200,000",
    documents: ["Request form.pdf", "Contract summary.pdf", "Medical clearance.pdf"],
    discussion: [
      { from: "Club", text: "Please include ACL injury coverage in the policy.", time: "09:14" },
      { from: "Insurance", text: "An additional MRI report is required before we proceed.", time: "10:02" },
      { from: "Club", text: "MRI uploaded successfully.", time: "11:20" },
      { from: "Insurance", text: "Review in progress.", time: "11:45" },
    ],
  },
  {
    id: "REQ-5011", club: "Al Nassr", athlete: "Sultan Al-Ghannam", initials: "SG", sport: "Football",
    date: "Aug 15, 2026", aiStatus: "Processing", status: "Under Review",
    position: "Right Back", age: 31, clubContact: "Nawaf Al-Harbi", clubEmail: "insurance@alnassr.sa",
    medical: "One ankle sprain (2025), fully recovered. No chronic conditions. Routine monitoring only.",
    reports: ["Medical clearance.pdf", "Ankle X-ray.pdf"],
    aiRisk: "Low-to-moderate risk. Ankle history stable. Injury probability 14% this season.",
    riskLevel: "Low",
    aiCoverage: "Standard plan recommended. No riders required at this stage.",
    coverageTier: "Standard", coverageLimit: "SAR 2,800,000",
    documents: ["Request form.pdf", "Contract summary.pdf"],
    discussion: [
      { from: "Club", text: "Requesting standard seasonal coverage for our right back.", time: "08:30" },
      { from: "Insurance", text: "Received. Running AI risk assessment now.", time: "09:05" },
    ],
  },
  {
    id: "REQ-5009", club: "Al Ittihad", athlete: "Yasser Al-Shahrani", initials: "YS", sport: "Football",
    date: "Aug 14, 2026", aiStatus: "Needs Data", status: "Awaiting Documents",
    position: "Left Back", age: 33, clubContact: "Turki Al-Shammari", clubEmail: "insurance@alittihad.sa",
    medical: "Major facial/jaw injury (2022) with full recovery. Requires updated neurological clearance.",
    reports: ["Old clearance 2024.pdf"],
    aiRisk: "Assessment incomplete — awaiting current neurological clearance to finalize risk score.",
    riskLevel: "Moderate",
    aiCoverage: "Pending — recommendation will generate once documents are complete.",
    coverageTier: "Pending", coverageLimit: "—",
    documents: ["Request form.pdf"],
    discussion: [
      { from: "Club", text: "Submitting seasonal coverage request for Yasser.", time: "12:10" },
      { from: "Insurance", text: "We need an updated neurological clearance (2026) before assessment.", time: "13:22" },
    ],
  },
  {
    id: "REQ-5007", club: "Al Ahli", athlete: "Ali Al-Bulayhi", initials: "AB", sport: "Football",
    date: "Aug 12, 2026", aiStatus: "Risk Analyzed", status: "Pending Review",
    position: "Centre Back", age: 36, clubContact: "Majed Al-Ghamdi", clubEmail: "insurance@alahli.sa",
    medical: "No significant injury history. Age-related monitoring recommended for joint load.",
    reports: ["Medical clearance.pdf", "Full physical.pdf"],
    aiRisk: "Moderate risk driven primarily by age and cumulative match load. Injury probability 19%.",
    riskLevel: "Moderate",
    aiCoverage: "Elite plan recommended given contract value and role exposure.",
    coverageTier: "Elite", coverageLimit: "SAR 5,000,000",
    documents: ["Request form.pdf", "Contract summary.pdf", "Full physical.pdf"],
    discussion: [
      { from: "Club", text: "Coverage request for our senior centre back ahead of the season.", time: "10:40" },
      { from: "Insurance", text: "Received and queued for review.", time: "11:15" },
    ],
  },
  {
    id: "REQ-5004", club: "Al Nassr", athlete: "Mohammed Kanno", initials: "MK", sport: "Football",
    date: "Aug 10, 2026", aiStatus: "Risk Analyzed", status: "Ready for Approval",
    position: "Defensive Midfield", age: 31, clubContact: "Nawaf Al-Harbi", clubEmail: "insurance@alnassr.sa",
    medical: "Minor knee inflammation (2025), resolved. No surgeries. Stable baseline.",
    reports: ["Medical clearance.pdf", "Knee MRI.pdf"],
    aiRisk: "Low risk. Stable medical baseline with strong recovery metrics. Injury probability 12%.",
    riskLevel: "Low",
    aiCoverage: "Standard plan recommended with optional knee rider.",
    coverageTier: "Standard", coverageLimit: "SAR 3,100,000",
    documents: ["Request form.pdf", "Contract summary.pdf", "Knee MRI.pdf"],
    discussion: [
      { from: "Club", text: "Please prepare seasonal coverage for Mohammed.", time: "09:50" },
      { from: "Insurance", text: "Risk analysis complete. Ready for your approval.", time: "14:05" },
    ],
  },
];

/* ══════════════════════ SHELLS ══════════════════════ */

function Card({ title, subtitle, right, children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover={{ y: -3 }}
      className={`group/card relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] p-6 transition-colors duration-300 hover:border-[#00B5FF]/25 ${className}`}
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{ boxShadow: "inset 0 0 30px -10px rgba(0,181,255,0.25)" }} />
      {(title || right) && (
        <div className="relative mb-5 flex items-start justify-between">
          <div>
            {title && <p className="text-[15px] font-bold tracking-tight text-white">{title}</p>}
            {subtitle && <p className="mt-0.5 text-[12px] text-white/45">{subtitle}</p>}
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
    <span className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/60">
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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] p-6 transition-colors duration-300 hover:border-[#00B5FF]/25"
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(80% 60% at 50% 120%, rgba(0,181,255,0.12), transparent 70%)" }} />
      <div className="relative flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <Icon size={16} className="text-[#22D3EE]" />
        </div>
        <span className={`flex items-center gap-1 text-[12px] font-medium ${k.up ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
          <TrendingUp size={12} className={k.up ? "" : "rotate-180"} />{k.delta}
        </span>
      </div>
      <p className="relative mt-4 text-[28px] font-bold leading-none tracking-tight text-white">{n}{k.suffix ?? ""}</p>
      <p className="relative mt-1.5 text-[13px] text-white/55">{k.label}</p>
      <div className="relative mt-3 opacity-70"><Sparkline data={k.spark} color={k.up ? "#22D3EE" : "#EF4444"} /></div>
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
            <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00B5FF" /><stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" strokeLinecap="round" />
          <motion.path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="url(#gauge)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={semi} initial={{ strokeDashoffset: semi }} animate={inView ? { strokeDashoffset: semi * (1 - frac) } : {}}
            transition={{ duration: 1.1, ease: EASE }} style={{ filter: "drop-shadow(0 0 6px rgba(0,181,255,0.4))" }} />
        </svg>
        <div className="absolute inset-x-0 bottom-1 text-center">
          <p className="text-[30px] font-bold leading-none text-white">{n}%</p>
          <p className="mt-1 text-[11px] text-white/45">Approved Policies</p>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-3 gap-2">
        {APPROVAL.map((a) => (
          <div key={a.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-2.5 text-center">
            <p className="text-[16px] font-bold text-white">{a.value}%</p>
            <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />{a.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ ROW 2 RIGHT — RECENT POLICIES ══════════════════════ */

function RecentPolicies({ approved = [] }) {
  const base = POLICIES.slice(0, 5).map((p) => ({ id: p.id, club: p.club, coverage: p.coverage, status: p.status, isNew: false }));
  const rows = [...approved, ...base];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-left">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.1em] text-white/40">
            {["Policy ID", "Club", "Coverage Type", "Status"].map((h) => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {rows.map((p, i) => (
              <motion.tr
                key={p.id}
                layout
                initial={p.isNew ? { opacity: 0, backgroundColor: "rgba(34,197,94,0.18)", height: 0 } : { opacity: 0, x: -12 }}
                animate={p.isNew ? { opacity: 1, backgroundColor: "rgba(34,197,94,0)", height: "auto" } : { opacity: 1, x: 0 }}
                transition={{ duration: p.isNew ? 1.2 : 0.45, delay: p.isNew ? 0 : i * 0.06, ease: EASE }}
                className="border-t border-white/[0.05] text-[13px] transition-colors hover:bg-white/[0.03]">
                <td className="whitespace-nowrap py-3 pr-4 font-medium text-white">
                  {p.isNew && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#22C55E]" />}
                  {p.id}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-white/70">{p.club}</td>
                <td className="whitespace-nowrap py-3 pr-4 text-white/60">{p.coverage}</td>
                <td className="whitespace-nowrap py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${POLICY_STATUS_STYLE[p.status] ?? "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20"}`}>{p.status}</span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
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
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
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
          className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.12]">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#00B5FF]/25 to-[#22D3EE]/10 text-[13px] font-bold text-white">{r.initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{r.club}</p>
            <p className="truncate text-[12px] text-white/50">{r.player} · {r.sport}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${REQ_STATUS_STYLE[r.status]}`}>{r.status}</span>
            <span className="text-[10px] text-white/35">{r.date}</span>
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
    { key: "approved", data: ACTIVITY.approved, color: "#22C55E", label: "Approved" },
    { key: "pending", data: ACTIVITY.pending, color: "#00B5FF", label: "Pending" },
    { key: "rejected", data: ACTIVITY.rejected, color: "#EF4444", label: "Rejected" },
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
            {series.map((s) => (
              <linearGradient key={s.key} id={`pa-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.25" /><stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
            <filter id="paGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
          {series.map((s, si) => (
            <motion.path key={`a-${s.key}`} d={area(s.data)} fill={`url(#pa-${s.key})`} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.6 + si * 0.15 }} />
          ))}
          {series.map((s, si) => (
            <motion.path key={s.key} d={smooth(s.data)} stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#paGlow)"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, delay: si * 0.15, ease: EASE }} vectorEffect="non-scaling-stroke" />
          ))}
          {ACTIVITY.months.map((_, i) => (
            <g key={i}>
              <rect x={px(i) - stepW / 2} y={0} width={stepW} height={H} fill="transparent" onMouseEnter={() => setHx(i)} style={{ cursor: "pointer" }} />
              {hx === i && <line x1={px(i)} x2={px(i)} y1={0} y2={H} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />}
              {hx === i && series.map((s) => <circle key={s.key} cx={px(i)} cy={py(s.data[i])} r="3.5" fill="#0c121a" stroke={s.color} strokeWidth="2.5" />)}
            </g>
          ))}
        </svg>
        {hx !== null && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-white/[0.12] px-3 py-2 text-[11px] shadow-2xl backdrop-blur-md"
            style={{ left: `${(hx / (n - 1)) * 100}%`, top: 4, background: "rgba(12,18,26,0.8)" }}>
            <p className="mb-1 font-medium text-white/80">{ACTIVITY.months[hx]}</p>
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-white/55"><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
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
            <span className="text-[12px] text-white/55">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-1 text-[10px] text-white/35">{ACTIVITY.months.map((m) => <span key={m}>{m}</span>)}</div>
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
        <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,181,255,0.12), transparent 65%)" }} />
        <svg viewBox="0 0 150 150" className="relative h-full w-full -rotate-90" style={{ filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.45))" }}>
          <defs>
            {COVERAGE_BREAKDOWN.map((s, i) => (
              <linearGradient key={s.label} id={`cb-${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.6" /><stop offset="100%" stopColor={s.color} stopOpacity="1" />
              </linearGradient>
            ))}
          </defs>
          <circle cx="75" cy="75" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="15" />
          {COVERAGE_BREAKDOWN.map((s, i) => {
            const len = (s.value / total) * C, arc = Math.max(len - GAP, 3), active = hover === i;
            const el = <motion.circle key={s.label} cx="75" cy="75" r={R} fill="none" stroke={`url(#cb-${i})`}
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
            <p className="text-[24px] font-bold leading-none text-white">{hover !== null ? COVERAGE_BREAKDOWN[hover].value : total}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">{hover !== null ? COVERAGE_BREAKDOWN[hover].label : "policies"}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {COVERAGE_BREAKDOWN.map((s, i) => (
          <button key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
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
          <div className="mb-1 flex items-center justify-between text-[11px]"><span className="text-white/55">{d.label}</span><span className="font-medium text-white/75">{d.value}{pct ? "%" : ""}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
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
      className="relative overflow-hidden rounded-3xl border border-[#00B5FF]/25 p-6 lg:p-8" style={{ background: "rgba(0,181,255,0.05)" }}>
      <motion.div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(0,181,255,0.2)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative mb-6 flex items-center gap-3">
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#00B5FF]/30 bg-[#00B5FF]/10">
          <Brain size={19} className="text-[#22D3EE]" /><span className="absolute inset-0 rounded-2xl border border-[#00B5FF]/40 motion-safe:animate-ping" />
        </div>
        <div>
          <p className="text-[16px] font-bold tracking-tight text-white">AI Insurance Portfolio Overview</p>
          <p className="text-[12px] text-white/45">Live portfolio intelligence · model v4.2</p>
        </div>
      </div>

      <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-white/40">Policies by Sport</p>
          <MiniBars data={sportBars} />
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-white/40">Policies by Risk Level</p>
          <MiniBars data={RISK_LEVELS} pct />
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">Coverage Utilization</p>
          <div>
            <p className="text-[34px] font-bold leading-none text-white">{util}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div initial={{ width: 0 }} animate={inView ? { width: "87%" } : {}} transition={{ duration: 1, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-[#00B5FF] to-[#22D3EE]" />
            </div>
            <p className="mt-2 text-[11px] text-white/45">of total portfolio capacity in use</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">Pending Renewals</p>
          <div>
            <p className="text-[34px] font-bold leading-none text-white">34</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-[#EAB308]"><Calendar size={12} /> 6 due within 14 days</p>
          </div>
          <RippleButton className="mt-3 justify-center rounded-full border border-white/[0.15] py-2 text-[12px] font-medium text-white">Review renewals</RippleButton>
        </div>
        <div className="rounded-2xl border border-[#00B5FF]/20 bg-[#00B5FF]/[0.06] p-4 md:col-span-2 xl:col-span-1">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#4FC9FF]"><Sparkles size={12} /> Recent AI Recommendations</p>
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

/* ══════════════════════ ACTIVE POLICIES (unchanged content) ══════════════════════ */

function ActivePolicies({ approved }) {
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k, i) => <KpiCard key={k.label} k={k} i={i} />)}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Policy Approval Rate" subtitle="Approved · Rejected · Pending"><ApprovalGauge /></Card>
        <Card title="Recent Policies" subtitle="Latest across all clubs" className="lg:col-span-2" delay={0.08}
          right={<Pill><Calendar size={13} /> 2025 – 2026</Pill>}><RecentPolicies approved={approved} /></Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Coverage Distribution" subtitle="Policies by sport" className="lg:col-span-2"><CoverageBySport /></Card>
        <Card title="Recent Insurance Requests" subtitle="Latest club submissions" delay={0.08}><RecentRequests /></Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Policy Activity" subtitle="Monthly approved · pending · rejected" className="lg:col-span-2"><PolicyActivity /></Card>
        <Card title="Coverage Breakdown" subtitle="By coverage tier" delay={0.08}><CoverageBreakdown /></Card>
      </div>

      <div className="mt-5"><PortfolioOverview /></div>

      <p className="mt-8 text-[12px] text-white/30">Figures are illustrative sample data for the ATHLONIX platform preview.</p>
    </>
  );
}

/* ══════════════════════ PENDING REQUESTS TAB ══════════════════════ */

function PendingRequests({ requests, onOpen }) {
  return (
    <div className="mt-6">
      <Card title="Pending Insurance Requests" subtitle="New requests submitted by clubs via the Club Portal — review before creating a policy"
        right={<Pill><FileClock size={13} className="text-[#EAB308]" /> {requests.length} pending</Pill>}>
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl border border-white/[0.08] bg-white/[0.02]"><CheckCircle2 size={26} className="text-[#22C55E]" /></div>
            <p className="mt-5 text-[17px] font-bold text-white">All requests processed</p>
            <p className="mt-1.5 max-w-[320px] text-[13px] text-white/45">There are no pending insurance requests. New submissions from clubs will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.1em] text-white/40">
                  {["Club", "Athlete", "Sport", "Submission Date", "AI Status", "Request Status", "Actions"].map((h) => <th key={h} className="pb-4 pr-4 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {requests.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      layout
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 60, height: 0, transition: { duration: 0.5, ease: EASE } }}
                      transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
                      whileHover={{ y: -2 }}
                      onClick={() => onOpen(r)}
                      className="group cursor-pointer border-t border-white/[0.05] text-[13px] transition-colors hover:bg-white/[0.03]">
                      <td className="whitespace-nowrap py-4 pr-4 font-medium text-white">{r.club}</td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00B5FF]/25 to-[#22D3EE]/10 text-[11px] font-bold text-white">{r.initials}</div>
                          <span className="text-white/85">{r.athlete}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 text-white/60">{r.sport}</td>
                      <td className="whitespace-nowrap py-4 pr-4 text-white/60">{r.date}</td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${AI_STATUS_STYLE[r.aiStatus] ?? ""}`}>
                          <Sparkles size={10} />{r.aiStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${REQUEST_STATUS_STYLE[r.status] ?? ""}`}>{r.status}</span>
                      </td>
                      <td className="whitespace-nowrap py-4">
                        <span className="flex items-center gap-1 text-[12px] font-medium text-[#22D3EE] opacity-0 transition-opacity group-hover:opacity-100">Review <ChevronRight size={14} /></span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════ REQUEST SLIDE-OVER PANEL ══════════════════════ */

function PanelSection({ title, icon: Icon, children }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40"><Icon size={12} /> {title}</p>
      {children}
    </div>
  );
}
function Row2({ label, value }) {
  return <div className="flex items-center justify-between py-0.5"><span className="text-[13px] text-white/50">{label}</span><span className="text-[13px] font-medium text-white/85">{value}</span></div>;
}

function Discussion({ messages }) {
  const [thread, setThread] = useState(messages);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    setThread((t) => [...t, { from: "Insurance", text: draft.trim(), time: "now" }]);
    setDraft("");
  };
  return (
    <div>
      <div className="space-y-3">
        <AnimatePresence initial={true}>
          {thread.map((m, i) => {
            const isClub = m.from === "Club";
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
                className={`flex ${isClub ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${isClub ? "rounded-tl-sm border border-white/[0.08] bg-white/[0.03]" : "rounded-tr-sm border border-[#00B5FF]/20 bg-[#00B5FF]/[0.08]"}`}>
                  <p className={`mb-0.5 text-[10px] font-medium uppercase tracking-wide ${isClub ? "text-white/40" : "text-[#4FC9FF]"}`}>{m.from}</p>
                  <p className="text-[13px] leading-snug text-white/85">{m.text}</p>
                  <p className="mt-1 text-right text-[10px] text-white/30">{m.time}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write a reply…" className="flex-1 rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:border-[#00B5FF]/40 focus:outline-none" />
        <RippleButton onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-[#00B5FF] text-white"><Send size={15} /></RippleButton>
      </div>
    </div>
  );
}

function RequestPanel({ request, onClose, onApprove, onReject }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className="relative z-10 flex h-full w-full max-w-[480px] flex-col overflow-y-auto border-l border-white/[0.1]" style={{ background: "rgba(12,18,26,.97)" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(0,181,255,0.16)" }} />

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0c121a]/90 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#00B5FF]/30 to-[#22D3EE]/10 text-[13px] font-bold text-white">{request.initials}</div>
            <div>
              <p className="text-[16px] font-bold tracking-tight text-white">{request.athlete}</p>
              <p className="text-[12px] text-white/45">{request.id} · {request.club}</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] text-white/50 transition-colors hover:text-white"><X size={16} /></button>
        </div>

        <div className="relative space-y-7 px-6 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-[12px] font-medium ${REQUEST_STATUS_STYLE[request.status] ?? ""}`}>{request.status}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium ${AI_STATUS_STYLE[request.aiStatus] ?? ""}`}><Sparkles size={11} />{request.aiStatus}</span>
          </div>

          <PanelSection title="Player Information" icon={User}>
            <Row2 label="Full name" value={request.athlete} />
            <Row2 label="Position" value={request.position} />
            <Row2 label="Age" value={String(request.age)} />
            <Row2 label="Sport" value={request.sport} />
          </PanelSection>

          <PanelSection title="Club Information" icon={ShieldCheck}>
            <Row2 label="Club" value={request.club} />
            <Row2 label="Contact" value={request.clubContact} />
            <Row2 label="Email" value={request.clubEmail} />
            <Row2 label="Submitted" value={request.date} />
          </PanelSection>

          <PanelSection title="Medical History" icon={HeartPulse}>
            <p className="text-[13px] leading-relaxed text-white/70">{request.medical}</p>
          </PanelSection>

          <PanelSection title="Uploaded Medical Reports" icon={Paperclip}>
            <div className="flex flex-wrap gap-1.5">
              {request.reports.map((d) => (
                <span key={d} className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/55"><FileText size={11} /> {d}</span>
              ))}
            </div>
          </PanelSection>

          <PanelSection title="AI Risk Assessment" icon={Brain}>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] text-white/55"><ShieldAlert size={13} /> Risk Level</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${RISK_STYLE[request.riskLevel] ?? ""}`}>{request.riskLevel}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-white/70">{request.aiRisk}</p>
            </div>
          </PanelSection>

          <PanelSection title="AI Coverage Recommendation" icon={Sparkles}>
            <div className="rounded-2xl border border-[#00B5FF]/20 bg-[#00B5FF]/[0.06] p-4">
              <p className="text-[13px] leading-relaxed text-white/80">{request.aiCoverage}</p>
              <div className="mt-3 border-t border-white/[0.08] pt-3">
                <Row2 label="Recommended tier" value={request.coverageTier} />
                <Row2 label="Coverage limit" value={request.coverageLimit} />
                <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#4FC9FF]/70"><Sparkles size={9} /> Generated automatically by ATHLONIX AI</p>
              </div>
            </div>
          </PanelSection>

          <PanelSection title="Supporting Documents" icon={FileText}>
            <div className="space-y-1.5">
              {request.documents.map((d) => (
                <div key={d} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                  <span className="flex items-center gap-2 text-[12px] text-white/70"><FileText size={12} className="text-white/40" /> {d}</span>
                  <button className="text-white/40 transition-colors hover:text-white"><Download size={13} /></button>
                </div>
              ))}
            </div>
          </PanelSection>

          <PanelSection title="Discussion" icon={MessageSquare}>
            <Discussion messages={request.discussion} />
          </PanelSection>
        </div>

        <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 border-t border-white/[0.08] bg-[#0c121a]/90 p-4 backdrop-blur-xl">
          <RippleButton onClick={() => onApprove(request)} className="col-span-2 justify-center rounded-full bg-[#22C55E] py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_-16px_rgba(34,197,94,0.6)]"><Check size={15} /> Approve Request</RippleButton>
          <RippleButton className="justify-center rounded-full border border-white/[0.15] py-2.5 text-[12px] font-medium text-white"><Info size={13} /> Request More Info</RippleButton>
          <RippleButton onClick={() => onReject(request)} className="justify-center rounded-full border border-[#EF4444]/30 py-2.5 text-[12px] font-medium text-[#EF4444]"><XCircle size={13} /> Reject</RippleButton>
          <RippleButton className="col-span-2 justify-center rounded-full border border-white/[0.15] py-2.5 text-[12px] font-medium text-white"><Download size={13} /> Download Documents</RippleButton>
        </div>
      </motion.aside>
    </motion.div>
  );
}

/* ══════════════════════ SUCCESS TOAST ══════════════════════ */

function SuccessToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#22C55E]/30 px-5 py-3.5 shadow-2xl backdrop-blur-md" style={{ background: "rgba(12,22,16,0.92)" }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 15 }}
              className="grid h-8 w-8 place-items-center rounded-full bg-[#22C55E]">
              <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <motion.path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.4, ease: EASE }} />
              </motion.svg>
            </motion.div>
            <div>
              <p className="text-[13px] font-semibold text-white">Policy Created Successfully</p>
              <p className="text-[11px] text-white/50">The request is now an active policy.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════ TABS ══════════════════════ */

function Tabs({ tab, setTab, pendingCount }) {
  const items = [
    { key: "pending", label: "Pending Requests", count: pendingCount },
    { key: "active", label: "Active Policies", count: null },
  ];
  return (
    <div className="mt-7 flex items-center gap-1 border-b border-white/[0.08]">
      {items.map((it) => {
        const active = tab === it.key;
        return (
          <button key={it.key} onClick={() => setTab(it.key)}
            className={`relative flex items-center gap-2 px-4 py-3 text-[14px] font-medium transition-colors ${active ? "text-white" : "text-white/45 hover:text-white/75"}`}>
            {it.label}
            {it.count !== null && (
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${active ? "bg-[#00B5FF]/15 text-[#4FC9FF]" : "bg-white/[0.06] text-white/50"}`}>{it.count}</span>
            )}
            {active && <motion.span layoutId="policyTab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00B5FF]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function Policies() {
  const [tab, setTab] = useState("pending");
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [approved, setApproved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(false);
  const seq = useRef(3100);

  const tierToCoverage = (tier) => (tier === "Pending" ? "Standard" : tier);

  const approve = (r) => {
    setSelected(null);
    setRequests((list) => list.filter((x) => x.id !== r.id));
    const newId = `POL-${seq.current++}`;
    setApproved((a) => [{ id: newId, club: r.club, coverage: tierToCoverage(r.coverageTier), status: "Active", isNew: true }, ...a]);
    setToast(true);
    window.setTimeout(() => setToast(false), 2800);
  };

  const reject = (r) => {
    setSelected(null);
    setRequests((list) => list.filter((x) => x.id !== r.id));
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-5 py-8 lg:px-8" style={{ background: "#05070B" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[38px]">Policies</h1>
          <p className="mt-2 max-w-[600px] text-[15px] leading-relaxed text-white/55">
            Review AI-generated coverage recommendations, process incoming club requests and monitor active policies across all insured clubs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill><Calendar size={14} className="text-white/40" /> 2025 – 2026</Pill>
          <Pill><Activity size={14} className="text-[#22D3EE]" /> All policies</Pill>
        </div>
      </motion.div>

      <Tabs tab={tab} setTab={setTab} pendingCount={requests.length} />

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
          {tab === "pending"
            ? <PendingRequests requests={requests} onOpen={setSelected} />
            : <ActivePolicies approved={approved} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selected && <RequestPanel request={selected} onClose={() => setSelected(null)} onApprove={approve} onReject={reject} />}
      </AnimatePresence>

      <SuccessToast show={toast} />
    </main>
  );
}