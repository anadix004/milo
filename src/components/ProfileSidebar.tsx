"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Globe, Image as ImageIcon, QrCode, LogOut, X, ChevronRight, ShieldCheck, Camera, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "./AuthContext";
import IdentityScan from "./IdentityScan";

import { useIsMobile } from "@/hooks/useMediaQuery";
import BottomSheet from "@/components/mobile/BottomSheet";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: () => void;
}

export default function ProfileSidebar({ isOpen, onClose, onAuthClick }: ProfileSidebarProps) {
  const isMobile = useIsMobile();
  const supabase = createClient();
  const { user, isAuthenticated, logout, refreshProfile, isAdmin, isOwner } = useAuth();
  const router = useRouter();
  const isTeam = user?.role === "team";
  const hasAdminAccess = isAdmin || isOwner || isTeam;
  const [isUploading, setIsUploading] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [updateMode, setUpdateMode] = useState<"camera" | "upload" | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileName = `${user.id}_manual_${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (profileError) throw profileError;

      await refreshProfile();
      setIsUpdatingAvatar(false);
      setUpdateMode(null);
    } catch (err) {
      console.error("Manual upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const renderContent = () => (
    <div className={clsx("flex flex-col h-full", !isMobile && "p-0")}>
      {/* Header - Desktop Only (BottomSheet has its own handle) */}
      {!isMobile && (
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-white text-xl font-black uppercase tracking-[0.2em]">My Profile</h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-12">
        <div 
          onClick={() => {
            if (isAuthenticated) setIsUpdatingAvatar(!isUpdatingAvatar);
          }}
          className={clsx(
            "relative group cursor-pointer transition-transform active:scale-95",
            !isAuthenticated && "cursor-default opacity-50"
          )}
        >
          <div className={clsx(
            "w-32 h-32 rounded-full transition-all duration-500 border-2 overflow-hidden flex items-center justify-center bg-white/[0.02] relative",
            isGhostMode ? "bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-400" : "border-white/5 hover:border-white/20"
          )}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className={clsx("transition-colors", isGhostMode ? "text-emerald-400" : "text-white/20")} />
            )}
            {isAuthenticated && (
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                  <Camera size={20} className="text-white" />
               </div>
            )}
          </div>
          {isAuthenticated && (
             <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                <ImageIcon size={14} />
             </div>
          )}
        </div>
        <div className="text-center mt-6 space-y-2">
           <p className="text-sm font-black text-white uppercase tracking-tight">
              {isAuthenticated ? (user?.username || user?.display_name || user?.email?.split('@')[0]) : "Guest User"}
           </p>
           <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] font-black">
              {isAuthenticated ? "Pulse Active // Verified" : "Radar Unauthorized"}
           </p>
        </div>
      </div>

      {/* Content Hub */}
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        {!isAuthenticated ? (
          <div className="space-y-6">
             <div className="text-center p-6 border border-white/5 bg-white/[0.02] rounded-[2rem] space-y-4">
                <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">Please log in to continue</p>
                <button 
                   onClick={onAuthClick}
                   className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                >
                   Log In / Sign Up
                </button>
             </div>
          </div>
        ) : isUpdatingAvatar ? (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/40 text-[9px] uppercase tracking-widest font-black font-mono">Identity Update</h3>
              <button onClick={() => setIsUpdatingAvatar(false)} className="p-2 text-white/20 hover:text-white"><X size={16}/></button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setUpdateMode(updateMode === "camera" ? null : "camera")}
                className={clsx(
                  "p-6 rounded-[1.5rem] border flex items-center justify-between transition-all",
                  updateMode === "camera" ? "bg-white text-black border-white" : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <Camera size={20} />
                  <div className="text-left">
                    <p className="font-black text-[10px] tracking-widest uppercase">Live Pulse Sync</p>
                    <p className="text-[7px] uppercase tracking-widest opacity-40">Identity Scan Pulse</p>
                  </div>
                </div>
              </button>
              
              <div className="relative group">
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleFileUpload}
                   className="absolute inset-0 opacity-0 cursor-pointer z-10"
                 />
                 <button 
                   className={clsx(
                     "w-full p-6 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center gap-4 text-white group-hover:border-white/20 transition-all",
                     isUploading && "opacity-50 cursor-not-allowed"
                   )}
                 >
                   {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                   <div className="text-left">
                     <p className="font-black text-[10px] tracking-widest uppercase">File Upload</p>
                     <p className="text-[7px] uppercase tracking-widest opacity-40">Static Identity Sync</p>
                   </div>
                 </button>
              </div>
            </div>

            <AnimatePresence>
              {updateMode === "camera" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-white/5 rounded-3xl border border-white/5 overflow-hidden"
                >
                   <IdentityScan onComplete={async () => {
                     await refreshProfile();
                     setIsUpdatingAvatar(false);
                     setUpdateMode(null);
                   }} />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsUpdatingAvatar(false)}
              className="w-full text-center font-mono text-[8px] text-white/20 uppercase tracking-widest hover:text-white transition-colors py-4 font-black"
            >
              Return to Profile
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {isAuthenticated && hasAdminAccess && (
              <div className="space-y-4">
                <h3 className="text-amber-500/40 text-[9px] uppercase tracking-widest px-2 font-black font-mono">Administrative Pulse</h3>
                <button 
                  onClick={() => {
                    onClose();
                    router.push("/admin");
                  }}
                  className="w-full p-6 rounded-[1.5rem] bg-amber-400/5 border border-amber-400/20 flex items-center justify-between transition-all hover:bg-amber-400/10 hover:border-amber-400/40 group shadow-[0_0_30px_rgba(251,191,36,0.05)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-400/20 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Shield size={20} />
                    </div>
                    <div className="text-left">
                      <span className="font-black text-[10px] tracking-widest uppercase text-amber-400 block">Command Hub</span>
                      <span className="text-[7px] uppercase tracking-widest text-amber-400/40">Authorized Entry Only</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-amber-400/40 group-hover:text-amber-400" />
                </button>
              </div>
            )}

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
                  <span className="font-black text-[10px] tracking-widest uppercase">Milo Pass</span>
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
                         <p className="text-[8px] font-mono text-black font-black uppercase tracking-[0.4em]">Verified // Active</p>
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
                   <span className={clsx("text-[8px] uppercase tracking-widest", isGhostMode ? "text-black/40" : "text-white/20")}>Private Mode</span>
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
              <h3 className="text-white/40 text-[9px] uppercase tracking-widest px-2 font-black font-mono">Recent Activity</h3>
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
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} snapHeight="95vh">
        {renderContent()}
      </BottomSheet>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-all duration-700"
          />

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
            {renderContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
