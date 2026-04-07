"use client";
import { useState, useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function useMediaQuery(query: string): boolean {
  // Use useSyncExternalStore to avoid hydration mismatch.
  // Server snapshot always returns false; client reads the actual value.
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      window.addEventListener("resize", callback);
      return () => {
        mql.removeEventListener("change", callback);
        window.removeEventListener("resize", callback);
      };
    },
    getSnapshot,
    getServerSnapshot
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
