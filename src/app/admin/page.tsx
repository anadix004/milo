"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Upload, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  PhoneCall, 
  Video, 
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Eye,
  Users,
  ShieldAlert,
  Lock,
  Search
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "@/components/NotificationContext";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

// --- SECURE SECURITY KEYS ---
const SECURITY_KEY = "nexus_secure_2026"; // OWNER KEY
const TEAM_KEY = "milo_team_2026";      // TEAM KEY PULSE
const ADMIN_ID = "admin_milo"; 

type AdminView = "dashboard" | "queue" | "team" | "upload" | "settings";

export default function AdminPortal() {
  const { user, isAdmin, isOwner, login, logout: authLogout, isLoading: authLoading, recoverPassword } = useAuth();
  const { addNotification } = useNotifications();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authType, setAuthType] = useState<"id" | "session">("id");
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [queue, setQueue] = useState<any[]>([]);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isSettingsLocked, setIsSettingsLocked] = useState(true);
  const [settingsPass, setSettingsPass] = useState("");
  const [showCallHost, setShowCallHost] = useState<any | null>(null);

  // --- Auth Gate Synchronization ---
  useEffect(() => {
    if (isAdmin) {
      setIsAuthorized(true);
      setAuthType("session");
    }
  }, [isAdmin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    
    // Unique Admin ID Pulse (maps to owner email)
    const loginEmail = idInput === ADMIN_ID ? "milo.anadi@gmail.com" : idInput;
    
    try {
      await login(loginEmail, passInput);
      // AuthContext useEffect will handle isAuthorized if success
    } catch (err) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const unlockSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsPass === SECURITY_KEY) {
      setIsSettingsLocked(false);
      addNotification("system", "Settings Hub Unlocked.");
    } else {
       addNotification("system", "Security Violation: Invalid Key.");
    }
  };

  // --- Pending Queue Fetch ---
  const fetchQueue = async () => {
    setIsQueueLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    
    if (!error) setQueue(data || []);
    setIsQueueLoading(false);
  };

  useEffect(() => {
    if (isAuthorized && currentView === "queue") fetchQueue();
  }, [isAuthorized, currentView]);

  if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><Loader2 size={32} className="animate-spin text-white/20" /></div>;

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING_CONFIG} className="w-full max-w-md space-y-12 text-center">
          <div className="space-y-4">
            <h1 className="font-lexend text-4xl font-black text-white uppercase tracking-tight">Gatekeeper Portal</h1>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">identification Required</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
             <div className="space-y-4">
                <input type="text" placeholder="AUTHORIZED ID or EMAIL" value={idInput} onChange={(e) => setIdInput(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all font-mono" />
                <input type="password" placeholder="SECURITY KEY" value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all font-mono" />
             </div>
             <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Initialize Pulse</button>
             <button type="button" onClick={() => recoverPassword("milo.anadi@gmail.com")} className="block mx-auto mt-4 font-mono text-[8px] text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-all font-black">
                Lost Command Access? Initialize Recovery mission
             </button>
             {loginError && <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest animate-pulse">Access Denied // ID Mismatch</p>}
          </form>
          
          <div className="pt-8 border-t border-white/5 space-y-4">
             <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Team members should use their pre-authorized email and provided password.</p>
             <p className="font-mono text-[8px] text-purple-400 uppercase tracking-widest">Supreme owner: milo.anadi@gmail.com</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <aside className="w-80 bg-white/[0.02] border-r border-white/5 backdrop-blur-3xl flex flex-col p-8 z-30">
        <div className="mb-12">
          <h2 className="font-lexend text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <ShieldCheck size={24} /> MILO NEXUS
          </h2>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mt-2">Gatekeeper: v.2.5 RBAC</p>
        </div>

        <nav className="flex-1 space-y-4">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <NavItem icon={<CheckCircle2 size={18} />} label="Verification" active={currentView === "queue"} onClick={() => setCurrentView("queue")} />
          {(isOwner || isAdmin) && <NavItem icon={<Users size={18} />} label="Team Hub" active={currentView === "team"} onClick={() => setCurrentView("team")} />}
          <NavItem icon={<Upload size={18} />} label="Broadcast" active={currentView === "upload"} onClick={() => setCurrentView("upload")} />
          <NavItem icon={<Settings size={18} />} label="System" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
        </nav>

        <div className="mt-auto space-y-6">
           <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-black">{user?.full_name?.[0] || "A"}</div>
              <div className="overflow-hidden">
                 <p className="text-[10px] font-black uppercase tracking-tight truncate">{user?.full_name || "Admin"}</p>
                 <p className="text-[8px] font-mono text-purple-400 uppercase tracking-widest">{user?.role || "Owner"}</p>
              </div>
           </div>
           <button onClick={() => { setIsAuthorized(false); authLogout(); }} className="w-full flex items-center gap-4 text-white/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest">
             <LogOut size={16} /> Terminal Exit
           </button>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_50%)]">
        <header className="sticky top-0 z-20 px-12 py-8 flex items-center justify-between backdrop-blur-md border-b border-white/5">
          <h3 className="font-lexend text-sm font-black uppercase tracking-[0.5em] text-white/60">{currentView} HUB</h3>
          <div className="flex items-center gap-6">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Nexus Pulse Operational</span>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          {currentView === "dashboard" && <OverviewHub queueCount={queue.length} />}
          {currentView === "queue" && <PendingQueue queue={queue} fetchQueue={fetchQueue} />}
          {currentView === "team" && <TeamHub />}
          {currentView === "upload" && <BroadcastHub />}
          {currentView === "settings" && (
             isSettingsLocked ? (
               <div className="py-20 flex flex-col items-center justify-center space-y-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Lock size={32} className="text-white/20" /></div>
                  <h4 className="font-lexend text-2xl font-black uppercase tracking-tight">Settings Lock Enforced</h4>
                  <form onSubmit={unlockSettings} className="w-full max-w-md space-y-4">
                     <input type="password" placeholder="SYSTEM SECURITY KEY" value={settingsPass} onChange={(e) => setSettingsPass(e.target.value)} className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none" />
                     <button className="w-full bg-white text-black py-4 rounded-full font-black uppercase tracking-widest text-[10px]">Unlock System</button>
                  </form>
               </div>
             ) : (
               <SystemSettings />
             )
          )}
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={clsx("w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300", active ? "bg-white text-black shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white")}>
      {icon} <span className="font-lexend text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function OverviewHub({ queueCount }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <StatCard label="Pending Pulse" value={queueCount} accent="purple" />
      <StatCard label="Radar Nodes" value="LIVE" accent="emerald" />
      <StatCard label="System Load" value="OPTimal" accent="white" />
      <StatCard label="Identity Sync" value="100%" accent="white" />
    </div>
  );
}

