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
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const BLUE = "#00B5FF";
const SPRING = { type: "spring", stiffness: 200, damping: 18 };

/* ══════════════════════ DATA ══════════════════════ */

const TEMPLATES = [
  { id: "risk", title: "Monthly Risk Report", desc: "Squad-wide injury risk, ACWR trends and flagged athletes for the period.", time: "~40s", icon: ShieldAlert, gradient: "from-[#EF4444] to-[#00B5FF]" },
  { id: "club", title: "Executive Club Report", desc: "Board-ready summary of squad health, availability and performance.", time: "~55s", icon: BarChart3, gradient: "from-[#00B5FF] to-[#22D3EE]" },
  { id: "insurance", title: "Insurance Summary", desc: "Coverage, claims pipeline and portfolio exposure at a glance.", time: "~35s", icon: Wallet, gradient: "from-[#22D3EE] to-[#22C55E]" },
  { id: "premium", title: "Premium Analysis", desc: "Dynamic premium modelling and forecast against live risk.", time: "~45s", icon: TrendingUp, gradient: "from-[#8B5CF6] to-[#00B5FF]" },
  { id: "medical", title: "Medical Intelligence Report", desc: "Injury patterns, recovery windows and medical observations.", time: "~50s", icon: HeartPulse, gradient: "from-[#EC4899] to-[#EF4444]" },
  { id: "performance", title: "Athlete Performance Report", desc: "Load, fatigue and output metrics across the monitored squad.", time: "~48s", icon: Activity, gradient: "from-[#22D3EE] to-[#00B5FF]" },
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
      className="scroll-mt-6"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-[#00B5FF]/25 bg-[#00B5FF]/10">
          <Icon size={15} className="text-[#22D3EE]" />
        </div>
        <h3 className="font-heading text-[16px] font-bold tracking-tight text-white">
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
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[120px] w-full" fill="none" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <motion.polyline
          points={pts}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: EASE }}
          vectorEffect="non-scaling-stroke"
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
          transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
          className="flex-1 rounded-t-md bg-gradient-to-t from-[#00B5FF]/35 to-[#22D3EE]"
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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative mt-8 overflow-hidden rounded-[28px] border border-white/[0.1]"
      style={{ background: "rgba(12,18,26,.9)" }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(0,181,255,0.14)" }}
      />

      {/* Report toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0c121a]/90 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${tpl.gradient}`}>
            <tpl.icon size={17} className="text-white" />
          </div>
          <div>
            <p className="font-heading text-[15px] font-bold tracking-tight text-white">{tpl.title}</p>
            <p className="text-[11px] text-white/40">ATHLONIX · Season 2026 · Confidential</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GenerateControl gen={gen} step={step} onRun={run} />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] text-white/50 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable report body */}
      <div className="max-h-[70vh] space-y-10 overflow-y-auto px-6 py-8 lg:px-10">
        <ReportSection title="Executive Summary" icon={FileText} i={0}>
          <p className="text-[14px] leading-[1.7] text-white/70">
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
              { t: "Recovery on track", d: "A. Otayf return-to-play progressing ahead of schedule.", c: "#22C55E" },
              { t: "Premium pressure", d: "Three defenders driving 5% portfolio premium increase.", c: BLUE },
              { t: "Model confidence", d: "Risk model v4.2 running at 92% prediction confidence.", c: "#22D3EE" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />
                  <span className="text-[13px] font-medium text-white">{x.t}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-white/55">{x.d}</p>
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
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="mb-3 text-[12px] text-white/50">Average Risk — rolling 10 weeks</p>
              <LineChart data={RISK_TREND} max={80} color={BLUE} />
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="mb-3 text-[12px] text-white/50">Premium Estimate — SAR millions</p>
              <BarChart data={PREMIUM_TREND} />
            </div>
          </div>
        </ReportSection>

        <ReportSection title="Player Highlights" icon={Activity} i={4}>
          <div className="space-y-2.5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.name} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#00B5FF]/25 to-[#22D3EE]/10 text-[12px] font-bold text-white">
                  {h.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-white">{h.name} · <span className="text-white/45">{h.club}</span></p>
                  <p className="text-[12px] text-white/50">{h.note}</p>
                </div>
                <span className="shrink-0 font-heading text-[18px] font-bold text-[#EF4444]">{h.risk}</span>
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Risk Analysis" icon={ShieldAlert} i={5}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Low Risk", value: 812, color: "#22C55E" },
              { label: "Moderate", value: 425, color: "#EAB308" },
              { label: "High Risk", value: 47, color: "#EF4444" },
            ].map((r) => (
              <div key={r.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                <p className="text-[12px] text-white/50">{r.label}</p>
                <p className="mt-1 font-heading text-[24px] font-bold text-white">{r.value}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
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
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <BarChart data={PREMIUM_TREND} />
            <p className="mt-4 text-[13px] leading-relaxed text-white/60">
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
              <li key={t} className="flex items-start gap-2.5 text-[13px] text-white/70">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#22D3EE]" />
                {t}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Medical Observations" icon={HeartPulse} i={8}>
          <p className="text-[14px] leading-[1.7] text-white/70">
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
    <div ref={ref} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <p className="text-[11px] text-white/45">{m.label}</p>
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
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 rounded-full bg-[#00B5FF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_16px_40px_-14px_rgba(0,181,255,0.6)]"
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
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[#22D3EE]" />
            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-[12px] font-medium text-white/70"
              >
                {label}…
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-1.5 h-1 w-44 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: EASE }}
              className="h-full rounded-full bg-gradient-to-r from-[#00B5FF] to-[#22D3EE]"
            />
          </div>
        </div>
      </div>
    );
  }

  // done
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING}
      className="flex items-center gap-3"
    >
      <span className="hidden items-center gap-1.5 text-[13px] font-medium text-[#22C55E] sm:flex">
        <CheckCircle2 size={16} /> Report Ready
      </span>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        animate={{
          boxShadow: [
            "0 0 24px -6px rgba(0,181,255,0.5)",
            "0 0 40px -4px rgba(0,181,255,0.85)",
            "0 0 24px -6px rgba(0,181,255,0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center gap-2 rounded-full bg-[#00B5FF] px-5 py-2.5 text-[13px] font-semibold text-white"
      >
        <Download size={15} />
        Download PDF
      </motion.button>
    </motion.div>
  );
}


/* ══════════════════════ TEMPLATE CARD ══════════════════════ */

const cardV = {
  hidden: { opacity: 0, y: 26 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: EASE },
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
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      onClick={onSelect}
      className="group relative overflow-hidden rounded-3xl p-[1px] text-left"
    >
      {/* gradient border */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tpl.gradient} opacity-30 transition-opacity duration-300 group-hover:opacity-100 ${
          selected ? "opacity-100" : ""
        }`}
      />
      <div
        className="relative h-full rounded-3xl p-6"
        style={{ background: "rgba(14,20,30,.92)" }}
      >
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tpl.gradient}`}>
          <Icon size={22} className="text-white" />
        </div>
        <p className="mt-5 font-heading text-[16px] font-bold tracking-tight text-white">
          {tpl.title}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/55">{tpl.desc}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-white/40">
            <Loader2 size={12} /> Est. {tpl.time}
          </span>
          <span className="text-[12px] font-medium text-[#22D3EE] opacity-0 transition-opacity group-hover:opacity-100">
            {selected ? "Selected" : "Preview →"}
          </span>
        </div>
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#4FC9FF]">
          <Sparkles size={15} /> Generate Intelligence Reports
        </div>
        <h1 className="mt-2 font-heading text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[36px]">
          Executive <span className="text-[#22D3EE]">Reports</span>
        </h1>
        <p className="mt-1.5 max-w-[560px] text-[15px] text-white/55">
          Choose a template to preview a board-ready report, then generate a polished PDF
          powered by live ATHLONIX intelligence.
        </p>

        {loadedAthlete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#00B5FF]/25 bg-[#00B5FF]/[0.06] px-4 py-2.5"
          >
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#00B5FF]/30 to-[#22D3EE]/10 text-[10px] font-bold text-white">
              {loadedAthlete.initials}
            </div>
            <span className="text-[13px] text-white/75">
              Athlete data loaded — <span className="font-medium text-white">{loadedAthlete.name}</span>, {loadedAthlete.club}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Template cards */}
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

      <p className="mt-8 text-[12px] text-white/30">
        Figures are illustrative sample data for the ATHLONIX platform preview.
      </p>
    </main>
  );
}