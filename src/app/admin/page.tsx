"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Upload, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Video,
  Image as ImageIcon,
  Loader2,
  Users,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  Calendar
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "@/components/NotificationContext";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

// --- SECURE AUTH KEYS ---
const SECURITY_KEY = "nexus_secure_2026"; // OWNER PASSWORD
const ADMIN_ID = "admin_milo"; 

type AdminView = "dashboard" | "queue" | "manage" | "team" | "upload" | "settings";

export default function AdminPortal() {
  const { user, isAdmin, isOwner, login, logout: authLogout, isLoading: authLoading, recoverPassword } = useAuth();
  const { addNotification } = useNotifications();
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [queue, setQueue] = useState<any[]>([]);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isSettingsLocked, setIsSettingsLocked] = useState(true);
  const [settingsPass, setSettingsPass] = useState("");

  // --- Auth Gate Synchronization ---
  useEffect(() => {
    if (isAdmin) {
      setIsAuthorized(true);
    }
  }, [isAdmin]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    
    // Direct Identification Bridge (Owner Bypass)
    if (idInput === ADMIN_ID && passInput === SECURITY_KEY) {
      setIsAuthorized(true);
      addNotification("session", "Admin Hub: Direct Bridge Established.");
      return;
    }

    // Standard synchronization Flow
    const loginEmail = idInput === ADMIN_ID ? "milo.anadi@gmail.com" : idInput;
    
    try {
      await login(loginEmail, passInput);
      // AuthContext will update isAdmin, triggering the useEffect above
    } catch (err) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const unlockSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsPass === SECURITY_KEY) {
      setIsSettingsLocked(false);
      addNotification("system", "System settings unlocked.");
    } else {
       addNotification("system", "Access denied: Invalid password.");
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
            <h1 className="font-lexend text-4xl font-black text-white uppercase tracking-tight">Admin Access</h1>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">Authorization Required</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
             <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="ADMIN ID or EMAIL" 
                    value={idInput} 
                    onChange={(e) => setIdInput(e.target.value)} 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all font-mono" 
                  />
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="PASSWORD" 
                    value={passInput} 
                    onChange={(e) => setPassInput(e.target.value)} 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all font-mono" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
             </div>
             <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Sign In</button>
             <button type="button" onClick={() => recoverPassword("milo.anadi@gmail.com")} className="block mx-auto mt-4 font-mono text-[8px] text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-all font-black">
                Forgot password?
             </button>
             {loginError && <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest animate-pulse">Access Denied // Invalid Credentials</p>}
          </form>
          
          <div className="pt-8 border-t border-white/5 space-y-4 text-center">
             <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Authorized team access only.</p>
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
            <ShieldCheck size={24} /> MILO ADMIN
          </h2>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mt-2">Access Level: {isOwner ? "Owner" : "Admin"}</p>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <NavItem icon={<CheckCircle2 size={18} />} label="Verifications" active={currentView === "queue"} onClick={() => setCurrentView("queue")} />
          <NavItem icon={<ShieldAlert size={18} />} label="Manage Events" active={currentView === "manage"} onClick={() => setCurrentView("manage")} />
          {isOwner && <NavItem icon={<Users size={18} />} label="Team Members" active={currentView === "team"} onClick={() => setCurrentView("team")} />}
          <NavItem icon={<Upload size={18} />} label="Post Event" active={currentView === "upload"} onClick={() => setCurrentView("upload")} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
        </nav>

        <div className="mt-8 space-y-6">
           <button onClick={() => { setIsAuthorized(false); authLogout(); }} className="w-full flex items-center gap-4 text-white/40 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest">
             <LogOut size={16} /> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 relative overflow-y-auto">
        <header className="sticky top-0 z-20 px-12 py-8 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-black/40">
          <h3 className="font-lexend text-xs font-black uppercase tracking-[0.5em] text-white/60">{currentView}</h3>
          <div className="flex items-center gap-6">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Secure Link Active</span>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          {currentView === "dashboard" && <OverviewHub queueCount={queue.length} />}
          {currentView === "queue" && <PendingQueue queue={queue} fetchQueue={fetchQueue} />}
          {currentView === "manage" && <EventsManager />}
          {currentView === "team" && <TeamHub />}
          {currentView === "upload" && <BroadcastHub />}
          {currentView === "settings" && (
             isSettingsLocked ? (
                <SecurityLock onUnlock={unlockSettings} settingsPass={settingsPass} setSettingsPass={setSettingsPass} />
             ) : (
                <SystemSettings />
             )
          )}
        </div>
      </main>
    </div>
  );
}

