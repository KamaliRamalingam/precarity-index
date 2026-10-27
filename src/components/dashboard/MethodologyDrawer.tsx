import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X, Database, AlertTriangle, Workflow, Sigma } from "lucide-react";
import { PILLARS } from "./types";

export function MethodologyDrawer({
  open: controlledOpen,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setAnimateBars(true), 200);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    } else {
      setAnimateBars(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flowSteps = [
    { icon: <Database className="h-4 w-4" />, title: "Collect", body: "Eurostat + ILO indicators across 30+ European countries (2019–2025)." },
    { icon: <Sigma className="h-4 w-4" />, title: "Normalize", body: "Min–max scale each indicator to a 0–100 burden range." },
    { icon: <Workflow className="h-4 w-4" />, title: "Weight", body: "Combine four pillars by labor-research weights into one composite." },
    { icon: <AlertTriangle className="h-4 w-4" />, title: "Classify", body: "Map score to LOW · MODERATE · HIGH · SEVERE risk bands." },
  ];

  return (
    <>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs tracking-wider text-[#3a3530] hover:text-[#1D1D1D] border border-[#DDD6CC] hover:border-[#C46A3D]/50 hover:bg-[#C46A3D]/5 transition-all"
          aria-label="Open methodology"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">METHODOLOGY</span>
        </button>
      )}

      {open && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto px-3 py-3 sm:px-6 sm:py-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-[#1a1a1a]/35 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Methodology"
            className="relative mx-auto my-2 sm:my-4 w-full max-w-4xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] flex flex-col rounded-2xl border border-[#D4D0C7] bg-[#FAFAF8] shadow-[0_30px_120px_-20px_rgba(15,76,129,0.14)] overflow-hidden animate-scale-in"
            style={{
              backdropFilter: "blur(10px) saturate(110%)",
              WebkitBackdropFilter: "blur(10px) saturate(110%)",
            }}
          >
            {/* Ambient gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,rgba(15,76,129,0.05),transparent_70%)]" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_30%_at_90%_110%,rgba(201,122,43,0.05),transparent_70%)]" />

            {/* Header */}
            <div className="relative z-20 flex-shrink-0 px-6 sm:px-10 pt-7 pb-5 border-b border-[#D4D0C7] flex items-start justify-between gap-4 bg-[#FAFAF8]">
              <div>
                <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.3em]">
                  // METHODOLOGY
                </div>
                <h2 className="text-[#111111] font-extrabold text-xl sm:text-2xl mt-1 leading-tight">
                  How the Precarity Index is built
                </h2>
                <p className="text-[#5f5f5f] text-sm mt-2 max-w-xl leading-relaxed">
                  Psychological burden is inferred using labor precarity proxies from
                  labor economics and wellbeing research — not measured directly.
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="relative z-30 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-[#FFFFFF] hover:bg-[#ECE9E1] text-[#1a1a1a] border border-[#CFC9BD] shadow-sm transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Close methodology"
              >
                <X className="h-4 w-4 pointer-events-none" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-7 space-y-10 bg-[#FAFAF8]">
              {/* Flow diagram */}
              <section>
                <SectionLabel>Process flow</SectionLabel>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  {flowSteps.map((s, i) => (
                    <div
                      key={s.title}
                      className="relative rounded-xl border border-[#E5E2DA] bg-[#FFFFFF]/80 p-4 hover:border-[#0F4C81]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-[#0F4C81]/70">
                          0{i + 1}
                        </span>
                        <span className="text-[#0F4C81]">{s.icon}</span>
                      </div>
                      <h4 className="text-[#111111] font-semibold text-sm">{s.title}</h4>
                      <p className="text-[#5f5f5f] text-xs mt-1 leading-relaxed">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <AnimatedDivider />

              {/* The four pillars + formula */}
              <section>
                <SectionLabel>The weighted formula</SectionLabel>

                {/* Modern formula card */}
                <div className="mt-4 rounded-2xl border border-[#D4D0C7] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_8px_30px_-18px_rgba(15,76,129,0.18)]">
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="font-serif italic text-[#111111] text-xl sm:text-2xl">
                      Precarity Score
                    </span>
                    <span className="text-[#0F4C81] font-mono text-xl">=</span>
                  </div>
                  <div className="space-y-4">
                    {PILLARS.map((p, i) => (
                      <div key={p.key as string} className="grid grid-cols-[auto,3rem,1fr] sm:grid-cols-[auto,4rem,1fr,auto] items-center gap-3 sm:gap-4">
                        <span className="text-[#737373] text-xl font-mono w-4">
                          {i === 0 ? "" : "+"}
                        </span>
                        <span
                          className="font-extrabold font-mono text-2xl tabular-nums"
                          style={{ color: p.color }}
                        >
                          {(p.weight * 100).toFixed(0)}%
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{p.icon}</span>
                            <span className="text-[#111111] font-semibold text-sm">
                              {p.label}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-[#F2EFE8] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-[width] duration-1000 ease-out"
                              style={{
                                width: animateBars ? `${p.weight * 100 * 2.5}%` : "0%",
                                maxWidth: "100%",
                                background: p.color,
                              }}
                            />
                          </div>
                        </div>
                        <span className="hidden sm:block text-[11px] font-mono text-[#737373] text-right max-w-[180px] leading-tight">
                          {p.proxy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[#6b6b6b] text-xs mt-4 italic leading-relaxed max-w-2xl">
                  Each raw indicator is min–max scaled across the country sample
                  before weighting, so the highest observed burden maps to 100.
                </p>
              </section>

              <AnimatedDivider />

              {/* Data */}
              <section>
                <SectionLabel>Data sources</SectionLabel>
                <ul className="grid sm:grid-cols-2 gap-2 mt-4 text-sm text-[#444444]">
                  {[
                    ["Eurostat LFSA_EGAD", "Employment by gender"],
                    ["Eurostat TESEM010", "Gender pay gap"],
                    ["Eurostat TESEM180", "In-work poverty risk"],
                    ["Eurostat TESOV110", "Job tenure under 12 months"],
                    ["ILO HOW_UEES_SEX_NB_A", "Average weekly hours"],
                    ["Reference period", "2019–2025"],
                  ].map(([code, desc]) => (
                    <li
                      key={code}
                      className="flex items-start gap-3 rounded-lg border border-[#E5E2DA] bg-[#FFFFFF]/60 px-3 py-2"
                    >
                      <span className="font-mono text-[11px] text-[#0F4C81]/80 flex-shrink-0 mt-0.5">
                        ●
                      </span>
                      <div>
                        <div className="font-mono text-xs text-[#2a2a2a]">{code}</div>
                        <div className="text-[#6b6b6b] text-xs">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <AnimatedDivider />

              {/* Limitations */}
              <section>
                <SectionLabel>Limitations</SectionLabel>
                <ul className="mt-4 space-y-2 text-sm text-[#444444] leading-relaxed">
                  {[
                    "The index is a proxy: it measures conditions that correlate with psychosocial stress, not stress itself.",
                    'Country comparability varies — definitions of "short tenure" and "in-work poverty" differ slightly across sources.',
                    "Weights are normative choices informed by labor research, not empirically optimal.",
                    "Min–max normalization is sensitive to outliers within the sample.",
                    "The pay-gap indicator is unadjusted and reflects the combined effect of occupation, hours, sector, and discrimination.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className="text-[#0F4C81]/70 mt-1.5 h-1 w-1 rounded-full bg-[#0F4C81]/70 flex-shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="pt-4 border-t border-[#E5E2DA]">
                <p className="text-[#9a9a9a] text-xs font-mono leading-relaxed">
                  Built for the Labor Rights Data Hackathon · Data &amp; AI Stockholm
                  × Lovable
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] text-[#0F4C81] tracking-[0.3em] uppercase">
      // {children}
    </div>
  );
}

function AnimatedDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C7C2B6] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F4C81]/40 to-transparent shimmer" />
    </div>
  );
}
