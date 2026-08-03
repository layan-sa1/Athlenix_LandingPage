import { Fragment, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { EASE, RippleButton, useCountUp } from "../../components/ui-motion";
import {
  CLAIM_STATUS_STYLE,
  CLAIM_STATUSES,
  CLAIMS,
  fraudColor,
} from "../../components/claimData";

const BLUE = "#00B5FF";
const CYAN = "#22D3EE";
const sar = (n) => `SAR ${n.toLocaleString()}`;

/* ══════════════════════ KPI ══════════════════════ */

const KPIS = [
  { label: "Total Claims", value: 342, decimals: 0, delta: "+8.1%", up: true, icon: FileText, spark: [28, 30, 32, 33, 36, 38, 40, 42] },
  { label: "Pending Review", value: 47, decimals: 0, delta: "+5", up: false, icon: ShieldAlert, spark: [30, 33, 35, 38, 40, 43, 45, 47] },
  { label: "Approved Claims", value: 218, decimals: 0, delta: "+12%", up: true, icon: CheckCircle2, spark: [180, 188, 195, 200, 206, 210, 214, 218] },
  { label: "Rejected Claims", value: 31, decimals: 0, delta: "-3", up: true, icon: XCircle, spark: [38, 37, 36, 35, 34, 33, 32, 31] },
];

function Sparkline({ data, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const W = 120, H = 34;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - ((v - min) / (max - min || 1)) * H).toFixed(1)}`).join(" ");
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full" fill="none" preserveAspectRatio="none">
        <motion.polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: EASE }} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

function KpiCard({ k, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const n = useCountUp(k.value, inView, k.decimals);
  const Icon = k.icon;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }} whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] p-6 transition-colors duration-300 hover:border-white/[0.16]"
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(80% 60% at 50% 120%, rgba(0,181,255,0.14), transparent 70%)" }} />
      <div className="relative flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]"><Icon size={16} className="text-[#22D3EE]" /></div>
        <span className={`text-[13px] font-medium ${k.up ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{k.delta}</span>
      </div>
      <p className="relative mt-4 font-heading text-[28px] font-bold leading-none tracking-tight text-white">{n}</p>
      <p className="relative mt-1.5 text-[13px] text-white/55">{k.label}</p>
      <div className="relative mt-3"><Sparkline data={k.spark} color={k.up ? CYAN : "#EF4444"} /></div>
    </motion.div>
  );
}

/* ══════════════════════ PANEL ══════════════════════ */

function Panel({ title, children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: EASE }}
      className={`flex flex-col rounded-2xl border border-white/[0.08] p-6 transition-colors duration-300 hover:border-white/[0.14] ${className}`}
      style={{ background: "rgba(14,20,30,.72)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05)" }}>
      <p className="mb-5 font-heading text-[15px] font-bold tracking-tight text-white">{title}</p>
      <div className="flex-1">{children}</div>
    </motion.section>
  );
}

/* ══════════════════════ ANALYTICS ══════════════════════ */

