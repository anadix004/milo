"use client";
import { motion } from "framer-motion";
import { Home, Search, PlusCircle, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "../NotificationContext";
import { useAuth } from "../AuthContext";
import clsx from "clsx";

interface BottomNavProps {
  onProfileClick: () => void;
  onEventClick: () => void;
  onNotificationsClick: () => void;
}

export default function BottomNav({ onProfileClick, onEventClick, onNotificationsClick }: BottomNavProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { isAuthenticated } = useAuth();

  // Perfect 5-Column Symmetry: Center the (+) trigger
  const tabs = [
    { icon: Home, label: "Home", href: "/", active: pathname === "/" },
    { icon: Search, label: "Radar", href: "/events", active: pathname === "/events" },
    { icon: PlusCircle, label: "Scan", action: onEventClick, primary: true },
    { icon: Bell, label: "Alerts", action: onNotificationsClick, badge: unreadCount },
    { icon: User, label: isAuthenticated ? "Profile" : "Log In", action: onProfileClick },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-[100] flex items-center justify-between bg-black/90 border-t border-white/10 backdrop-blur-xl md:hidden px-2"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const isActive = tab.href ? tab.active : false;

        const content = (
          <motion.div
            whileTap={{ scale: 0.85 }}
            className={clsx(
              "flex flex-col items-center justify-center gap-1.5 py-4 px-2 relative h-full",
              tab.primary && "z-10"
            )}
          >
            {tab.primary ? (
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center -mt-10 shadow-[0_0_30px_rgba(255,255,255,0.4)] border-4 border-black ring-1 ring-white/10">
                <Icon size={24} className="text-black" />
              </div>
            ) : (
              <div className="relative">
                <Icon size={22} className={isActive ? "text-white" : "text-white/40"} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-purple-500 rounded-full text-[8px] font-black flex items-center justify-center text-white ring-2 ring-black">
                    {tab.badge}
                  </span>
                )}
              </div>
            )}
            
            <span className={clsx(
              "text-[8px] uppercase tracking-widest font-black transition-all",
              isActive ? "text-white" : "text-white/30",
              tab.primary && "mt-1.5"
            )}>
              {tab.label}
            </span>
          </motion.div>
        );

        if (tab.href) {
          return <Link key={i} href={tab.href} className="flex-1 flex justify-center">{content}</Link>;
        }
        return (
          <button key={i} onClick={tab.action} className="flex-1 flex justify-center">
            {content}
          </button>
        );
      })}
    </nav>
  );
}
