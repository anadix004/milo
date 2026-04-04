"use client";

import { motion } from "framer-motion";
import { Send, Users, Search } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import EventSubmission from "@/components/EventSubmission";
import AuthModal from "@/components/AuthModal";
import PigeonLogo from "@/components/PigeonLogo";
import clsx from "clsx";
import { useAuth } from "@/components/AuthContext";

const MOCK_FRIENDS = [
  { id: 1, name: "Neon_Ghost", status: "online", bio: "Active in Delhi NCR", type: "friend" },
  { id: 2, name: "Cyber_Dove", status: "away", bio: "Mumbai Tech Coast", type: "friend" },
  { id: 3, name: "Pigeon_Zero", status: "online", bio: "Bangalore Network", type: "friend" },
  { id: 4, name: "Alpha_Group", status: "online", bio: "8 members active", type: "group" }
];

const MOCK_EVENTS = [
  { id: "e1", name: "Rooftop Party", active: 45, icon: "🏙️" },
  { id: "e2", name: "Tech Summit Alpha", active: 128, icon: "🛸" },
  { id: "e3", name: "Art District Meetup", active: 22, icon: "🎨" }
];

export default function ChatPage() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: "Wait, is the Rooftop party in Delhi NCR still on?", user: "CyberNomad", time: "2m ago" },
    { id: 2, text: "Yes! 🏙️ Getting everything ready now. See you there.", user: "Milo_Admin", isSystem: true },
    { id: 3, text: "The Tech Summit Alpha starts in 10 minutes.", user: "DataVoyager", time: "Just now" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | null>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputValue, user: "You", time: "Just now" }]);
    setInputValue("");
  };

  const closeModals = () => setActiveModal(null);

  const handleAuthGate = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setActiveModal("auth");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-[family-name:var(--font-lexend)] overflow-hidden flex flex-col pt-24 pb-8">
      <div className="fixed inset-0 bg-[#050505] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_50%)] -z-10" />

      <Header 
        onProfileClick={() => setActiveModal("profile")}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
        isSidebarOpen={activeModal === "profile"} 
      />

      <ProfileSidebar 
        isOpen={activeModal === "profile"} 
        onClose={closeModals} 
        onAuthClick={() => setActiveModal("auth")}
      />

      <EventSubmission 
        isOpen={activeModal === "event"} 
        onClose={closeModals}
        onAuthRedirect={() => setActiveModal("auth")}
      />

      <AuthModal 
        isOpen={activeModal === "auth"}
        onClose={closeModals}
      />

      <div className="flex-1 w-full max-w-[1800px] mx-auto flex gap-6 px-6 h-[calc(100vh-160px)] overflow-hidden">
        {/* LEFT COLUMN: FRIENDS SECTION */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden xl:flex flex-col w-72 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black drop-shadow-md">Friends and Groups</h2>
            <Users size={14} className="text-white/20" />
          </div>
          <div className="space-y-4 overflow-y-auto no-scrollbar">
            {MOCK_FRIENDS.map(item => (
              <div key={item.id} className="group relative flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10">
                <div className={clsx(
                  "relative w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5",
                  item.type === "group" ? "rounded-xl" : "rounded-full"
                )}>
                  <span className="text-xs text-white/40 group-hover:text-white transition-colors">
                    {item.type === "group" ? <Users size={16} /> : item.name[0]}
                  </span>
                  <div className={clsx(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black",
                    item.status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-orange-500 text-transparent"
                  )} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/80 group-hover:text-white drop-shadow-sm">{item.name}</p>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest">{item.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CENTER COLUMN: MAIN HUB */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        >
          <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="relative p-2">
                <PigeonLogo size={42} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse -z-10" />
              </div>
              <div className="drop-shadow-lg">
                <h1 className="text-white text-lg md:text-xl font-black uppercase tracking-widest leading-tight">Milo Hub</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.4em] font-black">Connected // Secure Link</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-white/30 hover:text-white transition-all cursor-pointer">
                <Search size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Search Hub</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar scroll-smooth">
            {messages.map((m) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id} 
                className={clsx(
                  "flex flex-col max-w-[85%] md:max-w-[70%]",
                  m.user === "You" ? "ml-auto items-end text-right" : "items-start text-left"
                )}
              >
                <div className="flex items-center gap-3 mb-2 px-2">
                  <span className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md",
                    m.isSystem ? "text-cyan-500" : "text-white/40"
                  )}>
                    {m.user}
                  </span>
                  {m.time && <span className="text-[9px] text-white/20 font-mono tracking-widest">{m.time}</span>}
                </div>
                <div className={clsx(
                  "p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-sm md:text-base leading-relaxed shadow-2xl backdrop-blur-md",
                  m.user === "You" 
                    ? "bg-white text-black font-semibold rounded-tr-none shadow-white/5" 
                    : m.isSystem 
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tl-none" 
                      : "bg-white/[0.05] border border-white/10 text-white rounded-tl-none font-light"
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 md:p-8 bg-white/[0.01] border-t border-white/5">
            <div className="relative group max-w-4xl mx-auto">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Send a message..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-8 pr-20 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all duration-700 shadow-inner"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95 shadow-xl"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center mt-4 text-[9px] text-white/10 uppercase tracking-[0.5em] font-black drop-shadow-sm">Secure channel active // No pigeon was harmed</p>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: EVENT CHATS */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex flex-col w-72 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black drop-shadow-md">Events</h2>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          </div>
          <div className="space-y-4 overflow-y-auto no-scrollbar">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="group p-4 rounded-2xl border border-white/5 bg-white/0 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white/60 group-hover:text-white transition-colors leading-tight drop-shadow-sm">{event.name}</span>
                    <span className="text-[14px]">{event.icon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                    <span className="text-[9px] text-white/30 uppercase tracking-widest">{event.active} active</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 mt-auto">
            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-2 drop-shadow-md">Global Scan status</p>
            <p className="text-[10px] text-white/20 leading-relaxed font-medium">Click any active event stream to join the community identification cycle.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
