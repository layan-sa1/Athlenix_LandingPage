import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bell, Brain, ChevronRight, ClipboardList, FileClock, Layers, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { ATHLETES, STATUS_STYLE } from "../../components/platformData";
import { EASE, RippleButton, useCountUp } from "../../components/ui-motion";

const BLUE = "#00B5FF";

/* ══════════════════════ DATA ══════════════════════ */

const KPIS = [
  { label: "Active Policies", value: 1237, decimals: 0, delta: "+3.2%", up: true, icon: ShieldCheck, spark: [30, 34, 33, 38, 40, 44, 48, 52] },
  { label: "Pending Claims", value: 18, decimals: 0, delta: "-2", up: true, icon: ClipboardList, spark: [26, 24, 25, 22, 20, 21, 19, 18] },
  { label: "AI Coverage Recommendations", value: 284, decimals: 0, delta: "+12%", up: true, icon: Layers, spark: [230, 240, 239, 250, 260, 270, 278, 284] },
  { label: "Policies Pending Review", value: 34, decimals: 0, delta: "+6", up: false, icon: FileClock, spark: [20, 22, 25, 27, 28, 30, 32, 34] },
];

const CLAIMS_TREND = {
  approved: [14, 18, 17, 22, 21, 26, 24, 25, 23, 27],
  pending: [8, 11, 9, 13, 12, 15, 14, 12, 13, 11],
  rejected: [3, 4, 5, 4, 6, 5, 7, 6, 5, 4],
  months: 10,
};

const COVERAGE = [
  { label: "Football", value: 612, color: "#00B5FF" },
  { label: "Basketball", value: 268, color: "#22D3EE" },
  { label: "Volleyball", value: 174, color: "#8B5CF6" },
  { label: "Tennis", value: 118, color: "#EAB308" },
  { label: "Swimming", value: 65, color: "#22C55E" },
];

// Fallback protection in case ATHLETES is undefined or smaller than 6
const CLAIMS = (ATHLETES || []).slice(0, 6).map((a, i) => ({
  ...a,
  amount: ["SAR 82,000", "SAR 140,000", "SAR 47,000", "SAR 61,000", "SAR 33,000", "SAR 95,000"][i] || "SAR 0",
  date: ["Aug 16, 2026", "Aug 14, 2026", "Aug 12, 2026", "Aug 09, 2026", "Aug 07, 2026", "Aug 05, 2026"][i] || "Recent",
  injury: ["Hamstring", "Knee (ACL)", "Ankle", "Hamstring", "Calf", "Shoulder"][i] || "General",
}));

/* ══════════════════════ PANEL ══════════════════════ */

function Panel({
  title,
  subtitle,
  action,
  right,
  children,
  className = "",
  delay = 0,
  onAction,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`group/panel relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] p-6 transition-colors duration-300 hover:border-white/[0.14] ${className}`}
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      <div className="pointer-events-none absolute -inset-y-2 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 transition-all duration-700 group-hover/panel:left-[130%] group-hover/panel:opacity-100" />
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="font-heading text-[16px] font-bold tracking-tight text-white">{title}</p>
          {subtitle && <p className="mt-0.5 text-[12px] text-white/45">{subtitle}</p>}
        </div>
        {right ? right : action && (
          <button onClick={onAction} className="flex items-center gap-1 text-[13px] font-medium text-[#22D3EE] transition-opacity hover:opacity-80">
            {action} <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div className="relative flex-1">{children}</div>
    </motion.section>
  );
}

/* segmented time selector (Year / Month / Week / Day) — reference style */
function TimeSelector() {
  const [active, setActive] = useState("Year");
  const opts = ["Year", "Month", "Week", "Day"];
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => setActive(o)}
          className={`relative rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${active === o ? "text-white" : "text-white/45 hover:text-white/70"}`}
        >
          {active === o && (
            <motion.span layoutId="timeSel" className="absolute inset-0 rounded-full bg-[#00B5FF]"
              transition={{ type: "spring", stiffness: 400, damping: 32 }} />
          )}
          <span className="relative z-10">{o}</span>
        </button>
      ))}
    </div>
  );
}

