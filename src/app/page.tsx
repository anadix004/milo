"use client";

import { useState, useEffect } from "react";
import CursorBlob from "@/components/CursorBlob";
import CityDefaultBanner from "@/components/CityDefaultBanner";
import HeroSection from "@/components/HeroSection";
import Preloader from "@/components/Preloader";
import { useAuth } from "@/components/AuthContext";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import BottomNav from "@/components/mobile/BottomNav";
import MarqueeBar from "@/components/MarqueeBar";

const ProfileSidebar = dynamic(() => import("@/components/ProfileSidebar"), { ssr: false });
const EventSubmission = dynamic(() => import("@/components/EventSubmission"), { ssr: false });
const NotificationSidebar = dynamic(() => import("@/components/NotificationSidebar"), { ssr: false });

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "notifications" | null>(null);

  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const closeModals = () => setActiveModal(null);

  const handleAuthGate = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      window.location.href = '/auth';
    }
  };

  return (
    <main className="w-full min-h-[100dvh] bg-[#000000] flex flex-col overflow-y-auto">
      <Preloader progress={progress} isReady={isReady} />

      <Header
        onProfileClick={() => handleAuthGate(() => setActiveModal("profile"))}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
        onNotificationsClick={() => setActiveModal("notifications")}
        isSidebarOpen={activeModal === "profile"}
      />

      <ProfileSidebar
        isOpen={activeModal === "profile"}
        onClose={closeModals}
        onAuthClick={() => { window.location.href = '/auth'; }}
      />

      <EventSubmission
        isOpen={activeModal === "event"}
        onClose={closeModals}
        onAuthRedirect={() => { window.location.href = '/auth'; }}
      />


      <NotificationSidebar
        isOpen={activeModal === "notifications"}
        onClose={closeModals}
      />

      <BottomNav
        onProfileClick={() => handleAuthGate(() => setActiveModal("profile"))}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
        onNotificationsClick={() => setActiveModal("notifications")}
      />

      <div className="flex-1 flex flex-col">
        {/* PHASE 3 FIX: non-blocking city picker when no city is set.
            On the homepage navigateOnSelect=false so users stay on /
            and just update the context — HeroSection will then route
            to the correct city when they click Explore. */}
        <CityDefaultBanner navigateOnSelect={false} />
        <HeroSection />
        <MarqueeBar />
      </div>
    </main>
  );
}