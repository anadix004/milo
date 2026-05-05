"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Preloader from "@/components/Preloader";
import { useAuth } from "@/components/AuthContext";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
import BottomNav from "@/components/mobile/BottomNav";

const ProfileSidebar = dynamic(() => import("@/components/ProfileSidebar"), { ssr: false });
const EventSubmission = dynamic(() => import("@/components/EventSubmission"), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const NotificationSidebar = dynamic(() => import("@/components/NotificationSidebar"), { ssr: false });

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | "notifications" | null>(null);

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
      setActiveModal("auth");
    }
  };

  return (
    <main className="w-full h-screen bg-[#000000] overflow-hidden flex flex-col">
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
        onAuthClick={() => setActiveModal("auth")}
      />

      <EventSubmission 
        isOpen={activeModal === "event"}
        onClose={closeModals}
        onAuthRedirect={() => setActiveModal("auth")}
      />

      <AuthModal 
        isOpen={activeModal === "auth"}
        onClose={() => setActiveModal(null)}
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

      <div className="flex-1">
        <HeroSection />
      </div>
    </main>
  );
}
