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
      {/* Ambient city wash — no photography available, use layered gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, var(--acg), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%222%22 height=%222%22><rect width=%222%22 height=%222%22 fill=%22%23ffffff%22 fill-opacity=%22.03%22/></svg>')" }}
      />

      <div className="relative z-40 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end gap-10 pb-[22dvh] md:pb-24">
        <div className="space-y-6 md:space-y-8 max-w-3xl">
          <p className="m-0 font-[family-name:var(--font-geist)] text-xs tracking-[0.34em] uppercase text-[var(--txm)]">
            {selectedCity === "mum" ? "Mumbai" : selectedCity === "blr" ? "Bengaluru" : "Delhi"} — tonight's ledger
          </p>
          <h1 className="m-0 font-[family-name:var(--font-instrument)] text-[clamp(3.2rem,12vw,8.4rem)] leading-[0.88] tracking-[-0.03em] text-[var(--tx)]">
            Your city,<br />
            <span style={{ color: "var(--ac)" }}>after dark.</span>
          </h1>
          <p className="m-0 max-w-[42ch] text-[1rem] leading-[1.75] text-[var(--txm)] font-[family-name:var(--font-geist)]">
            Stop searching. See what is actually happening on your streets tonight and
            commit in one tap.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleExplore}
              className="rounded-full px-7 py-3 text-[0.85rem] font-semibold tracking-[0.04em] text-[var(--tx)] border transition-all hover:translate-y-[-1px]"
              style={{ background: "var(--ac)", borderColor: "var(--ac)", color: "#061322" }}
            >
              Explore now
            </button>
            <button
              onClick={handleExplore}
              className="text-[0.85rem] font-medium text-[var(--txm)] tracking-[0.06em] hover:text-[var(--tx)] transition-colors"
            >
              See the cities
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