function StatCard({ label, value, accent }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-2 group hover:border-white/20 transition-all">
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{label}</p>
      <p className={clsx("text-4xl font-black uppercase tracking-tight", accent === "purple" && "text-purple-400", accent === "emerald" && "text-emerald-400")}>{value}</p>
    </div>
  );
}

function PendingQueue({ queue, fetchQueue }: { queue: any[], fetchQueue: () => void }) {
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const authorize = async (id: string) => {
    setIsProcessing(id);
    const { error } = await supabase.from("events").update({ is_verified: true }).eq("id", id);
    if (!error) {
       addNotification("radar", "Event Verified Successfully.");
       fetchQueue();
    } else {
       addNotification("system", "Kinetic Sequence Overflow: Verification failed.");
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-12">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {queue.map((event: any) => (
            <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-8">
               <div className="flex justify-between">
                  <div className="space-y-2">
                     <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest p-2 bg-purple-500/10 rounded-lg">Pending identification</span>
                     <h4 className="text-2xl font-black font-lexend uppercase tracking-tight">{event.title}</h4>
                     <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{event.location}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => authorize(event.id)} disabled={!!isProcessing} className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-400 transition-all">
                    {isProcessing === event.id ? "Syncing..." : "Authorize mission"}
                  </button>
               </div>
            </motion.div>
          ))}
       </div>
       {queue.length === 0 && <div className="py-40 text-center opacity-20 uppercase font-mono text-[10px] tracking-widest">Queue Synchronized</div>}
    </div>
  );
}

function TeamHub() {
  const [team, setTeam] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const { addNotification } = useNotifications();

  const fetchTeam = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("role", "team");
    setTeam(data || []);
  };

  useEffect(() => { fetchTeam(); }, []);

  const addTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ role: "team" }).eq("email", emailInput);
    if (!error) {
       addNotification("system", "Team identification Synchronized.");
       setEmailInput("");
       fetchTeam();
    } else {
       addNotification("system", "Member Identity Not Found in Profiles.");
    }
  };

  return (
    <div className="space-y-12">
       <div className="max-w-2xl bg-white/[0.02] border border-white/5 p-12 rounded-[40px] space-y-8">
          <h4 className="font-lexend text-2xl font-black uppercase">Recruit Team identification</h4>
          <form onSubmit={addTeamMember} className="flex gap-4">
             <input type="email" placeholder="IDENTITY EMAIL" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-mono outline-none" required />
             <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px]">Add Member</button>
          </form>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map(member => (
             <div key={member.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black uppercase text-xs">{member.full_name?.[0]}</div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-tight">{member.full_name}</p>
                      <p className="text-[8px] font-mono text-white/20 truncate max-w-[200px]">{member.email}</p>
                   </div>
                </div>
                <button onClick={async () => { await supabase.from("profiles").update({ role: "user" }).eq("id", member.id); fetchTeam(); }} className="p-3 text-red-500/30 hover:text-red-500 transition-colors"><XCircle size={18} /></button>
             </div>
          ))}
       </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="py-20 text-center space-y-4 opacity-20">
       <ShieldAlert size={48} className="mx-auto" />
       <p className="font-mono text-[10px] uppercase tracking-[0.4em]">Cinematic Core settings Synchronized</p>
    </div>
  );
}

