"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Ticket, Bookmark, History, QrCode, Loader2 } from "lucide-react";
import clsx from "clsx";
import { EVENTS } from "@/constants/events";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthContext";

type Tab = "passes" | "saved" | "history";

export default function MyRadar() {
  const [activeTab, setActiveTab] = useState<Tab>("saved");
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        // Fetch RSVPs
        const { data: rsvpData, error: rsvpError } = await supabase
          .from("rsvps")
          .select(`
            id,
            event:events (*)
          `)
          .eq("profile_id", user.id);

        if (rsvpError) throw rsvpError;
        setRsvps(rsvpData || []);

        // Fetch Bookmarks
        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from("bookmarks")
          .select(`
            id,
            event:events (*)
          `)
          .eq("profile_id", user.id);

        if (bookmarkError) throw bookmarkError;
        setBookmarks(bookmarkData || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Extract events from RSVPs
  const passes = rsvps.map(r => r.event).filter(Boolean);
  const saved = bookmarks.map(b => b.event).filter(Boolean);
  const history: any[] = [];

  return (
    <div className="w-full mt-12">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab("saved")}
          className={clsx(
            "flex items-center gap-2 pb-4 text-xs font-mono uppercase tracking-widest transition-colors relative whitespace-nowrap",
            activeTab === "saved" ? "text-white" : "text-white/40 hover:text-white/70"
          )}
        >
          <Bookmark size={16} /> Saved Events
          {activeTab === "saved" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={clsx(
            "flex items-center gap-2 pb-4 text-xs font-mono uppercase tracking-widest transition-colors relative whitespace-nowrap",
            activeTab === "history" ? "text-white" : "text-white/40 hover:text-white/70"
          )}
        >
          <History size={16} /> Memories
          {activeTab === "history" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {activeTab === "saved" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map(event => (
              <div key={event.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-white/5">
                 <Image src={event.image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                 <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Bookmark size={14} className="text-cyan-400" fill="currentColor" />
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-2 block">{event.date}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">{event.title}</h3>
                    <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{event.category}</span>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-50">
            <History size={48} className="text-white/20 mb-4" />
            <h3 className="text-white font-black uppercase tracking-widest">No Past Memories</h3>
            <p className="text-white/40 font-mono text-xs mt-2 max-w-sm">Events you attend will automatically be archived here once they are over.</p>
          </div>
        )}
      </div>
    </div>
  );
}
