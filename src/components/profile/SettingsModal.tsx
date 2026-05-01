"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, EyeOff, LogOut, ChevronRight, Eye } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/components/NotificationContext";
import clsx from "clsx";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
}

export default function SettingsModal({ isOpen, onClose, onEditProfile }: SettingsModalProps) {
  const { user, logout, updateProfile } = useAuth();
  const { addNotification } = useNotifications();

  const [isTogglingGhost, setIsTogglingGhost] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("milo_notifications") !== "disabled";
    }
    return true;
  });

  const isGhostMode = !!user?.is_ghost;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleEditProfile = () => {
    onClose();
    setTimeout(() => onEditProfile(), 200);
  };

  const handleToggleGhost = async () => {
    setIsTogglingGhost(true);
    try {
      await updateProfile({ is_ghost: !isGhostMode });
      addNotification("session", isGhostMode ? "Ghost Mode deactivated." : "Ghost Mode activated. You're invisible.");
    } catch (err) {
      const error = err as Error;
      addNotification("system", `Failed to toggle Ghost Mode: ${error.message}`);
    } finally {
      setIsTogglingGhost(false);
    }
  };

  const handleToggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem("milo_notifications", newVal ? "enabled" : "disabled");
    addNotification("session", newVal ? "Notifications enabled." : "Notifications muted.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-zinc-950 sticky top-0 z-10">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Control Room</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-6 space-y-8 no-scrollbar overscroll-contain">
              
              {/* Account Details */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Account Details</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                  
                  {[
                    { label: "Name", value: user?.display_name || user?.full_name || "Anonymous" },
                    { label: "Phone Number", value: "+91 ••••• •••••" },
                    { label: "Date of Birth", value: "DD/MM/YYYY" },
                    { label: "Email Address", value: user?.email || "Not Provided" },
                    { label: "City", value: user?.city || "Not Set" },
                    { label: "Gender", value: "Not Specified" },
                  ].map((field, idx) => (
                    <div key={field.label} className={clsx("flex flex-col p-4", idx !== 5 && "border-b border-white/5")}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{field.label}</span>
                        <button onClick={handleEditProfile} className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-300">Edit</button>
                      </div>
                      <span className="text-sm font-black text-white">{field.value}</span>
                    </div>
                  ))}

                </div>
              </section>

              {/* Preferences */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Preferences</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  
                  {/* Push Notifications */}
                  <button
                    onClick={handleToggleNotifications}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-white/50 group-hover:text-white transition-colors" />
                      <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-wider transition-colors">Push Notifications</span>
                    </div>
                    <div className={clsx(
                      "w-12 h-7 rounded-full p-1 transition-colors",
                      notificationsEnabled ? "bg-emerald-500" : "bg-white/10"
                    )}>
                      <div className={clsx(
                        "w-5 h-5 rounded-full bg-white shadow-md transition-transform",
                        notificationsEnabled ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                  </button>

                  <div className="h-px w-full bg-white/5" />
                  
                  {/* Ghost Mode */}
                  <button
                    onClick={handleToggleGhost}
                    disabled={isTogglingGhost}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isGhostMode ? (
                        <Eye size={18} className="text-emerald-400" />
                      ) : (
                        <EyeOff size={18} className="text-white/50 group-hover:text-white transition-colors" />
                      )}
                      <div>
                        <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-wider transition-colors">Ghost Mode</span>
                        <p className="text-[10px] font-mono text-white/40 mt-1">Hide your event attendance from friends</p>
                      </div>
                    </div>
                    <div className={clsx(
                      "w-12 h-7 rounded-full p-1 transition-colors",
                      isGhostMode ? "bg-emerald-500" : "bg-white/10"
                    )}>
                      <div className={clsx(
                        "w-5 h-5 rounded-full bg-white shadow-md transition-transform",
                        isGhostMode ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                  </button>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="pt-4">
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-colors group"
                >
                  <div className="flex items-center gap-3 font-black uppercase tracking-widest text-xs">
                    <LogOut size={16} /> Sign Out
                  </div>
                  <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </section>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
