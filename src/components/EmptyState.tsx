"use client";

import { ReactNode } from "react";
import clsx from "clsx";

/**
 * PHASE 3 FIX — Unified EmptyState
 *
 * Root cause of old bug: every page rolled its own empty state with
 * `text-white/20 font-mono text-[10px]` — essentially invisible at 10px
 * opacity-20 on a black background. Users thought the page was broken or
 * still loading.
 *
 * This component is the single source of truth for all empty states in Milo.
 * It follows the App DS (city accent system, --ac variable) and is used by:
 *   - EventListing.tsx  (no events / no filter results)
 *   - events-client.tsx (Marketing DS /events page)
 *   - city-client.tsx   (/city/[slug] no events)
 *
 * Design decisions:
 *   - Icon at 48px, not a tiny dot
 *   - Heading at 18–24px, weight 700, white/70 — clearly readable
 *   - Sub-text at 13px, white/45
 *   - Optional primary CTA (accent button) + optional secondary CTA
 *   - Consistent padding: py-20 container
 */

interface EmptyStateProps {
  /** Large icon or emoji passed as JSX */
  icon?: ReactNode;
  /** Main heading — what happened */
  heading: string;
  /** Supporting explanation — what to do */
  subtext?: string;
  /** Primary action button label */
  ctaLabel?: string;
  /** Primary action handler */
  onCta?: () => void;
  /** Secondary action label (e.g. "Clear filters") */
  secondaryLabel?: string;
  /** Secondary action handler */
  onSecondary?: () => void;
  className?: string;
  /** Use Marketing DS gold accent instead of App DS --ac */
  variant?: "app" | "marketing";
}

export default function EmptyState({
  icon,
  heading,
  subtext,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
  className,
  variant = "app",
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center py-20 px-6",
        className
      )}
    >
      {/* Icon container */}
      {icon && (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border"
          style={{
            background:
              variant === "marketing"
                ? "rgba(201,168,76,.06)"
                : "rgba(255,255,255,.04)",
            borderColor:
              variant === "marketing"
                ? "rgba(201,168,76,.18)"
                : "rgba(255,255,255,.08)",
          }}
        >
          <span
            className="text-2xl"
            style={{
              color:
                variant === "marketing" ? "#C9A84C" : "var(--ac, #4A7FD4)",
              opacity: 0.7,
            }}
          >
            {icon}
          </span>
        </div>
      )}

      {/* Heading */}
      <h3
        className="font-[family-name:var(--font-lexend,system-ui)] text-[18px] md:text-[22px] font-bold tracking-tight mb-3 leading-snug"
        style={{ color: "rgba(232,238,248,.75)" }}
      >
        {heading}
      </h3>

      {/* Subtext */}
      {subtext && (
        <p
          className="font-[family-name:var(--font-roboto-mono,monospace)] text-[12px] leading-[1.7] max-w-xs mb-8 uppercase tracking-[.06em]"
          style={{ color: "rgba(232,238,248,.38)" }}
        >
          {subtext}
        </p>
      )}

      {/* Actions */}
      {(ctaLabel || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {ctaLabel && onCta && (
            <button
              onClick={onCta}
              className="px-8 py-3.5 rounded-full font-[family-name:var(--font-lexend,system-ui)] font-bold text-[11px] uppercase tracking-widest transition-all hover:opacity-90 active:scale-[.98]"
              style={
                variant === "marketing"
                  ? { background: "#C9A84C", color: "#050505" }
                  : {
                      background: "var(--ac, #4A7FD4)",
                      color: "#fff",
                    }
              }
            >
              {ctaLabel}
            </button>
          )}
          {secondaryLabel && onSecondary && (
            <button
              onClick={onSecondary}
              className="px-8 py-3.5 rounded-full font-[family-name:var(--font-roboto-mono,monospace)] text-[10px] uppercase tracking-widest border transition-all hover:bg-white/[.04] active:scale-[.98]"
              style={{
                borderColor: "rgba(255,255,255,.12)",
                color: "rgba(232,238,248,.45)",
              }}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
