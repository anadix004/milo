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

  const tabs = [
    { icon: Home, label: "Home", href: "/", active: pathname === "/" },
    { icon: Bell, label: "Alerts", action: onNotificationsClick, badge: unreadCount },
    { icon: PlusCircle, label: "Add", action: onEventClick, primary: true },
    { icon: User, label: isAuthenticated ? "Profile" : "Log In", action: onProfileClick },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-[100] flex items-center justify-around bg-black/90 border-t border-white/10 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {tabs.map((tab, i) => {
        const Icon = tab.icon;
        const isActive = tab.href ? tab.active : false;

        const content = (
          <motion.div
            whileTap={{ scale: 0.85 }}
            className={clsx(
              "flex flex-col items-center justify-center gap-1 py-3 px-4 relative",
              tab.primary && "relative"
            )}
          >
            {tab.primary ? (
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center -mt-8 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <Icon size={22} className="text-black" />
              </div>
            ) : (
              <>
                <Icon size={20} className={isActive ? "text-white" : "text-white/40"} />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full text-[8px] font-black flex items-center justify-center text-white">
                    {tab.badge}
                  </span>
                )}
              </>
            )}
            {!tab.primary && (
              <span className={clsx("text-[9px] uppercase tracking-widest font-black", isActive ? "text-white" : "text-white/30")}>
                {tab.label}
              </span>
            )}
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
