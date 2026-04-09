"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CitySelector from "@/components/CitySelector";
import EventListing from "@/components/EventListing";
import FinalCTA from "@/components/FinalCTA";
import Preloader from "@/components/Preloader";
import { HERO_FRAMES } from "@/constants/frames";
import { useAuth } from "@/components/AuthContext";

const CITY_IMAGES = [
  "/city selection/delhi.png",
  "/city selection/banglore.png",
  "/city selection/mumbai.png"
];

import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import EventSubmission from "@/components/EventSubmission";
import AuthModal from "@/components/AuthModal";
import NotificationSidebar from "@/components/NotificationSidebar";

import BottomNav from "@/components/mobile/BottomNav";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | "notifications" | null>(null);

  useEffect(() => {
    const allAssets = [...HERO_FRAMES.map(f => `/sequence/frames/${f}`), ...CITY_IMAGES];
    let loadedCount = 0;
    const totalAssets = allAssets.length;

    const preload = async () => {
      const isMobile = window.innerWidth < 768;
      // On mobile we use <video>, not canvas — skip ALL frame images
      const assetsToLoad = isMobile 
        ? CITY_IMAGES
        : allAssets;

      const promises = assetsToLoad.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedCount++;
            setProgress((loadedCount / assetsToLoad.length) * 100);
            resolve(true);
          };
          img.onerror = () => {
            loadedCount++;
            setProgress((loadedCount / assetsToLoad.length) * 100);
            resolve(true);
          };
        });
      });

      await Promise.all(promises);
      setTimeout(() => setIsReady(true), isMobile ? 600 : 1200);
    };

    preload();
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
