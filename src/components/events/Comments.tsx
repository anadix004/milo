"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Send, User } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
}

const MOCK_COMMENTS: Comment[] = [
  { id: "c1", user: "Aravind_Z", text: "Is the venue accessible for the 3D rigs?", time: "2m ago" },
  { id: "c2", user: "Milo_Dev", text: "Login verified. See you there.", time: "5m ago" },
  { id: "c3", user: "Sarah_Nexus", text: "Best tech mixer in Mumbai yet.", time: "12m ago" },
];

interface CommentsProps {
  isJoined: boolean;
}

export default function Comments({ isJoined }: CommentsProps) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="relative w-full h-[400px] flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-3xl mt-8">
      {/* Locked Overlay */}
      <AnimatePresence>
        {!isJoined && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
               <Lock className="text-white/40" size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="font-lexend text-white text-sm font-black uppercase tracking-widest">Login Required</h4>
              <p className="font-mono text-white/40 text-[10px] uppercase tracking-[0.2em] max-w-[200px]">Join this event to read and post comments</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h4 className="font-lexend text-[10px] text-white/60 font-black uppercase tracking-widest">Event Chat</h4>
        <div className="flex items-center gap-2">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Live Chat</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {MOCK_COMMENTS.map((c) => (
          <div key={c.id} className="space-y-1.5 group">
            <div className="flex items-center justify-between">
               <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{c.user}</span>
               <span className="font-mono text-[8px] text-white/10">{c.time}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
               <p className="font-mono text-xs text-white/80 leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder={isJoined ? "Type a message..." : "Login to type..."}
            disabled={!isJoined}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder:text-white/10 outline-none focus:border-white/20 transition-all font-mono tracking-wide disabled:cursor-not-allowed"
          />
          <button 
             disabled={!isJoined || !commentText.trim()}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
          >
             <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
