"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Loader2,
  Lock
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/components/NotificationContext";
import Sidebar from "@/components/admin/Sidebar";
import ModerationQueue from "@/components/admin/ModerationQueue";
import PlatformPulse from "@/components/admin/PlatformPulse";
import AccessControl from "@/components/admin/AccessControl";
import AuditLogs from "@/components/admin/AuditLogs";
import clsx from "clsx";

type AdminTab = "queue" | "pulse" | "access" | "audit";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };
const OWNER_PASS = "milo_owner_vault_2026"; 
const OWNER_ID = "owner_milo"; 
const TEAM_PASS = "milo_team_secure_2026";

export default function AdminPortal() {
  const { user, isAdmin, isOwner, login, logout, isLoading: authLoading, recoverPassword, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [currentTab, setCurrentTab] = useState<AdminTab>("queue");

  // --- Auth Gate Synchronization ---
  // AUTO-LOGIN DISABLED: Every session requires manual authorization pulse.

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    
    // Direct Identification Bridge (Owner & Team Bypass)
    if (idInput === OWNER_ID && passInput === OWNER_PASS) {
      setIsAuthorized(true);
      addNotification("session", "Root Command: Direct Bridge Established.");
      return;
    }

    if (passInput === TEAM_PASS) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", idInput)
        .single();

      const authorizedRoles = ["owner", "admin", "team"];
      if (profile && authorizedRoles.includes(profile.role)) {
        setIsAuthorized(true);
        addNotification("session", "Team Access: Direct Bridge Authorized.");
        return;
      }
    }

    try {
      await login(idInput, passInput);
      
      // Wait for AuthContext to update the user object
      // We check the role immediately after a successful login pulse
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", idInput)
        .single();

      const authorizedRoles = ["owner", "admin", "team"];
      if (profile && authorizedRoles.includes(profile.role)) {
        setIsAuthorized(true);
        addNotification("session", "Identity authorized. Dashboard active.");
      } else {
        await logout();
        setLoginError(true);
        addNotification("system", "Access Denied: Identity lacks clearance.");
      }
    } catch (err) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 grayscale">
        <Loader2 size={32} className="animate-spin text-white/10" />
      </div>
    );
  }

  // --- LOGIN GATE (DEEP SPACE BLACK) ---
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_100%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={SPRING_CONFIG} 
          className="w-full max-w-md space-y-12 text-center z-10"
        >
          {isAuthenticated && !isAdmin ? (
            /* ACCESS DENIED PULSE */
            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full mx-auto flex items-center justify-center">
                     <Lock size={32} className="text-red-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                     <h2 className="font-lexend text-3xl font-black text-white uppercase tracking-tighter italic">ACCESS DENIED</h2>
                     <p className="font-mono text-[9px] text-red-500/60 uppercase tracking-[0.5em] font-black">UNAUTHORIZED PROTOCOL DETECTION</p>
                  </div>
               </div>
               
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                     Your identity, <span className="text-white">@{user?.email?.split('@')[0]}</span>, does not have the required security clearance to access the Milo Command Hub.
                  </p>
               </div>

               <button 
                 onClick={() => router.push("/")}
                 className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5"
               >
                  Return to Radar
               </button>
            </div>
          ) : (
            /* STANDARD LOGIN GATE */
            <>
              <div className="space-y-4">
                <h1 className="font-lexend text-4xl font-black text-white uppercase tracking-tighter italic">MILO ADMIN</h1>
                <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Authorized Access Required</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                 <div className="space-y-3">
                    <div className="relative group">
                       <input 
                         type="text" 
                         placeholder="ADMIN ID // EMAIL" 
                         value={idInput} 
                         onChange={(e) => setIdInput(e.target.value)} 
                         className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono text-[11px] uppercase" 
                       />
                    </div>
                    <div className="relative group">
                       <input 
                         type={showPassword ? "text" : "password"} 
                         placeholder="SECURITY PASSWORD" 
                         value={passInput} 
                         onChange={(e) => setPassInput(e.target.value)} 
                         className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/20 transition-all font-mono text-[11px] uppercase" 
                       />
                       <button 
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white/10 hover:text-white transition-colors"
                       >
                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>
                 </div>

                 <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5">
                    Authorize Entry
                 </button>

                 <button 
                   type="button" 
                   onClick={() => recoverPassword("milo.anadi@gmail.com")} 
                   className="block mx-auto mt-4 font-mono text-[8px] text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-all font-black opacity-40 hover:opacity-100"
                 >
                    Lost your key?
                 </button>

                 {loginError && (
                   <div className="flex items-center justify-center gap-2 text-red-500/60 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                      <Lock size={12} /> Access Denied // Credentials Mismatch
                   </div>
                 )}
              </form>
            </>
          )}
          
          <div className="pt-8 border-t border-white/5 space-y-4 text-center opacity-20">
             <p className="font-mono text-[8px] text-white/40 uppercase tracking-[0.4em] font-black">Authorized personnel only. Infrastructure protected by Milo Edge Network.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- ADMIN HUB (COMMAND SHELL) ---
  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white font-[family-name:var(--font-lexend)]">
      {/* SIDEBAR: NAVIGATION & IDENTITY */}
      <Sidebar 
        currentTab={currentTab} 
        setTab={(tab: AdminTab) => setCurrentTab(tab)} 
        pendingCount={0} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* TOP STATUS BAR (SUBTLE) */}
        <header className="px-12 py-6 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-6">
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Admin Hub</span>
              <div className="h-4 w-px bg-white/5" />
              <span className="font-mono text-[9px] text-white/60 uppercase tracking-[0.2em] font-black">{currentTab.replace("-", " ")}</span>
           </div>
           
           <div className="flex items-center gap-4 text-white/10 font-mono text-[8px] uppercase tracking-[0.5em] font-black">
              System Health // 100%
           </div>
        </header>

        {/* DYNAMIC TAB CONTENT */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentTab}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className="absolute inset-0 flex flex-col overflow-hidden"
             >
               {currentTab === "queue" && <ModerationQueue />}
               {currentTab === "pulse" && <PlatformPulse />}
               {currentTab === "access" && <AccessControl />}
               {currentTab === "audit" && <AuditLogs />}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
