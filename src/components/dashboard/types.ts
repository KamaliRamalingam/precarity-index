export type RiskLabel = "SEVERE" | "HIGH" | "MODERATE" | "LOW";

export interface CountryData {
  rank: number;
  country: string;
  poverty_rate_avg: number;
  short_tenure_avg: number;
  gender_pay_gap_pct: number;
  hours_avg: number;
  poverty_rate_avg_norm: number;
  short_tenure_avg_norm: number;
  gender_pay_gap_pct_norm: number;
  hours_avg_norm: number;
  job_stability_score: number;
  employment_gap: number;
  poverty_gender_gap: number;
  hours_gap: number;
  overwork_flag: number;
  gender_equality_score_raw: number;
  emp_females: number;
  emp_males: number;
  pov_females: number;
  pov_males: number;
  tenure_females: number;
  tenure_males: number;
  hours_females: number;
  hours_males: number;
  risk_score: number;
  risk_label: RiskLabel;
}

// Risk palette — semantic traffic-light tones
export const RISK_COLORS: Record<RiskLabel, string> = {
  SEVERE: "#C0392B",
  HIGH: "#E67E22",
  MODERATE: "#D4AC0D",
  LOW: "#1A7A4A",
};

export const RISK_TINTS: Record<RiskLabel, string> = {
  SEVERE: "#FDECEA",
  HIGH: "#FEF0E3",
  MODERATE: "#FDF8E1",
  LOW: "#E8F5EE",
};

export const RISK_RING: Record<RiskLabel, string> = {
  SEVERE: "ring-[#C0392B]/40",
  HIGH: "ring-[#E67E22]/40",
  MODERATE: "ring-[#D4AC0D]/45",
  LOW: "ring-[#1A7A4A]/40",
};

export const RISK_BADGE: Record<RiskLabel, string> = {
  SEVERE: "bg-[#FDECEA] text-[#C0392B] border border-[#C0392B] font-bold uppercase",
  HIGH: "bg-[#FEF0E3] text-[#E67E22] border border-[#E67E22] font-bold uppercase",
  MODERATE: "bg-[#FDF8E1] text-[#D4AC0D] border border-[#D4AC0D] font-bold uppercase",
  LOW: "bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A] font-bold uppercase",
};

export interface Pillar {
  key: keyof CountryData;
  normKey: keyof CountryData;
  label: string;
  icon: string;
  weight: number;
  unit: string;
  color: string;
  proxy: string;
  desc: string;
}

// Pillar palette — aligned with the muted editorial system
export const PILLARS: Pillar[] = [
  {
    key: "poverty_rate_avg",
    normKey: "poverty_rate_avg_norm",
    label: "Financial Stress",
    icon: "💸",
    weight: 0.3,
    unit: "%",
    color: "#A94442",
    proxy: "Economic anxiety",
    desc: "In-work at-risk-of-poverty rate (avg M+F)",
  },
  {
    key: "short_tenure_avg",
    normKey: "short_tenure_avg_norm",
    label: "Job Instability",
    icon: "⏱️",
    weight: 0.2,
    unit: "%",
    color: "#C9784A",
    proxy: "Employment insecurity",
    desc: "Workers in jobs under 12 months (avg M+F)",
  },
  {
    key: "gender_pay_gap_pct",
    normKey: "gender_pay_gap_pct_norm",
    label: "Pay Inequality",
    icon: "💰",
    weight: 0.3,
    unit: "%",
    color: "#0F4C81",
    proxy: "Systemic unfairness",
    desc: "Unadjusted gender pay gap in hourly earnings",
  },
  {
    key: "hours_avg",
    normKey: "hours_avg_norm",
    label: "Overwork Risk",
    icon: "🕐",
    weight: 0.2,
    unit: "h/wk",
    color: "#5B7C99",
    proxy: "Burnout risk",
    desc: "Mean weekly hours per employee (avg M+F)",
  },
];

export const fmt = (v: number | null | undefined, dec = 1): string =>
  v != null && !isNaN(v) ? Number(v).toFixed(dec) : "—";

export const avg = (arr: number[]): number =>
  arr.reduce((s, x) => s + x, 0) / arr.length;
