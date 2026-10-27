import { RISK_COLORS, RISK_TINTS, type RiskLabel } from "./types";

export function RiskBadge({ label }: { label: RiskLabel }) {
  const color = RISK_COLORS[label];
  const bg = RISK_TINTS[label];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider border"
      style={{ color, borderColor: color, backgroundColor: bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
