import { Database, Globe, Info } from "lucide-react";

function FormulaPart({
  letter,
  label,
  weight,
  color,
}: {
  letter: string;
  label: string;
  weight: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-3">
      <span
        className="font-serif text-4xl font-semibold"
        style={{ color }}
      >
        {letter}
      </span>
      <p className="mt-3 font-medium text-[#1D1D1D] text-sm">{label}</p>
      <p className="text-[#5F5B57] text-xs mt-0.5">({weight})</p>
    </div>
  );
}

function SourceCard({
  icon: Icon,
  name,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-9 w-9 rounded-md bg-[#EFE8DE] border border-[#DDD6CC] flex items-center justify-center text-[#2F3A45] shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="font-serif text-[#1D1D1D] text-base font-semibold leading-tight">
          {name}
        </p>
        <p className="text-[#5F5B57] text-xs mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

export function Methodology() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page intro */}
      <header>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1D] tracking-tight">
          How the Precarity Index is Built
        </h1>
        <p className="text-[#5F5B57] text-base mt-2 max-w-3xl">
          A composite index that captures the hidden psychological and economic
          costs of unstable work.
        </p>
      </header>

      {/* Formula + Normalization */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Formula */}
        <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#5F5B57] uppercase mb-5">
            The Formula
          </p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mb-2">
            <span className="font-serif text-[#1D1D1D] text-lg italic">
              Precarity Score =
            </span>
            <span className="font-serif text-[#1D1D1D] text-2xl tracking-tight">
              0.30<span style={{ color: "#C0392B" }}>F</span>{" "}
              <span className="text-[#5F5B57]">+</span> 0.20
              <span style={{ color: "#E67E22" }}>J</span>{" "}
              <span className="text-[#5F5B57]">+</span> 0.30
              <span style={{ color: "#6C3483" }}>P</span>{" "}
              <span className="text-[#5F5B57]">+</span> 0.20
              <span style={{ color: "#1A5276" }}>O</span>
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#DDD6CC] pt-6">
            <FormulaPart letter="F" label="Financial Stress" weight="30%" color="#C0392B" />
            <FormulaPart letter="J" label="Job Insecurity" weight="20%" color="#E67E22" />
            <FormulaPart letter="P" label="Pay Inequality" weight="30%" color="#6C3483" />
            <FormulaPart letter="O" label="Overwork Risk" weight="20%" color="#1A5276" />
          </div>
        </div>

        {/* Normalization */}
        <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-8">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#5F5B57] uppercase mb-5">
            Normalization
          </p>
          <p className="text-[#3a3530] text-sm leading-relaxed">
            Each metric is normalized to a 0–100 scale using min–max
            normalization (where{" "}
            <span className="font-serif italic">X<sub>min</sub></span> is best,{" "}
            <span className="font-serif italic">X<sub>max</sub></span> is worst).
          </p>

          <div className="mt-5 bg-[#EFE8DE]/60 border border-[#DDD6CC] rounded-md px-5 py-5 flex items-center justify-center">
            <div className="flex items-center gap-3 font-serif text-[#1D1D1D]">
              <span className="italic text-lg">
                X<sub className="text-xs">norm</sub>
              </span>
              <span className="text-2xl text-[#5F5B57]">=</span>
              <div className="inline-flex flex-col items-center">
                <span className="italic">X − X<sub className="text-xs">min</sub></span>
                <span className="block w-full border-t border-[#1D1D1D] my-1" />
                <span className="italic">X<sub className="text-xs">max</sub> − X<sub className="text-xs">min</sub></span>
              </div>
              <span className="text-2xl">×</span>
              <span className="text-2xl">100</span>
            </div>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-[#3a3530]">
            <li>
              <span className="font-serif italic mr-2">X</span>= Country's raw value
            </li>
            <li>
              <span className="font-serif italic mr-2">X<sub className="text-xs">min</sub></span>
              = Best (lowest risk) value among countries
            </li>
            <li>
              <span className="font-serif italic mr-2">X<sub className="text-xs">max</sub></span>
              = Worst (highest risk) value among countries
            </li>
          </ul>
        </div>
      </section>

      {/* Data Sources */}
      <section className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-8">
        <div className="mb-6">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#5F5B57] uppercase">
            Data Sources
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SourceCard
            icon={Database}
            name="Eurostat"
            detail="Employed persons by job tenure · Employment rate by sex · Gender pay gap (unadjusted) · In-work at-risk-of-poverty rate by sex"
          />
          <SourceCard
            icon={Globe}
            name="ILO (ILOSTAT)"
            detail="Mean weekly hours usually worked per employee by sex"
          />
        </div>
      </section>

      {/* Footnote */}
      <div className="bg-[#FFF7E6] border border-[#E8D9B5] rounded-md px-5 py-3 flex items-center gap-3">
        <Info className="h-4 w-4 text-[#B5965B] shrink-0" />
        <p className="text-sm text-[#5a4a20]">
          The index is updated annually as new data becomes available.
        </p>
      </div>
    </div>
  );
}
