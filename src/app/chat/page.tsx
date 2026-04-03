"use client";

import { motion } from "framer-motion";
import { Bird, Send, ShieldCheck, MapPin, Search, Users, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProfileSidebar from "@/components/ProfileSidebar";
import EventSubmission from "@/components/EventSubmission";
import Link from "next/link";
import clsx from "clsx";

const CITY_CHANNELS = [
  { id: "del", name: "Delhi NCR Hub", active: 124, color: "text-purple-500" },
  { id: "mum", name: "Mumbai Tech Coast", active: 89, color: "text-cyan-500" },
  { id: "blr", name: "Bangalore Network", active: 203, color: "text-green-500" }
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState("del");
  const [messages, setMessages] = useState([
    { id: 1, text: "Wait, is the Rooftop party in Delhi NCR still on?", user: "CyberNomad", time: "2m ago" },
    { id: 2, text: "Yes! 🌌 Syncing nebula frames now. See you there.", user: "Milo_Admin", isSystem: true },
    { id: 3, text: "Has anyone seen the Mumbai Tech Coast lineup?", user: "DataVoyager", time: "Just now" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputValue, user: "You", time: "Just now" }]);
    setInputValue("");
  };

  return (
    <main className="min-h-screen bg-black text-white font-[family-name:var(--font-lexend)] overflow-hidden flex flex-col pt-24 pb-8 px-6 md:px-12">
      {/* Cinematic Background Fix */}
      <div className="fixed inset-0 bg-[#0a0a0a] -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)] -z-10" />

      <Header 
        onProfileClick={() => setIsSidebarOpen(true)}
        onChatClick={() => {}}
        onEventClick={() => setIsEventOpen(true)}
        isSidebarOpen={isSidebarOpen} 
      />

      <ProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <EventSubmission 
        isOpen={isEventOpen} 
        onClose={() => setIsEventOpen(false)}
        onAuthRedirect={() => setIsSidebarOpen(true)}
      />

      <div className="flex-1 max-w-7xl mx-auto w-full flex gap-8 overflow-hidden">
        {/* Left Sidebar: City Channels */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col w-80 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black px-2">City Jurisdictions</h2>
            <div className="space-y-2">
              {CITY_CHANNELS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChannel(c.id)}
                  className={clsx(
                    "w-full p-4 rounded-2xl flex items-center justify-between border transition-all duration-500 group",
                    activeChannel === c.id 
                      ? "bg-white/10 border-white/20" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className={clsx(activeChannel === c.id ? c.color : "text-white/20")} />
                    <span className={clsx("text-sm font-bold tracking-wide", activeChannel === c.id ? "text-white" : "text-white/50")}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/20 font-mono group-hover:text-white/40 transition-colors uppercase">
                    {c.active} Pigeons
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex-1 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-cyan-500">Global Scan</h3>
              <p className="text-xs text-white/40 leading-relaxed">Identity verification active. All pigeons dispatches are ephemeral and encrypted.</p>
              <div className="flex -space-x-2 pt-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center">
                    <Users size={12} className="text-white/30" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white/5 flex items-center justify-center text-[10px] text-white/40">+12</div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent group-hover:h-full transition-all duration-1000" />
          </div>
        </motion.div>

        {/* Main Feed: The Pigeon Hub */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Dashboard Header */}
          <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <Link href="/" className="lg:hidden p-2 text-white/30 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </Link>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 group relative">
                <Bird size={24} />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-white text-xl font-black uppercase tracking-widest leading-tight">
                  {CITY_CHANNELS.find(c => c.id === activeChannel)?.name}
                </h1>
                <p className="text-[10px] text-cyan-500 uppercase tracking-[0.4em] mt-1 flex items-center gap-1 font-bold">
                  <ShieldCheck size={10} /> Sync active // Local Time {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/30 hover:text-white transition-colors cursor-pointer ring-purple-500/20 hover:ring-4">
              <Search size={14} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Search Hub</span>
            </div>
          </div>

          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 no-scrollbar">
            {messages.map((m) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id} 
                className={clsx(
                  "flex flex-col max-w-[80%]",
                  m.user === "You" ? "ml-auto items-end text-right" : "items-start text-left"
                )}
              >
                <div className="flex items-center gap-3 mb-2 px-2">
                  <span className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    m.isSystem ? "text-cyan-500" : "text-white/40"
                  )}>
                    {m.user}
                  </span>
                  {m.time && <span className="text-[9px] text-white/20 font-mono tracking-widest">{m.time}</span>}
                </div>
                <div className={clsx(
                  "p-6 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-lg",
                  m.user === "You" 
                    ? "bg-white text-black font-medium rounded-tr-none" 
                    : m.isSystem 
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tl-none" 
                      : "bg-white/5 border border-white/10 text-white rounded-tl-none font-light"
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Dispatcher (Input) */}
          <div className="p-8 bg-white/[0.02] border-t border-white/10">
            <div className="relative group max-w-4xl mx-auto">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Synchronize pigeon dispatch..." 
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-8 pr-20 text-sm md:text-base text-white placeholder:text-white/10 outline-none focus:border-cyan-500/50 transition-all duration-1000 shadow-inner"
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all transform active:scale-90 shadow-xl"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center mt-4 text-[9px] text-white/10 uppercase tracking-[0.5em] font-black">Secure neural channel active. All data is ephemeral.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
