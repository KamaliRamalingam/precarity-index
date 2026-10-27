import { Target, Eye, TrendingUp, Github, Linkedin, ArrowRight } from "lucide-react";

function ValueCard({
  icon: Icon,
  iconColor,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  body: string;
}) {
  return (
    <article className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 hover:border-[#C46A3D]/50 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-25px_rgba(47,58,69,0.35)] transition-all duration-300">
      <span
        className="inline-flex h-10 w-10 rounded-md items-center justify-center mb-4"
        style={{ backgroundColor: `${iconColor}1A`, color: iconColor }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-serif text-[#1D1D1D] text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#3a3530] text-sm leading-relaxed">{body}</p>
    </article>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden>
      <defs>
        <linearGradient id="city" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#DDD6CC" />
          <stop offset="1" stopColor="#EFE8DE" />
        </linearGradient>
      </defs>
      {/* Sun */}
      <circle cx="200" cy="80" r="56" fill="#C46A3D" opacity="0.85" />
      {/* City silhouette */}
      <g fill="url(#city)">
        <rect x="20" y="120" width="20" height="60" />
        <rect x="44" y="100" width="26" height="80" />
        <rect x="74" y="130" width="18" height="50" />
        <rect x="240" y="110" width="22" height="70" />
        <rect x="266" y="125" width="18" height="55" />
        <rect x="288" y="100" width="24" height="80" />
      </g>
      {/* Worker silhouettes */}
      <g>
        {/* Worker 1 - hardhat */}
        <circle cx="105" cy="100" r="14" fill="#2F3A45" />
        <path d="M91 100 a14 14 0 0 1 28 0 Z" fill="#C46A3D" />
        <rect x="92" y="110" width="26" height="70" rx="3" fill="#405261" />
        {/* Worker 2 - woman */}
        <circle cx="142" cy="96" r="14" fill="#3a3530" />
        <path d="M128 100 q14 -16 28 0 v6 h-28 z" fill="#3a3530" />
        <rect x="128" y="112" width="28" height="68" rx="3" fill="#A54E42" />
        {/* Worker 3 - center */}
        <circle cx="180" cy="92" r="15" fill="#2F3A45" />
        <rect x="165" y="108" width="30" height="72" rx="3" fill="#708C74" />
        {/* Worker 4 - apron */}
        <circle cx="217" cy="100" r="14" fill="#3a3530" />
        <rect x="203" y="114" width="28" height="66" rx="3" fill="#B5965B" />
      </g>
    </svg>
  );
}

export function About() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1D1D] tracking-tight leading-tight">
            About Precarity Index
          </h1>
          <p className="text-[#3a3530] text-base mt-4 max-w-2xl leading-relaxed">
            Precarity Index is a data-driven initiative to uncover the invisible
            psychological and economic costs of unstable work across Europe.
          </p>
          <p className="text-[#3a3530] text-base mt-3 max-w-2xl leading-relaxed">
            We believe that decent work is not just about having a job, but
            about having a secure, fair, and dignified life.
          </p>
        </div>
        <div className="max-w-sm mx-auto lg:ml-auto w-full">
          <HeroIllustration />
        </div>
      </section>

      {/* Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ValueCard
          icon={Target}
          iconColor="#C46A3D"
          title="Our Mission"
          body="Make hidden insecurity visible through transparent data and evidence-based insights."
        />
        <ValueCard
          icon={Eye}
          iconColor="#405261"
          title="Our Values"
          body="Fair pay. Decent work. Data-driven solutions. Fairness. Well-being. Equal opportunity."
        />
        <ValueCard
          icon={TrendingUp}
          iconColor="#708C74"
          title="Our Approach"
          body="Combine diverse data, rigorous methodology and a human-centered storytelling."
        />
      </section>

      {/* Built for Impact + Connect */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-8">
          <h2 className="font-serif text-xl text-[#1D1D1D] font-semibold mb-3">
            Built for Impact
          </h2>
          <p className="text-[#3a3530] text-sm leading-relaxed">
            This program was created for the Labor Rights Data Hackathon to
            promote awareness, drive policy conversations, and support the
            future of work.
          </p>
        </div>
        <div className="bg-[#FCFAF7] border border-[#DDD6CC] rounded-lg p-6 sm:p-8">
          <h2 className="font-serif text-xl text-[#1D1D1D] font-semibold mb-4">
            Connect
          </h2>
          <div className="flex flex-col divide-y divide-[#EFE8DE]">
            <a
              href="https://github.com/KamaliRamalingam/Labor-Hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <span className="inline-flex items-center gap-3 text-[#1D1D1D]">
                <Github className="h-4 w-4 text-[#5F5B57]" />
                <span className="text-sm font-medium">Labor-Hackathon — GitHub</span>
              </span>
              <ArrowRight className="h-4 w-4 text-[#5F5B57] group-hover:text-[#C46A3D] group-hover:translate-x-0.5 transition-all" />
            </a>
            <a
              href="https://www.linkedin.com/in/kamaliramalingam/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <span className="inline-flex items-center gap-3 text-[#1D1D1D]">
                <Linkedin className="h-4 w-4 text-[#5F5B57]" />
                <span className="text-sm font-medium">Kamali Ramalingam — LinkedIn</span>
              </span>
              <ArrowRight className="h-4 w-4 text-[#5F5B57] group-hover:text-[#C46A3D] group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
