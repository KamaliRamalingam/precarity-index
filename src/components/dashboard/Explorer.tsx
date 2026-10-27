import { useEffect, useMemo, useState } from "react";
import { Map as MapIcon, LineChart, RotateCcw, Info } from "lucide-react";
import {
  PILLARS,
  RISK_BADGE,
  RISK_COLORS,
  avg,
  fmt,
  type CountryData,
  type RiskLabel,
} from "./types";
import { EuropeMap } from "./EuropeMap";

type PresetName = "Default (Recommended)" | "Equal Weights" | "Inequality Focus";

const WEIGHT_PRESETS: Record<PresetName, Record<string, number>> = {
  "Default (Recommended)": {
    poverty_rate_avg: 0.3,
    short_tenure_avg: 0.2,
    gender_pay_gap_pct: 0.3,
    hours_avg: 0.2,
  },
  "Equal Weights": {
    poverty_rate_avg: 0.25,
    short_tenure_avg: 0.25,
    gender_pay_gap_pct: 0.25,
    hours_avg: 0.25,
  },
  "Inequality Focus": {
    poverty_rate_avg: 0.2,
    short_tenure_avg: 0.2,
    gender_pay_gap_pct: 0.4,
    hours_avg: 0.2,
  },
};

// Synthetic year shifts (older years = mildly better, since real data is single year)
const YEAR_SHIFT: Record<string, number> = {
  "2023 (Latest)": 1.0,
  "2022": 0.96,
  "2021": 0.92,
};

function bandOf(score: number): RiskLabel {
  if (score >= 65) return "SEVERE";
  if (score >= 55) return "HIGH";
  if (score >= 40) return "MODERATE";
  return "LOW";
}

function PillarSpark({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const w = Math.sin((value + i) * 0.7) * 4 + Math.cos((value - i) * 0.5) * 3;
    const y = 22 - ((value - 30) / 50) * 16 + w;
    return `${i * 8},${Math.max(2, Math.min(34, y))}`;
  });
  return (
    <div className="flex flex-col">
      <p className="font-mono text-[10px] tracking-[0.18em] text-[#5F5B57] uppercase">
        {label}
      </p>
      <p className="font-serif text-2xl text-[#1D1D1D] mt-1 tabular-nums">
        {fmt(value)}
      </p>
      <svg width="100%" height="34" viewBox="0 0 80 36" preserveAspectRatio="none" className="mt-1">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts.join(" ")}
        />
      </svg>
    </div>
  );
}

const DEFAULT_ENABLED: Record<string, boolean> = {
  poverty_rate_avg: true,
  short_tenure_avg: true,
  gender_pay_gap_pct: true,
  hours_avg: true,
};

