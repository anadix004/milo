"use client";

import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import PigeonLogo from "./PigeonLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Bell, User, PlusCircle, Menu } from "lucide-react";
import NotificationSidebar from "./NotificationSidebar";

interface HeaderProps {
  onProfileClick: () => void;
  onChatClick?: () => void;
  onEventClick: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onProfileClick, onChatClick, onEventClick, isSidebarOpen }: HeaderProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const scrollToTop = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full p-6 md:p-8 flex justify-between items-start z-[100] pointer-events-none mix-blend-screen">
      {/* Top Left: Profile (Leftmost) & Logo (Beside Avatar) */}
      <div className="flex items-center gap-6 pointer-events-auto">
        {/* Profile Avatar - Leftmost */}
        <button 
          onClick={onProfileClick}
          className={clsx(
            "relative w-10 h-10 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md transition-all duration-500",
            isSidebarOpen ? "bg-white text-black border-white" : "bg-black/20 text-white hover:bg-white/10"
          )}
        >
          <User size={18} />
        </button>

        {/* Milo Logo - Home Anchor */}
        <Link 
          href="/" 
          onClick={scrollToTop}
          className="relative group flex items-center justify-center cursor-pointer"
        >
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
        </Link>
      </div>

      <div className="flex gap-4 items-center flex-row pointer-events-auto">
        {/* Pigeon Chat Hub Link */}
        <Link 
          href="/chat"
          className={clsx(
            "relative w-10 h-10 rounded-full flex items-center justify-center border backdrop-blur-md transition-all group",
            isChatPage 
              ? "bg-cyan-500 text-white border-cyan-400" 
              : "bg-black/20 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          <PigeonLogo size={20} animate={!isChatPage} />
          
          {/* Pulsing Pigeon Notification (only hide on chat page) */}
          {!isChatPage && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full blur-[2px] opacity-60 animate-pulse" />
          )}
        </Link>

        {/* Event Submission Hub */}
        <button 
          onClick={onEventClick}
          className="relative w-10 h-10 rounded-full flex items-center justify-center bg-black/20 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-all font-black"
        >
          <PlusCircle size={18} />
        </button>

        {/* NOTIFICATION NEXUS HUB */}
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center bg-black/20 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-[8px] font-black font-lexend text-white border-2 border-black"
            >
              {unreadCount}
            </motion.span>
          )}
        </button>
        
        <div className="flex flex-col items-end gap-2">
          <button className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium tracking-[0.2em] uppercase border border-white/20 hover:bg-white/20 transition-colors">
            <Menu size={16} />
          </button>
          <Link 
            href="/admin"
            className="text-[8px] font-mono text-white/5 uppercase tracking-widest hover:text-white/40 transition-colors pointer-events-auto"
          >
            TEAM
          </Link>
        </div>

        <NotificationSidebar 
           isOpen={isNotificationsOpen} 
           onClose={() => setIsNotificationsOpen(false)} 
        />
      </div>
    </header>
  );
}