function SportDonut() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hover, setHover] = useState(null);
  const data = [
    { label: "Football", value: 214, color: "#00B5FF" },
    { label: "Basketball", value: 68, color: "#22D3EE" },
    { label: "Volleyball", value: 34, color: "#8B5CF6" },
    { label: "Tennis", value: 16, color: "#EAB308" },
    { label: "Swimming", value: 10, color: "#22C55E" },
  ];
  const total = data.reduce((a, b) => a + b.value, 0);
  const R = 54, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div ref={ref} className="flex h-full items-center gap-5">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          {data.map((s, i) => {
            const len = (s.value / total) * C;
            const active = hover === i;
            const el = <motion.circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth={active ? 18 : 14}
              strokeDashoffset={-offset} initial={{ strokeDasharray: `0 ${C}` }} animate={inView ? { strokeDasharray: `${len} ${C - len}` } : {}}
              transition={{ duration: 1, ease: EASE }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer", transition: "stroke-width .25s" }} />;
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-heading text-[22px] font-bold leading-none text-white">{hover !== null ? data[hover].value : total}</p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">{hover !== null ? data[hover].label : "claims"}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {data.map((s, i) => (
          <button key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            className={`flex w-full items-center justify-between rounded-lg px-2 py-1 transition-colors ${hover === i ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"}`}>
            <span className="flex items-center gap-2 text-[12px] text-white/70"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}</span>
            <span className="text-[12px] font-medium text-white">{s.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function InjuryBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const data = [
    { label: "Hamstring", value: 88 }, { label: "Knee", value: 64 },
    { label: "Ankle", value: 52 }, { label: "Shoulder", value: 38 },
    { label: "Calf", value: 27 }, { label: "Concussion", value: 14 },
  ];
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-[12px]">
            <span className="text-white/60">{d.label}</span><span className="font-medium text-white/80">{d.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div initial={{ width: 0 }} animate={inView ? { width: `${(d.value / max) * 100}%` } : {}}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-[#00B5FF] to-[#22D3EE]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyLine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const series = [24, 28, 26, 32, 30, 36, 34, 38];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const W = 300, H = 130, max = 45;
  const line = series.map((v, i) => `${((i / (series.length - 1)) * W).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[130px] w-full" fill="none" preserveAspectRatio="none">
        <defs><linearGradient id="ml" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity="0.28" /><stop offset="100%" stopColor={BLUE} stopOpacity="0" /></linearGradient></defs>
        <motion.polygon points={area} fill="url(#ml)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.5 }} />
        <motion.polyline points={line} stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, ease: EASE }} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-white/35">{months.map((m) => <span key={m}>{m}</span>)}</div>
    </div>
  );
}

function StatusStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const seg = [
    { label: "Approved", value: 218, color: "#22C55E" },
    { label: "Pending", value: 47, color: "#EAB308" },
    { label: "Investigating", value: 28, color: "#22D3EE" },
    { label: "Paid", value: 18, color: "#8B5CF6" },
    { label: "Rejected", value: 31, color: "#EF4444" },
  ];
  const total = seg.reduce((a, b) => a + b.value, 0);
  return (
    <div ref={ref} className="flex h-full flex-col justify-center">
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {seg.map((s, i) => (
          <motion.div key={s.label} initial={{ width: 0 }} animate={inView ? { width: `${(s.value / total) * 100}%` } : {}}
            transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }} style={{ background: s.color }} />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {seg.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] text-white/65"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />{s.label}</span>
            <span className="text-[12px] font-medium text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ EXPANDABLE ROW ══════════════════════ */

const TIMELINE_STAGES = ["Submitted", "Medical Review", "Insurance Assessment", "AI Analysis", "Approval", "Payment", "Completed"];

function stageIndex(status) {
  switch (status) {
    case "Pending Review": return 1;
    case "Under Investigation": return 2;
    case "Approved": return 4;
    case "Paid": return 6;
    case "Rejected": return 3;
  }
}

function ClaimRow({ c, i, onView }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.tr initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.45, delay: i * 0.04, ease: EASE }} onClick={() => setOpen((v) => !v)}
        className="cursor-pointer border-t border-white/[0.05] text-[13px] transition-colors hover:bg-white/[0.03]">
        <td className="whitespace-nowrap px-5 py-4 font-medium text-white">{c.id}</td>
        <td className="whitespace-nowrap px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#00B5FF]/25 to-[#22D3EE]/10 text-[11px] font-bold text-white">{c.initials}</div>
            <span className="text-white">{c.athlete}</span>
          </div>
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-white/65">{c.club}</td>
        <td className="whitespace-nowrap px-5 py-4 text-white/65">{c.injuryDetail}</td>
        <td className="whitespace-nowrap px-5 py-4 text-white/80">{sar(c.amount)}</td>
        <td className="whitespace-nowrap px-5 py-4 text-white/60">{c.date}</td>
        <td className="whitespace-nowrap px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${CLAIM_STATUS_STYLE[c.status]}`}>{c.status}</span></td>
        <td className="whitespace-nowrap px-5 py-4">
          <button onClick={(e) => { e.stopPropagation(); onView(); }} className="text-[12px] font-medium text-[#22D3EE] hover:opacity-80">View Details</button>
        </td>
      </motion.tr>

      <AnimatePresence>
        {open && (
          <tr>
            <td colSpan={8} className="p-0">
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
                <div className="grid gap-6 border-t border-white/[0.05] bg-white/[0.02] px-5 py-6 lg:grid-cols-[1.4fr_1fr]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Athlete" value={c.athlete} />
                    <Field label="Club" value={c.club} />
                    <Field label="Injury Details" value={c.injuryDetail} />
                    <Field label="Coverage Status" value={`${c.coveragePct}% covered`} />
                    <Field label="Coverage Amount" value={sar(c.amount)} />
                    <Field label="Approved Compensation" value={sar(Math.round(c.amount * c.coveragePct / 100))} />
                    <div className="sm:col-span-2">
                      <p className="text-[11px] uppercase tracking-[0.1em] text-white/40">Medical Report Summary</p>
                      <p className="mt-1 text-[13px] text-white/70">{c.medical}</p>
                    </div>
                    <div className="sm:col-span-2 flex flex-wrap gap-1.5">
                      {["Medical report.pdf", "Imaging scan.pdf", "Club statement.pdf"].map((d) => (
                        <span key={d} className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/55"><FileText size={11} /> {d}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Fraud risk */}
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] text-white/55"><ShieldAlert size={13} /> Fraud Risk Score</span>
                        <span className="text-[14px] font-bold" style={{ color: fraudColor(c.fraudRisk) }}>{c.fraudRisk}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${c.fraudRisk}%` }} transition={{ duration: 0.9, ease: EASE }}
                          className="h-full rounded-full" style={{ background: fraudColor(c.fraudRisk) }} />
                      </div>
                    </div>
                    {/* AI rec */}
                    <div className="rounded-xl border border-[#00B5FF]/20 bg-[#00B5FF]/[0.06] p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#4FC9FF]"><Sparkles size={12} /> AI Recommendation</p>
                      <p className="mt-1.5 text-[13px] text-white/75">{c.insight}</p>
                    </div>
                    <MiniTimeline status={c.status} />
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

function MiniTimeline({ status }) {
  const active = stageIndex(status);
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.1em] text-white/40">Claim Timeline</p>
      <div className="space-y-0">
        {TIMELINE_STAGES.map((s, i) => {
          const done = i <= active;
          return (
            <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }} className="flex gap-3 pb-3 last:pb-0">
              <div className="flex flex-col items-center">
                <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${done ? "bg-[#00B5FF]" : "bg-white/15"}`} />
                {i < TIMELINE_STAGES.length - 1 && <span className={`w-px flex-1 ${done ? "bg-[#00B5FF]/40" : "bg-white/[0.08]"}`} />}
              </div>
              <p className={`pb-0.5 text-[12px] ${done ? "text-white/80" : "text-white/35"}`}>{s}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return <div><p className="text-[11px] uppercase tracking-[0.1em] text-white/40">{label}</p><p className="mt-1 text-[13px] font-medium text-white/80">{value}</p></div>;
}

/* ══════════════════════ SLIDE-OVER ══════════════════════ */

function SlideOver({ c, onClose }) {
  const active = stageIndex(c.status);
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className="relative z-10 flex h-full w-full max-w-[460px] flex-col overflow-y-auto border-l border-white/[0.1]" style={{ background: "rgba(12,18,26,.96)" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(0,181,255,0.16)" }} />
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0c121a]/90 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#00B5FF]/30 to-[#22D3EE]/10 text-[13px] font-bold text-white">{c.initials}</div>
            <div><p className="font-heading text-[16px] font-bold tracking-tight text-white">{c.id}</p><p className="text-[12px] text-white/45">{c.athlete} · {c.club}</p></div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] text-white/50 transition-colors hover:text-white"><X size={16} /></button>
        </div>

        <div className="relative space-y-6 px-6 py-6">
          <div className="flex items-center justify-between">
            <span className={`rounded-full border px-3 py-1 text-[12px] font-medium ${CLAIM_STATUS_STYLE[c.status]}`}>{c.status}</span>
            <span className="text-[12px] text-white/45">{c.date}</span>
          </div>

          <Section title="Full Medical Report"><p className="text-[13px] leading-relaxed text-white/70">{c.medical}</p></Section>

          <Section title="Coverage Details">
            <Row2 label="Injury" value={c.injuryDetail} />
            <Row2 label="Coverage Status" value={`${c.coveragePct}%`} />
            <Row2 label="Coverage Amount" value={sar(c.amount)} />
            <Row2 label="Approved Compensation" value={sar(Math.round(c.amount * c.coveragePct / 100))} />
          </Section>

          <Section title="Previous Claims"><Row2 label="Lifetime claims" value={`${c.prevClaims}`} /></Section>

          <Section title="Timeline">
            <div className="space-y-0">
              {TIMELINE_STAGES.map((s, i) => {
                const done = i <= active;
                return (
                  <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="flex gap-3 pb-3.5 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className={`mt-0.5 grid h-4 w-4 place-items-center rounded-full ${done ? "bg-[#00B5FF]" : "border border-white/20 bg-transparent"}`}>
                        {done && <CheckCircle2 size={10} className="text-white" />}
                      </span>
                      {i < TIMELINE_STAGES.length - 1 && <span className={`w-px flex-1 ${done ? "bg-[#00B5FF]/40" : "bg-white/[0.08]"}`} style={{ minHeight: 14 }} />}
                    </div>
                    <p className={`text-[13px] ${done ? "text-white/80" : "text-white/35"}`}>{s}</p>
                  </motion.div>
                );
              })}
            </div>
          </Section>

          <Section title="AI Risk Analysis">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/55">Fraud risk score</span>
                <span className="text-[16px] font-bold" style={{ color: fraudColor(c.fraudRisk) }}>{c.fraudRisk}/100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.fraudRisk}%` }} transition={{ duration: 1, ease: EASE }} className="h-full rounded-full" style={{ background: fraudColor(c.fraudRisk) }} />
              </div>
              <p className="mt-3 text-[13px] text-white/70">{c.insight}</p>
            </div>
          </Section>

          <Section title="Insurance Decision">
            <div className={`flex items-center gap-2 rounded-xl border p-3.5 ${c.fraudRisk > 60 ? "border-[#EF4444]/20 bg-[#EF4444]/[0.06]" : "border-[#22C55E]/20 bg-[#22C55E]/[0.06]"}`}>
              {c.fraudRisk > 60 ? <AlertTriangle size={16} className="text-[#EF4444]" /> : <CheckCircle2 size={16} className="text-[#22C55E]" />}
              <span className="text-[13px] font-medium text-white">{c.fraudRisk > 60 ? "Manual verification required" : "Eligible for approval"}</span>
            </div>
          </Section>
        </div>

        <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2 border-t border-white/[0.08] bg-[#0c121a]/90 p-4 backdrop-blur-xl">
          <RippleButton className="justify-center rounded-full bg-[#22C55E] py-3 text-[13px] font-semibold text-white"><CheckCircle2 size={14} /> Approve</RippleButton>
          <RippleButton className="justify-center rounded-full bg-[#EF4444] py-3 text-[13px] font-semibold text-white"><XCircle size={14} /> Reject</RippleButton>
          <RippleButton className="justify-center rounded-full border border-white/[0.15] py-2.5 text-[12px] font-medium text-white">Request Docs</RippleButton>
          <RippleButton className="justify-center rounded-full border border-white/[0.15] py-2.5 text-[12px] font-medium text-white"><Download size={13} /> Report</RippleButton>
        </div>
      </motion.aside>
    </motion.div>
  );
}
function Section({ title, children }) {
  return <div><p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-white/40">{title}</p><div className="space-y-2.5">{children}</div></div>;
}
function Row2({ label, value }) {
  return <div className="flex items-center justify-between"><span className="text-[13px] text-white/50">{label}</span><span className="text-[13px] font-medium text-white/85">{value}</span></div>;
}

/* ══════════════════════ AI PANEL ══════════════════════ */

function AIPanel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const points = [
    "7 claims require urgent review",
    "2 claims show unusual injury patterns",
    "AI generated new coverage recommendations",
    "One claim requires manual verification",
  ];
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border border-[#00B5FF]/25 p-6 lg:p-8" style={{ background: "rgba(0,181,255,0.05)" }}>
      <motion.div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(0,181,255,0.2)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#00B5FF]/30 bg-[#00B5FF]/10">
              <Brain size={19} className="text-[#22D3EE]" /><span className="absolute inset-0 rounded-2xl border border-[#00B5FF]/40 motion-safe:animate-ping" />
            </div>
            <div><p className="font-heading text-[16px] font-bold tracking-tight text-white">AI Claims Intelligence</p><p className="text-[12px] text-white/45">Today's summary · model v4.2</p></div>
          </div>
          <div className="mt-5 space-y-3">
            {points.map((t, i) => (
              <motion.div key={t} initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" /><span className="text-[14px] text-white/85">{t}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Estimated Coverage Impact</p>
            <p className="mt-2 font-heading text-[28px] font-bold tracking-tight text-white">SAR 428,000</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/40">Recommended Action</p>
            <p className="mt-2 text-[14px] leading-snug text-white/85">Review AI-generated claim recommendations before final approval.</p>
            <RippleButton className="mt-4 w-full justify-center rounded-full bg-[#00B5FF] py-3 text-[13px] font-semibold text-white shadow-[0_16px_40px_-16px_rgba(0,181,255,0.7)]"><Sparkles size={15} /> View AI Recommendations</RippleButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLAIMS.filter((c) => {
      const mq = !q || [c.id, c.athlete, c.club, c.injuryDetail].some((f) => f.toLowerCase().includes(q));
      const ms = status === "All" || c.status === status;
      return mq && ms;
    });
  }, [query, status]);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-heading text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[38px]">Claims Management</h1>
          <p className="mt-2 max-w-[600px] text-[15px] leading-relaxed text-white/55">Review, process and manage insurance claims submitted by insured sports clubs.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-300"
            style={{ borderColor: focused ? "rgba(0,181,255,0.5)" : "rgba(255,255,255,0.08)", background: "rgba(14,20,30,.6)", boxShadow: focused ? "0 0 0 4px rgba(0,181,255,0.1)" : "none" }}>
            <Search size={15} className={focused ? "text-[#22D3EE]" : "text-white/40"} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              placeholder="Search claims…" className="w-40 bg-transparent text-[13px] text-white placeholder:text-white/35 focus:outline-none" />
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.02] px-3.5 py-2 text-[13px] text-white/70"><Filter size={14} /> Filter</button>
          <RippleButton className="rounded-full border border-white/[0.15] px-4 py-2 text-[13px] font-medium text-white"><Download size={14} /> Export</RippleButton>
          <RippleButton className="rounded-full bg-[#00B5FF] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_16px_40px_-16px_rgba(0,181,255,0.7)]"><Plus size={15} /> New Claim</RippleButton>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{KPIS.map((k, i) => <KpiCard key={k.label} k={k} i={i} />)}</div>

      {/* Analytics */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <Panel title="Claims by Sport"><SportDonut /></Panel>
        <Panel title="Claims by Injury Type" delay={0.06}><InjuryBars /></Panel>
        <Panel title="Monthly Claims" delay={0.12}><MonthlyLine /></Panel>
        <Panel title="Status Distribution" delay={0.18}><StatusStack /></Panel>
      </div>

      {/* Filters + table */}
      <div className="mt-5 rounded-2xl border border-white/[0.08]" style={{ background: "rgba(14,20,30,.72)" }}>
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-5 py-4">
          <span className="text-[11px] uppercase tracking-[0.1em] text-white/35">Status</span>
          {["All", ...CLAIM_STATUSES].map((o) => (
            <button key={o} onClick={() => setStatus(o)}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${status === o ? "border-[#00B5FF]/40 bg-[#00B5FF]/12 text-white" : "border-white/[0.08] text-white/50 hover:text-white"}`}>{o}</button>
          ))}
          <span className="ml-auto text-[12px] text-white/40">{filtered.length} of {CLAIMS.length} claims</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl border border-white/[0.08] bg-white/[0.02]"><Search size={26} className="text-white/30" /></div>
            <p className="mt-5 font-heading text-[17px] font-bold text-white">No claims match your filters</p>
            <p className="mt-1.5 max-w-[320px] text-[13px] text-white/45">Try a different search term or status.</p>
            <RippleButton onClick={() => { setQuery(""); setStatus("All"); }} className="mt-6 rounded-full border border-white/[0.15] px-5 py-2.5 text-[13px] font-medium text-white">Clear filters</RippleButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead><tr className="text-[11px] uppercase tracking-[0.1em] text-white/40">
                {["Claim ID", "Athlete", "Club", "Injury Type", "Coverage Amount", "Submitted", "Status", "Actions"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr></thead>
              <tbody>{filtered.map((c, i) => <Fragment key={c.id}><ClaimRow c={c} i={i} onView={() => setDetail(c)} /></Fragment>)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI panel */}
      <div className="mt-5"><AIPanel /></div>

      <p className="mt-8 text-[12px] text-white/30">Figures are illustrative sample data for the ATHLONIX platform preview.</p>

      <AnimatePresence>{detail && <SlideOver c={detail} onClose={() => setDetail(null)} />}</AnimatePresence>
    </main>
  );
}