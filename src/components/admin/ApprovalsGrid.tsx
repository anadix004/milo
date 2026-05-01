"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Check, X, Search, Filter, Eye, Video } from "lucide-react";
import clsx from "clsx";
import { METRO_CITIES } from "@/constants/cities";

export default function ApprovalsGrid() {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"pending" | "live">("pending");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, [viewMode, selectedCity]);

  const fetchEvents = async () => {
    setIsLoading(true);
    let query = supabase
      .from("events")
      .select("*")
      .eq("is_verified", viewMode === "live")
      .order("created_at", { ascending: false });
      
    if (selectedCity !== "all") {
      query = query.eq("cityId", selectedCity);
    }

    const { data } = await query;
    
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
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-6 py-3 bg-white/[0.05] border border-white/10 rounded-full text-[10px] text-white outline-none focus:border-white/30 font-black tracking-widest uppercase appearance-none"
          >
            <option value="all" className="bg-black text-white">All Cities</option>
            {METRO_CITIES.map(c => (
              <option key={c.id} value={c.id} className="bg-black text-white">{c.label}</option>
            ))}
          </select>
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
                    {event.video_url ? (
                      <div className="w-8 h-8 bg-white/10 rounded overflow-hidden relative group/video">
                        <video src={event.video_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                           <Video size={12} className="text-white" />
                        </div>
                      </div>
                    ) : event.image ? (
                      <div className="w-8 h-8 bg-white/10 rounded overflow-hidden"><img src={event.image} className="w-full h-full object-cover" /></div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="p-2 bg-white/5 text-white/60 rounded-full hover:bg-white/20 hover:text-white transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
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

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-950 border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Event Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              {selectedEvent.video_url ? (
                <video src={selectedEvent.video_url} autoPlay loop muted playsInline className="w-full h-48 object-cover rounded-2xl border border-white/10" />
              ) : (
                <img src={selectedEvent.image} className="w-full h-48 object-cover rounded-2xl border border-white/10" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Title</p>
                  <p className="text-white text-sm font-bold uppercase tracking-wide">{selectedEvent.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Category</p>
                  <p className="text-white text-sm font-bold uppercase tracking-wide">{selectedEvent.category || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Date</p>
                  <p className="text-white text-sm font-bold uppercase tracking-wide">{selectedEvent.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Price</p>
                  <p className="text-white text-sm font-bold uppercase tracking-wide">{selectedEvent.price}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Location</p>
                <p className="text-white text-sm font-bold tracking-wide">{selectedEvent.location}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Description</p>
                <p className="text-white/80 text-sm font-mono tracking-wide">{selectedEvent.description}</p>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                 {viewMode === "pending" && (
                    <button 
                      onClick={() => { handleAction(selectedEvent.id, "approve"); setSelectedEvent(null); }}
                      className="px-6 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-full"
                    >
                      Approve
                    </button>
                 )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
