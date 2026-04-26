"use client";

import { useState, useEffect } from "react";
import { Ticket, Bookmark, History, ExternalLink, QrCode, Loader2 } from "lucide-react";
import clsx from "clsx";
import { EVENTS } from "@/constants/events";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/components/AuthContext";

type Tab = "passes" | "saved" | "history";

export default function MyRadar() {
  const [activeTab, setActiveTab] = useState<Tab>("passes");
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
          onClick={() => setActiveTab("passes")}
          className={clsx(
            "flex items-center gap-2 pb-4 text-xs font-mono uppercase tracking-widest transition-colors relative whitespace-nowrap",
            activeTab === "passes" ? "text-white" : "text-white/40 hover:text-white/70"
          )}
        >
          <Ticket size={16} /> Digital Wallet
          {activeTab === "passes" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
        </button>
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
        {activeTab === "passes" && (
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 size={32} className="text-purple-500 animate-spin" /></div>
            ) : passes.length === 0 ? (
              <div className="text-center py-12 text-white/40 font-mono text-sm uppercase tracking-widest">No upcoming passes found.</div>
            ) : (
              passes.map(event => (
                <div key={event.id} className="w-full md:w-[400px] flex rounded-2xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer hover:border-purple-500/50 transition-colors relative">
                  {/* Event Image */}
                  <div className="w-1/3 relative">
                    <img src={event.image || "https://images.unsplash.com/photo-1540039155732-684735035727?w=800"} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                  </div>
                  {/* Pass Details */}
                  <div className="w-2/3 p-4 flex flex-col justify-between relative">
                    <div className="absolute top-0 right-4 w-1 h-full flex flex-col justify-between py-2">
                      {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-black/50" />)}
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-purple-400 uppercase tracking-[0.2em]">{event.date}</span>
                      <h3 className="font-black text-white uppercase tracking-tight leading-none mt-1 mb-2 truncate">{event.title}</h3>
                      <p className="text-[9px] font-mono text-white/50 truncate uppercase tracking-wider">{event.venue_address || "Secret Location"}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.price || "Free"}</span>
                       <button className="flex items-center gap-1 text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 transition-colors">
                         Show QR <QrCode size={12} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map(event => (
              <div key={event.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-white/5">
                 <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
