"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/mobile/BottomNav";
import EventListing from "@/components/EventListing";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";

export default function ExplorePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { selectedCity, setSelectedCity } = useLocation();

  const getCityCode = (urlCity: string): string => {
    const map: Record<string, string> = {
      delhi: "del",
      mumbai: "mum",
      bengaluru: "blr",
    };
    return map[urlCity] || urlCity;
  };

  const getCitySlug = (cityCode: string | null): string | null => {
    if (!cityCode) return null;
    if (cityCode === "del") return "delhi";
    if (cityCode === "mum") return "mumbai";
    if (cityCode === "blr") return "bengaluru";
    return null;
  };

  const ensureCitySlug = () => {
    const city = selectedCity ?? "del";
    const slug = getCitySlug(city);
    if (!slug) return null;
    return slug;
  };

  // Sync city url param with context
  useEffect(() => {
    const urlCity = params?.city as string;
    if (urlCity) {
      const code = getCityCode(urlCity);
      setSelectedCity(code);
    }
  }, [params, setSelectedCity]);

  const initialTime = searchParams.get("time");
  const initialPrice = searchParams.get("price");
  const initialQ = searchParams.get("q");

  return (
    <main className="w-full min-h-screen overflow-x-hidden pt-[76px] pb-[80px] bg-black">
      <Header
        onProfileClick={() => (isAuthenticated ? router.push("/profile") : router.push("/login"))}
        onEventClick={() => router.push(isAuthenticated ? "/explore" : "/login")}
        onNotificationsClick={() => {}}
      />

      <BottomNav
        onProfileClick={() => (isAuthenticated ? router.push("/profile") : router.push("/login"))}
        onEventClick={() => router.push(isAuthenticated ? "/explore" : "/login")}
        onNotificationsClick={() => {}}
      />

      <EventListing
        selectedCity={selectedCity}
        onAuthRequired={() => router.push("/login")}
        initialTimeFilter={initialTime}
        initialPriceFilter={initialPrice}
        initialSearchQuery={initialQ}
      />
    </main>
  );
}
