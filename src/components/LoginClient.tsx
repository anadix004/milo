"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "./NotificationContext";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  X,
  Loader2,
  LogIn,
  AtSign,
  ArrowLeft
} from "lucide-react";
import clsx from "clsx";

type AuthStep = "gateway" | "login" | "signup-credentials" | "signup-handle";

const SPRING_TRANSITION: any = { type: "spring", stiffness: 300, damping: 30 };

export default function LoginClient() {
  const supabase = createClient();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<AuthStep>("gateway");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: ""
  });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleNext = () => {
    setErrorStatus(null);
    if (currentStep === "signup-credentials") {
      if (!formData.email || !formData.password) {
        setErrorStatus("Login Required");
        return;
      }
      
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const isLongEnough = formData.password.length >= 8;

      if (!hasUpper || !hasLower || !hasNumber || !isLongEnough) {
        setErrorStatus("Password must be 8+ chars with Uppercase, Lowercase, and Numbers.");
        return;
      }

      setCurrentStep("signup-handle");
    }
  };

  const executeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setErrorStatus(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;
      
      addNotification("session", "Login successful. Redirecting...");
      router.refresh();
      router.push("/");
    } catch (err: any) {
      setErrorStatus(err.message || "Login Failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const executeSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setErrorStatus(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            full_name: formData.name || formData.username
          }
        }
      });
      if (error) throw error;
      
      addNotification("session", "Profile created. Welcome!");
      router.refresh();
      router.push("/");
    } catch (err: any) {
      setErrorStatus(err.message || "Operation Failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-y-auto no-scrollbar py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_100%)]" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        transition={SPRING_TRANSITION} 
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-3xl overflow-hidden"
      >
         {/* Navigation Actions */}
         <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            {currentStep !== "gateway" && (
               <button 
                 onClick={() => setCurrentStep("gateway")}
                 className="text-white/20 hover:text-white transition-colors p-2 -ml-2"
               >
                  <ArrowLeft size={20} />
               </button>
            )}
            <div />
         </div>

         <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === "gateway" && (
                <motion.div
                  key="gateway"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={SPRING_TRANSITION}
                  className="space-y-12"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/5 rotate-3">
                       <UserIcon size={28} className="text-white/40" />
                    </div>
                    <h2 className="font-lexend text-4xl font-black uppercase tracking-tighter text-white italic">MILO ACCESS</h2>
                    <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Login to Continue</p>
                  </div>

                  <div className="space-y-4 pt-4">
                     <button 
                       onClick={loginWithGoogle}
                       className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5"
                     >
                        <LogIn size={18} />
                        Continue with Google
                     </button>

                     <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] font-mono"><span className="bg-[#0a0a0a] px-4 text-white/10 uppercase tracking-widest font-black italic">Advanced Auth</span></div>
                     </div>

                     <div className="space-y-3">
                        <button 
                          onClick={() => setCurrentStep("login")}
                          className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all font-lexend"
                        >
                           Log In
                        </button>
                        <button 
                          onClick={() => setCurrentStep("signup-credentials")}
                          className="w-full bg-white/5 border border-white/10 text-white/40 py-5 rounded-3xl font-black uppercase tracking-widest text-[9px] hover:text-white transition-all font-lexend"
                        >
                           Create Account
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={SPRING_TRANSITION}
                  className="space-y-12"
                >
                  <div className="text-center space-y-4">
                     <h2 className="font-lexend text-3xl font-black uppercase tracking-tighter text-white">RE-ENTRY</h2>
                     <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Members Only</p>
                  </div>

                  <form onSubmit={executeLogin} className="space-y-6">
                     <div className="space-y-4">
                        <div className="relative group">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={18} />
                           <input 
                             type="email" 
                             placeholder="EMAIL ADDRESS" 
                             value={formData.email} 
                             onChange={(e) => setFormData({...formData, email: e.target.value})} 
                             required 
                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 pl-16 text-white text-[11px] font-black tracking-widest outline-none focus:border-white transition-all font-mono" 
                           />
                        </div>
                        <div className="relative group">
                           <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={18} />
                           <input 
                             type="password" 
                             placeholder="PASSWORD" 
                             value={formData.password} 
                             onChange={(e) => setFormData({...formData, password: e.target.value})} 
                             required 
                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 pl-16 text-white text-[11px] font-black tracking-widest outline-none focus:border-white transition-all font-mono" 
                           />
                        </div>
                     </div>

                     {errorStatus && <p className="text-center text-red-500 font-mono text-[10px] uppercase font-black tracking-widest animate-pulse">{errorStatus}</p>}

                     <button disabled={isSyncing} className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                        {isSyncing ? <Loader2 className="animate-spin" size={16} /> : "Log In"}
                        <ArrowRight size={16} />
                     </button>
                  </form>
                </motion.div>
              )}

              {currentStep === "signup-credentials" && (
                <motion.div
                  key="signup-creds"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={SPRING_TRANSITION}
                  className="space-y-12"
                >
                  <div className="text-center space-y-4">
                     <h2 className="font-lexend text-3xl font-black uppercase tracking-tighter text-white italic">NEW PROFILE</h2>
                     <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Create Profile</p>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <div className="relative group">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                           <input type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-16 text-white text-[11px] font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                        </div>
                        <div className="relative group">
                           <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                           <input type="password" placeholder="PASSWORD" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 pl-16 text-white text-[11px] font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono" />
                        </div>
                     </div>

                     {errorStatus && <p className="text-center text-red-500 font-mono text-[10px] uppercase font-black tracking-widest">{errorStatus}</p>}

                     <button onClick={handleNext} className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3">
                        Next Step
                        <ArrowRight size={16} />
                     </button>
                  </div>
                </motion.div>
              )}

              {currentStep === "signup-handle" && (
                <motion.div
                  key="signup-handle"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={SPRING_TRANSITION}
                  className="space-y-12"
                >
                  <div className="text-center space-y-4">
                     <h2 className="font-lexend text-3xl font-black uppercase tracking-tighter text-white italic">HANDLE NEXUS</h2>
                     <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Choose your Username</p>
                  </div>

                  <form onSubmit={executeSignUp} className="space-y-8">
                     <div className="relative group">
                        <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="text" 
                          autoComplete="off"
                          placeholder="USERNAME" 
                          value={formData.username} 
                          onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, "")})} 
                          required 
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 pl-16 text-white text-lg font-black tracking-widest outline-none focus:border-white transition-all font-mono italic" 
                        />
                     </div>

                     {errorStatus && <p className="text-center text-red-500 font-mono text-[10px] uppercase font-black tracking-widest animate-pulse">{errorStatus}</p>}

                     <button disabled={isSyncing} className="w-full bg-emerald-500 text-black py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3">
                        {isSyncing ? <Loader2 className="animate-spin" size={16} /> : "Sign Up"}
                        <ArrowRight size={16} />
                     </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </motion.div>
    </div>
  );
}