function BroadcastHub() {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({ title: "", location: "", category: "Culture", description: "", price: "Free" });
  const [media, setMedia] = useState<{ photo: File | null; video: File | null }>({ photo: null, video: null });
  const [isSyncing, setIsSyncing] = useState(false);

  const validateMedia = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "photo") {
       if (file.size > 1024 * 1024) {
          addNotification("system", "Visual Frame Overflow: Photo exceeds 1MB limit.");
          e.target.value = "";
          return;
       }
       setMedia(prev => ({ ...prev, photo: file }));
       addNotification("system", "Visual Frame Synchronized.");
    }

    if (type === "video") {
       if (file.size > 2 * 1024 * 1024) {
          addNotification("system", "Kinetic Sequence Overflow: Video exceeds 2MB limit.");
          e.target.value = "";
          return;
       }

       const video = document.createElement("video");
       video.preload = "metadata";
       video.onloadedmetadata = () => {
         window.URL.revokeObjectURL(video.src);
         if (video.duration > 10.5) {
            addNotification("system", "Temporal Violation: Broadcast must be 10.5s or less.");
            e.target.value = "";
         } else {
            setMedia(prev => ({ ...prev, video: file }));
            addNotification("system", "Kinetic Sequence Synchronized.");
         }
       };
       video.src = URL.createObjectURL(file);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);

    try {
      let imageUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
      let videoUrl = "";

      if (media.photo) {
        const fileName = `${Date.now()}_admin_img.${media.photo.name.split(".").pop()}`;
        await supabase.storage.from("event-assets").upload(fileName, media.photo);
        imageUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
      }

      if (media.video) {
        const fileName = `${Date.now()}_admin_vid.${media.video.name.split(".").pop()}`;
        await supabase.storage.from("event-assets").upload(fileName, media.video);
        videoUrl = supabase.storage.from("event-assets").getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from("events").insert({
        ...formData,
        cityId: formData.location.toLowerCase().replace(" ", "-"),
        image: imageUrl,
        video_url: videoUrl,
        is_verified: true, // Admin broadcasts are auto-verified
        featured: true // Admin broadcasts are featured by default
      });

      if (error) throw error;
      addNotification("radar", "Nexus Broadcast Synchronized.");
      setFormData({ title: "", location: "", category: "Culture", description: "", price: "Free" });
      setMedia({ photo: null, video: null });
    } catch (err: any) {
      addNotification("system", `Broadcast Sync Failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] p-12 space-y-12 backdrop-blur-3xl">
      <div className="space-y-4 text-center">
        <Upload className="mx-auto text-purple-400" size={32} />
        <h4 className="font-lexend text-3xl font-black uppercase tracking-tight">Initiate Broadcast</h4>
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Cinematic Multi-Path Broadcaster</p>
      </div>

      <form onSubmit={handleBroadcast} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Entity Name" placeholder="EVENT TITLE" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
          <InputGroup label="Broadcast Terminal" placeholder="VENUE LOCATION" value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})} />
        </div>
        
        <div className="space-y-6">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] font-black text-center">Media Synchronization Gatekeeper</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MediaInput label="Visual (1MB)" icon={<ImageIcon size={18} />} onSelect={(e: any) => validateMedia(e, "photo")} accept="image/*" active={!!media.photo} />
             <MediaInput label="Kinetic (10s/2MB)" icon={<Video size={18} />} onSelect={(e: any) => validateMedia(e, "video")} accept="video/*" active={!!media.video} />
          </div>
        </div>

        <button disabled={isSyncing} className="w-full bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.05)] disabled:opacity-50">
          {isSyncing ? "Initializing Pulse..." : "Synchronize Broadcast"}
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] ml-2 font-black">{label}</label>
      <input required type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:border-white/20 transition-all font-black tracking-widest" />
    </div>
  );
}

function MediaInput({ label, icon, onSelect, accept, active }: any) {
  return (
    <label className={clsx("relative group flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/5 border-dashed rounded-3xl cursor-pointer hover:bg-white/[0.05] transition-all", active ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-white/20")}>
      <input type="file" className="hidden" onChange={onSelect} accept={accept} />
      <div className={clsx("mb-4", active ? "text-emerald-400" : "text-white/40 group-hover:text-white transition-colors")}>{icon}</div>
      <span className={clsx("text-[9px] font-lexend font-black uppercase tracking-widest", active ? "text-emerald-400" : "text-white/40 group-hover:text-white")}>{active ? "Synchronized" : label}</span>
    </label>
  );
}
