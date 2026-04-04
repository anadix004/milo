"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Globe, Image as ImageIcon, QrCode, LogOut, X, ChevronRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useAuth } from "./AuthContext";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-all duration-700"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={SPRING_CONFIG}
            className={clsx(
              "fixed inset-y-0 left-0 w-full max-w-sm bg-black/40 backdrop-blur-3xl border-r border-white/10 z-[120] p-8 flex flex-col font-[family-name:var(--font-lexend)] transition-shadow duration-500",
              isGhostMode && "shadow-[inset_0_0_50px_rgba(16,185,129,0.1)] border-emerald-500/30"
            )}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-white text-xl font-black uppercase tracking-[0.2em]">Identity Hub</h2>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group cursor-pointer" onClick={simulateUpload}>
                <div className={clsx(
                  "p-4 rounded-full transition-all duration-500 border-2",
                  isUploading ? "animate-pulse border-white/40" : "border-white/5",
                  isGhostMode && "bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-400"
                )}>
                  <User size={40} className={clsx("transition-colors", isGhostMode ? "text-emerald-400" : "text-white/20")} />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                  <ImageIcon size={14} />
                </div>
              </div>
              <p className="mt-4 text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-black">
                {isAuthenticated ? (user?.full_name || user?.email) : "Unidentified biometric data source"}
              </p>
            </div>

            {/* Content Hub */}
            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
              {!isAuthenticated ? (
                /* Auth Flow */
                <div className="space-y-6">
                   <div className="text-center p-6 border border-white/5 bg-white/[0.02] rounded-[2rem] space-y-2">
                      <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest font-black">Access required</p>
                      <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">Please initialize mission at Home Hub</p>
                   </div>
                </div>
              ) : (
                /* Profile Hub */
                <div className="space-y-8">
                  
                  {/* MILO PASS OPTION HEARTBEAT */}
                  <div className="space-y-4">
                    <h3 className="text-white/40 text-[9px] uppercase tracking-widest px-2 font-black font-mono">Mission Identification</h3>
                    
                    <button 
                      onClick={() => setShowPass(!showPass)}
                      className={clsx(
                        "w-full p-6 rounded-[1.5rem] border flex items-center justify-between transition-all duration-700",
                        showPass ? "bg-white text-black border-white" : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <QrCode size={20} className={showPass ? "text-black" : "text-purple-500"} />
                        <span className="font-black text-[10px] tracking-widest uppercase">Milo Pass Hub</span>
                      </div>
                      <ChevronRight size={16} className={clsx("transition-transform duration-500", showPass && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {showPass && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={SPRING_CONFIG}
                          className="overflow-hidden"
                        >
                          <div className="p-8 bg-white rounded-[2rem] flex flex-col items-center space-y-6">
                            <div className="w-full aspect-square bg-[radial-gradient(circle_at_50%_50%,#000_20%,transparent_0%),radial-gradient(circle_at_50%_50%,#000_10%,transparent_0%)] bg-[length:12px_12px] opacity-90 rounded-2xl" />
                            <div className="flex flex-col items-center gap-2">
                               <ShieldCheck className="text-black" size={24} />
                               <p className="text-[8px] font-mono text-black font-black uppercase tracking-[0.4em]">Identity Verified // Active Pulse</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white/40 text-[9px] uppercase tracking-widest px-2 font-black font-mono">Privacy Shield</h3>
                    <button 
                      onClick={() => setIsGhostMode(!isGhostMode)}
                      className={clsx(
                        "w-full p-5 rounded-[1.5rem] border flex items-center justify-between transition-all duration-500",
                        isGhostMode 
                          ? "bg-emerald-400 border-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                          : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                      )}
                    >
                      <div className="flex flex-col items-start gap-1">
                         <span className={clsx("text-[10px] font-black tracking-widest uppercase", isGhostMode ? "text-black" : "text-white")}>Ghost Mode</span>
                         <span className={clsx("text-[8px] uppercase tracking-widest", isGhostMode ? "text-black/40" : "text-white/20")}>Cloaked identification</span>
                      </div>
                      <div className={clsx(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                        isGhostMode ? "bg-black text-emerald-400 animate-pulse" : "bg-white/10 text-white/40"
                      )}>
                        {isGhostMode ? "ACTIVE" : "OFF"}
                      </div>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white/40 text-[9px] uppercase tracking-widest px-2 font-black font-mono">Recent Telemetry</h3>
                    {[
                      { name: "Milo Festival '26", city: "Delhi", day: "Tomorrow" },
                      { name: "Code & Craft", city: "Mumbai", day: "Sat" }
                    ].map((h, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 flex justify-between items-center group cursor-pointer hover:border-white/20 transition-all">
                        <div>
                          <p className="text-[10px] text-white font-black tracking-widest uppercase">{h.name}</p>
                          <p className="text-[8px] text-white/20 uppercase font-mono">{h.city} // {h.day}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {isAuthenticated && (
              <button 
                onClick={logout}
                className="mt-12 flex items-center justify-center gap-3 text-white/30 hover:text-red-400 transition-colors py-4 uppercase text-[9px] tracking-[0.4em] font-black font-mono"
              >
                <LogOut size={16} />
                Terminate Session
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
