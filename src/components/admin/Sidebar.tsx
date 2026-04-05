"use client";

import { motion } from "framer-motion";
import { 
  Layers, 
  Activity, 
  Shield, 
  Terminal, 
  LogOut, 
  PlusCircle 
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";
import PigeonLogo from "@/components/PigeonLogo";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: any) => void;
  pendingCount?: number;
}

export default function Sidebar({ currentTab, setTab, pendingCount = 0 }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || "user";

  // Role Visibility Gates
  const navigation = [
    { id: "queue", label: "Moderation Queue", icon: <Layers size={18} />, roles: ["owner", "admin", "team"], pill: pendingCount },
    { id: "pulse", label: "Platform Pulse", icon: <Activity size={18} />, roles: ["owner", "admin"] },
    { id: "access", label: "Access Control", icon: <Shield size={18} />, roles: ["owner", "admin"] },
    { id: "audit", label: "Audit Logs", icon: <Terminal size={18} />, roles: ["owner"] },
  ];

  const visibleNav = navigation.filter(item => item.roles.includes(role));

  const roleColors = {
    owner: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    admin: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    team: "text-gray-400 border-gray-400/20 bg-gray-400/5",
    user: "text-white/20 border-white/5 bg-white/5"
  };

  return (
    <aside className="w-72 h-screen bg-black border-r border-white/5 flex flex-col z-50">
      {/* HEADER: LOGO & STATUS */}
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <PigeonLogo size={32} />
          <h1 className="font-lexend text-xl font-black text-white tracking-widest uppercase italic">MILO</h1>
        </div>

        <div className="flex items-center gap-3 px-2 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <span className="font-mono text-[9px] text-white/60 uppercase tracking-[0.3em]">Radar Online</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {visibleNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={clsx(
              "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
              currentTab === item.id 
                ? "bg-white/[0.05] border border-white/10 text-white" 
                : "text-white/40 hover:text-white hover:bg-white/[0.02]"
            )}
          >
            <div className="flex items-center gap-4">
              <span className={clsx("transition-colors", currentTab === item.id ? "text-white" : "text-white/20 group-hover:text-white/60")}>
                {item.icon}
              </span>
              <span className="font-lexend text-[10px] uppercase font-black tracking-widest leading-none">
                {item.label}
              </span>
            </div>
            {item.pill > 0 && (
              <div className="px-2 py-1 bg-red-500 text-white font-mono text-[8px] rounded-md animate-pulse">
                {item.pill}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* FOOTER: IDENTITY */}
      <div className="p-6 mt-auto border-t border-white/5 space-y-6 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.02),transparent_100%)]">
        <div className="space-y-3 px-2">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-mono text-white/40 truncate max-w-[140px] lowercase">{user?.email}</span>
             <div className={clsx(
               "px-3 py-1 border rounded-full font-mono text-[8px] font-black tracking-widest uppercase",
               roleColors[role as keyof typeof roleColors]
             )}>
               {role}
             </div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all font-lexend text-[10px] uppercase font-black tracking-widest border border-transparent hover:border-red-500/10"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </div>
    </aside>
  );
}
