"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, CheckCircle, Users, BarChart3, Calendar, Settings, Key } from "lucide-react";
import clsx from "clsx";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const tabs = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "approvals", label: "EVENT MANAGEMENT", icon: CheckCircle },
    { id: "moderation", label: "MODERATION", icon: Calendar },
    { id: "team", label: "TEAM ACCESS", icon: Key },
    { id: "users", label: "USERS", icon: Users },
    { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
    { id: "bulk", label: "BULK STUDIO", icon: Calendar },
    { id: "settings", label: "SETTINGS", icon: Settings },
  ];

  return (
    <div className="w-full h-[88px] md:w-64 md:h-full bg-black/95 md:bg-white/[0.02] border-t md:border-t-0 md:border-r border-white/10 backdrop-blur-2xl flex flex-row md:flex-col pt-2 pb-safe md:pt-12 md:pb-6 flex-shrink-0 transition-all fixed md:relative bottom-0 left-0 z-[100] overflow-x-auto md:overflow-visible no-scrollbar">
      <div className="hidden md:block px-8 mb-16">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tighter">
          MILO
        </h1>
        <p className="text-[9px] text-white/40 font-mono uppercase tracking-[0.3em] mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col px-4 space-x-2 md:space-x-0 md:space-y-2 items-center md:items-stretch min-w-max md:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-4 md:px-4 py-2 md:py-4 rounded-2xl transition-all duration-300 relative shrink-0",
                isActive ? "md:bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 md:top-auto md:left-0 md:-translate-x-0 w-8 md:w-1 h-1 md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-purple-400 to-cyan-400 rounded-b-full md:rounded-b-none md:rounded-r-full"
                />
              )}
              <Icon size={20} className={clsx("transition-colors shrink-0", isActive ? "text-cyan-400" : "group-hover:text-purple-400")} />
              <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase md:hidden block mt-1">{tab.label.split(" ")[0]}</span>
              <span className="hidden md:inline font-black text-[10px] tracking-widest uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block px-8 mt-auto border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-xs">
            A
          </div>
          <div>
            <p className="text-white text-xs font-black uppercase tracking-widest">Admin</p>
            <p className="text-white/40 text-[9px] uppercase tracking-widest">System Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
