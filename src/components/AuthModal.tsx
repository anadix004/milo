"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationContext";
import { supabase } from "@/utils/supabase";
import IdentityScan from "./IdentityScan";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  X,
  UserCircle,
  Loader2,
  LogIn,
  ShieldCheck
} from "lucide-react";
import clsx from "clsx";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, signUp, user, isAuthenticated, refreshProfile, recoverPassword, loginWithGoogle } = useAuth();
  const { addNotification } = useNotifications();
  
  const [mode, setMode] = useState<"login" | "signup" | "onboarding">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Transition to onboarding if profile is incomplete
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signUp(email, password, name);
      }
      // Mode will be updated by the useEffect watching isAuthenticated
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScanComplete = async (url: string) => {
    addNotification("session", "Identity synchronization successful. Pulse active.");
    await refreshProfile();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={SPRING_CONFIG} className="relative w-full max-w-md bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto no-scrollbar">
             <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-20"><X size={24} /></button>

             <div className="space-y-12">
                {!isAuthenticated ? (
                  <>
                    <div className="text-center space-y-4">
                       <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/5"><UserIcon size={28} className="text-white/40" /></div>
                       <h2 className="font-lexend text-2xl font-black uppercase tracking-tight text-white">{mode === "login" ? "Sign In" : "Create Account"}</h2>
                       <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Authorized Access Only</p>
                    </div>

                    <div className="space-y-8">
                      <form onSubmit={handleAuth} className="space-y-6">
                         <div className="space-y-4">
                            {mode === "signup" && (
                              <div className="relative">
                                <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input type="text" placeholder="FULL NAME" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                              </div>
                            )}
                            <div className="relative">
                              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                              <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                              <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-16 text-white text-xs font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                            </div>
                         </div>

                         <button disabled={isSyncing} className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : (mode === "login" ? "Sign In" : "Create Account")}
                            <ArrowRight size={16} />
                         </button>

                         <p className="text-center">
                            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-mono text-[8px] text-white/20 uppercase tracking-widest hover:text-white transition-colors font-black">
                               {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                            </button>
                            {mode === "login" && (
                               <button type="button" onClick={() => recoverPassword(email)} className="block w-full mt-4 font-mono text-[8px] text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors font-black">
                                  Forgot password?
                               </button>
                            )}
                         </p>
                      </form>

                      <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[8px] font-mono text-white/10 uppercase tracking-widest font-black">OR</span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      <button 
                        onClick={loginWithGoogle}
                        className="w-full bg-white/5 border border-white/5 text-white py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                      >
                        <LogIn size={16} />
                        Continue with Google
                      </button>
                    </div>
                  </>
                ) : (
                  /* ONBOARDING PULSE: IDENTITY SCAN */
                  <div className="space-y-12">
                     <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center border border-emerald-500/20"><ShieldCheck size={28} className="text-emerald-400" /></div>
                        <h2 className="font-lexend text-2xl font-black uppercase tracking-tight text-white">Identity Scan</h2>
                        <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Final authorization step</p>
                     </div>

                     <IdentityScan onComplete={handleScanComplete} />

                     <div className="text-center pt-4 border-t border-white/5">
                        <button 
                          onClick={onClose} 
                          className="font-mono text-[8px] text-white/10 uppercase tracking-widest hover:text-white transition-colors font-black"
                        >
                           Skip Identity scan for now
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
