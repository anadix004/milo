"use client";

import { useAuth } from "./AuthContext";
import { User, Plus, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import BrandLogo from "./BrandLogo";

interface HeaderProps {
  onProfileClick: () => void;
  onEventClick: () => void;
  onNotificationsClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onProfileClick, onEventClick, onNotificationsClick, isSidebarOpen }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={clsx(
      "fixed top-0 inset-x-0 w-full z-[100] transition-all duration-700 ease-in-out",
      isScrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4" : "pt-4 md:pt-6 py-6"
    )}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 flex justify-between items-center">
      {/* Top Left: Profile & Logo (Left) - Hidden on Mobile */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button 
          onClick={onProfileClick}
          className={clsx(
            "hidden md:flex relative px-4 py-2 rounded-full items-center justify-center gap-2 border border-white/10 backdrop-blur-md transition-all duration-500",
            isSidebarOpen ? "bg-white text-black border-white" : "bg-black/20 text-white hover:bg-white/10"
          )}
        >
          <User size={16} />
          {!isAuthenticated && (
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Log In</span>
          )}
        </button>

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
                "0 0 10px rgba(255,255,255,0.1)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center"
          >
            <BrandLogo size="md" />
          </motion.div>
        </Link>
      </div>

      {/* Global Command Center (Right) */}
      <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
        <Link href="/chat" className="group flex items-center gap-2 bg-black/20 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 transition-all duration-500 hover:border-white/30 hover:bg-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] group-hover:animate-pulse" />
          <span className="font-[family-name:var(--font-lexend)] text-[9px] font-black uppercase tracking-[0.1em] text-white/60 group-hover:text-white">Pigeon</span>
          <MessageSquare size={12} className="text-white/20 group-hover:text-white transition-colors" />
        </Link>

        <button 
          onClick={onEventClick}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
        
        <button 
          onClick={onNotificationsClick}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/20 border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-500 relative backdrop-blur-md"
        >
          <Bell size={18} />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-black" />
        </button>
      </div>
      </div>
    </header>
  );
}
