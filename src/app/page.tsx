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

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | null>(null);

  useEffect(() => {
    const allAssets = [...HERO_FRAMES.map(f => `/sequence/frames/${f}`), ...CITY_IMAGES];
    let loadedCount = 0;
    const totalAssets = allAssets.length;

    const preload = async () => {
      const promises = allAssets.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedCount++;
            setProgress((loadedCount / totalAssets) * 100);
            resolve(true);
          };
          img.onerror = () => {
            loadedCount++;
            setProgress((loadedCount / totalAssets) * 100);
            resolve(true);
          };
        });
      });

      await Promise.all(promises);
      setTimeout(() => setIsReady(true), 1200); // Aesthetic delay
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
    <main className="w-full bg-[#000000]">
      <Preloader progress={progress} isReady={isReady} />
      
      <Header 
        onProfileClick={() => setActiveModal("profile")}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
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

      {/* Show content only when partially ready to avoid flashes, 
          but technically Preloader handles the overlay */}
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
