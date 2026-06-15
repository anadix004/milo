"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "@/components/LocationContext";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, X } from "lucide-react";

/**
 * PHASE 3 FIX — CityDefaultBanner
 *
 * Root cause of old bug:
 *   HeroSection.tsx:  `const city = selectedCity ?? "del"` — silent Delhi default
 *   ExploreIndexPage: `const city = selectedCity ? (cityMap[selectedCity] ?? "delhi") : "delhi"` — same
 *
 * Users who have never picked a city see Delhi events with zero indication
 * that this is a default, not their actual city. If they're in Mumbai or
 * Bangalore they get irrelevant content and think the app is wrong.
 *
 * Fix: Show a non-blocking, dismissible banner strip at the top of the
 * content area (below Header) whenever selectedCity is null.
 * - Explains what's happening ("Showing Delhi by default")
 * - Offers 3 city pills to pick right there
 * - Has a dismiss (X) that also writes "del" to localStorage so it doesn't
 *   reappear on the same session
 * - Animates out smoothly on dismiss or on city selection
 *
 * Usage: render inside the explore page and home page layouts, above the
 * content but below the Header spacer.
 */

const CITIES = [
  { code: "del", label: "Delhi", slug: "delhi" },
  { code: "mum", label: "Mumbai", slug: "mumbai" },
  { code: "blr", label: "Bengaluru", slug: "bengaluru" },
] as const;

interface CityDefaultBannerProps {
  /** If true, clicking a city pill navigates to /explore/[city].
   *  If false (homepage), just sets the location context. */
  navigateOnSelect?: boolean;
}

export default function CityDefaultBanner({
  navigateOnSelect = false,
}: CityDefaultBannerProps) {
  const { selectedCity, setSelectedCity } = useLocation();
  const router = useRouter();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Only show when no city has been chosen AND banner hasn't been dismissed
  if (selectedCity || dismissed) return null;

  const handleSelect = (code: string, slug: string) => {
    setSelectedCity(code);
    if (navigateOnSelect || pathname?.startsWith("/explore")) {
      router.push(`/explore/${slug}`);
    }
    // Banner auto-hides because selectedCity is now set
  };

  const handleDismiss = () => {
    // Silently commit Delhi so the banner never shows again this session
    setSelectedCity("del");
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="w-full"
        style={{
          background: "rgba(74,127,212,.07)",
          borderBottom: "0.5px solid var(--br, rgba(74,127,212,.14))",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 flex-wrap">
          {/* Icon + label */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <MapPin
              size={13}
              style={{ color: "var(--ac, #4A7FD4)", opacity: 0.7 }}
            />
            <span
              className="font-[family-name:var(--font-roboto-mono,monospace)] text-[10px] uppercase tracking-[.12em]"
              style={{ color: "rgba(232,238,248,.45)" }}
            >
              Showing Delhi by default — pick your city:
            </span>
          </div>

          {/* City pills */}
          <div className="flex items-center gap-2">
            {CITIES.map((c) => (
              <button
                key={c.code}
                onClick={() => handleSelect(c.code, c.slug)}
                className="font-[family-name:var(--font-roboto-mono,monospace)] text-[9px] uppercase tracking-[.1em] px-3 py-1 rounded-full border transition-all hover:opacity-100"
                style={{
                  borderColor: "var(--br, rgba(74,127,212,.18))",
                  color: "var(--ac, #4A7FD4)",
                  background: "var(--acg, rgba(74,127,212,.08))",
                  opacity: 0.8,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.8";
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="ml-auto flex-shrink-0 p-1 rounded-full transition-colors hover:bg-white/[.06]"
            aria-label="Dismiss city banner"
            title="Keep Delhi and dismiss"
          >
            <X size={13} style={{ color: "rgba(232,238,248,.3)" }} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