function KpiCell({ k, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const n = useCountUp(k.value, inView, k.decimals);
  const Icon = k.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
      className="group relative flex-1 px-6 py-7 transition-colors duration-300 lg:px-8"
    >
      {/* border glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(70% 60% at 50% 120%, rgba(0,181,255,0.10), transparent 70%)" }} />
      <div className="relative">
        {/* large number + small trend badge */}
        <div className="flex items-center gap-2">
          <span className="font-heading text-[32px] font-bold leading-none tracking-tight text-white">
            {n}
          </span>
          <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${k.up ? "bg-[#22C55E]/12 text-[#22C55E]" : "bg-[#EF4444]/12 text-[#EF4444]"}`}>
            <TrendingUp size={11} className={k.up ? "" : "rotate-180"} />{k.delta}
          </span>
        </div>
        {/* small label with icon below */}
        <div className="mt-3 flex items-center gap-2 text-[13px] text-white/55">
          <Icon size={15} className="text-white/40" />
          {k.label}
        </div>
      </div>
    </motion.div>
  );
}

function KpiContainer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="overflow-hidden rounded-3xl border border-white/[0.08]"
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 24px 60px -40px rgba(0,0,0,0.6)" }}
    >
      {/* header row — matches reference "Analytics report" strip */}
      <div className="flex flex-col gap-3 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="font-heading text-[15px] font-bold tracking-tight text-white">Insurance Analytics</p>
          <p className="mt-0.5 text-[12px] text-white/45">Portfolio overview · 2025 – 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/60">
            <Layers size={13} className="text-white/40" /> All policies
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/60">
            2025 – 2026
          </span>
        </div>
      </div>
      {/* KPI cells with thin vertical dividers */}
      <div className="flex flex-col divide-y divide-white/[0.06] sm:flex-row sm:divide-x sm:divide-y-0">
        {KPIS.map((k, i) => <KpiCell key={k.label} k={k} i={i} />)}
      </div>
    </motion.div>
  );
}

/* ══════════════════════ CLAIMS TREND — 3 LINES ══════════════════════ */

function ClaimsTrend() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hx, setHx] = useState(null);
  const W = 520, H = 200;
  const series = [
    { key: "approved", data: CLAIMS_TREND.approved, color: "#22C55E", label: "Approved" },
    { key: "pending", data: CLAIMS_TREND.pending, color: BLUE, label: "Pending" },
    { key: "rejected", data: CLAIMS_TREND.rejected, color: "#EF4444", label: "Rejected" },
  ];
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.2;
  const stepW = W / (CLAIMS_TREND.months - 1);
  const px = (i) => i * stepW;
  const py = (v) => H - (v / max) * H;

  // Catmull-Rom → cubic bezier for smooth curved lines
  const smoothPath = (arr) => {
    const pts = arr.map((v, i) => [px(i), py(v)]);
    if (pts.length < 2) return "";
    let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const t = 0.18; // smoothing tension
      const c1x = p1[0] + (p2[0] - p0[0]) * t;
      const c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t;
      const c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  };
  const smoothArea = (arr) => `${smoothPath(arr)} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div ref={ref}>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[300px] w-full" fill="none" preserveAspectRatio="none"
          onMouseLeave={() => setHx(null)}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`ct-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.30" />
                <stop offset="55%" stopColor={s.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
            {/* soft glow for the lines + points */}
            <filter id="ctGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}

          {/* gradient areas under each curve */}
          {series.map((s, si) => (
            <motion.path key={`area-${s.key}`} d={smoothArea(s.data)} fill={`url(#ct-${s.key})`}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.7 + si * 0.15 }} />
          ))}

          {/* smooth curved lines with glow */}
          {series.map((s, si) => (
            <motion.path key={s.key} d={smoothPath(s.data)} stroke={s.color} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" filter="url(#ctGlow)"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.6, delay: si * 0.15, ease: EASE }} vectorEffect="non-scaling-stroke" />
          ))}

          {/* hover crosshair + glowing points */}
          {Array.from({ length: CLAIMS_TREND.months }).map((_, i) => (
            <g key={i}>
              <rect x={px(i) - stepW / 2} y={0} width={stepW} height={H} fill="transparent"
                onMouseEnter={() => setHx(i)} style={{ cursor: "pointer" }} />
              {hx === i && (
                <line x1={px(i)} x2={px(i)} y1={0} y2={H} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
              )}
              {hx === i && series.map((s) => (
                <g key={s.key} filter="url(#ctGlow)">
                  <motion.circle cx={px(i)} cy={py(s.data[i])} r="6" fill={s.color} opacity="0.25"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} style={{ transformOrigin: `${px(i)}px ${py(s.data[i])}px` }} />
                  <motion.circle cx={px(i)} cy={py(s.data[i])} r="3.5" fill="#0c121a" stroke={s.color} strokeWidth="2.5"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.25, ease: EASE }} style={{ transformOrigin: `${px(i)}px ${py(s.data[i])}px` }} />
                </g>
              ))}
            </g>
          ))}
        </svg>

        {/* glassmorphism tooltip */}
        {hx !== null && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="pointer-events-none absolute -translate-x-1/2 rounded-xl border border-white/[0.12] px-3 py-2 text-[11px] shadow-2xl backdrop-blur-md"
            style={{ left: `${(hx / (CLAIMS_TREND.months - 1)) * 100}%`, top: 4, background: "rgba(12,18,26,0.75)" }}>
            {series.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-white/55"><span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />{s.label}</span>
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
            <span className="text-[12px] text-white/55">{s.label} Claims</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ COVERAGE — DONUT ══════════════════════ */

function CoverageDonut() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hover, setHover] = useState(null);
  const total = COVERAGE.reduce((a, b) => a + b.value, 0);
  const maxVal = Math.max(...COVERAGE.map((s) => s.value));

  // Concentric rings — outermost ring is the largest category.
  const SIZE = 180, C0 = SIZE / 2;
  const OUTER = 78, RING_GAP = 13, STROKE = 9;
  const rings = COVERAGE.map((s, i) => {
    const radius = OUTER - i * RING_GAP;
    const circumference = 2 * Math.PI * radius;
    const pct = s.value / maxVal;                 // fill proportion of the ring
    const arc = circumference * pct;
    return { ...s, i, radius, circumference, arc };
  });

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center">
      <div className="relative" style={{ height: SIZE, width: SIZE }}>
        {/* ambient glow behind the rings */}
        <div className="pointer-events-none absolute inset-0 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,181,255,0.12), transparent 65%)" }} />

        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-full w-full -rotate-90"
          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.45))" }}>
          <defs>
            {rings.map((r) => (
              <linearGradient key={`g-${r.label}`} id={`ring-${r.i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={r.color} stopOpacity="0.55" />
                <stop offset="100%" stopColor={r.color} stopOpacity="1" />
              </linearGradient>
            ))}
            <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* background track rings */}
          {rings.map((r) => (
            <circle key={`t-${r.label}`} cx={C0} cy={C0} r={r.radius} fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
          ))}

          {/* value arcs */}
          {rings.map((r) => {
            const active = hover === r.i;
            return (
              <motion.circle
                key={`v-${r.label}`}
                cx={C0} cy={C0} r={r.radius} fill="none"
                stroke={`url(#ring-${r.i})`}
                strokeWidth={active ? STROKE + 3 : STROKE}
                strokeLinecap="round"
                filter={active ? "url(#ringGlow)" : undefined}
                initial={{ strokeDasharray: `0 ${r.circumference}` }}
                animate={inView ? { strokeDasharray: `${r.arc} ${r.circumference - r.arc}` } : {}}
                transition={{ duration: 1.1, delay: r.i * 0.12, ease: EASE }}
                onMouseEnter={() => setHover(r.i)} onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "stroke-width .25s" }}
              />
            );
          })}
        </svg>

        {/* center readout */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-heading text-[30px] font-bold leading-none text-white">
              {hover !== null ? COVERAGE[hover].value.toLocaleString() : total.toLocaleString()}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
              {hover !== null ? COVERAGE[hover].label : "policies"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {COVERAGE.map((s, i) => (
          <button key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            className="flex items-center justify-between rounded-lg px-1 py-0.5 transition-colors hover:bg-white/[0.03]">
            <span className="flex items-center gap-2 text-[12px] text-white/70">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}
            </span>
            <span className="text-[12px] font-medium text-white">{s.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ RECENT CLAIMS — EXPANDING ROWS ══════════════════════ */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.1em] text-white/40">{label}</p>
      <p className="mt-1 text-[13px] text-white/75">{value}</p>
    </div>
  );
}

function RecentClaims() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="-mx-2">
      {CLAIMS.map((c, i) => {
        const open = openId === c.id;
        return (
          <Fragment key={c.id}>
            <motion.button
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              onClick={() => setOpenId(open ? null : c.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-white/[0.03]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#00B5FF]/25 to-[#22D3EE]/10 text-[12px] font-bold text-white">
                {c.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">{c.name}</p>
                <p className="truncate text-[12px] text-white/40">{c.club} · {c.injury}</p>
              </div>
              <span className="hidden shrink-0 text-[12px] text-white/40 md:block">{c.date}</span>
              <span className="shrink-0 text-[13px] font-semibold text-white">{c.amount}</span>
              <span className={`hidden shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline-block ${STATUS_STYLE[c.status]}`}>{c.status}</span>
              <ChevronRight size={16} className={`shrink-0 text-white/30 transition-transform ${open ? "rotate-90 text-[#22D3EE]" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mx-2 mb-2 grid gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:grid-cols-2">
                    <Detail label="Medical Report" value={`${c.injury} strain · grade II`} />
                    <Detail label="Coverage Details" value={c.coverage} />
                    <Detail label="Claim Timeline" value="Filed → Under review → Assessment" />
                    <Detail label="Approval History" value={`${c.claims} prior claim${c.claims === 1 ? "" : "s"} · settled`} />
                    <div className="sm:col-span-2 rounded-xl border border-[#00B5FF]/20 bg-[#00B5FF]/[0.06] p-3">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#4FC9FF]">
                        <Sparkles size={12} /> AI Recommendation
                      </p>
                      <p className="mt-1.5 text-[13px] text-white/75">{c.insight}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <RippleButton
                        onClick={() => navigate(`/platform/insurance-dashboard?athlete=${c.id}`)}
                        className="rounded-full bg-[#00B5FF] px-4 py-2.5 text-[13px] font-semibold text-white"
                      >
                        Open full profile <ChevronRight size={14} />
                      </RippleButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Fragment>
        );
      })}
    </div>
  );
}

/* ══════════════════════ AI INSURANCE INTELLIGENCE ══════════════════════ */

function AIIntelligence() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const points = [
    "14 new policies reviewed today",
    "5 claims require manual review",
    "3 AI recommendations are awaiting approval",
    "Coverage recommendations generated successfully",
    "AI detected an unusual increase in knee injuries among football athletes",
  ];
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-[#00B5FF]/25 p-6 lg:p-8"
      style={{ background: "rgba(0,181,255,0.05)" }}
    >
      <motion.div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(0,181,255,0.2)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#00B5FF]/30 bg-[#00B5FF]/10">
              <Brain size={19} className="text-[#22D3EE]" />
              <span className="absolute inset-0 rounded-2xl border border-[#00B5FF]/40 motion-safe:animate-ping" />
            </div>
            <div>
              <p className="font-heading text-[16px] font-bold tracking-tight text-white">AI Insurance Intelligence</p>
              <p className="text-[12px] text-white/45">Today's summary · model v4.2</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {points.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
                <span className="text-[14px] text-white/85">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Estimated Financial Impact</p>
            <p className="mt-2 font-heading text-[28px] font-bold tracking-tight text-white">SAR 315,000</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Recommended Action</p>
            <p className="mt-2 text-[14px] leading-snug text-white/85">
              Review AI-generated coverage recommendations for high-risk football athletes before approving policy renewals.
            </p>
            <RippleButton className="mt-4 w-full justify-center rounded-full bg-[#00B5FF] py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_-16px_rgba(0,181,255,0.7)]">
              <Sparkles size={15} /> View AI Recommendations <ChevronRight size={14} />
            </RippleButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function Dashboard() {
  const navigate = useNavigate();
  const toReports = () => navigate("/platform/reports");

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <h1 className="font-heading text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[38px]">
            Insurance <span className="text-[#22D3EE]">Control Center</span>
          </h1>
          <p className="mt-2 max-w-[600px] text-[15px] leading-relaxed text-white/55">
            Monitor insurance policies, claims, AI recommendations and insurance portfolio performance across all covered sports clubs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-2">
            <Search size={15} className="text-white/40" />
            <input placeholder="Search policies…" className="w-32 bg-transparent text-[13px] text-white placeholder:text-white/35 focus:outline-none" />
          </div>
          <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08]">
            <Bell size={16} className="text-white/60" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#00B5FF] motion-safe:animate-pulse" />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#00B5FF]/30 to-[#22D3EE]/10 text-[12px] font-bold text-white">AD</div>
          <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-4 py-2 text-[13px] text-white/70">Jun 23 – Sept 23</span>
        </div>
      </motion.div>

      {/* KPI CONTAINER — 4 cells with vertical dividers */}
      <div className="mt-8">
        <KpiContainer />
      </div>

      {/* HERO — full-width Claims Trend with time selector */}
      <div className="mt-5">
        <Panel title="Claims Trend" subtitle="Approved · Pending · Rejected over time" right={<TimeSelector />}>
          <ClaimsTrend />
        </Panel>
      </div>

      {/* Coverage Distribution + Recent Claims */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Coverage Distribution" action="View Details" onAction={toReports}>
          <CoverageDonut />
        </Panel>
        <Panel title="Recent Claims" action="View Details" onAction={toReports} delay={0.08}>
          <RecentClaims />
        </Panel>
      </div>

      {/* Full-width AI Intelligence */}
      <div className="mt-5">
        <AIIntelligence />
      </div>

      <p className="mt-8 text-[12px] text-white/30">Figures are illustrative sample data for the ATHLONIX platform preview.</p>
    </main>
  );
}