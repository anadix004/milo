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
    <div className="w-16 md:w-64 h-full bg-white/[0.02] border-r border-white/5 backdrop-blur-3xl flex flex-col pt-12 pb-6 flex-shrink-0 transition-all">
      <div className="px-2 md:px-8 mb-16">
        <h1 className="hidden md:block text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tighter">
          MILO
        </h1>
        <h1 className="md:hidden text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tighter text-center">
          M
        </h1>
        <p className="hidden md:block text-[9px] text-white/40 font-mono uppercase tracking-[0.3em] mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 px-2 md:px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative",
                isActive ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-r-full"
                />
              )}
              <Icon size={18} className={clsx("transition-colors shrink-0", isActive ? "text-cyan-400" : "group-hover:text-purple-400")} />
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
