"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bird, ShieldCheck } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface ChatHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHub({ isOpen, onClose }: ChatHubProps) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Wait, is the Rooftop party in Delhi NCR still on?", user: "CyberNomad", time: "2m ago" },
    { id: 2, text: "Yes! 🌌 Syncing nebula frames now. See you there.", user: "Milo_Admin", isSystem: true },
    { id: 3, text: "Has anyone seen the Mumbai Tech Coast lineup?", user: "DataVoyager", time: "Just now" }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputValue, user: "You", time: "Just now" }]);
    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-black/60 backdrop-blur-3xl border-l border-white/10 z-[120] flex flex-col font-[family-name:var(--font-lexend)] shadow-[-20px_0_40px_rgba(0,0,0,0.4)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
                  <Bird size={20} />
                </div>
                <div>
                  <h2 className="text-white text-sm font-black uppercase tracking-widest">Pigeon Hub</h2>
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={10} /> Ephemeral Channel Active
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={clsx(
                    "flex flex-col max-w-[85%]",
                    m.user === "You" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-widest",
                      m.isSystem ? "text-cyan-500" : "text-white/40"
                    )}>
                      {m.user}
                    </span>
                    {m.time && <span className="text-[9px] text-white/20">{m.time}</span>}
                  </div>
                  <div className={clsx(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    m.user === "You" 
                      ? "bg-white text-black font-medium" 
                      : m.isSystem 
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-200" 
                        : "bg-white/5 border border-white/10 text-white"
                  )}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Hub */}
            <div className="p-6 border-t border-white/10 bg-black/40">
              <div className="relative group">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Dispatch Pigeon..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/50 transition-all duration-500"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
