"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLocation } from "./LocationContext";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/useMediaQuery";

import { ZC } from "@/lib/zIndex";

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
  const isMobile = useIsMobile();

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    onClose();
    
    const isExplorePage = pathname.startsWith("/explore/");
    if (isExplorePage) {
      const citySlug = cityId === "del" ? "delhi" : cityId === "mum" ? "mumbai" : "bengaluru";
      router.push(`/explore/${citySlug}`);
    }
  };

  const cityList = (
    <div className="p-4 space-y-3">
      <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em]">Select City</h3>
      <div className="space-y-2">
        {CITIES.map((city) => {
          const isSelected = selectedCity === city.id;
          return (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city.id)}
              className={clsx(
                "w-full px-5 py-4 rounded-2xl text-left text-sm font-black uppercase tracking-widest transition-all flex items-center justify-between group",
                isSelected 
                  ? "bg-white text-black" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {city.name}
              {isSelected ? (
                <CheckCircle2 size={16} className="text-black" />
              ) : (
                <MapPin size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${ZC.OVERLAY}`}
              onClick={onClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed bottom-0 inset-x-0 ${ZC.MODAL} bg-zinc-900 border-t border-white/10 rounded-t-2xl overflow-hidden shadow-2xl`}
              style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              {cityList}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${ZC.LOCATION}`}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${ZC.LOCATION}`}
          >
            {cityList}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
