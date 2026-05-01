"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLocation } from "./LocationContext";
import { useRouter, usePathname } from "next/navigation";

interface LocationSelectorPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CITIES = [
  { id: "del", name: "Delhi" },
  { id: "mum", name: "Mumbai" },
  { id: "blr", name: "Bengaluru" },
];

export default function LocationSelectorPopup({ isOpen, onClose }: LocationSelectorPopupProps) {
  const { selectedCity, setSelectedCity } = useLocation();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (cityId: string) => {
    setSelectedCity(cityId);
    
    // Map internal codes to full city names for URLs
    let cityUrl = cityId;
    if (cityId === "del") cityUrl = "delhi";
    if (cityId === "mum") cityUrl = "mumbai";
    if (cityId === "blr") cityUrl = "bengaluru";

    // If already on an explore page, route to the new city
    if (pathname?.startsWith("/explore/")) {
      router.push(`/explore/${cityUrl}`);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[120]"
          >
            <div className="p-3 border-b border-white/10 bg-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 text-center">
                Choose Your Location
              </h3>
            </div>
            <div className="flex flex-col py-2">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city.id)}
                  className={clsx(
                    "w-full px-4 py-3 flex items-center justify-between text-sm font-bold transition-colors",
                    selectedCity === city.id 
                      ? "text-white bg-white/10" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span>{city.name}</span>
                  {selectedCity === city.id && (
                    <CheckCircle2 size={16} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
