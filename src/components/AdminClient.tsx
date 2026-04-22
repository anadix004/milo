"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff,
  Loader2,
  Lock
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/components/NotificationContext";
import Sidebar from "@/components/admin/Sidebar";
import ModerationQueue from "@/components/admin/ModerationQueue";
import PlatformPulse from "@/components/admin/PlatformPulse";
import AccessControl from "@/components/admin/AccessControl";
import AuditLogs from "@/components/admin/AuditLogs";

type AdminTab = "queue" | "pulse" | "access" | "audit";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

export default function AdminClient() {
  const supabase = createClient();
  const { user, isAdmin, login, logout, isLoading: authLoading, recoverPassword, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [currentTab, setCurrentTab] = useState<AdminTab>("queue");
  
  // Consolidate Auth: If Supabase session is an admin/owner, bypass secondary wall
  useEffect(() => {
    const checkAdmin = async () => {
      if (isAuthenticated && (isAdmin || user?.email?.includes('owner_milo'))) {
        setIsAuthorized(true);
        addNotification("session", "Admin session verified.");
      }
    };
    checkAdmin();
  }, [isAuthenticated, isAdmin, user, addNotification]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    
    // 1. Check server-side admin credentials
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idInput, password: passInput }),
      });
      const data = await res.json();

      if (data.authorized) {
        if (data.method === "team") {
          // Verify the user has team/admin role in the database
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("email", idInput)
            .single();

          const authorizedRoles = ["owner", "admin", "team"];
          if (profile && authorizedRoles.includes(profile.role)) {
            setIsAuthorized(true);
            addNotification("session", "Team access granted.");
            return;
          }
        } else {
          setIsAuthorized(true);
          addNotification("session", "Root Command: Direct Bridge Established.");
          return;
        }
      }
    } catch (err) {
      console.error("Admin verify API error:", err);
    }

    // 2. Fall back to Supabase email/password login
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: idInput, 
        password: passInput 
      });
      if (error) {
        setLoginError(true);
        setTimeout(() => setLoginError(false), 2000);
        return;
      }
      setIsAuthorized(true);
      addNotification("session", "Login successful. Admin dashboard ready.");
      router.refresh();
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

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-6 overflow-y-auto no-scrollbar py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_100%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={SPRING_CONFIG} 
          className="w-full max-w-md space-y-12 text-center z-10"
        >
          <div className="space-y-4">
            <h1 className="font-lexend text-4xl font-black text-white uppercase tracking-tighter italic">MILO ADMIN</h1>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.5em] font-black">Admin Access Required</p>
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

             {loginError && (
               <div className="flex items-center justify-center gap-2 text-red-500/60 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                  <Lock size={12} /> Access Denied // Credentials Mismatch
               </div>
             )}
          </form>
          
          <div className="pt-8 border-t border-white/5 space-y-4 text-center opacity-20">
             <p className="font-mono text-[8px] text-white/40 uppercase tracking-[0.4em] font-black">Infrastructure protected by Milo Edge Network.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden text-white font-[family-name:var(--font-lexend)]">
      <Sidebar 
        currentTab={currentTab} 
        setTab={(tab: AdminTab) => setCurrentTab(tab)} 
        pendingCount={0} 
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="px-12 py-6 flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-6">
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">Admin Hub</span>
              <div className="h-4 w-px bg-white/5" />
              <span className="font-mono text-[9px] text-white/60 uppercase tracking-[0.2em] font-black">{currentTab.replace("-", " ")}</span>
           </div>
        </header>

        <div className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentTab}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className="min-h-full"
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
