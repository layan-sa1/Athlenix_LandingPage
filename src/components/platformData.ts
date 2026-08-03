
/**
 * Shared athlete data + selection helpers for the connected platform flow:
 *   Club Dashboard → pick player → Insurance Dashboard → Generate Report → Reports
 *
 * Selection is passed through the URL (?athlete=<id>) so it survives
 * navigation and refresh, and any page can read it via search params.
 */

export type Zone =
  | "hamstringL" | "hamstringR" | "kneeL" | "kneeR"
  | "ankleL" | "ankleR" | "torso" | "shoulderL" | "shoulderR" | "head";
export type ZoneLevel = "ok" | "moderate" | "high";

export type Athlete = {
  id: string;
  name: string;
  club: string;
  position: string;
  initials: string;
  age: number;
  status: "Active" | "Recovering" | "High Risk" | "Medical Review";
  risk: number;
  acwr: number;
  injuryProb: number;
  fitness: number;
  premium: number;
  coverage: string;
  claims: number;
  renewal: string;
  insight: string;
  zones: Partial<Record<Zone, ZoneLevel>>;
};

export const CLUBS = ["Al Hilal", "Al Nassr", "Al Ittihad", "Al Ahli", "Al Shabab"];

export const ATHLETES: Athlete[] = [
  { id: "sd", name: "Salem Al-Dawsari", club: "Al Hilal", position: "Winger", initials: "SD", age: 33, status: "Active", risk: 41, acwr: 1.12, injuryProb: 18, fitness: 88, premium: 3200, coverage: "Full · Season 2026", claims: 0, renewal: "142 days", insight: "Training load up 14%. Two-day recovery advised.", zones: { hamstringL: "moderate", kneeR: "ok" } },
  { id: "sg", name: "Sultan Al-Ghannam", club: "Al Nassr", position: "Right Back", initials: "SG", age: 30, status: "High Risk", risk: 68, acwr: 1.38, injuryProb: 44, fitness: 61, premium: 4850, coverage: "Full · Season 2026", claims: 1, renewal: "38 days", insight: "Sprint volume above threshold. Reduce load 30%.", zones: { hamstringR: "high", kneeR: "moderate", ankleR: "moderate" } },
  { id: "fb", name: "Firas Al-Buraikan", club: "Al Ahli", position: "Striker", initials: "FB", age: 25, status: "Active", risk: 55, acwr: 1.27, injuryProb: 33, fitness: 74, premium: 4100, coverage: "Full · Season 2026", claims: 0, renewal: "96 days", insight: "Hamstring load elevated post-match. Light session.", zones: { hamstringL: "moderate", hamstringR: "moderate" } },
  { id: "ao", name: "Abdullah Otayf", club: "Al Hilal", position: "Midfielder", initials: "AO", age: 32, status: "Recovering", risk: 72, acwr: 1.44, injuryProb: 51, fitness: 54, premium: 5300, coverage: "Full + Recovery", claims: 2, renewal: "14 days", insight: "Return-to-play day 4 of 10. Progressing well.", zones: { kneeL: "high", hamstringL: "moderate", ankleL: "moderate" } },
  { id: "ms", name: "Muhannad Al-Shanqiti", club: "Al Ittihad", position: "Center Back", initials: "MS", age: 27, status: "Medical Review", risk: 63, acwr: 1.33, injuryProb: 39, fitness: 66, premium: 4600, coverage: "Full · Season 2026", claims: 1, renewal: "61 days", insight: "Ankle stability flagged. Awaiting clearance.", zones: { ankleR: "high", kneeR: "moderate" } },
  { id: "fm", name: "Fahad Al-Muwallad", club: "Al Shabab", position: "Winger", initials: "FM", age: 30, status: "High Risk", risk: 76, acwr: 1.49, injuryProb: 58, fitness: 48, premium: 5700, coverage: "Full · Season 2026", claims: 3, renewal: "22 days", insight: "ACWR spiking. Immediate load reduction needed.", zones: { hamstringL: "high", hamstringR: "high", kneeL: "moderate" } },
  { id: "ah", name: "Ali Al-Hassan", club: "Al Nassr", position: "Midfielder", initials: "AH", age: 26, status: "Active", risk: 38, acwr: 1.08, injuryProb: 16, fitness: 90, premium: 2950, coverage: "Full · Season 2026", claims: 0, renewal: "120 days", insight: "Metrics optimal. Cleared for full training.", zones: { torso: "ok" } },
  { id: "zs", name: "Ziyad Al-Sahafi", club: "Al Ahli", position: "Right Back", initials: "ZS", age: 30, status: "Recovering", risk: 60, acwr: 1.31, injuryProb: 36, fitness: 68, premium: 4250, coverage: "Full + Recovery", claims: 1, renewal: "48 days", insight: "Calf strain healing. Light training resumed.", zones: { ankleR: "moderate", hamstringR: "moderate" } },
];

export const STATUS_STYLE: Record<string, string> = {
  Active: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  Recovering: "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  "High Risk": "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
  "Medical Review": "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
};

export const riskColor = (r: number) => (r > 65 ? "#EF4444" : r > 50 ? "#EAB308" : "#22C55E");

export const getAthlete = (id?: string) =>
  ATHLETES.find((a) => a.id === id);