// --- Dynamic View Components ---

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
      <StatCard label="Pending Events" value={queueCount} accent="purple" />
      <StatCard label="Platform Load" value="Normal" accent="emerald" />
      <StatCard label="Active Synapse" value="Live" accent="white" />
      <StatCard label="System Integrity" value="100%" accent="white" />
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
       addNotification("radar", "Event approved successfully.");
       fetchQueue();
    } else {
       addNotification("system", "Failed to approve event.");
    }
    setIsProcessing(null);
  };

  return (
    <div className="space-y-12">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {queue.map((event: any) => (
            <motion.div key={event.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={SPRING_CONFIG} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-8 flex flex-col justify-between hover:border-white/20 transition-all">
               <div className="space-y-4">
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest p-2 bg-purple-500/10 rounded-lg">Pending Verification</span>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black font-lexend uppercase tracking-tight text-white">{event.title}</h4>
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin size={12} />
                      <p className="text-[10px] font-mono uppercase tracking-widest">{event.location}</p>
                    </div>
                  </div>
               </div>
               <button onClick={() => authorize(event.id)} disabled={!!isProcessing} className="w-full py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-400 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {isProcessing === event.id ? "Syncing..." : "Approve Event"}
               </button>
            </motion.div>
          ))}
       </div>
       {queue.length === 0 && <div className="py-40 text-center opacity-20 uppercase font-mono text-[10px] tracking-widest">No pending pulse verifications</div>}
    </div>
  );
}

function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this event session?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
       addNotification("system", "Event session terminated.");
       fetchEvents();
    } else {
       addNotification("system", "Termination failed.");
    }
  };

  return (
    <div className="space-y-12">
       {isLoading ? (
         <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-white/20" /></div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e: any) => (
              <div key={e.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:border-white/20 transition-all group">
                <div className="aspect-video w-full bg-white/5 rounded-2xl overflow-hidden relative">
                   <img src={e.image} alt="" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                   {e.is_verified && <div className="absolute top-4 right-4 bg-emerald-500 text-black p-1 rounded-full"><CheckCircle2 size={12} /></div>}
                </div>
                <div className="space-y-1">
                   <h5 className="text-[12px] font-black uppercase tracking-tight">{e.title}</h5>
                   <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{e.location}</p>
                </div>
                <button onClick={() => deleteEvent(e.id)} className="w-full py-3 bg-red-500/10 text-red-500/40 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                   <Trash2 size={14} /> Delete Event
                </button>
              </div>
            ))}
         </div>
       )}
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

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ role: "team" }).eq("email", emailInput);
    if (!error) {
       addNotification("system", "Team member added successfully.");
       setEmailInput("");
       fetchTeam();
    } else {
       addNotification("system", "Account not found in profile sync.");
    }
  };

  return (
    <div className="space-y-12">
       <div className="max-w-2xl bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] space-y-8">
          <h4 className="font-lexend text-xl font-black uppercase tracking-tight">Add Team Member</h4>
          <form onSubmit={addMember} className="flex gap-4">
             <input type="email" placeholder="TEAM EMAIL" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-mono text-[11px] outline-none" required />
             <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all">Authorize</button>
          </form>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map(member => (
             <div key={member.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center font-black uppercase text-xs">{member.full_name?.[0]}</div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-tight">{member.full_name}</p>
                      <p className="text-[8px] font-mono text-white/20 truncate max-w-[200px]">{member.email}</p>
                   </div>
                </div>
                <button onClick={async () => { await supabase.from("profiles").update({ role: "user" }).eq("id", member.id); fetchTeam(); }} className="p-3 text-red-500/20 hover:text-red-500 transition-colors"><XCircle size={18} /></button>
             </div>
          ))}
       </div>
    </div>
  );
}

