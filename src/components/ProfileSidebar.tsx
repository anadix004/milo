"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Globe, Image as ImageIcon, QrCode, LogOut, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-sm bg-black/40 backdrop-blur-3xl border-r border-white/10 z-[120] p-8 flex flex-col font-[family-name:var(--font-lexend)]"
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
                  "w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5 overflow-hidden transition-all duration-500 group-hover:border-purple-500/50",
                  isUploading && "animate-pulse"
                )}>
                  {isUploading ? (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <div className="w-full h-1 bg-white animate-scan-line" />
                    </div>
                  ) : (
                    <User size={40} className="text-white/20" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                  <ImageIcon size={14} />
                </div>
              </div>
              <p className="mt-4 text-xs text-white/40 uppercase tracking-widest">Biometric Data Source</p>
            </div>

            {/* Content Hub */}
            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
              {!isLoggedIn ? (
                /* Auth Flow */
                <div className="space-y-6">
                  <button 
                    onClick={() => setIsLoggedIn(true)}
                    className="w-full bg-white text-black py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-[0.98]"
                  >
                    <Globe size={18} />
                    <span className="font-bold text-sm tracking-widest uppercase">Connect Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/10" />
                    <span className="relative bg-black/10 backdrop-blur-xl px-4 text-[10px] text-white/30 uppercase tracking-[0.4em] left-1/2 -translate-x-1/2">OR</span>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input 
                        type="email" 
                        placeholder="Neural Address (Email)" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <button 
                      onClick={() => setIsLoggedIn(true)}
                      className="w-full bg-black/40 border border-white/10 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-white/5 transition-all"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              ) : (
                /* Profile Hub */
                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white/40 text-[10px] uppercase tracking-widest">Milo Pass</h3>
                      <QrCode size={16} className="text-purple-500" />
                    </div>
                    <div className="aspect-square bg-white rounded-lg flex items-center justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Simulated QR Code Pattern */}
                      <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,#000_20%,transparent_0%),radial-gradient(circle_at_50%_50%,#000_10%,transparent_0%)] bg-[length:10px_10px]" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white/40 text-[10px] uppercase tracking-widest px-2">Recent Happenings</h3>
                    {[
                      { name: "Nebula Sync '26", city: "Delhi", day: "Tomorrow" },
                      { name: "Code & Craft", city: "Mumbai", day: "Sat" }
                    ].map((h, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center group cursor-pointer hover:border-white/30 transition-all">
                        <div>
                          <p className="text-sm text-white font-bold tracking-wide">{h.name}</p>
                          <p className="text-[10px] text-white/30 uppercase">{h.city} // {h.day}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {isLoggedIn && (
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="mt-8 flex items-center justify-center gap-2 text-white/30 hover:text-red-400 transition-colors py-4 uppercase text-[10px] tracking-[0.4em]"
              >
                <LogOut size={14} />
                Terminate Session
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
