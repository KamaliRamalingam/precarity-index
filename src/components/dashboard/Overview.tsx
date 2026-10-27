import { Users, ShieldCheck, Calculator, AlertTriangle, TrendingUp, UserMinus, Scale, Lightbulb, ArrowRight } from "lucide-react";
import {
  RISK_COLORS,
  RISK_BADGE,
  avg,
  fmt,
  type CountryData,
  type RiskLabel,
} from "./types";
import { EuropeMap } from "./EuropeMap";
import { EmploymentScatter } from "./EmploymentScatter";

function HeroStat({
  icon: Icon,
  value,
  label,
  sub,
  iconTone = "outline",
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  sub: string;
  iconTone?: "outline" | "filled";
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <span
        className={`h-12 w-12 rounded-full flex items-center justify-center border ${
          iconTone === "filled"
            ? "border-[#C46A3D] bg-[#C46A3D]/10 text-[#E8B889]"
            : "border-white/25 text-white/80"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="font-serif text-[2.25rem] leading-none text-white">{value}</p>
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-white/55 text-xs mt-1">{sub}</p>
      </div>
    </div>
  );
}

function FindingCard({
  icon: Icon,
  iconBg,
  title,
  body,
  exampleLabel,
  exampleColor,
  whyItMatters,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  title: string;
  body: string;
  exampleLabel: string;
  exampleColor: string;
  whyItMatters: string;
}) {
  return (
    <article className="h-full bg-[#FCFAF7] border border-[#DDD6CC] rounded-md p-5 flex flex-col hover:border-[#C46A3D]/50 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-25px_rgba(47,58,69,0.35)] transition-all duration-300">
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span
            className="h-9 w-9 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="font-serif text-[#1D1D1D] text-[17px] leading-snug font-semibold pt-1.5">
            {title}
          </h3>
        </div>
        <p className="text-[#3a3530] text-sm leading-relaxed">{body}</p>
        <p className="text-sm">
          <span className="font-semibold text-[#1D1D1D]">Example:</span>{" "}
          <span style={{ color: exampleColor }} className="font-medium">
            {exampleLabel}
          </span>
        </p>
      </div>
      <div className="mt-4 bg-[#EFE8DE] border-t border-[#DDD6CC] -mx-5 -mb-5 px-5 py-2.5 rounded-b-md">
        <p className="text-xs text-[#3a3530]">
          <span className="font-semibold">Why it matters:</span> {whyItMatters}
        </p>
      </div>
    </article>
  );
}

export function Overview({
  data,
  onNavigate,
}: {
  data: CountryData[];
  onNavigate?: (tab: "Explorer" | "Ranking") => void;
}) {
  const labelCounts = { SEVERE: 0, HIGH: 0, MODERATE: 0, LOW: 0 };
  data.forEach((d) => {
    if (labelCounts[d.risk_label] !== undefined) labelCounts[d.risk_label]++;
  });
  const euAvgScore = fmt(avg(data.map((d) => d.risk_score)));
  const topCountry = [...data].sort((a, b) => b.risk_score - a.risk_score)[0];
  const topFive = [...data].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* HERO — dark editorial */}
      <section className="relative overflow-hidden bg-[#1D2A36] text-white">
        {/* Soft Europe map texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><g fill='%23ffffff' fill-opacity='0.6'><path d='M120 180 q40 -40 90 -30 t110 -10 t90 30 t60 50 t-30 90 t-110 40 t-130 -20 t-90 -70 z'/><path d='M340 110 q60 -20 120 0 t90 50 t-20 80 t-100 30 z'/><path d='M250 320 q60 30 130 20 t150 -30 t100 20 t-30 110 t-160 50 t-180 -30 t-50 -110 z'/></g></svg>\")",
            backgroundSize: "70% auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_15%_30%,rgba(196,106,61,0.10),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: headline + quote */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.32em] text-[#C46A3D] uppercase mb-6">
              Labor Rights. Data. Dignity.
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] text-white leading-[1.05] tracking-tight">
              The Hidden Psychological
              <br />
              Cost of{" "}
              <span className="text-[#E8956B] italic">Unstable Work</span>
            </h1>
            <p className="mt-6 text-white/65 text-base sm:text-lg leading-relaxed max-w-xl">
              High employment rates can hide financial stress, job insecurity,
              burnout, and inequality across Europe.
            </p>

            {/* Quote banner */}
            <div className="mt-8 inline-flex items-center gap-4 border border-[#C46A3D]/70 rounded-md px-5 py-4 max-w-xl">
              <span className="font-serif text-3xl text-[#C46A3D] leading-none">“</span>
              <p className="font-serif italic text-lg sm:text-xl text-white">
                Employment does not equal security.
              </p>
            </div>
          </div>

          {/* Right: 4 stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4">
            <HeroStat
              icon={Users}
              value={data.length}
              label="Countries"
              sub="Across Europe"
            />
            <HeroStat
              icon={ShieldCheck}
              value="4"
              label="Labor Metrics"
              sub="Core dimensions of precarity"
              iconTone="filled"
            />
            <HeroStat
              icon={Calculator}
              value={euAvgScore}
              label="EU Average Score"
              sub="Out of 100"
              iconTone="filled"
            />
            <HeroStat
              icon={AlertTriangle}
              value={labelCounts.SEVERE}
              label="Severe Risk"
              sub="Countries"
              iconTone="filled"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-8 py-10 flex flex-col gap-8">
        {/* MAP + SCATTER */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Map card */}
          <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-1">
              <div>
                <p className="font-mono text-[11px] tracking-[0.25em] text-[#1D1D1D] uppercase font-semibold">
                  A Precarity Map of Europe
                </p>
                <p className="text-[#5F5B57] text-sm mt-1">Overall Precarity Risk Score</p>
              </div>
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
            <EuropeMap data={data} />
          </div>

          {/* Scatter card */}
          <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 sm:p-6 flex flex-col">
            <div className="mb-1">
              <p className="font-mono text-[11px] tracking-[0.25em] text-[#1D1D1D] uppercase font-semibold">
                Employment Does Not Equal Security
              </p>
              <p className="text-[#5F5B57] text-sm mt-1">
                Employment rate vs. Precarity Risk Score ({data.length} countries)
              </p>
            </div>
            <div className="flex-1">
              <EmploymentScatter data={data} />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 bg-[#EFE8DE] border border-[#DDD6CC] rounded-md px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="h-7 w-7 rounded-full bg-[#1D2A36] text-[#E8B889] flex items-center justify-center shrink-0">
                  <Lightbulb className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm text-[#1D1D1D] leading-relaxed">
                  <span className="font-semibold">Paradox:</span> {topCountry.country} ranks
                  among Europe's highest employment economies — yet shows the highest
                  precarity burden.
                </p>
              </div>
              <button
                onClick={() => onNavigate?.("Explorer")}
                className="shrink-0 inline-flex items-center gap-1 text-[#C46A3D] hover:text-[#A54E42] text-sm font-medium whitespace-nowrap"
              >
                Explore {topCountry.country} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* KEY FINDINGS + HIGHEST RISK */}
        <section className="grid grid-cols-1 xl:grid-cols-[2.2fr_1fr] gap-6 items-start">
          <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 sm:p-6 flex flex-col">
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#1D1D1D] uppercase font-semibold mb-4">
              Key Findings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <FindingCard
                icon={TrendingUp}
                iconBg="#C46A3D"
                title="High Employment, High Insecurity"
                body="Some countries combine high employment with severe precarity due to inequality and instability."
                exampleLabel="Estonia, Romania"
                exampleColor="#C46A3D"
                whyItMatters="Quantity of jobs ≠ Quality of work."
              />
              <FindingCard
                icon={UserMinus}
                iconBg="#B5965B"
                title="Short Tenure Drives Insecurity"
                body="Short job tenure is one of the strongest predictors of psychological and economic instability."
                exampleLabel="Türkiye, Spain"
                exampleColor="#B5965B"
                whyItMatters="Instability erodes long-term security."
              />
              <FindingCard
                icon={Scale}
                iconBg="#708C74"
                title="Inequality Deepens Worker Stress"
                body="Pay gaps and poverty risk remain major drivers of chronic financial and mental strain."
                exampleLabel="Latvia, Lithuania"
                exampleColor="#708C74"
                whyItMatters="Inequality compounds stress."
              />
            </div>
          </div>

          <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[11px] tracking-[0.25em] text-[#1D1D1D] uppercase font-semibold">
                Highest Risk Countries
              </p>
              <button
                onClick={() => onNavigate?.("Ranking")}
                className="text-[#C46A3D] hover:text-[#A54E42] text-xs font-medium inline-flex items-center gap-1"
              >
                View full rankings <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="flex flex-col">
              {topFive.map((c, i) => (
                <button
                  key={c.country}
                  onClick={() => onNavigate?.("Explorer")}
                  className={`group grid grid-cols-[24px_32px_1fr_auto_auto] items-center gap-3 py-2.5 text-left ${
                    i < topFive.length - 1 ? "border-b border-[#EFE8DE]" : ""
                  } hover:bg-[#EFE8DE]/40 -mx-2 px-2 rounded transition-colors`}
                >
                  <span className="font-mono text-sm text-[#5F5B57] tabular-nums">
                    {c.rank}
                  </span>
                  <span
                    className="h-5 w-7 rounded-sm border border-[#DDD6CC] flex items-center justify-center text-[9px] font-mono text-[#5F5B57] bg-white"
                    aria-hidden
                  >
                    {c.country.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-[#1D1D1D] text-sm group-hover:text-[#C46A3D] transition-colors">
                    {c.country}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-[0.15em] ${RISK_BADGE[c.risk_label as RiskLabel]}`}
                  >
                    {c.risk_label}
                  </span>
                  <span
                    className="font-mono font-semibold text-sm text-right tabular-nums w-12"
                    style={{ color: RISK_COLORS[c.risk_label as RiskLabel] }}
                  >
                    {fmt(c.risk_score)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
