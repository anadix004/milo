"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface LocationContextType {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  cityThemeColor: string;
}

const LocationContext = createContext<LocationContextType>({
  selectedCity: null,
  setSelectedCity: () => {},
  cityThemeColor: "#ffffff",
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCity, setCity] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from local storage or URL
  useEffect(() => {
    const savedCity = localStorage.getItem("milo_city");
    
    // Check if we are on a city-specific route
    const match = pathname?.match(/^\/explore\/(delhi|mumbai|bengaluru)/);
    if (match) {
      const cityFromUrl = match[1];
      let cityCode = cityFromUrl;
      // Map full names to short codes used internally
      if (cityFromUrl === "delhi") cityCode = "del";
      if (cityFromUrl === "mumbai") cityCode = "mum";
      if (cityFromUrl === "bengaluru") cityCode = "blr";
      
      setCity(cityCode);
      localStorage.setItem("milo_city", cityCode);
    } else if (savedCity) {
      setCity(savedCity);
    }
  }, [pathname]);

  const setSelectedCity = (city: string | null) => {
    setCity(city);
    if (city) {
      localStorage.setItem("milo_city", city);
    } else {
      localStorage.removeItem("milo_city");
    }
  };

  // Determine theme color
  let cityThemeColor = "#ffffff"; // default white
  if (selectedCity === "del") cityThemeColor = "#DC2626"; // Red for Delhi
  if (selectedCity === "mum") cityThemeColor = "#3B82F6"; // Blue for Mumbai
  if (selectedCity === "blr") cityThemeColor = "#10B981"; // Green for Bangalore

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, cityThemeColor }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
