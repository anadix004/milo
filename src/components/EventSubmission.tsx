"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PlusCircle, Globe, ShieldCheck, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import clsx from "clsx";

interface EventSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRedirect: () => void;
}

export default function EventSubmission({ isOpen, onClose, onAuthRedirect }: EventSubmissionProps) {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ title: "", city: "Delhi NCR", date: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      alert("Event Dispatched to the Radar! 🛰️");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-black border border-white/10 rounded-3xl overflow-hidden font-[family-name:var(--font-lexend)] shadow-[0_0_100px_rgba(168,85,247,0.1)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h2 className="text-white text-xl font-black uppercase tracking-widest leading-tight">Radar Submission</h2>
                  <p className="text-[10px] text-purple-500 uppercase tracking-[0.4em] mt-1 flex items-center gap-1 font-bold">
                    <ShieldCheck size={10} /> Verified Host Hub
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="p-8 md:p-12">
              {!isAuthenticated ? (
                /* Locked State */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-6 border border-white/10">
                    <Lock size={40} />
                  </div>
                  <h3 className="text-white text-lg font-black uppercase tracking-widest mb-4">Authentication Required</h3>
                  <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-8 font-medium">
                    To maintain the cinematic integrity of the radar, only verified Milo identities can submit new city happenings.
                  </p>
                  <button 
                    onClick={() => { onClose(); onAuthRedirect(); }}
                    className="bg-white text-black px-12 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                  >
                    Authenticate Identity
                  </button>
                </div>
              ) : (
                /* Submission Form */
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2">Happenings Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Nebula Tech Sync" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 outline-none focus:border-purple-500/50 transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2">City Jurisdiction</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      >
                        <option value="Delhi NCR">Delhi NCR Hub</option>
                        <option value="Mumbai">Mumbai Coast</option>
                        <option value="Bangalore">Bangalore Network</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] ml-2">Temporal Window (Date)</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={isSubmitting}
                      type="submit" 
                      className={clsx(
                        "w-full py-5 rounded-2xl font-black text-sm tracking-[0.4em] uppercase transition-all duration-700 relative overflow-hidden group",
                        isSubmitting ? "bg-purple-500 text-white" : "bg-white text-black hover:bg-purple-500 hover:text-white"
                      )}
                    >
                      <span className={clsx("relative z-10", isSubmitting && "animate-pulse")}>
                        {isSubmitting ? "Synchronizing..." : "Dispatch to Radar"}
                      </span>
                      {/* Button Pulse Glow */}
                      <div className="absolute inset-0 bg-white group-hover:bg-purple-400 opacity-0 group-active:opacity-20 transition-opacity" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
