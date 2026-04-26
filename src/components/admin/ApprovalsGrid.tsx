"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Check, X, Search, Filter } from "lucide-react";
import clsx from "clsx";

export default function ApprovalsGrid() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"pending" | "live">("pending");

  useEffect(() => {
    fetchEvents();
  }, [viewMode]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("is_verified", viewMode === "live")
      .order("created_at", { ascending: false });
    
    if (data) setEvents(data);
    setIsLoading(false);
  };

  const handleAction = async (id: string, action: "approve" | "reject" | "delete" | "toggle-featured") => {
    if (action === "approve") {
      await supabase.from("events").update({ is_verified: true }).eq("id", id);
      setEvents(events.filter((e) => e.id !== id));
    } else if (action === "reject" || action === "delete") {
      if (confirm(`Are you sure you want to ${action} this event?`)) {
        await supabase.from("events").delete().eq("id", id);
        setEvents(events.filter((e) => e.id !== id));
      }
    } else if (action === "toggle-featured") {
      const event = events.find(e => e.id === id);
      const { error } = await supabase.from("events").update({ featured: !event.featured }).eq("id", id);
      if (!error) {
        setEvents(events.map(e => e.id === id ? { ...e, featured: !e.featured } : e));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Event Management
          </h2>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setViewMode("pending")}
              className={clsx(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === "pending" ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              Pending Submissions
            </button>
            <button 
              onClick={() => setViewMode("live")}
              className={clsx(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                viewMode === "live" ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              Live Feed
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              className="pl-10 pr-6 py-3 bg-white/[0.05] border border-white/10 rounded-full text-[10px] text-white outline-none focus:border-white/30 font-black tracking-widest uppercase placeholder:text-white/20 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-neutral-950/50 rounded-2xl border border-white/5">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-6 border-b border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
            <div>Event Name</div>
            <div>Date</div>
            <div>Location</div>
            <div>Featured</div>
            <div>Media</div>
            <div className="text-right">Actions</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-purple-500" size={32} />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center p-12 text-white/40 font-mono text-xs uppercase tracking-widest">
              No events found in {viewMode} list
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {events.map((event) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={event.id} 
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="font-black text-white text-sm uppercase tracking-tight truncate pr-4">
                    {event.title}
                  </div>
                  <div className="font-mono text-[10px] text-white/60 tracking-wider">
                    {event.date}
                  </div>
                  <div className="font-mono text-[10px] text-white/60 tracking-wider truncate">
                    {event.cityId}
                  </div>
                  <div>
                    <button 
                      onClick={() => handleAction(event.id, "toggle-featured")}
                      className={clsx(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all",
                        event.featured 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" 
                          : "bg-white/5 text-white/20 border border-white/10 hover:border-white/30"
                      )}
                    >
                      {event.featured ? "Trending" : "Standard"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {event.image && <div className="w-8 h-8 bg-white/10 rounded overflow-hidden"><img src={event.image} className="w-full h-full object-cover" /></div>}
                  </div>
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {viewMode === "pending" ? (
                      <>
                        <button 
                          onClick={() => handleAction(event.id, "approve")}
                          className="p-2 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500 hover:text-black transition-all"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(event.id, "reject")}
                          className="p-2 bg-rose-500/20 text-rose-400 rounded-full hover:bg-rose-500 hover:text-black transition-all"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleAction(event.id, "delete")}
                        className="p-2 bg-rose-500/20 text-rose-400 rounded-full hover:bg-rose-500 hover:text-black transition-all"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
