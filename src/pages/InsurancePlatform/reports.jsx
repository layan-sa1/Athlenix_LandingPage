import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useInView,
} from "framer-motion";
import { getAthlete } from "../../components/platformData";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Download,
  FileText,
  HeartPulse,
  Loader2,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];
const BLUE = "#00B5FF";
const SPRING = { type: "spring", stiffness: 220, damping: 20 };

/* ══════════════════════ DATA ══════════════════════ */

const TEMPLATES = [
  { id: "risk", title: "Monthly Risk Report", desc: "Squad-wide injury risk, ACWR trends and flagged athletes for the period.", time: "~40s", icon: ShieldAlert, gradient: "from-[#EF4444] to-[#00B5FF]" },
  { id: "club", title: "Executive Club Report", desc: "Board-ready summary of squad health, availability and performance.", time: "~55s", icon: BarChart3, gradient: "from-[#00B5FF] to-[#00E5FF]" },
  { id: "insurance", title: "Insurance Summary", desc: "Coverage, claims pipeline and portfolio exposure at a glance.", time: "~35s", icon: Wallet, gradient: "from-[#00E5FF] to-[#10B981]" },
  { id: "premium", title: "Premium Analysis", desc: "Dynamic premium modelling and forecast against live risk.", time: "~45s", icon: TrendingUp, gradient: "from-[#8B5CF6] to-[#00B5FF]" },
  { id: "medical", title: "Medical Intelligence Report", desc: "Injury patterns, recovery windows and medical observations.", time: "~50s", icon: HeartPulse, gradient: "from-[#EC4899] to-[#EF4444]" },
  { id: "performance", title: "Athlete Performance Report", desc: "Load, fatigue and output metrics across the monitored squad.", time: "~48s", icon: Activity, gradient: "from-[#00E5FF] to-[#00B5FF]" },
];

const GEN_STEPS = [
  "Collecting Athlete Data",
  "Running AI Analysis",
  "Calculating Risk Scores",
  "Generating Insurance Insights",
  "Building Executive Summary",
  "Rendering Charts",
  "Generating PDF",
];

const KEY_METRICS = [
  { label: "Athletes Analyzed", value: 1284, suffix: "" },
  { label: "Avg Risk Score", value: 63.8, suffix: "", decimals: 1 },
  { label: "High-Risk Flags", value: 47, suffix: "" },
  { label: "Portfolio Premium", value: 2.84, prefix: "SAR ", suffix: "M", decimals: 2 },
];

const HIGHLIGHTS = [
  { name: "Fahad Al-Muwallad", club: "Al Shabab", note: "ACWR 1.49 — immediate load reduction", risk: 76 },
  { name: "Abdullah Otayf", club: "Al Hilal", note: "Return-to-play day 4 of 10", risk: 72 },
  { name: "Sultan Al-Ghannam", club: "Al Nassr", note: "Sprint volume above threshold", risk: 68 },
];

const RISK_TREND = [58, 61, 60, 64, 62, 66, 63, 65, 62, 60];
const PREMIUM_TREND = [2.31, 2.44, 2.39, 2.58, 2.67, 2.72, 2.84, 2.9];

/* ══════════════════════ PRIMITIVES ══════════════════════ */

