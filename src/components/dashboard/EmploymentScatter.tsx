import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { RISK_COLORS, fmt, type CountryData } from "./types";
import { useMemo } from "react";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CountryData & { emp: number };
  return (
    <div className="bg-[#FFFFFF]/95 backdrop-blur border border-[#C7C2B6] rounded-lg px-3 py-2 shadow-2xl text-xs font-mono">
      <div className="text-[#111111] font-bold text-sm font-sans mb-1">
        {d.country}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: RISK_COLORS[d.risk_label] }}
        />
        <span style={{ color: RISK_COLORS[d.risk_label] }}>{d.risk_label}</span>
      </div>
      <div className="text-[#3a3a3a] mt-1.5 space-y-0.5">
        <div>Employment: <span className="text-[#111111]">{fmt(d.emp)}%</span></div>
        <div>Precarity: <span className="text-[#111111]">{fmt(d.risk_score)}</span></div>
        <div>Pay gap: <span className="text-[#111111]">{fmt(d.gender_pay_gap_pct)}%</span></div>
      </div>
    </div>
  );
}

export function EmploymentScatter({ data }: { data: CountryData[] }) {
  const points = useMemo(
    () =>
      data
        .map((d) => ({
          ...d,
          emp: (d.emp_females + d.emp_males) / 2,
          z: Math.max(1, Math.abs(d.gender_pay_gap_pct)),
        }))
        .filter((d) => !isNaN(d.emp) && !isNaN(d.risk_score)),
    [data],
  );

  // Annotation: high emp + high precarity, and low emp + low precarity (stable)
  const meanEmp =
    points.reduce((s, p) => s + p.emp, 0) / Math.max(1, points.length);
  const meanRisk =
    points.reduce((s, p) => s + p.risk_score, 0) / Math.max(1, points.length);

  const highEmpHighRisk = points
    .filter((p) => p.emp >= meanEmp && p.risk_score >= meanRisk)
    .sort((a, b) => b.risk_score - a.risk_score)[0];

  const lowerEmpLowerRisk = points
    .filter((p) => p.emp < meanEmp && p.risk_score < meanRisk)
    .sort((a, b) => a.risk_score - b.risk_score)[0];

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.3em] mb-1">
          // SIGNATURE INSIGHT
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] leading-tight">
          Employment Does Not Equal Security
        </h2>
        <p className="text-[#6b6b6b] text-sm mt-2 italic max-w-2xl">
          Economic growth can coexist with worker insecurity. Each bubble is a country —
          its size scales with the gender pay gap, its color with risk band.
        </p>
      </div>

      <div className="relative bg-[#FFFFFF] border border-[#E5E2DA] rounded-2xl p-4 sm:p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_80%_10%,rgba(15,76,129,0.04),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_30%_at_10%_90%,rgba(15,76,129,0.04),transparent_70%)]" />

        <div className="relative" style={{ width: "100%", height: 460 }}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 24, right: 36, bottom: 48, left: 24 }}>
              <CartesianGrid stroke="#E5E2DA" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="emp"
                name="Employment Rate"
                domain={["dataMin - 3", "dataMax + 3"]}
                tick={{ fill: "#6b6b6b", fontSize: 11 }}
                axisLine={{ stroke: "#D4D0C7" }}
                tickLine={false}
                label={{
                  value: "Employment rate (%)",
                  position: "insideBottom",
                  offset: -16,
                  fill: "#737373",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="risk_score"
                name="Precarity"
                domain={[0, 100]}
                tick={{ fill: "#6b6b6b", fontSize: 11 }}
                axisLine={{ stroke: "#D4D0C7" }}
                tickLine={false}
                label={{
                  value: "Precarity score",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#737373",
                  fontSize: 11,
                  offset: 10,
                }}
              />
              <ZAxis type="number" dataKey="z" range={[60, 600]} />
              <ReferenceLine
                x={meanEmp}
                stroke="#0F4C81"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <ReferenceLine
                y={meanRisk}
                stroke="#0F4C81"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#0F4C81", strokeOpacity: 0.3 }} />
              <Scatter data={points}>
                {points.map((p, i) => (
                  <Cell
                    key={i}
                    fill={RISK_COLORS[p.risk_label]}
                    fillOpacity={0.75}
                    stroke={RISK_COLORS[p.risk_label]}
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Annotation callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 relative">
          {highEmpHighRisk && (
            <div className="rounded-xl border border-[#0F4C81]/30 bg-[#0F4C81]/5 p-4">
              <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.25em] mb-1">
                // PARADOX
              </div>
              <p className="text-[#111111] text-sm font-semibold">
                {highEmpHighRisk.country}
                <span className="text-[#5f5f5f] font-normal">
                  {" "}— high employment, high precarity
                </span>
              </p>
              <p className="text-[#525252] text-xs mt-1.5 leading-relaxed">
                {fmt(highEmpHighRisk.emp)}% employed, yet a precarity score of{" "}
                {fmt(highEmpHighRisk.risk_score)}. Jobs exist; stability does not.
              </p>
            </div>
          )}
          {lowerEmpLowerRisk && (
            <div className="rounded-xl border border-[#4C956C]/30 bg-[#4C956C]/5 p-4">
              <div className="font-mono text-[10px] text-[#4C956C] tracking-[0.25em] mb-1">
                // STABILITY
              </div>
              <p className="text-[#111111] text-sm font-semibold">
                {lowerEmpLowerRisk.country}
                <span className="text-[#5f5f5f] font-normal">
                  {" "}— lower employment, stronger stability
                </span>
              </p>
              <p className="text-[#525252] text-xs mt-1.5 leading-relaxed">
                Fewer people in work, but those who are face less precarity —
                score {fmt(lowerEmpLowerRisk.risk_score)} at {fmt(lowerEmpLowerRisk.emp)}%
                employment.
              </p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#111111]/35 italic mt-4 text-center">
          Dashed crosshairs mark sample means · bubble area ∝ |gender pay gap|
        </p>
      </div>
    </section>
  );
}
