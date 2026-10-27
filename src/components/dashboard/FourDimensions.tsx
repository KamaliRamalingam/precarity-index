import { ArrowRight, Wallet, Briefcase, Scale, Clock } from "lucide-react";

type Dim = {
  num: string;
  title: string;
  color: string;
  callout: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  desc: string;
  euAvg: string;
  euAvgRaw: number;
  worstCountry: string;
  worstValue: string;
  worstRaw: number;
  unit: string;
  top5: { country: string; value: number }[];
  max: number;
  insight: string;
};

const DIMS: Dim[] = [
  {
    num: "01",
    title: "Financial Stress",
    color: "#C0392B",
    callout: "#FADBD8",
    Icon: Wallet,
    desc: "Economic insecurity that puts pressure on daily life.",
    euAvg: "8.0%",
    euAvgRaw: 8.0,
    worstCountry: "Luxembourg",
    worstValue: "14.9%",
    worstRaw: 14.9,
    unit: "%",
    top5: [
      { country: "Luxembourg", value: 14.9 },
      { country: "Romania", value: 14.6 },
      { country: "Bulgaria", value: 11.3 },
      { country: "Spain", value: 11.2 },
      { country: "Estonia", value: 10.3 },
    ],
    max: 20,
    insight: "Working poverty persists despite employment growth.",
  },
  {
    num: "02",
    title: "Job Instability",
    color: "#E67E22",
    callout: "#FDEBD0",
    Icon: Briefcase,
    desc: "Unstable employment relationships that undermine security.",
    euAvg: "13.6%",
    euAvgRaw: 13.6,
    worstCountry: "Türkiye",
    worstValue: "26.0%",
    worstRaw: 26.0,
    unit: "%",
    top5: [
      { country: "Türkiye", value: 26.0 },
      { country: "Denmark", value: 19.8 },
      { country: "Finland", value: 18.8 },
      { country: "Iceland", value: 17.8 },
      { country: "Netherlands", value: 17.6 },
    ],
    max: 30,
    insight: "Short tenure predicts insecure labor conditions.",
  },
  {
    num: "03",
    title: "Pay Inequality",
    color: "#6C3483",
    callout: "#E8DAEF",
    Icon: Scale,
    desc: "Unequal pay that deepens economic vulnerability.",
    euAvg: "11.4%",
    euAvgRaw: 11.4,
    worstCountry: "Estonia",
    worstValue: "21.1%",
    worstRaw: 21.1,
    unit: "%",
    top5: [
      { country: "Estonia", value: 21.1 },
      { country: "Latvia", value: 18.9 },
      { country: "Austria", value: 18.7 },
      { country: "Czechia", value: 18.4 },
      { country: "Germany", value: 17.7 },
    ],
    max: 25,
    insight: "Gender disparities continue to shape economic vulnerability.",
  },
  {
    num: "04",
    title: "Overwork Risk",
    color: "#1A5276",
    callout: "#D6EAF8",
    Icon: Clock,
    desc: "Excessive work hours that harm well-being and increase burnout.",
    euAvg: "37.7h",
    euAvgRaw: 37.7,
    worstCountry: "Türkiye",
    worstValue: "45.1h/wk",
    worstRaw: 45.1,
    unit: "h",
    top5: [
      { country: "Türkiye", value: 45.1 },
      { country: "Albania", value: 43.6 },
      { country: "Serbia", value: 42.8 },
      { country: "Romania", value: 40.3 },
      { country: "Cyprus", value: 40.0 },
    ],
    max: 50,
    insight: "Long work hours increase burnout exposure.",
  },
];

