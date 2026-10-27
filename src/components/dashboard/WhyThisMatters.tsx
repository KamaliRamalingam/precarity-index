import { Brain, HeartCrack, Scale } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import type { CountryData } from "./types";
import { avg } from "./types";

export function WhyThisMatters({ data }: { data: CountryData[] }) {
  const burnoutShare = Math.round(
    (data.filter((d) => d.overwork_flag).length / data.length) * 100,
  );
  const avgPayGap = avg(data.map((d) => d.gender_pay_gap_pct));
  const avgPoverty = avg(data.map((d) => d.poverty_rate_avg));

  const stats = [
    {
      icon: Brain,
      value: burnoutShare,
      suffix: "%",
      label: "of countries flagged for chronic overwork",
      caption: "Sustained long hours are linked to elevated burnout risk.",
    },
    {
      icon: Scale,
      value: avgPayGap,
      suffix: "%",
      decimals: 1,
      label: "average gender pay gap across Europe",
      caption: "Equal participation rarely means equal compensation.",
    },
    {
      icon: HeartCrack,
      value: avgPoverty,
      suffix: "%",
      decimals: 1,
      label: "of workers live in in-work poverty",
      caption: "Having a job is no longer a guarantee of dignity.",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl glass p-6 sm:p-10">
      <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[#0F4C81]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.25em] mb-2">
            // WHY THIS MATTERS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
            Behind every employment number is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C81] to-[#C97A2B]">
              a human nervous system
            </span>
            .
          </h2>
          <p className="mt-5 text-[#3a3a3a] leading-relaxed">
            Headline statistics tell us how many people work — not how that work
            feels. They miss the silent epidemic of{" "}
            <span className="text-[#111111] font-semibold">burnout</span>, the slow
            grind of <span className="text-[#111111] font-semibold">unstable contracts</span>,
            the quiet anxiety of <span className="text-[#111111] font-semibold">in-work poverty</span>,
            and the systemic unfairness of{" "}
            <span className="text-[#111111] font-semibold">unequal pay</span>.
          </p>
          <p className="mt-3 text-[#5f5f5f] italic leading-relaxed">
            Economic dignity is not a metric most dashboards track. This one
            does — because mental health is a labor right.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative bg-[#FFFFFF]/70 border border-[#E5E2DA] rounded-2xl p-5 flex items-start gap-4 hover:border-[#0F4C81]/40 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-12px_rgba(15,76,129,0.10)] transition-all duration-300"
            >
              <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-[#0F4C81]/20 to-[#C97A2B]/10 border border-[#0F4C81]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <s.icon className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-3xl font-extrabold font-mono text-[#111111] leading-none">
                  <AnimatedCounter
                    value={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                  />
                </p>
                <p className="text-[#3a3a3a] text-sm mt-1.5 leading-snug">
                  {s.label}
                </p>
                <p className="text-[#737373] text-xs mt-1 italic">{s.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
