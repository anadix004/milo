"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Bell, EyeOff, LogOut, ChevronRight, UserCircle, ShieldAlert, Loader2, Eye, Check } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/components/NotificationContext";
import { createClient } from "@/utils/supabase/client";
import clsx from "clsx";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
}

export default function SettingsModal({ isOpen, onClose, onEditProfile }: SettingsModalProps) {
  const { user, logout, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const supabase = createClient();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isTogglingGhost, setIsTogglingGhost] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("milo_notifications") !== "disabled";
    }
    return true;
  });

  const isGhostMode = !!(user as any)?.is_ghost;

  const handleEditProfile = () => {
    onClose();
    setTimeout(() => onEditProfile(), 200);
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      addNotification("system", "Password must be at least 6 characters.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      addNotification("session", "Password updated successfully.");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      addNotification("system", `Password change failed: ${err.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleGhost = async () => {
    setIsTogglingGhost(true);
    try {
      await updateProfile({ is_ghost: !isGhostMode } as any);
      addNotification("session", isGhostMode ? "Ghost Mode deactivated." : "Ghost Mode activated. You're invisible.");
    } catch (err: any) {
      addNotification("system", `Failed to toggle Ghost Mode: ${err.message}`);
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
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-lg bg-zinc-950 border border-white/10 rounded-t-3xl md:rounded-3xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-zinc-950 sticky top-0 z-10">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Control Room</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
              
              {/* Account Security */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Account & Security</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  
                  {/* Edit Profile */}
                  <button
                    onClick={handleEditProfile}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle size={18} className="text-white/50 group-hover:text-white transition-colors" />
                      <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-wider transition-colors">Edit Profile Details</span>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </button>

                  <div className="h-px w-full bg-white/5" />
                  
                  {/* Change Password */}
                  <div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Lock size={18} className="text-white/50 group-hover:text-white transition-colors" />
                        <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-wider transition-colors">Change Password</span>
                      </div>
                      <ChevronRight size={16} className={clsx("text-white/20 transition-all", showPasswordForm && "rotate-90")} />
                    </button>

                    <AnimatePresence>
                      {showPasswordForm && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 flex gap-2">
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New password (min 6 chars)"
                              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                            />
                            <button
                              onClick={handleChangePassword}
                              disabled={isChangingPassword}
                              className="px-4 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-white/90 transition-all disabled:opacity-50"
                            >
                              {isChangingPassword ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="h-px w-full bg-white/5" />
                  
                  {/* 2FA */}
                  <div className="w-full flex items-center justify-between p-4 text-left opacity-50">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={18} className="text-white/50" />
                      <div>
                        <span className="text-sm font-black text-white/80 uppercase tracking-wider">Two-Factor Auth (2FA)</span>
                        <p className="text-[10px] font-mono text-white/40 mt-1">Coming soon</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-rose-400">Disabled</span>
                  </div>
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
        </>
      )}
    </AnimatePresence>
  );
}
