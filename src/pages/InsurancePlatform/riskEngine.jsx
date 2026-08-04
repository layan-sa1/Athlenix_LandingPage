import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
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
  Sliders,
  Calendar,
  Layers,
  FileText
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

export default function RiskEngine() {
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
        return { text: "text-[#34d399]", bg: "bg-[#064e3b]/30", border: "border-[#059669]/40", stroke: "#10b981", glow: "rgba(16, 185, 129, 0.3)" };
      case "Medium":
        return { text: "text-[#fbbf24]", bg: "bg-[#78350f]/30", border: "border-[#d97706]/40", stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)" };
      case "High":
        return { text: "text-[#f87171]", bg: "bg-[#7f1d1d]/30", border: "border-[#dc2626]/40", stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.35)" };
      case "Critical":
        return { text: "text-[#f43f5e]", bg: "bg-[#881337]/40", border: "border-[#e11d48]/50", stroke: "#f43f5e", glow: "rgba(244, 63, 94, 0.4)" };
      default:
        return { text: "text-[#3b82f6]", bg: "bg-[#1e3a8a]/30", border: "border-[#2563eb]/40", stroke: "#3b82f6", glow: "rgba(59, 130, 246, 0.3)" };
    }
  };

  const riskColors = getRiskColor(currentMetrics.level);

  return (
    <div className="min-h-screen bg-[#030712] text-[#f3f4f6] font-sans antialiased selection:bg-[#2563eb] selection:text-white pb-16">
      
      {/* DEEP DASHBOARD AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[25%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#1e3a8a]/15 via-[#0284c7]/5 to-transparent blur-[160px]" />
        <div className="absolute top-[45%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-[#1d4ed8]/10 via-[#312e81]/5 to-transparent blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* TOP NAVBAR (MATCHING DASHBOARD CONTROL BAR EXACTLY) */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 mb-8 border-b border-[#1f293d]/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                Insurance <span className="text-[#3b82f6]">Control Center</span>
              </span>
            </div>
            <p className="text-xs text-[#9ca3af] tracking-wide">
              Monitor insurance policies, claims, AI recommendations and risk parameters across all sports assets.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            {/* Dashboard Search Input Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]"/>
              <input
                type="text"
                placeholder="Search policies..."
                className="w-56 bg-[#0b0f19] border border-[#1f293d] rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#3b82f6] transition-all shadow-inner"
              />
            </div>

            {/* Dashboard Icon Buttons */}
            <button className="p-2 rounded-full bg-[#0b0f19] border border-[#1f293d] hover:border-[#374151] text-[#9ca3af] hover:text-white transition-all relative">
              <Bell className="w-3.5 h-3.5"/>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            </button>

            {/* Dashboard User Avatar Badge */}
            <div className="w-8 h-8 rounded-full bg-[#2563eb] font-bold text-xs flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              AD
            </div>

            {/* Dashboard Date Range Pill Button */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b0f19] border border-[#1f293d] hover:border-[#374151] text-[#d1d5db] transition-all text-xs font-medium">
              <Calendar className="w-3 h-3 text-[#3b82f6]"/>
              <span>Jun 23 – Sept 23</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD PAGE TITLE BAR */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              Risk Engine <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1e293b] text-[#93c5fd] border border-[#334155]">Underwriting AI</span>
            </h1>
            <p className="text-xs text-[#9ca3af] mt-1">
              Real-time biometric stress model, policy claim exposure, and algorithmic underwriting engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9ca3af] hover:text-white bg-[#0b0f19] border border-[#1f293d] hover:border-[#374151] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5"/>
              <span>Reset Values</span>
            </button>
          </div>
        </div>

        {/* MAIN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: ATHLETE INPUTS FORM (5 COLS - DASHBOARD GLASS PANEL) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-5 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1f293d]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#1e3a8a]/40 border border-[#2563eb]/30 text-[#60a5fa]">
                  <Sliders className="w-4 h-4"/>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Athlete Telemetry & Inputs</h2>
                  <p className="text-[11px] text-[#6b7280]">Real-time underwriting parameter controls</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Athlete Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Club / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Sport
                  </label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
                  >
                    <option>Football (Soccer)</option>
                    <option>Basketball</option>
                    <option>American Football</option>
                    <option>Rugby</option>
                    <option>Tennis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Height / Weight
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-1/2 bg-[#030712] border border-[#1f293d] rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-1/2 bg-[#030712] border border-[#1f293d] rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Insured Contract Value ($ USD)
                  </label>
                  <input
                    type="number"
                    value={formData.contractValue}
                    step={500000}
                    onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-1.5 text-xs text-[#60a5fa] font-mono font-bold focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>
              </div>

              {/* DYNAMIC STRESS SIMULATION SLIDERS */}
              <div className="p-3.5 rounded-lg bg-[#030712]/90 border border-[#1f293d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f293d] pb-2">
                  <span className="text-[11px] font-bold text-[#60a5fa] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5"/> Dynamic Stress Simulation
                  </span>
                  <span className="text-[10px] text-[#6b7280]">Live Feedback</span>
                </div>

                {/* Training Load Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[#d1d5db] font-medium">Weekly Training Load</span>
                    <span className="font-mono text-[#60a5fa] font-bold">{formData.trainingLoad}%</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={formData.trainingLoad}
                      onChange={(e) => setFormData({ ...formData, trainingLoad: Number(e.target.value) })}
                      className="w-full h-1.5 bg-[#1f293d] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
                    />
                  </div>
                </div>

                {/* Recovery Score Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[#d1d5db] font-medium">Recovery & Biomarker Score</span>
                    <span className="font-mono text-[#34d399] font-bold">{formData.recoveryStatus}%</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={formData.recoveryStatus}
                      onChange={(e) => setFormData({ ...formData, recoveryStatus: Number(e.target.value) })}
                      className="w-full h-1.5 bg-[#1f293d] rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                  </div>
                </div>

                {/* Match Frequency Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-[#d1d5db] font-medium">Match Intensity Frequency</span>
                    <span className="font-mono text-[#818cf8] font-bold">{formData.matchesPerMonth} matches/mo</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={formData.matchesPerMonth}
                      onChange={(e) => setFormData({ ...formData, matchesPerMonth: Number(e.target.value) })}
                      className="w-full h-1.5 bg-[#1f293d] rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Active Injury / Strain Status
                  </label>
                  <input
                    type="text"
                    value={formData.currentInjury}
                    onChange={(e) => setFormData({ ...formData, currentInjury: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-[#f87171] focus:outline-none focus:border-[#3b82f6] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">
                    Medical History Notes & Clinical Records
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full bg-[#030712] border border-[#1f293d] rounded-lg px-3 py-2 text-xs text-[#d1d5db] focus:outline-none focus:border-[#3b82f6] transition-all resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleRunAssessment}
                  disabled={isProcessing}
                  className="w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#2563eb] to-[#0284c7] hover:from-[#1d4ed8] hover:to-[#0369a1] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer border border-[#3b82f6]/40"
                >
                  <Sparkles className="w-4 h-4 text-white"/>
                  <span>{isProcessing ? "Analyzing Telemetry..." : "Run AI Assessment"}</span>
                </motion.button>
              </div>

            </div>
          </motion.div>

          {/* RIGHT PANEL: LIVE AI ANALYSIS & RISK KNOWLEDGE (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* AI PROCESSING OVERLAY */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#0b0f19] border border-[#3b82f6]/50 backdrop-blur-xl rounded-xl p-8 shadow-2xl relative z-30 min-h-[440px] flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-20 h-20 mb-5">
                    <div className="absolute inset-0 rounded-full border-2 border-[#3b82f6]/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#3b82f6] animate-spin" style={{ animationDuration: '5s' }} />
                    <div className="absolute inset-2 rounded-full bg-[#1e3a8a]/30 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[#60a5fa] animate-pulse"/>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">AI Neural Engine Running</h3>
                  <p className="text-xs text-[#9ca3af] max-w-md mb-6">
                    Synthesizing biometric parameters and historical risk claims models.
                  </p>

                  <div className="w-full max-w-md space-y-2 text-left bg-[#030712] p-4 rounded-lg border border-[#1f293d]">
                    {[
                      "Initializing Neural Underwriting Model...",
                      "Parsing Biometric & Medical History Records...",
                      "Analyzing Historical Ligament Stress Patterns...",
                      "Computing Training Load vs Recovery Ratios...",
                      "Estimating Maximum Claim Financial Exposure...",
                      "Finalizing Policy Premium & Rider Options..."
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs">
                        {idx < processingStep ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399] shrink-0"/>
                        ) : idx === processingStep ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#374151] shrink-0" />
                        )}
                        <span className={idx === processingStep ? "text-[#60a5fa] font-semibold" : idx < processingStep ? "text-[#d1d5db]" : "text-[#4b5563]"}>
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
                {/* METRICS ROW (MATCHES COVERAGE DISTRIBUTION & ANALYTICS CARDS EXACTLY) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* RISK SCORE CARD (WITH GAUGE ACCENT MATCHING DASHBOARD BLUE DONUT) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="md:col-span-5 bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-5 shadow-xl flex flex-col items-center justify-between relative overflow-hidden"
                  >
                    <div className="w-full flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#3b82f6]"/> Risk Score
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${riskColors.bg} ${riskColors.text} ${riskColors.border}`}>
                        {currentMetrics.level} Risk
                      </span>
                    </div>

                    <div className="relative w-40 h-40 my-3 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          className="stroke-[#111827]"
                          strokeWidth="7"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={riskColors.stroke}
                          strokeWidth="7"
                          strokeDasharray={238.7}
                          initial={{ strokeDashoffset: 238.7 }}
                          animate={{ strokeDashoffset: 238.7 - (238.7 * currentMetrics.score) / 100 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                          fill="transparent"
                          style={{
                            filter: `drop-shadow(0 0 6px ${riskColors.glow})`
                          }}
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                          <AnimatedNumber value={currentMetrics.score} />
                        </span>
                        <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider mt-0.5">
                          / 100 Risk Score
                        </span>
                      </div>
                    </div>

                    <div className="w-full pt-3 border-t border-[#1f293d]">
                      <div className="flex justify-between items-center text-[11px] mb-1.5">
                        <span className="text-[#9ca3af]">AI Coverage Recommendation Confidence</span>
                        <span className="font-mono text-[#60a5fa] font-bold">{currentMetrics.confidence}%</span>
                      </div>
                      <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-[#2563eb] h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentMetrics.confidence}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* FINANCIAL METRICS GRID (MATCHES DASHBOARD TOP STATS TILES) */}
                  <div className="md:col-span-7 grid grid-cols-1 gap-4">
                    
                    {/* FINANCIAL EXPOSURE TILE */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-4 shadow-xl relative"
                    >
                      <div className="flex items-center justify-between text-[#9ca3af] text-xs mb-1">
                        <span className="font-medium flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-[#3b82f6]"/> Estimated Financial Exposure
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#93c5fd] font-medium border border-[#334155]">
                          Max Claim Potential
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white font-mono tracking-tight mt-1">
                        USD <AnimatedNumber value={currentMetrics.exposure} format={true} />
                      </div>
                      <p className="text-[11px] text-[#6b7280] mt-1">
                        Calculated probability model based on current injury status & contract magnitude.
                      </p>
                    </motion.div>

                    {/* RECOMMENDED COVERAGE & PREMIUM GRID */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-4 shadow-xl"
                      >
                        <div className="text-[11px] text-[#9ca3af] font-medium mb-1">
                          Recommended Coverage
                        </div>
                        <div className="text-lg font-bold text-white font-mono">
                          USD <AnimatedNumber value={currentMetrics.coverage} format={true} />
                        </div>
                        <div className="text-[10px] text-[#34d399] font-medium mt-1">
                          85% Policy Ceiling Target
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-4 shadow-xl"
                      >
                        <div className="text-[11px] text-[#9ca3af] font-medium mb-1">
                          Calculated Annual Premium
                        </div>
                        <div className="text-lg font-bold text-[#60a5fa] font-mono">
                          USD <AnimatedNumber value={currentMetrics.premium} format={true} />
                        </div>
                        <div className="text-[10px] text-[#9ca3af] mt-1">
                          Adjusted dynamically
                        </div>
                      </motion.div>
                    </div>

                  </div>
                </div>

                {/* AI RECOMMENDATION PANEL (MATCHES AI INSURANCE INTELLIGENCE BOTTOM CARD EXACTLY) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-[#0b0f19]/90 backdrop-blur-md border border-[#1f293d] rounded-xl p-5 shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-[#1f293d] pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/40 border border-[#2563eb]/40 flex items-center justify-center text-[#60a5fa]">
                        <Sparkles className="w-3.5 h-3.5"/>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">AI Underwriting Recommendation</h3>
                        <p className="text-[11px] text-[#6b7280]">Automated policy rider & coverage decision guidance</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#030712] text-[#9ca3af] border border-[#1f293d]">
                      Model Engine v4.2
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-[#030712] border border-[#1f293d] flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${riskColors.text}`} />
                      <div className="text-xs">
                        <div className="font-bold text-white mb-0.5">
                          {currentMetrics.level === "Critical" || currentMetrics.level === "High"
                            ? "High Underwriting Exposure Alert"
                            : "Standard Risk Policy Profile"}
                        </div>
                        <p className="text-[#9ca3af] leading-relaxed">
                          {formData.name} exhibits a elevated training stress coefficient ({formData.trainingLoad}%) combined with active strain ({formData.currentInjury}).
                          Underwriting recommendation requires an initial 15% deductible rider on knee and ankle claim categories.
                        </p>
                      </div>
                    </div>

                    {/* BULLET ACTIONABLE RECOMMENDATIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#030712]/60 border border-[#1f293d] flex items-center gap-2 text-[#d1d5db]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        <span>Require bi-weekly biometric telemetry sync</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#030712]/60 border border-[#1f293d] flex items-center gap-2 text-[#d1d5db]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        <span>Cap maximum single-event claim at $8.5M</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#030712]/60 border border-[#1f293d] flex items-center gap-2 text-[#d1d5db]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        <span>Apply 12% premium reduction upon recovery score &gt; 90%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#030712]/60 border border-[#1f293d] flex items-center gap-2 text-[#d1d5db]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        <span>Include standard rehab compliance rider</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM CTA BAR */}
                  <div className="mt-5 pt-3 border-t border-[#1f293d] flex items-center justify-between">
                    <span className="text-[11px] text-[#6b7280]">
                      Generated for policy draft: <span className="font-mono text-[#9ca3af]">POL-2026-8842</span>
                    </span>
                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-500/10">
                      <span>Approve Underwriting Rider</span>
                      <ChevronRight className="w-3.5 h-3.5"/>
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