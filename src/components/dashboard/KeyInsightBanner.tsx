import { useEffect, useState } from "react";

const INSIGHTS = [
  "High employment does not guarantee psychological security.",
  "Gender equality in participation does not mean equality in pay.",
  "Flexible labor markets can increase instability.",
  "Economic growth can coexist with worker precarity.",
  "Stable jobs can still leave workers in poverty.",
];

export function KeyInsightBanner() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((p) => (p + 1) % INSIGHTS.length);
        setFade(true);
      }, 350);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl glass px-4 sm:px-6 py-4 flex items-center gap-4">
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#0F4C81] opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F4C81]" />
        </span>
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#0F4C81]">
          KEY INSIGHT
        </span>
      </div>
      <div className="h-6 w-px bg-[#ECE9E1] hidden sm:block" />
      <p
        key={i}
        className={`text-sm sm:text-base font-medium leading-snug transition-all duration-500 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        } text-[#111111] text-glow`}
      >
        “{INSIGHTS[i]}”
      </p>
      <div className="ml-auto hidden md:flex gap-1">
        {INSIGHTS.map((_, idx) => (
          <span
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === i ? "w-6 bg-[#0F4C81]" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
