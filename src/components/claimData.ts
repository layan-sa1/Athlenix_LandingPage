/** Claim records for the Claims Management page. */
import { ATHLETES } from "../components/platformData";

export type ClaimStatus = "Pending Review" | "Under Investigation" | "Approved" | "Rejected" | "Paid";

export type Claim = {
  id: string;
  athleteId: string;
  athlete: string;
  club: string;
  sport: string;
  initials: string;
  injury: string;
  injuryDetail: string;
  amount: number;        // requested SAR
  coveragePct: number;   // % covered
  date: string;
  status: ClaimStatus;
  fraudRisk: number;     // 0-100
  medical: string;
  insight: string;
  prevClaims: number;
};

const INJURIES = ["Hamstring strain", "Knee (ACL)", "Ankle sprain", "Calf tear", "Shoulder dislocation", "Groin strain", "Concussion", "Fracture"];

export const CLAIMS: Claim[] = ATHLETES.slice(0, 8).map((a, i) => {
  const injury = INJURIES[i % INJURIES.length];
  const amount = [82000, 140000, 47000, 61000, 33000, 95000, 54000, 120000][i];
  const status: ClaimStatus = (["Pending Review", "Under Investigation", "Approved", "Pending Review", "Paid", "Rejected", "Approved", "Under Investigation"] as ClaimStatus[])[i];
  const fraud = [12, 68, 8, 22, 5, 74, 15, 41][i];
  return {
    id: `CLM-${2041 - i}`,
    athleteId: a.id,
    athlete: a.name,
    club: a.club,
    sport: "Football",
    initials: a.initials,
    injury: injury.split(" ")[0],
    injuryDetail: injury,
    amount,
    coveragePct: [90, 75, 100, 85, 100, 60, 90, 80][i],
    date: ["Aug 16, 2026", "Aug 14, 2026", "Aug 12, 2026", "Aug 10, 2026", "Aug 08, 2026", "Aug 06, 2026", "Aug 04, 2026", "Aug 02, 2026"][i],
    status,
    fraudRisk: fraud,
    medical: `${injury} confirmed via imaging. Estimated recovery ${[3, 8, 2, 4, 1, 6, 3, 10][i]} weeks. Treatment plan approved by club medical staff.`,
    insight: fraud > 60
      ? "Unusual claim pattern detected. Flag for manual fraud verification before approval."
      : status === "Pending Review"
      ? "Documentation complete. Eligible for fast-track approval."
      : "Claim consistent with injury profile and coverage terms.",
    prevClaims: a.claims,
  };
});

export const CLAIM_STATUS_STYLE: Record<ClaimStatus, string> = {
  "Pending Review": "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20",
  "Under Investigation": "text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20",
  Approved: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  Rejected: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
  Paid: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
};

export const CLAIM_STATUSES: ClaimStatus[] = ["Pending Review", "Under Investigation", "Approved", "Rejected", "Paid"];

export const fraudColor = (r: number) => (r > 60 ? "#EF4444" : r > 35 ? "#EAB308" : "#22C55E");