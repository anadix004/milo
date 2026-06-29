"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface LocationContextType {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const LocationContext = createContext<LocationContextType>({
  selectedCity: null,
  setSelectedCity: () => {},
});

// Maps short city code → body CSS class
const CITY_CLASS: Record<string, string> = {
  del: "city-delhi",
  blr: "city-blr",
  mum: "city-mum",
};

function applyCityClass(city: string | null) {
  // Remove all existing city classes
  document.body.classList.remove("city-delhi", "city-blr", "city-mum");
  if (city && CITY_CLASS[city]) {
    document.body.classList.add(CITY_CLASS[city]);
  }
}

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCity, setCity] = useState<string | null>(null);
  const pathname = usePathname();

  // Initialize from local storage or URL
  useEffect(() => {
    const savedCity = localStorage.getItem("milo_city");

    // Check if we are on a city-specific route
    const match = pathname?.match(/^\/explore\/(delhi|mumbai|bengaluru)/);
    if (match) {
      const cityFromUrl = match[1];
      let cityCode = cityFromUrl;
      if (cityFromUrl === "delhi") cityCode = "del";
      if (cityFromUrl === "mumbai") cityCode = "mum";
      if (cityFromUrl === "bengaluru") cityCode = "blr";

      setCity(cityCode);
      localStorage.setItem("milo_city", cityCode);
      
      // If the user navigates directly to a non-default city (mumbai/bengaluru),
      // we treat it as an explicit selection. Otherwise, keep it as default.
      if (cityCode !== "del") {
        localStorage.setItem("milo_city_explicit", "true");
      }
      applyCityClass(cityCode);
    } else if (savedCity) {
      setCity(savedCity);
      applyCityClass(savedCity);
    }
  }, [pathname]);

  // Apply city class whenever selectedCity changes
  useEffect(() => {
    applyCityClass(selectedCity);
  }, [selectedCity]);

  const setSelectedCity = useCallback((city: string | null) => {
    setCity(city);
    if (city) {
      localStorage.setItem("milo_city", city);
      localStorage.setItem("milo_city_explicit", "true");
    } else {
      localStorage.removeItem("milo_city");
      localStorage.removeItem("milo_city_explicit");
    }
  }, []);

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
