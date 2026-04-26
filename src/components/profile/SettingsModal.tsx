"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Bell, EyeOff, LogOut, ChevronRight, UserCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { logout } = useAuth();

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
                  <SettingRow icon={UserCircle} label="Edit Profile Details" />
                  <div className="h-px w-full bg-white/5" />
                  <SettingRow icon={Lock} label="Change Password" />
                  <div className="h-px w-full bg-white/5" />
                  <SettingRow icon={ShieldAlert} label="Two-Factor Auth (2FA)" value="Disabled" valueColor="text-rose-400" />
                </div>
              </section>

              {/* Preferences */}
              <section className="space-y-2">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest px-2">Preferences</p>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <SettingRow icon={Bell} label="Push Notifications" value="Enabled" valueColor="text-emerald-400" />
                  <div className="h-px w-full bg-white/5" />
                  <SettingRow icon={EyeOff} label="Ghost Mode" value="Off" description="Hide your event attendance from friends" />
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

function SettingRow({ icon: Icon, label, value, valueColor, description }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-white/50 group-hover:text-white transition-colors" />
        <div>
          <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-wider transition-colors">{label}</span>
          {description && <p className="text-[10px] font-mono text-white/40 mt-1">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className={clsx("text-xs font-mono uppercase tracking-widest", valueColor || "text-white/50")}>{value}</span>}
        <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
    </button>
  );
}
