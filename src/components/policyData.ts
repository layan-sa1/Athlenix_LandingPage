/** Policy records for the Policies page, derived from the shared roster. */
import { CLUBS } from "../components/platformData";

export type PolicyStatus = "Active" | "Pending Renewal" | "Expired" | "Suspended";
export type CoverageType = "Full Season" | "Full + Recovery" | "Partial" | "Injury Only";

export type Policy = {
  id: string;
  club: string;
  sport: string;
  athletes: number;
  coverage: CoverageType;
  premium: number;       // SAR / month
  limit: number;         // SAR coverage ceiling
  status: PolicyStatus;
  renewal: string;       // date
  duration: string;
  claims: number;
  manager: string;
  risk: "Low" | "Moderate" | "High";
  benefits: string[];
  exclusions: string[];
  insight: string;
};

const MANAGERS = ["Noura Al-Otaibi", "Khalid Al-Harbi", "Sara Al-Qahtani", "Faisal Al-Dosari", "Reem Al-Ghamdi"];
const SPORTS = ["Football", "Basketball", "Volleyball", "Tennis", "Swimming"];

export const POLICIES: Policy[] = [
  { id: "POL-4021", club: "Al Hilal", sport: "Football", athletes: 27, coverage: "Full + Recovery", premium: 84000, limit: 12000000, status: "Active", renewal: "Dec 14, 2026", duration: "12 months", claims: 3, manager: MANAGERS[0], risk: "Moderate", benefits: ["Injury treatment", "Surgery & rehab", "Loss of earnings", "Recovery monitoring"], exclusions: ["Pre-existing conditions", "Non-sanctioned events"], insight: "Two defenders trending high-risk. Consider a load-triggered premium clause at renewal." },
  { id: "POL-4022", club: "Al Nassr", sport: "Football", athletes: 25, coverage: "Full Season", premium: 79000, limit: 10000000, status: "Pending Renewal", renewal: "Sept 02, 2026", duration: "12 months", claims: 2, manager: MANAGERS[1], risk: "High", benefits: ["Injury treatment", "Surgery & rehab", "Loss of earnings"], exclusions: ["Pre-existing conditions", "Reckless conduct"], insight: "Renewal due in under 30 days. Sprint-load spikes suggest a 6% premium uplift." },
  { id: "POL-4023", club: "Al Ittihad", sport: "Football", athletes: 24, coverage: "Full Season", premium: 72000, limit: 9500000, status: "Active", renewal: "Jan 20, 2027", duration: "12 months", claims: 1, manager: MANAGERS[2], risk: "Moderate", benefits: ["Injury treatment", "Surgery & rehab"], exclusions: ["Pre-existing conditions"], insight: "Portfolio stable. One ankle case under medical review." },
  { id: "POL-4024", club: "Al Ahli", sport: "Basketball", athletes: 16, coverage: "Full + Recovery", premium: 51000, limit: 7000000, status: "Active", renewal: "Nov 08, 2026", duration: "12 months", claims: 0, manager: MANAGERS[3], risk: "Low", benefits: ["Injury treatment", "Surgery & rehab", "Recovery monitoring"], exclusions: ["Pre-existing conditions", "Non-sanctioned events"], insight: "Lowest claim rate in portfolio. Eligible for a loyalty discount." },
  { id: "POL-4025", club: "Al Shabab", sport: "Football", athletes: 23, coverage: "Injury Only", premium: 44000, limit: 6000000, status: "Suspended", renewal: "Oct 30, 2026", duration: "12 months", claims: 4, manager: MANAGERS[4], risk: "High", benefits: ["Injury treatment"], exclusions: ["Rehab", "Loss of earnings", "Pre-existing conditions"], insight: "Suspended pending documentation. High claim frequency needs review." },
  { id: "POL-4026", club: "Al Hilal", sport: "Volleyball", athletes: 14, coverage: "Partial", premium: 33000, limit: 4500000, status: "Active", renewal: "Feb 11, 2027", duration: "12 months", claims: 1, manager: MANAGERS[0], risk: "Low", benefits: ["Injury treatment", "Physiotherapy"], exclusions: ["Surgery", "Loss of earnings"], insight: "Coverage gap on surgery. Upsell to Full Season recommended." },
  { id: "POL-4027", club: "Al Nassr", sport: "Tennis", athletes: 8, coverage: "Full Season", premium: 28000, limit: 3800000, status: "Pending Renewal", renewal: "Aug 28, 2026", duration: "12 months", claims: 0, manager: MANAGERS[1], risk: "Low", benefits: ["Injury treatment", "Surgery & rehab"], exclusions: ["Pre-existing conditions"], insight: "Clean record. Straightforward renewal at current terms." },
  { id: "POL-4028", club: "Al Ittihad", sport: "Swimming", athletes: 11, coverage: "Partial", premium: 21000, limit: 3000000, status: "Expired", renewal: "Jul 15, 2026", duration: "12 months", claims: 2, manager: MANAGERS[2], risk: "Moderate", benefits: ["Injury treatment"], exclusions: ["Surgery", "Loss of earnings"], insight: "Policy lapsed 2 weeks ago. Reinstatement window closing." },
];

export const POLICY_STATUS_STYLE: Record<PolicyStatus, string> = {
  Active: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  "Pending Renewal": "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  Expired: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
  Suspended: "text-white/60 bg-white/[0.06] border-white/[0.15]",
};

export const SPORT_COLORS: Record<string, string> = {
  Football: "#00B5FF",
  Basketball: "#22D3EE",
  Volleyball: "#8B5CF6",
  Tennis: "#EAB308",
  Swimming: "#22C55E",
};

export { CLUBS, SPORTS };
export const COVERAGE_TYPES: CoverageType[] = ["Full Season", "Full + Recovery", "Partial", "Injury Only"];
export const STATUSES: PolicyStatus[] = ["Active", "Pending Renewal", "Expired", "Suspended"];