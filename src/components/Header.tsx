"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import clsx from "clsx";

interface HeaderProps {
  onProfileClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onProfileClick, isSidebarOpen }: HeaderProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full p-6 md:p-8 flex justify-between items-start z-[100] pointer-events-none mix-blend-screen">
      {/* Top Left: Logo & Profile */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <div className="relative group flex items-center justify-center cursor-pointer" onClick={scrollToTop}>
          {/* Circular Orbit Highlight */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-500"
          />
          
          <span className="relative font-[family-name:var(--font-lexend)] text-white text-sm md:text-lg font-bold tracking-[0.2em] lowercase">
            milo
          </span>
        </div>

        <button 
          onClick={onProfileClick}
          className={clsx(
            "relative w-10 h-10 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md transition-all duration-500",
            isSidebarOpen ? "bg-white text-black border-white" : "bg-black/20 text-white hover:bg-white/10"
          )}
        >
          <User size={18} />
          {/* Notification / Alert dot */}
          <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full border border-black" />
        </button>
      </div>

      {/* Top Right: Actions */}
      <div className="flex gap-4 items-center flex-row pointer-events-auto">
        <button className="hidden md:block px-6 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium tracking-[0.2em] uppercase border border-white/10 hover:bg-black/60 transition-colors">
          LET&apos;S TALK
        </button>
        <button className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium tracking-[0.2em] uppercase border border-white/20 hover:bg-white/20 transition-colors">
          MENU
        </button>
      </div>
    </header>
  );
}
