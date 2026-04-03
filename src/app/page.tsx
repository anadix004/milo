"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CitySelector from "@/components/CitySelector";
import EventListing from "@/components/EventListing";
import FinalCTA from "@/components/FinalCTA";
import Preloader from "@/components/Preloader";
import { HERO_FRAMES } from "@/constants/frames";

const CITY_IMAGES = [
  "/city selection/delhi.png",
  "/city selection/banglore.png",
  "/city selection/mumbai.png"
];

import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <main className="w-full bg-[#000000]">
      <Preloader progress={progress} isReady={isReady} />
      
      <Header 
        onProfileClick={() => setIsSidebarOpen(true)} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <ProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Show content only when partially ready to avoid flashes, 
          but technically Preloader handles the overlay */}
      <div className={isReady ? "opacity-100" : "opacity-0 transition-opacity duration-1000"}>
        <HeroSection />
        <CitySelector 
          selectedCity={selectedCity} 
          onSelect={setSelectedCity} 
        />
        <EventListing selectedCity={selectedCity} />
        <FinalCTA selectedCity={selectedCity} />
      </div>
    </main>
  );
}
