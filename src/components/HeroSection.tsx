"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { useLocation } from "./LocationContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "./NotificationContext";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const { selectedCity } = useLocation();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const citySlug = (cityCode: string | null) =>
    cityCode === "mum" ? "mumbai" : cityCode === "blr" ? "bengaluru" : "delhi";

  const ensureCitySlug = () => {
    const slug = citySlug(selectedCity ?? "del");
    return slug;
  };

  const handleExplore = () => {
    const slug = ensureCitySlug();
    router.push(`/explore/${slug}`);
  };

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0a]">
      {/* Premium ambient mesh — layered gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, var(--acg), transparent 70%), radial-gradient(45% 40% at 85% 20%, rgba(180,140,255,0.12), transparent 70%), radial-gradient(40% 40% at 15% 80%, rgba(201,168,76,0.08), transparent 70%), #050505",
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%223%22 height=%223%22><rect width=%223%22 height=%223%22 fill=%22%23ffffff%22 fill-opacity=%22.05%22/></svg>')" }}
      />

      <div className="relative z-40 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end gap-10 pb-[22dvh] md:pb-24">
        <div className="space-y-6 md:space-y-8 max-w-3xl">
          <p className="m-0 font-[family-name:var(--font-geist)] text-xs tracking-[0.34em] uppercase text-[var(--txm)]">
            {selectedCity === "mum" ? "Mumbai" : selectedCity === "blr" ? "Bengaluru" : "Delhi"} — curated tonight
          </p>
          <h1 className="m-0 font-[family-name:var(--font-instrument)] text-[clamp(3.2rem,12vw,8.4rem)] leading-[0.88] tracking-[-0.03em] text-[var(--tx)]">
            What&apos;s actually happening,
            <br />
            <span style={{ background: "linear-gradient(120deg, var(--ac), #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              in your city tonight.
            </span>
          </h1>
          <p className="m-0 max-w-[42ch] text-[1rem] leading-[1.75] text-[var(--txm)] font-[family-name:var(--font-geist)]">
            One feed of real events across venues, campuses and culture hubs.
            Filter, save, and commit in one tap.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleExplore}
              className="rounded-full px-7 py-3 text-[0.85rem] font-semibold tracking-[0.04em] text-[var(--tx)] border transition-all hover:translate-y-[-1px]"
              style={{ background: "linear-gradient(135deg, var(--ac), rgba(255,255,255,0.12))", borderColor: "var(--acd)", color: "#ffffff", boxShadow: "0 10px 34px var(--acg)" }}
            >
              Explore events
            </button>
            <button
              onClick={handleExplore}
              className="rounded-full px-5 py-3 text-[0.85rem] font-medium text-[var(--tx)] tracking-[0.04em] border border-[var(--br)] bg-white/5 backdrop-blur hover:bg-white/10 transition-colors"
            >
              Browse cities
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-[family-name:var(--font-roboto-mono)] uppercase tracking-[0.22em] text-[var(--txm)]">
          {["Tonight", "Tomorrow", "This weekend", "Free entry"].map((label, i) => {
            const qs = ["time=Today", "time=Tomorrow", "time=Week", "price=Free"][i];
            return (
              <button
                key={label}
                onClick={() => {
                  const slug = ensureCitySlug();
                  router.push(`/explore/${slug}?${qs}`);
                }}
                className="px-4 py-1.5 rounded-full border border-[var(--br)] bg-[var(--acg)] hover:opacity-100 opacity-80 transition-opacity cursor-pointer text-[var(--ac)]"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
    </section>
  );
}
