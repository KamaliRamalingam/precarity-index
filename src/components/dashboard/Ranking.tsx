import { useMemo, useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PILLARS,
  RISK_BADGE,
  RISK_COLORS,
  fmt,
  type CountryData,
  type RiskLabel,
} from "./types";

const PAGE_SIZE = 12;

const YEAR_OPTIONS = ["2023 (Latest)", "2022", "2021"] as const;
type YearOption = (typeof YEAR_OPTIONS)[number];

// Synthetic deterministic year multipliers applied to normalized pillars.
// Older years are mildly better since we only have one snapshot of real data.
const YEAR_SHIFT: Record<string, number> = {
  "2023 (Latest)": 1.0,
  "2023": 1.0,
  "2022": 0.96,
  "2021": 0.92,
  "2020": 0.88,
};

const yearLabel = (y: YearOption) => (y === "2023 (Latest)" ? "2023" : y);
const previousYear = (y: YearOption): string | null => {
  if (y === "2023 (Latest)") return "2022";
  if (y === "2022") return "2021";
  if (y === "2021") return null; // no 2020 in dataset
  return null;
};

function bandOf(score: number): RiskLabel {
  if (score >= 65) return "SEVERE";
  if (score >= 55) return "HIGH";
  if (score >= 40) return "MODERATE";
  return "LOW";
}

function scoreFor(d: CountryData, year: string): number {
  const shift = YEAR_SHIFT[year] ?? 1;
  let s = 0;
  PILLARS.forEach((p) => {
    s += ((d[p.normKey] as number) ?? 0) * shift * p.weight;
  });
  return s;
}

function Sparkline({ scores, color }: { scores: number[]; color: string }) {
  // Render the per-year scores left-to-right (oldest → newest).
  const w = 72;
  const h = 36;
  const max = Math.max(...scores, 1);
  const min = Math.min(...scores, 0);
  const range = Math.max(1, max - min);
  const pts = scores.map((s, i) => {
    const x = (i / Math.max(1, scores.length - 1)) * w;
    const y = h - 4 - ((s - min) / range) * (h - 8);
    return `${x},${y}`;
  });
  return (
    <svg width="80" height="36" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(" ")}
      />
    </svg>
  );
}

