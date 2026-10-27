export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-[#111111] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(15,76,129,0.05),transparent)]" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#0F4C81] opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F4C81]" />
          </span>
          <span className="font-mono text-sm tracking-[0.4em] text-[#111111] text-glow">
            PRECARITY.INDEX
          </span>
        </div>
        <div className="h-px w-64 bg-[#ECE9E1] overflow-hidden relative">
          <div className="absolute inset-0 shimmer" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-[#737373]">
          LOADING DATASET · CALCULATING WEIGHTS
        </p>
      </div>
    </div>
  );
}
