"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/components/LocationContext";

/**
 * FIX: /explore had no index page.
 * Plus button on ExplorePage called router.push("/explore") which 404'd.
 * This page immediately redirects to the correct city explore page.
 */
export default function ExploreIndexPage() {
  const router = useRouter();
  const { selectedCity } = useLocation();

  useEffect(() => {
    const cityMap: Record<string, string> = {
      del: "delhi",
      mum: "mumbai",
      blr: "bengaluru",
    };
    const city = selectedCity ? (cityMap[selectedCity] ?? "delhi") : "delhi";
    router.replace(`/explore/${city}`);
  }, [selectedCity, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex items-end gap-1.5 h-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              background: "linear-gradient(to top, #4A7FD4, #b48cff)",
              animation: `bar-bounce 1.1s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bar-bounce {
          0%, 100% { height: 8px; opacity: .35; }
          50% { height: 40px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
