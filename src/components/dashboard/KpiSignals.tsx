import {
  Activity,
  AlertOctagon,
  Scale,
  Clock,
  Flame,
  Target,
} from "lucide-react";
import { PILLARS, avg, fmt, type CountryData } from "./types";
import { AnimatedCounter } from "./AnimatedCounter";

function dominantPillar(data: CountryData[]) {
  const means = PILLARS.map((p) => ({
    p,
    mean: avg(data.map((d) => (d[p.normKey] as number) ?? 0)),
  }));
  means.sort((a, b) => b.mean - a.mean);
  return means[0].p;
}

export function KpiSignals({ data }: { data: CountryData[] }) {
  const euAvg = avg(data.map((d) => d.risk_score));
  const highOrSevere = data.filter(
    (d) => d.risk_label === "HIGH" || d.risk_label === "SEVERE",
  );
  const pctHighSevere = (highOrSevere.length / data.length) * 100;
  const avgGap = avg(data.map((d) => d.gender_pay_gap_pct));
  const avgHours = avg(data.map((d) => d.hours_avg));
  const top = [...data].sort((a, b) => b.risk_score - a.risk_score)[0];
  const driver = dominantPillar(data);

  const cards = [
    {
      icon: <Activity className="h-4 w-4" />,
      label: "EU Avg Precarity",
      value: <AnimatedCounter value={euAvg} decimals={1} />,
      sub: "out of 100 · composite score",
      insight: euAvg > 50 ? "above mid-range burden" : "moderate burden",
      accent: "#0F4C81",
    },
    {
      icon: <AlertOctagon className="h-4 w-4" />,
      label: "% High / Severe",
      value: <AnimatedCounter value={pctHighSevere} decimals={0} suffix="%" />,
      sub: `${highOrSevere.length} of ${data.length} countries`,
      insight: "structural, not isolated",
      accent: "#C97A2B",
    },
    {
      icon: <Scale className="h-4 w-4" />,
      label: "Avg Gender Pay Gap",
      value: <AnimatedCounter value={avgGap} decimals={1} suffix="%" />,
      sub: "unadjusted hourly earnings",
      insight: "pay equity still uneven",
      accent: "#c084fc",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: "Avg Weekly Hours",
      value: <AnimatedCounter value={avgHours} decimals={1} suffix="h" />,
      sub: "mean across employees",
      insight: avgHours > 38 ? "above EU norm" : "near EU norm",
      accent: "#60a5fa",
    },
    {
      icon: <Flame className="h-4 w-4" />,
      label: "Highest Risk",
      value: (
        <span className="text-2xl sm:text-3xl font-extrabold">
          {top.country}
        </span>
      ),
      sub: `${fmt(top.risk_score)} · ${top.risk_label}`,
      insight: "most precarious labor profile",
      accent: "#0F4C81",
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: "Dominant Driver",
      value: (
        <span className="text-2xl sm:text-3xl font-extrabold">
          {driver.icon} {driver.label.split(" ")[0]}
        </span>
      ),
      sub: driver.label,
      insight: "the loudest signal in the data",
      accent: driver.color,
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.3em] mb-1">
          // KEY SIGNALS
        </div>
        <h2 className="text-2xl font-bold text-[#111111]">At a glance</h2>
        <p className="text-[#6b6b6b] text-sm mt-1 italic">
          Behind every employment statistic is a human nervous system.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="group relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-[#FFFFFF]/85 backdrop-blur p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0F4C81]/30"
            style={{
              boxShadow: `0 0 0 0 transparent`,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${c.accent}22, transparent 70%)`,
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="h-8 w-8 rounded-lg border flex items-center justify-center"
                  style={{
                    color: c.accent,
                    borderColor: `${c.accent}55`,
                    background: `${c.accent}11`,
                  }}
                >
                  {c.icon}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#737373]">
                  {c.label}
                </span>
              </div>
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums leading-none"
                style={{ color: c.accent }}
              >
                {c.value}
              </div>
              <p className="text-[#525252] text-xs mt-3 leading-relaxed">
                {c.sub}
              </p>
              <div className="mt-3 pt-3 border-t border-[#E5E2DA] flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: c.accent }}
                />
                <span className="text-[11px] text-[#4a4a4a] italic">
                  {c.insight}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
