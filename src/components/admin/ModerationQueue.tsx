"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  X, 
  MapPin, 
  Clock, 
  User, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useNotifications } from "@/components/NotificationContext";
import clsx from "clsx";

export default function ModerationQueue() {
  const { addNotification } = useNotifications();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    
    if (error) {
      addNotification("system", "Failed to load moderation radar.");
    } else {
      setQueue(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerify = async (id: string, title: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from("events")
      .update({ is_verified: true })
      .eq("id", id);

    if (error) {
      addNotification("system", `Verification failed for ${title}`);
    } else {
      addNotification("radar", `Event verified: ${title}`);
      setQueue(prev => prev.filter(e => e.id !== id));
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to reject and purge "${title}" from the radar?`)) return;
    
    setProcessingId(id);
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      addNotification("system", `Rejection failed for ${title}`);
    } else {
      addNotification("radar", `Event purged: ${title}`);
      setQueue(prev => prev.filter(e => e.id !== id));
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-white/10" size={32} />
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.4em]">Scanning Radar...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
      <div className="max-w-2xl mx-auto px-6 py-20 pb-40 space-y-16">
        {/* HEADER */}
        <div className="space-y-4 text-center">
          <h2 className="font-lexend text-3xl font-black text-white uppercase tracking-tight">Pending Radar Detections</h2>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">Process accurately. Cinematic quality only.</p>
        </div>

        {/* THE FEED */}
        <div className="space-y-24">
          <AnimatePresence mode="popLayout">
            {queue.map((event) => (
              <motion.article
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.03] transition-all duration-500 hover:border-white/10 shadow-2xl"
              >
                {/* MEDIA HEADER: UNCROPPED PREVIEW */}
                <div className="relative w-full aspect-video bg-black/40 overflow-hidden">
                   {event.video_url ? (
                     <video 
                       src={event.video_url} 
                       className="w-full h-full object-contain" 
                       autoPlay 
                       muted 
                       loop 
                       playsInline
                     />
                   ) : (
                     <img 
                       src={event.image || "/placeholder-event.jpg"} 
                       alt={event.title} 
                       className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
                     />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* METADATA */}
                <div className="p-10 space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-lexend text-2xl font-black text-white tracking-tight leading-none uppercase">{event.title}</h3>
                    
                    <div className="flex flex-wrap gap-6 items-center">
                      <div className="flex items-center gap-2 text-white/30">
                        <MapPin size={14} className="text-white/20" />
                        <span className="font-mono text-[10px] uppercase tracking-widest">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/30">
                        <Clock size={14} className="text-white/20" />
                        <span className="font-mono text-[10px] uppercase tracking-widest">{event.date || "TBA"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                     <div className="space-y-2">
                        <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black font-mono">Mission Narrative</p>
                        <p className="text-white/60 font-lexend text-sm leading-relaxed tracking-wide">
                           {event.description || "No description provided."}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black font-mono">Venue Specifics</p>
                           <p className="text-white/80 font-mono text-[10px] tracking-wider uppercase leading-relaxed">
                              {event.venue_address || "TBA"}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black font-mono">Identity Pulse (Aadhaar)</p>
                           <p className="text-emerald-400/60 font-mono text-xs tracking-[0.2em] font-black uppercase">
                              {event.aadhaar_id || "MISSING"}
                           </p>
                        </div>
                     </div>

                     {event.ticket_links && event.ticket_links.length > 0 && (
                        <div className="space-y-2">
                           <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black font-mono">Authorized Channels</p>
                           <div className="flex flex-wrap gap-2">
                              {event.ticket_links.map((link: any, i: number) => (
                                <div key={i} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-2">
                                   <span className="text-white/40 font-mono text-[8px] uppercase tracking-widest">{link.name || "Link"}</span>
                                   <span className="text-purple-400 font-mono text-[7px] truncate max-w-[100px]">{link.url}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     )}

                     <div className="flex items-center gap-3 py-2 px-4 bg-white/[0.02] border border-white/5 rounded-full w-fit">
                        <User size={12} className="text-white/20" />
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                           Detected by <span className="text-white/60 font-black">@{event.username || "Anonymous"}</span>
                        </span>
                     </div>
                  </div>

                  {/* MASSIVE ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={() => handleReject(event.id, event.title)}
                      disabled={!!processingId}
                      className="group/btn flex items-center justify-center gap-3 bg-white/[0.05] text-red-500/60 border border-white/5 py-6 rounded-3xl font-lexend font-black uppercase tracking-widest text-[11px] transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 disabled:opacity-50"
                    >
                      <X size={18} className="group-hover/btn:scale-125 transition-transform" />
                      Reject Event
                    </button>
                    <button
                      onClick={() => handleVerify(event.id, event.title)}
                      disabled={!!processingId}
                      className="group/btn flex items-center justify-center gap-3 bg-white text-black py-6 rounded-3xl font-lexend font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] shadow-2xl shadow-white/5 disabled:opacity-50"
                    >
                      <CheckCircle size={18} className="group-hover/btn:scale-125 transition-transform" />
                      {processingId === event.id ? "Syncing..." : "Verify Pulse"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {queue.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-40 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center opacity-20">
                 <CheckCircle size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="font-lexend text-2xl font-black text-white/20 tracking-widest uppercase">The radar is clear</h3>
                <p className="font-mono text-[10px] text-white/10 uppercase tracking-[0.4em]">No pending events detected.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