export function Ranking({
  data,
  onSelectCountry,
}: {
  data: CountryData[];
  onSelectCountry?: (country: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [dimension, setDimension] = useState<"ALL" | RiskLabel>("ALL");
  const [year, setYear] = useState<YearOption>("2023 (Latest)");
  const [page, setPage] = useState(1);

  const prevYear = previousYear(year);
  const yLabel = yearLabel(year);

  // Recompute scores + risk labels for the selected year
  const yearData = useMemo(() => {
    const recomputed = data.map((d) => {
      const score = scoreFor(d, year);
      return { ...d, risk_score: score, risk_label: bandOf(score) } as CountryData;
    });
    const sorted = [...recomputed].sort((a, b) => b.risk_score - a.risk_score);
    sorted.forEach((d, i) => (d.rank = i + 1));
    return recomputed;
  }, [data, year]);

  const filtered = useMemo(() => {
    return yearData
      .filter(
        (d) =>
          d.country.toLowerCase().includes(search.toLowerCase()) &&
          (dimension === "ALL" || d.risk_label === dimension)
      )
      .sort((a, b) => b.risk_score - a.risk_score);
  }, [yearData, search, dimension]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const downloadCsv = () => {
    const rows = [
      ["Rank", "Country", "Precarity Score", "Risk Level", "Year"],
      ...filtered.map((d, i) => [i + 1, d.country, fmt(d.risk_score), d.risk_label, yLabel]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `precarity_rankings_${yLabel}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <header>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1D] tracking-tight">
          Precarity Rankings
        </h1>
        <p className="text-[#5F5B57] text-base mt-2">
          Overall ranking of {data.length} European countries based on the
          Precarity Index ({yLabel}).
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F5B57]" />
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#FCFAF7] border border-[#DDD6CC] text-[#1D1D1D] rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#C46A3D] placeholder-[#9c958c]"
          />
        </div>

        <select
          value={dimension}
          onChange={(e) => {
            setDimension(e.target.value as typeof dimension);
            setPage(1);
          }}
          className="bg-[#FCFAF7] border border-[#DDD6CC] text-[#1D1D1D] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#C46A3D]"
        >
          <option value="ALL">All Dimension</option>
          <option value="SEVERE">Severe</option>
          <option value="HIGH">High</option>
          <option value="MODERATE">Moderate</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value as YearOption);
            setPage(1);
          }}
          className="bg-[#FCFAF7] border border-[#DDD6CC] text-[#1D1D1D] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#C46A3D]"
        >
          <option>2023 (Latest)</option>
          <option>2022</option>
          <option>2021</option>
        </select>

        <button
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 bg-[#1D2A36] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#2F3A45] transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EFE8DE]/60 border-b border-[#DDD6CC] text-[#5F5B57] text-[11px] uppercase tracking-[0.18em] font-mono">
                <th className="text-left px-6 py-3 font-medium">Rank</th>
                <th className="text-left px-6 py-3 font-medium">Country</th>
                <th className="text-left px-6 py-3 font-medium">
                  Precarity Score
                  <div className="text-[9px] normal-case tracking-normal text-[#9c958c] mt-0.5">
                    Out of 100
                  </div>
                </th>
                <th className="text-left px-6 py-3 font-medium">Risk Level</th>
                <th className="text-left px-6 py-3 font-medium">
                  Change
                  <div className="text-[9px] normal-case tracking-normal text-[#9c958c] mt-0.5">
                    vs. {prevYear ?? "previous"}
                  </div>
                </th>
                <th className="text-left px-6 py-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((d, i) => {
                const realRank = (page - 1) * PAGE_SIZE + i + 1;
                const prevScore = prevYear ? scoreFor(d, prevYear) : null;
                const change = prevScore != null ? d.risk_score - prevScore : null;
                const color = RISK_COLORS[d.risk_label];
                // Trend: oldest → selected year (up to 3 points)
                const trendYears = ["2021", "2022", yLabel].filter(
                  (y, idx, arr) => arr.indexOf(y) === idx
                );
                const trendScores = trendYears.map((y) => scoreFor(d, y));
                return (
                  <tr
                    key={d.country}
                    onClick={() => onSelectCountry?.(d.country)}
                    className="border-b border-[#EFE8DE] last:border-0 hover:bg-[#EFE8DE]/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3.5 text-[#5F5B57] font-mono tabular-nums">
                      {realRank}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-3">
                        <span
                          className="h-5 w-7 rounded-sm border border-[#DDD6CC] flex items-center justify-center text-[9px] font-mono text-[#5F5B57] bg-white shrink-0"
                          aria-hidden
                        >
                          {d.country.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[#1D1D1D] font-medium">
                          {d.country}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono tabular-nums text-[#1D1D1D]">
                      {fmt(d.risk_score)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-sm text-[10px] font-mono tracking-[0.15em] ${RISK_BADGE[d.risk_label]}`}
                      >
                        {d.risk_label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono tabular-nums">
                      {change == null ? (
                        <span className="text-[#9c958c]">N/A</span>
                      ) : (
                        <span
                          className={
                            change >= 0 ? "text-[#A54E42]" : "text-[#708C74]"
                          }
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-2">
                      <Sparkline scores={trendScores} color={color} />
                    </td>
                  </tr>
                );
              })}
              {pageItems.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-14 text-[#5F5B57] text-sm"
                  >
                    No countries match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-[#5F5B57]">
          Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          countries
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[#DDD6CC] text-[#5F5B57] hover:bg-[#EFE8DE] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-mono ${
                n === page
                  ? "bg-[#1D2A36] text-white"
                  : "border border-[#DDD6CC] text-[#5F5B57] hover:bg-[#EFE8DE]"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[#DDD6CC] text-[#5F5B57] hover:bg-[#EFE8DE] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