function useCountUp(to, run, decimals = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
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

/** Section wrapper that animates when scrolled into view inside the report. */
function ReportSection({
  title,
  icon: Icon,
  children,
  i = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
      className="scroll-mt-6"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#00B5FF]/30 bg-[#00B5FF]/10 text-[#00B5FF]">
          <Icon size={15} />
        </div>
        <h3 className="font-heading text-[15px] font-semibold tracking-tight text-white">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

/* ══════════════════════ CHARTS ══════════════════════ */

function LineChart({ data, max, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const W = 320, H = 110;
  const pts = data
    .map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`)
    .join(" ");
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[120px] w-full overflow-visible" fill="none" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 3" />
        ))}
        <motion.polyline
          points={pts}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE }}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 8px rgba(0, 181, 255, 0.4))" }}
        />
      </svg>
    </div>
  );
}

function BarChart({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const max = Math.max(...data);
  return (
    <div ref={ref} className="flex h-[120px] items-end gap-2">
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={inView ? { height: `${(v / max) * 100}%` } : {}}
          transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-[#00B5FF]/20 via-[#00B5FF]/60 to-[#00E5FF] shadow-[0_0_12px_rgba(0,181,255,0.2)]"
        />
      ))}
    </div>
  );
}

/* ══════════════════════ REPORT PREVIEW ══════════════════════ */

function ReportPreview({
  tpl,
  onClose,
}) {
  const [gen, setGen] = useState("idle");
  const [step, setStep] = useState(0);

  const run = () => {
    setGen("running");
    setStep(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= GEN_STEPS.length) {
        clearInterval(id);
        setStep(GEN_STEPS.length);
        setTimeout(() => setGen("done"), 600);
      } else {
        setStep(i);
      }
    }, 850);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#0B111D]/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #00B5FF 0%, transparent 70%)" }}
      />

      {/* Report toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800/80 bg-[#070C14]/90 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${tpl.gradient} shadow-lg shadow-blue-500/10`}>
            <tpl.icon size={18} className="text-white" />
          </div>
          <div>
            <p className="font-heading text-[15px] font-bold tracking-tight text-white">{tpl.title}</p>
            <p className="text-[11px] font-medium text-slate-400">ATHLONIX · Season 2026 · Confidential</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GenerateControl gen={gen} step={step} onRun={run} />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable report body */}
      <div className="max-h-[70vh] space-y-8 overflow-y-auto px-6 py-8 lg:px-10">
        <ReportSection title="Executive Summary" icon={FileText} i={0}>
          <p className="text-[14px] leading-relaxed text-slate-300">
            ATHLONIX AI analyzed 1,284 athletes across five clubs this cycle. Overall
            squad risk held steady while injury probability fell 3%, driven by improved
            load management at Al Hilal and Al Nassr. Portfolio premium rose 5% as three
            defenders crossed high-risk thresholds. Immediate attention is recommended
            for two Al Shabab and Al Hilal players entering critical acute:chronic ratios.
          </p>
        </ReportSection>

        <ReportSection title="AI Insights" icon={Sparkles} i={1}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { t: "Load spike detected", d: "Al Shabab winger ACWR 1.49 — reduce sprint volume 30%.", c: "#EF4444" },
              { t: "Recovery on track", d: "A. Otayf return-to-play progressing ahead of schedule.", c: "#10B981" },
              { t: "Premium pressure", d: "Three defenders driving 5% portfolio premium increase.", c: BLUE },
              { t: "Model confidence", d: "Risk model v4.2 running at 92% prediction confidence.", c: "#00E5FF" },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/80">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: x.c, color: x.c }} />
                  <span className="text-[13px] font-semibold text-white">{x.t}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-slate-400">{x.d}</p>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Key Metrics" icon={Brain} i={2}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {KEY_METRICS.map((m) => (
              <Metric key={m.label} m={m} />
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Charts" icon={BarChart3} i={3}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="mb-3 text-[12px] font-medium text-slate-400">Average Risk — rolling 10 weeks</p>
              <LineChart data={RISK_TREND} max={80} color={BLUE} />
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
              <p className="mb-3 text-[12px] font-medium text-slate-400">Premium Estimate — SAR millions</p>
              <BarChart data={PREMIUM_TREND} />
            </div>
          </div>
        </ReportSection>

        <ReportSection title="Player Highlights" icon={Activity} i={4}>
          <div className="space-y-2.5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.name} className="flex items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-colors hover:border-slate-700/80">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-700/50 bg-slate-800/60 text-[12px] font-bold text-white shadow-inner">
                  {h.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-white">{h.name} · <span className="text-slate-400">{h.club}</span></p>
                  <p className="text-[12px] text-slate-400">{h.note}</p>
                </div>
                <span className="shrink-0 font-heading text-[18px] font-bold text-[#EF4444]">{h.risk}</span>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Risk Analysis" icon={ShieldAlert} i={5}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Low Risk", value: 812, color: "#10B981" },
              { label: "Moderate", value: 425, color: "#F59E0B" },
              { label: "High Risk", value: 47, color: "#EF4444" },
            ].map((r) => (
              <div key={r.label} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                <p className="text-[12px] text-slate-400">{r.label}</p>
                <p className="mt-1 font-heading text-[24px] font-bold text-white">{r.value}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(r.value / 1284) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE }}
                    className="h-full rounded-full"
                    style={{ background: r.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Premium Forecast" icon={TrendingUp} i={6}>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <BarChart data={PREMIUM_TREND} />
            <p className="mt-4 text-[13px] leading-relaxed text-slate-300">
              Projected portfolio premium reaches SAR 2.9M next cycle, a 2.1% rise, assuming
              current risk trajectories and no new high-risk classifications.
            </p>
          </div>
        </ReportSection>

        <ReportSection title="Insurance Recommendations" icon={Wallet} i={7}>
          <ul className="space-y-2.5">
            {[
              "Reprice coverage for three high-risk defenders ahead of renewal.",
              "Introduce load-triggered premium adjustments for sprint-heavy roles.",
              "Bundle recovery-monitoring add-on for athletes in return-to-play.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#00E5FF]" />
                {t}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Medical Observations" icon={HeartPulse} i={8}>
          <p className="text-[14px] leading-relaxed text-slate-300">
            Hamstring strain remains the dominant injury pattern (38% of flagged cases),
            concentrated in wingers and full-backs with elevated sprint loads. Two athletes
            are in structured return-to-play; both are progressing within expected windows.
            Ankle-stability screening is recommended for one Al Ittihad center-back pending
            medical clearance.
          </p>
        </ReportSection>
      </div>
    </motion.div>
  );
}

function Metric({ m }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const n = useCountUp(m.value, inView, m.decimals ?? 0);
  return (
    <div ref={ref} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
      <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
      <p className="mt-1.5 font-heading text-[22px] font-bold leading-none tracking-tight text-white">
        {m.prefix}{n}{m.suffix}
      </p>
    </div>
  );
}

/* ══════════════════════ GENERATE WORKFLOW ══════════════════════ */

function GenerateControl({
  gen,
  step,
  onRun,
}) {
  if (gen === "idle") {
    return (
      <motion.button
        onClick={onRun}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#00B5FF] to-[#0080FF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(0,181,255,0.4)] transition-all hover:shadow-[0_0_28px_rgba(0,181,255,0.6)]"
      >
        <Sparkles size={15} />
        Generate Report
      </motion.button>
    );
  }

  if (gen === "running") {
    const label = step >= GEN_STEPS.length ? "Completed Successfully" : GEN_STEPS[step];
    const pct = Math.round((step / GEN_STEPS.length) * 100);
    return (
      <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[#00E5FF]" />
            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[12px] font-medium text-slate-300"
              >
                {label}…
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-1.5 h-1 w-44 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: EASE }}
              className="h-full rounded-full bg-gradient-to-r from-[#00B5FF] to-[#00E5FF]"
            />
          </div>
        </div>
      </div>
    );
  }

  // done
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING}
      className="flex items-center gap-3"
    >
      <span className="hidden items-center gap-1.5 text-[13px] font-medium text-[#10B981] sm:flex">
        <CheckCircle2 size={16} /> Report Ready
      </span>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            "0 0 16px rgba(0,181,255,0.3)",
            "0 0 28px rgba(0,181,255,0.7)",
            "0 0 16px rgba(0,181,255,0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00B5FF] to-[#0080FF] px-5 py-2.5 text-[13px] font-semibold text-white"
      >
        <Download size={15} />
        Download PDF
      </motion.button>
    </motion.div>
  );
}

/* ══════════════════════ TEMPLATE CARD ══════════════════════ */

const cardV = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: EASE },
  }),
};