export function FourDimensions({
  onNavigateRankings,
}: {
  onNavigateRankings: () => void;
}) {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Header */}
      <header className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#5F5B57] mb-3">
          Dashboard
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1D1D1D] leading-tight">
          The Four Dimensions of Precarity
        </h1>
        <div className="h-1 w-16 bg-[#534AB7] mt-4 mb-5" />
        <p className="font-serif text-[#5F5B57] text-base sm:text-lg max-w-3xl leading-relaxed">
          Four interlinked drivers behind worker insecurity and psychological
          strain — measured across 34 European countries.
        </p>
      </header>

      {/* Section 1 — Summary stat row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {DIMS.map((d) => (
          <div
            key={d.num}
            className="bg-white border border-[#DDD6CC] rounded-sm p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#5F5B57]">
                {d.title}
              </span>
            </div>
            <div
              className="font-serif text-3xl sm:text-4xl font-semibold tabular-nums"
              style={{ color: d.color }}
            >
              {d.euAvg}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-[#5F5B57] uppercase mt-1">
              EU Average
            </div>
            <div className="mt-3 pt-3 border-t border-[#DDD6CC] text-xs text-[#5F5B57]">
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Worst:
              </span>{" "}
              <span className="font-serif text-[#1D1D1D]">
                {d.worstCountry}
              </span>{" "}
              <span className="font-mono tabular-nums">{d.worstValue}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Section 2 — Four dimension cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
        {DIMS.map((d) => {
          const Icon = d.Icon;
          return (
            <article
              key={d.num}
              className="bg-white border border-[#DDD6CC] rounded-sm p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="h-9 w-9 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: `${d.color}18` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: d.color }} />
                </div>
                <span
                  className="font-mono text-[11px] tracking-[0.2em]"
                  style={{ color: d.color }}
                >
                  {d.num}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1D1D1D] mb-1.5">
                {d.title}
              </h3>
              <p className="text-sm text-[#5F5B57] leading-relaxed mb-4">
                {d.desc}
              </p>

              {/* Stat boxes */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-[#F5F1EA] border border-[#DDD6CC] rounded-sm px-3 py-2">
                  <div className="font-mono text-[9px] tracking-wider uppercase text-[#5F5B57]">
                    EU Avg
                  </div>
                  <div
                    className="font-serif text-base font-semibold tabular-nums"
                    style={{ color: d.color }}
                  >
                    {d.euAvg}
                  </div>
                </div>
                <div
                  className="border rounded-sm px-3 py-2"
                  style={{
                    backgroundColor: `${d.color}10`,
                    borderColor: `${d.color}40`,
                  }}
                >
                  <div className="font-mono text-[9px] tracking-wider uppercase text-[#5F5B57]">
                    Worst
                  </div>
                  <div
                    className="font-serif text-base font-semibold tabular-nums truncate"
                    style={{ color: d.color }}
                  >
                    {d.worstValue}
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex flex-col gap-2 mb-5">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5F5B57] mb-1">
                  Top 5 Countries
                </div>
                {d.top5.map((row) => {
                  const pct = (row.value / d.max) * 100;
                  return (
                    <div
                      key={row.country}
                      className="grid grid-cols-[80px_1fr_46px] items-center gap-2 text-xs"
                    >
                      <span className="font-serif text-[#1D1D1D] truncate">
                        {row.country}
                      </span>
                      <div className="h-2 bg-[#F0EAE0] rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: d.color,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[#1D1D1D] tabular-nums text-right">
                        {row.value.toFixed(1)}
                        {d.unit}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Insight callout */}
              <div
                className="mt-auto border-l-2 pl-3 py-2 rounded-r-sm"
                style={{
                  backgroundColor: d.callout,
                  borderColor: d.color,
                }}
              >
                <p
                  className="font-serif italic text-sm leading-snug"
                  style={{ color: d.color }}
                >
                  “{d.insight}”
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Footer banner */}
      <div className="bg-[#2C2A22] rounded-sm px-6 sm:px-8 py-6 sm:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-serif text-white text-base sm:text-lg leading-relaxed max-w-2xl">
          These four dimensions combine to form the Precarity Index. Explore
          country rankings to see the bigger picture.
        </p>
        <button
          onClick={onNavigateRankings}
          className="inline-flex items-center gap-2 bg-[#C46A3D] hover:bg-[#b15e34] text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
        >
          Explore Rankings
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Data source line */}
      <p className="mt-4 font-mono text-[10px] tracking-wider text-[#5F5B57] text-center sm:text-left">
        Data: Eurostat, ILO, EU–SILC <span className="text-[#DDD6CC]">|</span>{" "}
        Years: 2019–2023 (latest available){" "}
        <span className="text-[#DDD6CC]">|</span> Precarity Index v1.0{" "}
        <span className="text-[#DDD6CC]">|</span> Built for Labor Rights Data
        Hackathon
      </p>
    </div>
  );
}
