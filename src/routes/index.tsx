import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import type { CountryData } from "@/components/dashboard/types";
import { Overview } from "@/components/dashboard/Overview";
import { Explorer } from "@/components/dashboard/Explorer";
import { Ranking } from "@/components/dashboard/Ranking";
import { About } from "@/components/dashboard/About";
import { Methodology } from "@/components/dashboard/Methodology";
import { LoadingScreen } from "@/components/dashboard/LoadingScreen";
import { FourDimensions } from "@/components/dashboard/FourDimensions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Hidden Psychological Cost of Unstable Work" },
      {
        name: "description",
        content:
          "A cross-national index investigating precarity, poverty, tenure, gender pay gaps, and working hours. Built for the Labor Rights Data Hackathon.",
      },
      { property: "og:title", content: "The Hidden Psychological Cost of Unstable Work" },
      { property: "og:description", content: "Cross-national precarity index — Labor Rights Data Hackathon." },
    ],
  }),
  component: Dashboard,
});

const TABS = ["Overview", "Dashboard", "Explorer", "Rankings", "Methodology", "About"] as const;
type Tab = (typeof TABS)[number];

function Dashboard() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [data, setData] = useState<CountryData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bootDone, setBootDone] = useState(false);
  const [focusCountry, setFocusCountry] = useState<string | null>(null);
  

  useEffect(() => {
    const t0 = performance.now();
    fetch("/precarity_index.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load data");
        return r.json();
      })
      .then((d) => {
        const elapsed = performance.now() - t0;
        const wait = Math.max(0, 900 - elapsed);
        setTimeout(() => {
          setData(d);
          setBootDone(true);
        }, wait);
      })
      .catch((e) => {
        setError(e.message);
        setBootDone(true);
      });
  }, []);

  if (!bootDone && !error) return <LoadingScreen />;

  const openCountry = (country: string) => {
    setFocusCountry(country);
    setTab("Explorer");
  };

  return (
    <div className="min-h-screen text-[#1D1D1D] relative bg-[#F5F1EA]">
      {/* Editorial top bar */}
      <header className="border-b border-[#DDD6CC] bg-[#F5F1EA]">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between gap-6">
          <button
            onClick={() => setTab("Overview")}
            className="flex items-center gap-3 group"
          >
            {/* Logo mark */}
            <span className="relative h-9 w-9 rounded-full border-[1.5px] border-[#2F3A45] flex items-center justify-center">
              <span className="absolute h-1.5 w-1.5 rounded-full bg-[#C46A3D] -top-0.5 right-1" />
              <span className="block h-4 w-4 rounded-full border-[1.5px] border-[#2F3A45]" />
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[1.35rem] font-semibold tracking-[0.08em] text-[#1D1D1D] uppercase leading-none">
                Precarity Index
              </span>
              <span className="hidden md:inline font-mono text-[10px] text-[#5F5B57] tracking-[0.25em] uppercase">
                Measuring the hidden costs of work
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-6">
            <nav role="tablist" aria-label="Sections" className="flex items-center gap-1 sm:gap-5">
              {TABS.filter((t) => t !== "Dashboard").map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`relative px-1 py-1.5 text-[13px] tracking-wide transition-colors font-serif ${
                    tab === t ? "text-[#1D1D1D] font-semibold" : "text-[#5F5B57] hover:text-[#1D1D1D]"
                  }`}
                >
                  {t}
                  {tab === t && (
                    <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] bg-[#C46A3D]" />
                  )}
                </button>
              ))}
            </nav>
            <button
              onClick={() => setTab("Dashboard")}
              className="inline-flex items-center gap-2 bg-[#1D2A36] text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-full hover:bg-[#2F3A45] transition-colors"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Dashboard
            </button>
          </div>
        </div>
      </header>


      <main className="relative z-[1]">
        {error && (
          <div className="max-w-screen-2xl mx-auto px-6 py-6 border border-[#A54E42]/40 bg-[#A54E42]/10 rounded-sm font-mono text-sm">
            ERROR: {error}
          </div>
        )}
        {data && (
          <div key={tab} className="animate-fade-in">
            {tab === "Overview" && (
              <Overview
                data={data}
                onNavigate={(t) => setTab(t === "Ranking" ? "Rankings" : t)}
              />
            )}
            {tab === "Dashboard" && (
              <FourDimensions onNavigateRankings={() => setTab("Rankings")} />
            )}
            {tab === "Explorer" && (
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
                <Explorer data={data} initialCountry={focusCountry} />
              </div>
            )}
            {tab === "Rankings" && (
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
                <Ranking data={data} onSelectCountry={openCountry} />
              </div>
            )}
            {tab === "Methodology" && (
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
                <Methodology />
              </div>
            )}
            {tab === "About" && (
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
                <About />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[#DDD6CC] mt-12 relative z-[1] bg-[#F5F1EA]">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 py-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs items-start md:items-center">
          <div className="flex flex-col gap-1 font-mono text-[11px] text-[#5F5B57] tracking-wider md:text-left">
            <span>Built for Labor Rights Data Hackathon</span>
            <span>
              Built with purpose by{" "}
              <span className="text-[#1D1D1D] font-semibold">Data &amp; AI Stockholm</span>
            </span>
          </div>
          <div className="font-mono text-[14px] text-[#5F5B57] tracking-wider md:text-center">
            Built using <span className="text-[#1D1D1D] font-semibold">Lovable</span>
          </div>
          <div className="flex flex-col gap-1 font-mono text-[11px] text-[#5F5B57] tracking-wider md:text-right md:items-end">
            <span>
              Created by <span className="text-[#1D1D1D] font-semibold">Kamali Ramalingam</span>
            </span>
            <span>13 May 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
