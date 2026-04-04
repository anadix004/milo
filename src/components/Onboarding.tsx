"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import { supabase } from "@/utils/supabase";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Phone,
  Calendar,
  UserCircle
} from "lucide-react";
import clsx from "clsx";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

export default function Onboarding({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, signUp, user, isAuthenticated, refreshProfile, recoverPassword } = useAuth();
  const { addNotification } = useNotifications();
  
  const [mode, setMode] = useState<"login" | "signup" | "profile">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAuthPulse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signUp(email, password, name);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProfileSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    const { error } = await supabase.from("profiles").upsert({
      id: user?.id,
      email: user?.email,
      full_name: name,
      role: user?.email === "milo.anadi@gmail.com" ? "owner" : "user"
    });

    if (!error) {
      addNotification("session", "Identity Mission Synchronized.");
      await refreshProfile();
      onClose();
    } else {
      addNotification("system", `Sync Error: ${error.message}`);
    }
    setIsSyncing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={SPRING_CONFIG} className="relative w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl">
             <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"><X size={24} /></button>

             <div className="space-y-12">
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/5"><UserIcon size={32} className="text-white/40" /></div>
                   <h2 className="font-lexend text-3xl font-black uppercase tracking-tight">Identity Hub</h2>
                   <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Cinematic synchronization Required</p>
                </div>

                {!isAuthenticated ? (
                  <form onSubmit={handleAuthPulse} className="space-y-6">
                     <div className="space-y-4">
                        {mode === "signup" && (
                          <div className="relative">
                            <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input type="text" placeholder="FULL IDENTITY NAME" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                          </div>
                        )}
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input type="email" placeholder="IDENTITY EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input type="password" placeholder="SECURITY KEY" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                        </div>
                     </div>

                     <button disabled={isSyncing} className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                        {isSyncing ? <Loader2 className="animate-spin" size={18} /> : (mode === "login" ? "Initialize Identification" : "Establish Pulse")}
                        <ArrowRight size={16} />
                     </button>

                     <p className="text-center">
                        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-mono text-[9px] text-white/20 uppercase tracking-widest hover:text-white transition-colors">
                           {mode === "login" ? "Need a new mission pulse? Sign Up" : "Already reaches 100% synchronized? Login"}
                        </button>
                        {mode === "login" && (
                           <button type="button" onClick={() => recoverPassword(email)} className="block w-full mt-4 font-mono text-[8px] text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors">
                              Forgot Security Key? (Owner Recovery)
                           </button>
                        )}
                     </p>
                  </form>
                ) : (
                  /* Post-auth Profile Sync if needed */
                  <form onSubmit={handleProfileSync} className="space-y-8">
                     <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                        <CheckCircle2 className="text-emerald-400" size={24} />
                        <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Initial Pulse Synchronized.</p>
                     </div>
                     <button type="submit" className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-xs">Enter Live Radar</button>
                  </form>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Loader2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={clsx("lucide lucide-loader-2", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