export function Explorer({
  data,
  initialCountry,
}: {
  data: CountryData[];
  initialCountry?: string | null;
}) {
  const [view, setView] = useState<"map" | "trend">("map");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(DEFAULT_ENABLED);
  const [weightPreset, setWeightPreset] = useState<PresetName>("Default (Recommended)");
  const [year, setYear] = useState<string>("2023 (Latest)");
  const [country, setCountry] = useState<string>("All Countries");

  useEffect(() => {
    if (initialCountry) {
      const c = data.find(
        (d) => d.country.toLowerCase() === initialCountry.toLowerCase()
      );
      if (c) setCountry(c.country);
    }
  }, [initialCountry, data]);

  // Effective weights = preset weights, restricted to enabled pillars,
  // proportionally renormalized so they sum to 1.
  const effectiveWeights = useMemo(() => {
    const base = WEIGHT_PRESETS[weightPreset];
    const filtered: Record<string, number> = {};
    let total = 0;
    PILLARS.forEach((p) => {
      if (enabled[p.key as string]) {
        filtered[p.key as string] = base[p.key as string] ?? 0;
        total += filtered[p.key as string];
      }
    });
    if (total > 0) {
      Object.keys(filtered).forEach((k) => (filtered[k] = filtered[k] / total));
    }
    return filtered;
  }, [enabled, weightPreset]);

  // Recompute scores per country given year shift + effective weights.
  const processedData = useMemo<CountryData[]>(() => {
    const shift = YEAR_SHIFT[year] ?? 1;
    const recomputed = data.map((d) => {
      const norms: Record<string, number> = {};
      PILLARS.forEach((p) => {
        const raw = (d[p.normKey] as number) ?? 0;
        norms[p.key as string] = raw * shift;
      });
      let score = 0;
      Object.entries(effectiveWeights).forEach(([k, w]) => {
        score += (norms[k] ?? 0) * w;
      });
      const label = bandOf(score);
      return {
        ...d,
        poverty_rate_avg_norm: norms.poverty_rate_avg ?? d.poverty_rate_avg_norm,
        short_tenure_avg_norm: norms.short_tenure_avg ?? d.short_tenure_avg_norm,
        gender_pay_gap_pct_norm: norms.gender_pay_gap_pct ?? d.gender_pay_gap_pct_norm,
        hours_avg_norm: norms.hours_avg ?? d.hours_avg_norm,
        risk_score: score,
        risk_label: label,
      } as CountryData;
    });
    // Re-rank
    const sorted = [...recomputed].sort((a, b) => b.risk_score - a.risk_score);
    sorted.forEach((d, i) => (d.rank = i + 1));
    return recomputed;
  }, [data, year, effectiveWeights]);

  const selected = useMemo<CountryData | null>(
    () =>
      country === "All Countries"
        ? null
        : processedData.find((d) => d.country === country) ?? null,
    [country, processedData]
  );

  const euAvg = useMemo(
    () => fmt(avg(processedData.map((d) => d.risk_score))),
    [processedData]
  );

  const pillarAvgs = useMemo(() => {
    const obj: Record<string, number> = {};
    PILLARS.forEach((p) => {
      obj[p.key as string] = avg(
        processedData.map((d) => (d[p.normKey] as number) ?? 0)
      );
    });
    return obj;
  }, [processedData]);

  const reset = () => {
    setEnabled(DEFAULT_ENABLED);
    setWeightPreset("Default (Recommended)");
    setYear("2023 (Latest)");
    setCountry("All Countries");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <header>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1D] tracking-tight">
          Explore Precarity Across Europe
        </h1>
        <p className="text-[#5F5B57] text-base mt-2">
          Customize metrics, view trends, and understand the drivers behind
          labor insecurity.
        </p>
      </header>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        {/* Sidebar */}
        <aside className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 flex flex-col gap-6 self-start">
          {/* SELECT VIEW */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
              Select View
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setView("map")}
                className={`inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  view === "map"
                    ? "bg-[#1D2A36] text-white"
                    : "border border-[#DDD6CC] text-[#1D1D1D] hover:bg-[#EFE8DE]"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Map View
              </button>
              <button
                onClick={() => setView("trend")}
                className={`inline-flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                  view === "trend"
                    ? "bg-[#1D2A36] text-white"
                    : "border border-[#DDD6CC] text-[#1D1D1D] hover:bg-[#EFE8DE]"
                }`}
              >
                <LineChart className="h-3.5 w-3.5" /> Trend View
              </button>
            </div>
          </div>

          {/* METRIC DIMENSIONS */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
              Metric Dimensions
            </p>
            <div className="flex flex-col gap-2.5">
              {PILLARS.map((p) => {
                const w = effectiveWeights[p.key as string] ?? 0;
                return (
                  <label
                    key={p.key}
                    className="flex items-center justify-between gap-3 text-sm cursor-pointer group"
                  >
                    <span className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!enabled[p.key as string]}
                        onChange={(e) =>
                          setEnabled((s) => ({
                            ...s,
                            [p.key as string]: e.target.checked,
                          }))
                        }
                        className="h-3.5 w-3.5 accent-[#C46A3D]"
                      />
                      <span className="text-[#1D1D1D] group-hover:text-[#C46A3D] transition-colors">
                        {p.label}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-[#5F5B57] tabular-nums">
                      ({(w * 100).toFixed(0)}%)
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* WEIGHT PRESET */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
              Weight Preset
            </p>
            <select
              value={weightPreset}
              onChange={(e) => setWeightPreset(e.target.value as PresetName)}
              className="w-full bg-white border border-[#DDD6CC] rounded-md px-3 py-2 text-sm text-[#1D1D1D] focus:outline-none focus:border-[#C46A3D]"
            >
              <option>Default (Recommended)</option>
              <option>Equal Weights</option>
              <option>Inequality Focus</option>
            </select>
          </div>

          {/* YEAR */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
              Year
            </p>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-white border border-[#DDD6CC] rounded-md px-3 py-2 text-sm text-[#1D1D1D] focus:outline-none focus:border-[#C46A3D]"
            >
              <option>2023 (Latest)</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </div>

          {/* COUNTRY */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
              Country
            </p>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white border border-[#DDD6CC] rounded-md px-3 py-2 text-sm text-[#1D1D1D] focus:outline-none focus:border-[#C46A3D]"
            >
              <option>All Countries</option>
              {data.map((d) => (
                <option key={d.country} value={d.country}>
                  {d.country}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-[#5F5B57] hover:text-[#C46A3D] text-xs font-medium transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </button>
        </aside>

        {/* Main */}
        <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#1D1D1D] uppercase font-semibold">
              Precarity Risk Score by Country
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#5F5B57]">
              {[
                { l: "Low", c: RISK_COLORS.LOW },
                { l: "Moderate", c: RISK_COLORS.MODERATE },
                { l: "High", c: RISK_COLORS.HIGH },
                { l: "Severe", c: RISK_COLORS.SEVERE },
              ].map((x) => (
                <span key={x.l} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: x.c }} />
                  {x.l}
                </span>
              ))}
            </div>
          </div>

          {view === "map" ? (
            <div className="relative">
              <EuropeMap
                data={processedData}
                highlightedCountry={selected?.country ?? null}
              />
              {selected && (
                <div className="absolute top-4 right-4 bg-white border border-[#DDD6CC] rounded-md shadow-md px-4 py-3 w-52 text-sm">
                  <p className="font-serif text-[#1D1D1D] font-semibold text-base mb-2">
                    {selected.country}
                  </p>
                  <div className="flex justify-between text-[#5F5B57] mb-1">
                    <span>Precarity Score</span>
                    <span className="font-mono text-[#1D1D1D] tabular-nums">
                      {fmt(selected.risk_score)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5F5B57] mb-1">
                    <span>Risk Level</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-sm text-[10px] font-mono tracking-[0.15em] ${RISK_BADGE[selected.risk_label]}`}
                    >
                      {selected.risk_label}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5F5B57]">
                    <span>Rank</span>
                    <span className="font-mono text-[#1D1D1D] tabular-nums">
                      {selected.rank} / {processedData.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[420px] flex items-center justify-center text-[#5F5B57] text-sm border-2 border-dashed border-[#DDD6CC] rounded-md">
              Trend view — historical precarity over time (coming soon).
            </div>
          )}

          {/* Detailed breakdown for selected country */}
          {selected && (
            <div className="mt-5 border-t border-[#DDD6CC] pt-5">
              <p className="font-mono text-[10px] tracking-[0.25em] text-[#5F5B57] uppercase mb-3">
                {selected.country} — Dimension Breakdown
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {PILLARS.map((p) => {
                  const v = (selected[p.normKey] as number) ?? 0;
                  return (
                    <div
                      key={p.key}
                      className="rounded-md border border-[#DDD6CC] bg-white px-3 py-2.5"
                    >
                      <p className="font-mono text-[10px] tracking-[0.18em] text-[#5F5B57] uppercase">
                        {p.label}
                      </p>
                      <p className="font-serif text-2xl mt-1 tabular-nums" style={{ color: p.color }}>
                        {fmt(v)}
                      </p>
                      <div className="mt-1.5 h-1 w-full rounded-full bg-[#EFE8DE] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, v))}%`,
                            background: p.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EU avg + 4 pillar sparks */}
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-5 gap-5 border-t border-[#DDD6CC] pt-5">
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#5F5B57] uppercase">
                EU Average Score
              </p>
              <p className="font-serif text-3xl text-[#1D1D1D] mt-1 tabular-nums">
                {euAvg}
                <span className="text-[#5F5B57] text-base ml-1">/ 100</span>
              </p>
            </div>
            {PILLARS.map((p) => (
              <PillarSpark
                key={p.key}
                label={p.label}
                value={pillarAvgs[p.key as string]}
                color={p.color}
              />
            ))}
          </div>

          <div className="mt-4 border-t border-[#DDD6CC] pt-3 flex items-center gap-2 text-xs text-[#5F5B57]">
            <Info className="h-3.5 w-3.5" />
            <span>
              Tip: Select a country to see detailed breakdown and trends over time.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
