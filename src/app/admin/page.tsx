"use client";

import { useState, useRef, useEffect } from "react";
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
  Eye
} from "lucide-react";
import clsx from "clsx";

const SPRING_CONFIG = { stiffness: 70, damping: 15 };

// Mock Authorized Credentials
const AUTH_ID = "admin_milo";
const AUTH_PASS = "nexus_secure_2026";

// --- Types ---
type AdminView = "dashboard" | "queue" | "upload" | "settings";

interface PendingEvent {
  id: string;
  name: string;
  venue: string;
  host: string;
  timestamp: string;
  contact: string;
}

const MOCK_QUEUE: PendingEvent[] = [
  { id: "ev-101", name: "Urban Tech Meetup", venue: "The Collective, BLR", host: "Rohit K.", timestamp: "2h ago", contact: "+91 98765 43210" },
  { id: "ev-102", name: "Neon Jazz Night", venue: "Blue Room, MUM", host: "Sarah D.", timestamp: "5h ago", contact: "+91 91234 56789" },
  { id: "ev-103", name: "Startup Pulse '26", venue: "Innovation Hub, DEL", host: "Vikram S.", timestamp: "1d ago", contact: "+91 88888 77777" },
];

export default function AdminPortal() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [showCallHost, setShowCallHost] = useState<PendingEvent | null>(null);

  // --- Auth Gate ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (idInput === AUTH_ID && passInput === AUTH_PASS) {
      setIsAuthorized(true);
      setToast({ message: "Identity Synchronized", type: "success" });
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_CONFIG}
          className="w-full max-w-md space-y-12 text-center"
        >
          <div className="space-y-4">
            <h1 className="font-[family-name:var(--font-lexend)] text-4xl font-black text-white uppercase tracking-tight">Gatekeeper Login</h1>
            <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] text-white/40 uppercase tracking-[0.4em]">Authorized Access Only</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="AUTHORIZED ID" 
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all"
              />
              <input 
                type="password" 
                placeholder="SECURITY KEY" 
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-white text-center font-black tracking-widest outline-none focus:border-white/30 transition-all"
              />
            </div>
            <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Initialize Identification
            </button>
            {loginError && (
              <p className="font-[family-name:var(--font-roboto-mono)] text-[10px] text-red-500 uppercase tracking-widest animate-pulse">Access Denied // ID mismatch</p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white/[0.02] border-r border-white/5 backdrop-blur-3xl flex flex-col p-8 z-30">
        <div className="mb-12">
          <h2 className="font-[family-name:var(--font-lexend)] text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <ShieldCheck className="text-white" size={24} />
            Milo Team
          </h2>
          <p className="text-[9px] font-[family-name:var(--font-roboto-mono)] text-white/20 uppercase tracking-[0.3em] mt-2">v.2.4 Secure Admin</p>
        </div>

        <nav className="flex-1 space-y-4">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={currentView === "dashboard"} onClick={() => setCurrentView("dashboard")} />
          <NavItem icon={<CheckCircle2 size={18} />} label="Verification" active={currentView === "queue"} onClick={() => setCurrentView("queue")} />
          <NavItem icon={<Upload size={18} />} label="Broadcast" active={currentView === "upload"} onClick={() => setCurrentView("upload")} />
          <NavItem icon={<Settings size={18} />} label="System" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
        </nav>

        <button 
           onClick={() => setIsAuthorized(false)}
           className="mt-auto group flex items-center gap-4 text-white/40 hover:text-white transition-all font-[family-name:var(--font-roboto-mono)] text-[10px] uppercase tracking-widest"
        >
          <LogOut size={16} />
          Terminal Exit
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_50%)]">
        <header className="sticky top-0 z-20 px-12 py-8 flex items-center justify-between backdrop-blur-md border-b border-white/5">
          <h3 className="font-[family-name:var(--font-lexend)] text-sm font-black uppercase tracking-[0.5em] text-white/60">{currentView} Hub</h3>
          <div className="flex items-center gap-6">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Network Operational</span>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          {currentView === "dashboard" && <OverviewHub queueCount={queue.length} />}
          {currentView === "queue" && <PendingQueue queue={queue} setQueue={setQueue} onCallHost={setShowCallHost} />}
          {currentView === "upload" && <BroadcastHub setToast={setToast} />}
        </div>

        {/* Cinematic Toast Notifications */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: 100, opacity: 0, filter: "blur(10px)" }}
              className={clsx(
                "fixed bottom-12 right-12 z-[300] px-8 py-5 rounded-2xl border backdrop-blur-3xl shadow-2xl flex items-center gap-4",
                toast.type === "error" ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30"
              )}
            >
              {toast.type === "error" ? <XCircle className="text-red-500" /> : <CheckCircle2 className="text-emerald-500" />}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">{toast.type === "error" ? "Gatekeeper Violation" : "System Notification"}</p>
                <p className="text-[11px] font-[family-name:var(--font-roboto-mono)] text-white/60">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Call Host */}
        <AnimatePresence>
          {showCallHost && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowCallHost(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={SPRING_CONFIG}
                className="relative w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-3xl p-10 space-y-8 shadow-2xl"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10">
                     <PhoneCall size={32} className="text-white" />
                  </div>
                  <h4 className="font-lexend text-2xl font-black uppercase tracking-tight">Contact Hub</h4>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Organizer ID: {showCallHost.host}</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-black">Secure Mobile Line</p>
                    <p className="text-2xl font-bold tracking-[0.2em]">{showCallHost.contact}</p>
                  </div>
                  <button 
                    onClick={() => setShowCallHost(null)}
                    className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Close Portal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300",
        active ? "bg-white text-black shadow-lg" : "text-white/40 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span className="font-[family-name:var(--font-lexend)] text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function OverviewHub({ queueCount }: { queueCount: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <StatCard label="Pending Identify" value={queueCount} accent="purple" />
      <StatCard label="Live Events" value={24} accent="emerald" />
      <StatCard label="Total Broadcasts" value="1.2k" accent="white" />
      <StatCard label="System Integrity" value="99%" accent="white" />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string, value: string | number, accent: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-2 group hover:border-white/20 transition-all">
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/40">{label}</p>
      <p className={clsx(
        "text-4xl font-black tracking-tight",
        accent === "purple" && "text-purple-400",
        accent === "emerald" && "text-emerald-400"
      )}>{value}</p>
    </div>
  );
}

function PendingQueue({ queue, setQueue, onCallHost }: { queue: PendingEvent[], setQueue: any, onCallHost: any }) {
  const verify = (id: string) => {
    setQueue(queue.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {queue.map((event) => (
          <motion.div 
            key={event.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-purple-400/80 uppercase tracking-widest p-2 bg-purple-500/10 rounded-lg">Verification Pending</span>
                <h4 className="text-2xl font-black font-lexend uppercase tracking-tight">{event.name}</h4>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">{event.venue}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-white/20 uppercase font-black">{event.timestamp}</p>
              </div>
            </div>

            <div className="flex gap-4">
               <button 
                onClick={() => verify(event.id)}
                className="flex-1 py-4 bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-400 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] active:scale-95 group-hover:animate-pulse"
               >
                 Authorize Event
               </button>
               <button 
                 onClick={() => onCallHost(event)}
                 className="px-6 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all active:scale-95 border border-white/5"
               >
                 <PhoneCall size={18} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
      {queue.length === 0 && (
         <div className="py-32 text-center space-y-4 opacity-50">
            <CheckCircle2 size={48} className="mx-auto text-white/20" />
            <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Queue Cleared // Security Synchronized</p>
         </div>
      )}
    </div>
  );
}

function BroadcastHub({ setToast }: { setToast: any }) {
  const [formData, setFormData] = useState({ name: "", venue: "", category: "" });
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Gatekeeper: Media Validation Engine ---
  const validateMedia = async (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guardrail: Photo Size
    if (type === "photo") {
       if (file.size > 800 * 1024) {
          setToast({ message: "FILE OVERFLOW: Photo exceeds 800 KB (Cyberpunk Error)", type: "error" });
          e.target.value = "";
          return;
       }
    }

    // Guardrail: Video Size + Duration
    if (type === "video") {
       if (file.size > 2 * 1024 * 1024) {
          setToast({ message: "DATA OVERFLOW: Video exceeds 2 MB footprint", type: "error" });
          e.target.value = "";
          return;
       }

       // Duration Validation
       const video = document.createElement("video");
       video.preload = "metadata";
       video.onloadedmetadata = () => {
         window.URL.revokeObjectURL(video.src);
         if (video.duration > 10.5) {
            setToast({ message: "TEMPORAL ERROR: Broadcast must be 10s or less", type: "error" });
            e.target.value = "";
         } else {
            setToast({ message: "Media Synchronized // Gatekeeper Pass", type: "success" });
         }
       };
       video.src = URL.createObjectURL(file);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setToast({ message: "Broadcast Synchronized to Radar Portals", type: "success" });
      setFormData({ name: "", venue: "", category: "" });
    }, 2000);
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
          <InputGroup label="Entity Name" placeholder="EVENT TITLE" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
          <InputGroup label="Broadcast Terminal" placeholder="VENUE LOCATION" value={formData.venue} onChange={(v: string) => setFormData({...formData, venue: v})} />
        </div>
        
        <div className="space-y-6">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] font-black text-center">Media Synchronization Gatekeeper</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MediaInput label="Visual Frame (Photo)" icon={<ImageIcon size={18} />} onSelect={(e: React.ChangeEvent<HTMLInputElement>) => validateMedia(e, "photo")} accept="image/*" />
             <MediaInput label="Kinetic Sequence (Video)" icon={<Video size={18} />} onSelect={(e: React.ChangeEvent<HTMLInputElement>) => validateMedia(e, "video")} accept="video/*" />
          </div>
          <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest text-center">
            Limit: Photos under 800KB // Videos under 10s and 2MB
          </p>
        </div>

        <button 
          disabled={isSyncing}
          className="w-full bg-white text-black py-8 rounded-full font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.05)] disabled:opacity-50"
        >
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
      <input 
        required
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-white text-sm outline-none focus:border-white/20 transition-all font-black tracking-widest"
      />
    </div>
  );
}

function MediaInput({ label, icon, onSelect, accept }: any) {
  return (
    <label className="relative group flex flex-col items-center justify-center p-8 bg-white/[0.03] border border-white/5 border-dashed rounded-3xl cursor-pointer hover:bg-white/[0.05] transition-all hover:border-white/20">
      <input type="file" className="hidden" onChange={onSelect} accept={accept} />
      <div className="mb-4 text-white/40 group-hover:text-white transition-colors">{icon}</div>
      <span className="text-[9px] font-lexend font-black uppercase tracking-widest text-white/40 group-hover:text-white">{label}</span>
    </label>
  );
}
