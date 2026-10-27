import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Minus, Plus, RotateCcw, TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";
import { PILLARS, RISK_COLORS, avg, fmt, type CountryData } from "./types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_ALIASES: Record<string, string> = {
  Czechia: "Czech Republic",
  "Czech Rep.": "Czech Republic",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "North Macedonia": "North Macedonia",
  Macedonia: "North Macedonia",
  "Republic of Serbia": "Serbia",
};

function topPillar(c: CountryData): { label: string; icon: string; value: number } {
  const ranked = PILLARS.map((p) => ({
    label: p.label,
    icon: p.icon,
    value: (c[p.normKey] as number) ?? 0,
  })).sort((a, b) => b.value - a.value);
  return ranked[0];
}

const LEGEND_RANGES = [
  { label: "Low", range: "0–40", color: RISK_COLORS.LOW },
  { label: "Moderate", range: "40–55", color: RISK_COLORS.MODERATE },
  { label: "High", range: "55–65", color: RISK_COLORS.HIGH },
  { label: "Severe", range: "65+", color: RISK_COLORS.SEVERE },
];

export function EuropeMap({
  data,
  highlightedCountry,
}: {
  data: CountryData[];
  highlightedCountry?: string | null;
}) {
  const highlightLc = highlightedCountry?.toLowerCase() ?? null;
  const [hover, setHover] = useState<CountryData | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [resetKey, setResetKey] = useState(0);

  const byCountry = useMemo(() => {
    const m = new Map<string, CountryData>();
    data.forEach((d) => m.set(d.country.toLowerCase(), d));
    return m;
  }, [data]);

  const lookup = (name: string): CountryData | undefined => {
    const aliased = NAME_ALIASES[name] ?? name;
    return byCountry.get(aliased.toLowerCase());
  };

  const reset = () => {
    setZoom(1);
    setCenter([0, 0]);
    setResetKey((k) => k + 1);
  };

  const zoomIn = () => setZoom((z) => Math.min(+(z * 1.4).toFixed(3), 6));
  const zoomOut = () => setZoom((z) => Math.max(+(z / 1.4).toFixed(3), 1));

  // KPI strip
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.risk_score - a.risk_score),
    [data],
  );
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  const euAvg = avg(data.map((d) => d.risk_score));
  const aboveSevere = data.filter((d) => d.risk_score >= 65).length;

  const kpis = [
    {
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      label: "Highest risk",
      value: highest?.country ?? "—",
      sub: `${fmt(highest?.risk_score ?? 0)} pts`,
      color: "#0F4C81",
    },
    {
      icon: <TrendingDown className="h-3.5 w-3.5" />,
      label: "Lowest risk",
      value: lowest?.country ?? "—",
      sub: `${fmt(lowest?.risk_score ?? 0)} pts`,
      color: "#4C956C",
    },
    {
      icon: <Activity className="h-3.5 w-3.5" />,
      label: "EU average",
      value: fmt(euAvg),
      sub: "composite score",
      color: "#60a5fa",
    },
    {
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      label: "Above severe",
      value: String(aboveSevere),
      sub: "score ≥ 65",
      color: "#C97A2B",
    },
  ];

  return (
    <div className="relative">
      {/* Section header & narrative */}
      <div className="mb-6">
        <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.3em] mb-1">
          // GEOGRAPHY
        </div>
        <h2 className="text-3xl font-bold text-[#111111]">
          Where work feels least secure in Europe
        </h2>
        <p className="text-[#5a5a5a] text-base mt-2 leading-relaxed max-w-2xl">
          Precarity clusters reveal hidden inequalities beneath employment
          statistics. Geography exposes the pattern that headline figures hide.
        </p>
      </div>

      {/* KPI strip above map */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="relative overflow-hidden rounded-xl border border-[#E5E2DA] bg-[#FFFFFF]/85 backdrop-blur px-4 py-3 hover:border-[#C7C2B6] transition-colors"
          >
            <div
              className="absolute inset-y-0 left-0 w-0.5"
              style={{ background: k.color }}
            />
            <div className="flex items-center gap-2 text-[#737373] font-mono text-[10px] tracking-[0.25em] uppercase">
              <span style={{ color: k.color }}>{k.icon}</span>
              {k.label}
            </div>
            <div className="text-[#111111] font-extrabold text-lg sm:text-xl mt-1 truncate">
              {k.value}
            </div>
            <div className="text-[#737373] text-[11px] font-mono">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Map card */}
      <div className="bg-[#FFFFFF] border border-[#E5E2DA] rounded-2xl p-4 sm:p-6 relative overflow-hidden hover:border-[#D4D0C7] transition-colors">
        {/* Ambient gradient */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(15,76,129,0.04),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_90%_100%,rgba(15,76,129,0.04),transparent_70%)]" />

        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <div className="relative flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-[#111111] font-bold text-lg">
              Risk score choropleth
            </h3>
            <p className="text-[#737373] text-xs mt-0.5">
              Hover any country · scroll or use controls to zoom
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#F7F5F2] border border-[#D4D0C7] rounded-lg p-1">
            <button
              onClick={zoomIn}
              className="p-1.5 hover:bg-[#F2EFE8] rounded text-[#3a3a3a] hover:text-[#111111]"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1.5 hover:bg-[#F2EFE8] rounded text-[#3a3a3a] hover:text-[#111111]"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={reset}
              className="p-1.5 hover:bg-[#F2EFE8] rounded text-[#3a3a3a] hover:text-[#111111]"
              aria-label="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div
          className="relative w-full"
          style={{ height: "min(60vh, 560px)", minHeight: 420 }}
        >
          <ComposableMap
            projection="geoAzimuthalEqualArea"
            projectionConfig={{ rotate: [-15, -54, 0], scale: 1500 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              key={resetKey}
              zoom={zoom}
              center={center}
              onMoveEnd={({ coordinates, zoom: z }) => {
                const [nx, ny] = coordinates as [number, number];
                if (nx !== center[0] || ny !== center[1]) setCenter([nx, ny]);
                if (Math.abs(z - zoom) > 0.001) setZoom(z);
              }}
              minZoom={1}
              maxZoom={6}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name as string;
                    const c = lookup(name);
                    const fill = c ? RISK_COLORS[c.risk_label] : "#ECE9E1";
                    const opacity = c ? 0.45 + (c.risk_score / 100) * 0.55 : 1;
                    const isHighlighted =
                      !!c &&
                      !!highlightLc &&
                      c.country.toLowerCase() === highlightLc;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(e) => {
                          if (c) {
                            setHover(c);
                            const rect = (
                              e.currentTarget.ownerSVGElement
                                ?.parentElement as HTMLElement
                            )?.getBoundingClientRect();
                            setPos({
                              x: e.clientX - (rect?.left ?? 0),
                              y: e.clientY - (rect?.top ?? 0),
                            });
                          }
                        }}
                        onMouseMove={(e) => {
                          const rect = (
                            e.currentTarget.ownerSVGElement
                              ?.parentElement as HTMLElement
                          )?.getBoundingClientRect();
                          setPos({
                            x: e.clientX - (rect?.left ?? 0),
                            y: e.clientY - (rect?.top ?? 0),
                          });
                        }}
                        onMouseLeave={() => setHover(null)}
                        style={{
                          default: {
                            fill,
                            fillOpacity: isHighlighted ? 1 : opacity,
                            stroke: isHighlighted ? "#1D1D1D" : "rgba(255,255,255,0.28)",
                            strokeWidth: isHighlighted ? 2 : 0.6,
                            outline: "none",
                            transition:
                              "fill 0.5s ease, fill-opacity 0.5s ease, stroke 0.25s ease",
                          },
                          hover: {
                            fill: c ? fill : "#D4D0C7",
                            fillOpacity: 1,
                            stroke: isHighlighted ? "#1D1D1D" : c ? "#ffffff" : "#444",
                            strokeWidth: isHighlighted ? 2.2 : 1.4,
                            outline: "none",
                            cursor: c ? "pointer" : "default",
                            filter: c ? "url(#glow-red)" : undefined,
                          },
                          pressed: { fill, outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {hover &&
            (() => {
              const tp = topPillar(hover);
              return (
                <div
                  className="pointer-events-none absolute z-10 rounded-lg px-3 py-2 shadow-2xl text-xs font-mono animate-fade-in border border-[#C7C2B6]"
                  style={{
                    left: Math.min(pos.x + 12, 9999),
                    top: pos.y + 12,
                    background: "rgba(13,13,20,0.92)",
                    backdropFilter: "blur(12px) saturate(140%)",
                  }}
                >
                  <div className="text-[#F5F1EA] font-bold text-sm font-sans flex items-center gap-2">
                    {hover.country}
                    <span className="text-[#A8A296] font-mono text-[10px]">
                      #{hover.rank}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: RISK_COLORS[hover.risk_label] }}
                    />
                    <span style={{ color: RISK_COLORS[hover.risk_label] }}>
                      {hover.risk_label}
                    </span>
                    <span className="text-[#A8A296]">·</span>
                    <span className="text-[#F5F1EA]">
                      score {fmt(hover.risk_score)}
                    </span>
                  </div>
                  <div className="text-[#A8A296] mt-1.5 text-[10px]">
                    Dominant factor:{" "}
                    <span className="text-[#F5F1EA]">
                      {tp.icon} {tp.label}
                    </span>
                  </div>
                </div>
              );
            })()}
        </div>

        {/* Animated legend */}
        <div className="relative mt-5 pt-4 border-t border-[#E5E2DA]">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-mono text-[10px] text-[#737373] tracking-[0.25em] uppercase">
              Risk band
            </span>
            <div className="flex flex-wrap gap-2">
              {LEGEND_RANGES.map((l, i) => (
                <div
                  key={l.label}
                  className="group flex items-center gap-2 rounded-md border border-[#D4D0C7] bg-[#F7F5F2]/60 px-2.5 py-1.5 hover:border-[#A8A296] transition-colors"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span
                    className="h-3 w-5 rounded-sm"
                    style={{
                      background: `linear-gradient(90deg, ${l.color}aa, ${l.color})`,
                      boxShadow: `0 0 10px ${l.color}55`,
                    }}
                  />
                  <span
                    className="text-[11px] font-mono font-semibold"
                    style={{ color: l.color }}
                  >
                    {l.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#737373]">
                    {l.range}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(90deg, ${RISK_COLORS.LOW}, ${RISK_COLORS.MODERATE} 40%, ${RISK_COLORS.HIGH} 65%, ${RISK_COLORS.SEVERE})`,
                boxShadow: "0 0 18px rgba(15,76,129,0.07) inset",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
