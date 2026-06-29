"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/mobile/BottomNav";
import EventListing from "@/components/EventListing";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import CityDefaultBanner from "@/components/CityDefaultBanner";
import EventSubmission from "@/components/EventSubmission";
import { useState } from "react";

/**
 * FIX 1: Wrapped in <Suspense> — useSearchParams() requires this in Next.js App Router.
 *         Without it the build throws: "useSearchParams() should be wrapped in a suspense boundary".
 *
 * FIX 2: Plus button (onEventClick) now opens EventSubmission modal instead of
 *         router.push("/explore") which 404'd. The /explore index page we added also
 *         handles direct navigation as a safety net.
 */

function ExploreContent() {

  const router = useRouter();
  const searchParams = useSearchParams(); // safe inside Suspense
  const { isAuthenticated } = useAuth();
  const { selectedCity } = useLocation();

  const [activeModal, setActiveModal] = useState<"event" | null>(null);



  const handleAuthRequired = () => {
    if (isAuthenticated) return;
    router.push("/auth");
  };

  const handleEventClick = () => {
    if (isAuthenticated) {
      setActiveModal("event");
    } else {
      router.push("/auth");
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/auth");
    }
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden pt-[76px] pb-[80px] bg-black">
      <Header
        onProfileClick={handleProfileClick}
        onEventClick={handleEventClick}
        onNotificationsClick={() => {}}
        isSidebarOpen={false}
      />

      {/* PHASE 3 FIX: Show banner when no city has been selected yet */}
      <CityDefaultBanner navigateOnSelect={true} />

      <BottomNav
        onProfileClick={handleProfileClick}
        onEventClick={handleEventClick}
        onNotificationsClick={() => {}}
      />

      <EventListing
        selectedCity={selectedCity}
        onAuthRequired={handleAuthRequired}
        initialTimeFilter={searchParams.get("time")}
        initialPriceFilter={searchParams.get("price")}
        initialSearchQuery={searchParams.get("q")}
      />

      {/* FIX: Modals now live here so Plus button works correctly */}
      <EventSubmission
        isOpen={activeModal === "event"}
        onClose={() => setActiveModal(null)}
        onAuthRedirect={() => router.push("/auth")}
      />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex items-end gap-1.5 h-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full"
                style={{
                  height: "8px",
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
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
