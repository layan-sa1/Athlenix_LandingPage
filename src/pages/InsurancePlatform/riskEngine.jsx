import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  Activity,
  Zap,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Bell,
  Download,
  User,
  CheckCircle2,
  ChevronRight,
  Info,
  HeartPulse,
  Layers,
  FileText,
  Sliders
} from "lucide-react";

// ============================================================================
// INITIAL ATHLETE MOCK DATA
// ============================================================================

const initialAthlete = {
  name: "Alexander Vance",
  club: "Real Madrid CF",
  sport: "Football (Soccer)",
  age: 26,
  position: "Full Back / Winger",
  height: "182 cm",
  weight: "77 kg",
  contractValue: 12500000,
  trainingLoad: 78,
  recoveryStatus: 85,
  matchesPerMonth: 6,
  currentInjury: "High Ankle Sprain (Grade 1)",
  previousInjuries: ["Hamstring Strain (2023)", "ACL Reconstruction (2024)"],
  medicalHistory: "Clean cardiac screening. Prior knee ligament repair recovery completed properly, requiring routine monitoring."
};

// ============================================================================
// HELPER: ANIMATED NUMBER COUNTER
// ============================================================================

const AnimatedNumber = ({ value, prefix = "", suffix = "", format = false }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formattedStr = format ? displayValue.toLocaleString() : displayValue.toString();

  return (
    <span>
      {prefix}
      {formattedStr}
      {suffix}
    </span>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Dashboard() {
  const [formData, setFormData] = useState(initialAthlete);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Dynamic Risk & Financial Calculation Algorithm
  const calculateMetrics = (data) => {
    const baseRisk = 35;
    const loadFactor = (data.trainingLoad / 100) * 25;
    const recoveryFactor = ((100 - data.recoveryStatus) / 100) * 20;
    const matchFactor = (data.matchesPerMonth / 10) * 15;
    const injuryFactor = data.previousInjuries.length * 5;

    const rawScore = Math.min(Math.round(baseRisk + loadFactor + recoveryFactor + matchFactor + injuryFactor), 98);

    let level = "Low";
    if (rawScore > 75) level = "Critical";
    else if (rawScore > 58) level = "High";
    else if (rawScore > 40) level = "Medium";

    const premiumRate = rawScore * 0.0018;
    const basePremium = Math.round(data.contractValue * premiumRate);
    const financialExposure = Math.round(data.contractValue * (rawScore / 100) * 1.35);
    const recommendedCoverage = Math.round(data.contractValue * 0.85);

    return {
      score: rawScore,
      level,
      premium: basePremium,
      exposure: financialExposure,
      coverage: recommendedCoverage,
      confidence: 96.4
    };
  };

  const currentMetrics = calculateMetrics(formData);

  // Dynamic AI Assessment Sequence Trigger
  const handleRunAssessment = () => {
    setIsProcessing(true);
    setProcessingStep(0);

    const steps = [
      "Initializing Neural Underwriting Model...",
      "Parsing Biometric & Medical History Records...",
      "Analyzing Historical Ligament Stress Patterns...",
      "Computing Training Load vs Recovery Ratios...",
      "Estimating Maximum Claim Financial Exposure...",
      "Finalizing Policy Premium & Rider Options..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setProcessingStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
        }, 400);
      }
    }, 600);
  };

  const handleReset = () => {
    setFormData(initialAthlete);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "rgba(16,185,129,0.2)" };
      case "Medium":
        return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "rgba(245,158,11,0.2)" };
      case "High":
        return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", glow: "rgba(249,115,22,0.2)" };
      case "Critical":
        return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", glow: "rgba(244,63,94,0.25)" };
    }
  };

  const riskColors = getRiskColor(currentMetrics.level);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 pb-16">
      
      {/* BACKGROUND GRAPHICS & GLASS AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent blur-[140px]" />
        <div className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-indigo-600/10 via-purple-600/5 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5"/> ATHLONIX Underwriting v4.2
              </span>
              <span className="text-xs text-slate-400">Enterprise Insurance Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Risk Engine <span className="text-xs font-normal px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">AI Core</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Analyze athlete biometric telemetry, calculate financial risk exposure, and generate high-precision AI policy underwriting recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input
                type="text"
                placeholder="Search Athlete or Policy ID..."
                className="w-64 bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
            </div>

            <button className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all relative">
              <Bell className="w-4 h-4"/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium">
              <Download className="w-3.5 h-3.5 text-cyan-400"/>
              <span>Export</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1" />

            <div className="flex items-center gap-3 pl-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/10">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400"/>
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">Dr. Marcus Vance</p>
                <p className="text-[10px] text-slate-400">Chief Risk Officer</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: RISK ASSESSMENT FORM (5 COLS) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Sliders className="w-4 h-4"/>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Athlete Telemetry & Inputs</h2>
                  <p className="text-xs text-slate-400">Adjust parameters for live AI recalculation</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5"/>
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Athlete Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Club / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Sport
                  </label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    <option>Football (Soccer)</option>
                    <option>Basketball</option>
                    <option>American Football</option>
                    <option>Rugby</option>
                    <option>Tennis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Height / Weight
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-1/2 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200"
                    />
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-1/2 bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Insured Contract Value ($ USD)
                  </label>
                  <input
                    type="number"
                    value={formData.contractValue}
                    step={500000}
                    onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-cyan-400 font-mono font-semibold focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* SLIDERS FOR REAL-TIME SIMULATION */}
              <div className="pt-3 pb-2 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5"/> Dynamic Stress Simulation
                  </span>
                  <span className="text-[10px] text-slate-400">Live Feedback Enabled</span>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300 font-medium">Weekly Training Load</span>
                    <span className="font-mono text-cyan-400 font-bold">{formData.trainingLoad}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={formData.trainingLoad}
                    onChange={(e) => setFormData({ ...formData, trainingLoad: Number(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300 font-medium">Recovery & Biomarker Score</span>
                    <span className="font-mono text-emerald-400 font-bold">{formData.recoveryStatus}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={formData.recoveryStatus}
                    onChange={(e) => setFormData({ ...formData, recoveryStatus: Number(e.target.value) })}
                    className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300 font-medium">Match Intensity Frequency</span>
                    <span className="font-mono text-indigo-400 font-bold">{formData.matchesPerMonth} matches/mo</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={formData.matchesPerMonth}
                    onChange={(e) => setFormData({ ...formData, matchesPerMonth: Number(e.target.value) })}
                    className="w-full accent-indigo-400 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Active Injury / Strain Status
                  </label>
                  <input
                    type="text"
                    value={formData.currentInjury}
                    onChange={(e) => setFormData({ ...formData, currentInjury: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-rose-300 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Medical History Notes & Clinical Records
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <motion.button
                  whileHover={{ scale: 1.015, boxShadow: "0 0 25px rgba(6,182,212,0.35)" }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleRunAssessment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950"/>
                  <span>{isProcessing ? "Analyzing Telemetry..." : "Run Deep AI Assessment"}</span>
                </motion.button>
              </div>

            </div>
          </motion.div>

          {/* RIGHT PANEL: LIVE AI ANALYSIS & DASHBOARD (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* AI PROCESSING OVERLAY */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900/90 border border-cyan-500/40 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl relative overflow-hidden z-30 min-h-[420px] flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute inset-2 rounded-full bg-cyan-500/10 flex items-center justify-center backdrop-blur-sm">
                      <Activity className="w-8 h-8 text-cyan-400 animate-pulse"/>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">AI Neural Engine Active</h3>
                  <p className="text-xs text-slate-400 max-w-md mb-6">
                    Synthesizing 14,000+ historical sports injury datapoints against real-time biometric telemetry.
                  </p>

                  <div className="w-full max-w-md space-y-2.5 text-left bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                    {[
                      "Initializing Neural Underwriting Model...",
                      "Parsing Biometric & Medical History Records...",
                      "Analyzing Historical Ligament Stress Patterns...",
                      "Computing Training Load vs Recovery Ratios...",
                      "Estimating Maximum Claim Financial Exposure...",
                      "Finalizing Policy Premium & Rider Options..."
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        {idx < processingStep ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/>
                        ) : idx === processingStep ? (
                          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className={idx === processingStep ? "text-cyan-300 font-semibold" : idx < processingStep ? "text-slate-300" : "text-slate-600"}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isProcessing && (
              <>
                {/* METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* CIRCULAR RISK SCORE GAUGE */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between relative overflow-hidden"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400"/> Overall Risk Index
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${riskColors.bg} ${riskColors.text} ${riskColors.border}`}>
                        {currentMetrics.level} Risk
                      </span>
                    </div>

                    <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-slate-800"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="stroke-cyan-400"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * currentMetrics.score) / 100 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                          fill="transparent"
                          style={{
                            filter: `drop-shadow(0 0 8px ${riskColors.glow})`
                          }}
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                          <AnimatedNumber value={currentMetrics.score} />
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                          / 100 Index
                        </span>
                      </div>
                    </div>

                    <div className="w-full pt-3 border-t border-slate-800/80">
                      <div className="flex justify-between items-center text-[11px] mb-1">
                        <span className="text-slate-400">AI Model Confidence</span>
                        <span className="font-mono text-cyan-400 font-bold">{currentMetrics.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentMetrics.confidence}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* FINANCIAL EXPOSURE SUMMARY */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-7 bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400"/> AI Coverage Recommendation
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Annual Rate</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Recommended Coverage Plan
                        </p>
                        <p className="text-2xl font-extrabold text-cyan-400 font-mono">
                          <AnimatedNumber format prefix="$" value={currentMetrics.premium} />
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-cyan-400"/> Adjusted for risk load
                        </p>
                        <p className="text-[9px] text-cyan-500/70 mt-1 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5"/> Generated automatically by ATHLONIX AI
                        </p>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Estimated Coverage Exposure
                        </p>
                        <p className="text-2xl font-extrabold text-rose-400 font-mono">
                          <AnimatedNumber format prefix="$" value={currentMetrics.exposure} />
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400"/> Projected max loss
                        </p>
                        <p className="text-[9px] text-cyan-500/70 mt-1 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5"/> Generated automatically by ATHLONIX AI
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-slate-400">Recommended Coverage Level</span>
                        <span className="text-[9px] text-cyan-500/70 mt-0.5 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5"/> Generated automatically by ATHLONIX AI
                        </span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">
                        <AnimatedNumber format prefix="$" value={currentMetrics.coverage} />
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* DETAILED AI RISK BREAKDOWN */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-cyan-400"/> Telemetry Risk Factor Analysis
                    </h3>
                    <span className="text-[10px] text-slate-500">Real-time Biometric Stream</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                        <Activity className="w-4 h-4"/>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Joint & Ligament Fatigue</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Prior ACL Reconstruction combined with {formData.matchesPerMonth} matches/month increases localized joint fatigue probability by 18%.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                        <Zap className="w-4 h-4"/>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Training Load Balance</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Current load factor ({formData.trainingLoad}%) is well compensated by recovery status ({formData.recoveryStatus}%). Optimal window maintained.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDATION BANNER */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-cyan-400 shrink-0"/>
                      <p className="text-xs text-slate-300">
                        <strong className="text-white">AI Coverage Insight:</strong> ATHLONIX AI automatically generated this recommendation to append a Soft Tissue Injury Exclusion Rider for the initial 90 days, based on the athlete's risk profile.
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shrink-0">
                      Review AI Recommendation
                    </button>
                  </div>
                </motion.div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}