"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CitySelector from "@/components/CitySelector";
import EventListing from "@/components/EventListing";
import FinalCTA from "@/components/FinalCTA";
import Preloader from "@/components/Preloader";
import { useAuth } from "@/components/AuthContext";

import Header from "@/components/Header";
import dynamic from "next/dynamic";

const ProfileSidebar = dynamic(() => import("@/components/ProfileSidebar"), { ssr: false });
const EventSubmission = dynamic(() => import("@/components/EventSubmission"), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const NotificationSidebar = dynamic(() => import("@/components/NotificationSidebar"), { ssr: false });

import BottomNav from "@/components/mobile/BottomNav";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | "notifications" | null>(null);

  useEffect(() => {
    // Simulated cinematic preloading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    const isMobile = window.innerWidth < 768;
    const timer = setTimeout(() => {
      setIsReady(true);
      setProgress(100);
    }, isMobile ? 800 : 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
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
    <main className="w-full bg-[#000000] pb-[80px] md:pb-0">
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

      <div className={isReady ? "opacity-100" : "opacity-0 transition-opacity duration-1000"}>
        <HeroSection />
        <CitySelector 
          selectedCity={selectedCity} 
          onSelect={setSelectedCity} 
        />
        <EventListing 
          selectedCity={selectedCity} 
          onAuthRequired={() => setActiveModal("auth")}
        />
        <FinalCTA selectedCity={selectedCity} />
      </div>
    </main>
  );
}