function SecurityLock({ onUnlock, settingsPass, setSettingsPass }: any) {
  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-8">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Lock size={32} className="text-white/20" /></div>
      <div className="text-center space-y-2">
        <h4 className="font-lexend text-2xl font-black uppercase tracking-tight">Security Lock Active</h4>
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">Requires Owner Verification</p>
      </div>
      <form onSubmit={onUnlock} className="w-full max-w-md space-y-4">
         <input type="password" placeholder="ADMIN PASSWORD" value={settingsPass} onChange={(e) => setSettingsPass(e.target.value)} className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none transition-all focus:border-white/30" />
         <button className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all">Unlock Settings</button>
      </form>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="py-40 text-center space-y-6 opacity-20">
       <ShieldAlert size={64} className="mx-auto" />
       <div className="space-y-2">
         <p className="font-lexend text-2xl font-black uppercase tracking-tight">Advanced Settings Hub</p>
         <p className="font-mono text-[9px] uppercase tracking-[0.4em]">Core protocols currently restricted during beta phase</p>
       </div>
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
       if (file.size > 2048 * 1024) { // Increased to 2MB for better quality
          addNotification("system", "Photo exceeds 2MB limit.");
          return;
       }
       setMedia(prev => ({ ...prev, photo: file }));
    }

    if (type === "video") {
       if (file.size > 5 * 1024 * 1024) { // Increased to 5MB
          addNotification("system", "Video exceeds 5MB limit.");
          return;
       }
       setMedia(prev => ({ ...prev, video: file }));
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
        is_verified: true,
        featured: true 
      });

      if (error) throw error;
      addNotification("radar", "Event published successfully.");
      setFormData({ title: "", location: "", category: "Culture", description: "", price: "Free" });
      setMedia({ photo: null, video: null });
    } catch (err: any) {
      addNotification("system", `Post failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 space-y-12 backdrop-blur-3xl">
      <div className="space-y-4 text-center">
        <Upload className="mx-auto text-purple-400" size={32} />
        <h4 className="font-lexend text-3xl font-black uppercase tracking-tight">Post New Event</h4>
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Premium Event Broadcaster</p>
      </div>

      <form onSubmit={handleBroadcast} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputGroup label="Entity Name" placeholder="EVENT TITLE" value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} />
          <InputGroup label="Broadcast Venue" placeholder="LOCATION" value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})} />
        </div>
        
        <div className="space-y-6">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.5em] font-black text-center">Visual Media</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MediaInput label="Photo (2MB)" icon={<ImageIcon size={18} />} onSelect={(e: any) => validateMedia(e, "photo")} accept="image/*" active={!!media.photo} />
             <MediaInput label="Video (5MB)" icon={<Video size={18} />} onSelect={(e: any) => validateMedia(e, "video")} accept="video/*" active={!!media.video} />
          </div>
        </div>

        <button disabled={isSyncing} className="w-full bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50">
          {isSyncing ? "Syncing..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-mono text-white/30 uppercase tracking-[0.5em] ml-2 font-black">{label}</label>
      <input required type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-white/30 transition-all font-black tracking-widest" />
    </div>
  );
}

function MediaInput({ label, icon, onSelect, accept, active }: any) {
  return (
    <label className={clsx("relative group flex flex-col items-center justify-center p-10 bg-white/[0.03] border border-white/10 border-dashed rounded-[2rem] cursor-pointer hover:bg-white/[0.05] transition-all duration-500", active ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-white/30")}>
      <input type="file" className="hidden" onChange={onSelect} accept={accept} />
      <div className={clsx("mb-4 transition-colors", active ? "text-emerald-400" : "text-white/20 group-hover:text-white")}>{icon}</div>
      <span className={clsx("text-[9px] font-lexend font-black uppercase tracking-widest transition-colors", active ? "text-emerald-400" : "text-white/20 group-hover:text-white")}>{active ? "Synchronized" : label}</span>
    </label>
  );
}
