"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

/**
 * PHASE 3 FIX — RetryBanner
 *
 * Root cause of old bug: EventListing had a `fetchError` boolean that showed
 * a single "Retry" button inline inside the grid area, but:
 *   1. The button was styled like a ghost border button — easy to miss
 *   2. There was no attempt counter, so users could retry forever with no
 *      feedback that the server is genuinely down
 *   3. No error message was shown — users didn't know WHY it failed
 *   4. The supabase.channel() realtime subscription was never cleaned up
 *      on error, causing duplicate subscriptions on retry
 *
 * This component:
 *   - Shows a clear error banner with the error message (truncated)
 *   - Tracks retry attempts (max 3 before showing "try later" message)
 *   - Adds a 1s delay before calling onRetry to prevent rapid hammering
 *   - Exposes `attempt` count so parent can log / throttle
 *   - Works in both App DS and Marketing DS via `variant` prop
 */

interface RetryBannerProps {
  /** Human-readable error message from the catch block */
  errorMessage?: string;
  /** Called when user clicks Retry — parent re-runs fetchEvents */
  onRetry: () => void;
  /** How many retries have already been attempted */
  attempt?: number;
  /** Max retries before switching to "check back later" mode */
  maxAttempts?: number;
  className?: string;
  variant?: "app" | "marketing";
}

export default function RetryBanner({
  errorMessage,
  onRetry,
  attempt = 0,
  maxAttempts = 3,
  className,
  variant = "app",
}: RetryBannerProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const exhausted = attempt >= maxAttempts;

  const handleRetry = useCallback(async () => {
    if (isRetrying || exhausted) return;
    setIsRetrying(true);
    // Small delay — prevents immediate double-fire and gives visual feedback
    await new Promise((r) => setTimeout(r, 800));
    onRetry();
    setIsRetrying(false);
  }, [isRetrying, exhausted, onRetry]);

  const accentColor =
    variant === "marketing" ? "#C9A84C" : "var(--ac, #4A7FD4)";
  const accentBg =
    variant === "marketing"
      ? "rgba(201,168,76,.06)"
      : "var(--acg, rgba(74,127,212,.06))";
  const accentBorder =
    variant === "marketing"
      ? "rgba(201,168,76,.18)"
      : "var(--br, rgba(74,127,212,.14))";

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Pulse warning icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-14 h-14 rounded-full flex items-center justify-center mb-5 border"
        style={{ background: accentBg, borderColor: accentBorder }}
      >
        <span className="text-xl" style={{ color: accentColor }}>
          {exhausted ? "🌙" : "⚡"}
        </span>
      </motion.div>

      {/* Heading */}
      <h3
        className="font-[family-name:var(--font-lexend,system-ui)] text-[17px] font-bold tracking-tight mb-2"
        style={{ color: "rgba(232,238,248,.75)" }}
      >
        {exhausted ? "Having trouble connecting" : "Couldn't load events"}
      </h3>

      {/* Error detail */}
      {errorMessage && !exhausted && (
        <p
          className="font-[family-name:var(--font-roboto-mono,monospace)] text-[10px] uppercase tracking-[.06em] mb-1 max-w-xs"
          style={{ color: "rgba(232,238,248,.28)" }}
        >
          {errorMessage.length > 80
            ? errorMessage.slice(0, 80) + "…"
            : errorMessage}
        </p>
      )}

      {/* Sub text */}
      <p
        className="font-[family-name:var(--font-roboto-mono,monospace)] text-[11px] uppercase tracking-[.06em] mb-7 max-w-xs leading-[1.7]"
        style={{ color: "rgba(232,238,248,.35)" }}
      >
        {exhausted
          ? "The radar is resting. Check back in a few minutes."
          : `Attempt ${attempt + 1} of ${maxAttempts}. Check your connection and try again.`}
      </p>

      {/* Action */}
      {!exhausted ? (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="px-8 py-3.5 rounded-full font-[family-name:var(--font-lexend,system-ui)] font-bold text-[11px] uppercase tracking-widest transition-all active:scale-[.97] disabled:opacity-50"
          style={{ background: accentColor, color: "#fff" }}
        >
          <AnimatePresence mode="wait">
            {isRetrying ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"
                  style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }}
                />
                Retrying…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Try Again
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      ) : (
        <p
          className="font-[family-name:var(--font-roboto-mono,monospace)] text-[10px] uppercase tracking-widest"
          style={{ color: accentColor, opacity: 0.6 }}
        >
          ● Radar back soon
        </p>
      )}
    </div>
  );
}
