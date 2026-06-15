"use client";

import { useAuth } from "./AuthContext";
import { User, Plus, Bell, MapPin } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { useNotifications } from "./NotificationContext";
import { useLocation } from "./LocationContext";
import LocationSelectorPopup from "./LocationSelectorPopup";

interface HeaderProps {
  onProfileClick: () => void;
  onEventClick: () => void;
  onNotificationsClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({
  onProfileClick,
  onEventClick,
  onNotificationsClick,
  isSidebarOpen,
}: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { selectedCity } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCityName = () => {
    if (selectedCity === "del") return "Delhi";
    if (selectedCity === "mum") return "Mumbai";
    if (selectedCity === "blr") return "Bengaluru";
    return "Location";
  };

  return (
    /*
     * FIX: was z-[100], now z-[60].
     *
     * Before: Header and BottomNav were both z-[100]. The browser paints
     * the later DOM element on top, so BottomNav (rendered after Header in
     * the tree) appeared above the header's backdrop-blur layer, causing the
     * header blur to bleed visually over BottomNav icons during scroll.
     *
     * After: Header at z-60, BottomNav at z-50. Header renders above BottomNav
     * on desktop where BottomNav is hidden. Modals sit at z-90, safely above both.
     */
    <header
      className={clsx(
        "fixed top-0 inset-x-0 w-full z-[60] transition-all duration-700 ease-in-out pointer-events-none",
        isScrolled
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4"
          : "pt-4 md:pt-6 py-6"
      )}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left: Profile & Logo */}
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto justify-start">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className={clsx(
                "hidden md:flex relative px-4 py-2 rounded-full items-center justify-center gap-2 border border-white/10 backdrop-blur-md transition-all duration-500",
                "bg-black/20 text-white hover:bg-white/10"
              )}
            >
              <User size={16} />
            </Link>
          ) : (
            <button
              onClick={onProfileClick}
              className={clsx(
                "hidden md:flex relative px-4 py-2 rounded-full items-center justify-center gap-2 border border-white/10 backdrop-blur-md transition-all duration-500",
                isSidebarOpen
                  ? "bg-white text-black border-white"
                  : "bg-black/20 text-white hover:bg-white/10"
              )}
            >
              <User size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                Log In
              </span>
            </button>
          )}

          <Link
            href="/"
            onClick={scrollToTop}
            className="relative group flex items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.1)",
                  "0 0 15px rgba(255,255,255,0.2)",
                  "0 0 10px rgba(255,255,255,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center"
            >
              <BrandLogo size="md" />
            </motion.div>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto justify-end">
          {/* Location Selector */}
          <div className="relative">
            {/* Mobile */}
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className={clsx(
                "flex md:hidden items-center gap-1.5 px-3 py-2 rounded-full border backdrop-blur-md transition-all",
                selectedCity
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/30 bg-white/15 text-white animate-pulse"
              )}
            >
              <MapPin
                size={14}
                className={selectedCity ? "text-white/60" : "text-white"}
              />
              <span className="font-black text-[9px] uppercase tracking-widest">
                {getCityName()}
              </span>
            </button>
            {/* Desktop */}
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              <MapPin size={16} className="text-white/60" />
              <span className="font-bold text-[11px] uppercase tracking-wider">
                {getCityName()}
              </span>
            </button>
            {/*
             * FIX: LocationSelectorPopup was z-[110]/z-[120].
             * Now it sits at z-[70] (LOCATION tier) — above the header (z-60)
             * but below modals (z-90). The popup is attached to the header
             * so it should never need to outrank a modal.
             */}
            <LocationSelectorPopup
              isOpen={isLocationOpen}
              onClose={() => setIsLocationOpen(false)}
            />
          </div>

          <button
            onClick={onEventClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={onNotificationsClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