function TemplateCard({
  tpl,
  i,
  selected,
  onSelect,
}) {
  const Icon = tpl.icon;
  return (
    <motion.button
      custom={i}
      variants={cardV}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
        selected
          ? "border-[#00B5FF] bg-slate-900/90 shadow-[0_0_30px_rgba(0,181,255,0.25)]"
          : "border-slate-800/90 bg-[#0A0F1D]/80 hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(0,181,255,0.12)]"
      }`}
    >
      {/* Background Soft Inner Glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00B5FF]/5 blur-2xl transition-all duration-500 group-hover:bg-[#00B5FF]/15" />

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tpl.gradient} shadow-md`}>
            <Icon size={20} className="text-white" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-400">
            <Loader2 size={11} className="text-slate-500" /> Est. {tpl.time}
          </span>
        </div>

        <h3 className="mt-5 font-heading text-[16px] font-bold tracking-tight text-white group-hover:text-[#00B5FF] transition-colors">
          {tpl.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{tpl.desc}</p>
      </div>

      <div className="relative border-t border-slate-800/60 bg-slate-950/30 px-6 py-3.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-slate-400">Template Format</span>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-[#00E5FF] opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
          {selected ? "Active" : "Preview"} <ChevronRight size={14} />
        </span>
      </div>
    </motion.button>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function Dashboard() {
  const athleteId = undefined;
  const template = undefined;
  const loadedAthlete = getAthlete(athleteId);
  const [selected, setSelected] = useState(template ?? null);
  const tpl = TEMPLATES.find((t) => t.id === selected) ?? null;

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold tracking-wider text-[#00B5FF] uppercase">
            <Sparkles size={14} /> Intelligence Platform
          </div>
          <h1 className="mt-1 font-heading text-[30px] font-bold tracking-tight text-white sm:text-[36px]">
            Executive <span className="bg-gradient-to-r from-[#00B5FF] to-[#00E5FF] bg-clip-text text-transparent">Reports</span>
          </h1>
          <p className="mt-1 max-w-[560px] text-[14px] text-slate-400 leading-relaxed">
            Choose a template to preview a board-ready report, then generate a polished PDF
            powered by live ATHLONIX intelligence.
          </p>

          {loadedAthlete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
              className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md"
            >
              <div className="grid h-6 w-6 place-items-center rounded-full bg-[#00B5FF]/20 text-[10px] font-bold text-[#00B5FF]">
                {loadedAthlete.initials}
              </div>
              <span className="text-[12px] text-slate-300">
                Loaded: <span className="font-semibold text-white">{loadedAthlete.name}</span> ({loadedAthlete.club})
              </span>
            </motion.div>
          )}
        </div>

        {/* Dashboard-Style Header Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64 sm:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full rounded-full border border-slate-800 bg-slate-900/90 pl-9 pr-4 py-2 text-[13px] text-white placeholder-slate-500 transition-colors focus:border-[#00B5FF] focus:outline-none"
            />
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white">
            <Filter size={14} /> Filter
          </button>

          <button className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white">
            2025 – 2026
          </button>
        </div>
      </motion.div>

      {/* Template cards grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((t, i) => (
          <TemplateCard
            key={t.id}
            tpl={t}
            i={i}
            selected={selected === t.id}
            onSelect={() => setSelected(t.id)}
          />
        ))}
      </div>

      {/* Expanding preview */}
      <AnimatePresence mode="wait">
        {tpl && <ReportPreview key={tpl.id} tpl={tpl} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <p className="mt-8 text-center text-[12px] text-slate-600">
        Figures are illustrative sample data for the ATHLONIX platform preview.
      </p>
    </main>
  );
}