"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Tag, Users, AlertCircle, ArrowLeft, Loader2, Music, Check, Share2, Heart, Ticket } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import { useNotifications } from "@/components/NotificationContext";
import Header from "@/components/Header";
import { getCategoryColour, getCategoryButtonGlow, getCategoryCardAura } from "@/lib/aura";
import { createClient } from "@/utils/supabase/client";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cityUrl = params?.city as string;
  const slug = params?.slug as string;
  const { isAuthenticated, user } = useAuth();
  const { selectedCity } = useLocation();
  const { addNotification } = useNotifications();
  const supabase = createClient();

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  
  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true);
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', slug)
        .single();
        
      if (!error && data) {
        setEvent(data);
      } else {
        console.error("Event fetch error:", error);
      }
      setIsLoading(false);
    }
    fetchEventData();
  }, [slug, supabase]);

  useEffect(() => {
    async function checkJoined() {
      if (!isAuthenticated || !user || !event) return;
      const { data } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', event.id)
        .eq('profile_id', user.id)
        .eq('type', 'join')
        .single();
      if (data) setIsJoined(true);
    }
    checkJoined();
  }, [isAuthenticated, user, event, supabase]);

  const handleJoinPlan = async () => {
    if (!isAuthenticated || !user) {
      router.push("/auth?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (event?.ticket_links && event.ticket_links.length > 0) {
      window.open(event.ticket_links[0].url, "_blank");
    }

    try {
      if (!isJoined) {
        const { error } = await supabase
          .from('rsvps')
          .insert({
            event_id: event.id,
            profile_id: user.id,
            type: 'join'
          });
        if (!error || error.code === '23505') {
           setIsJoined(true);
           addNotification("radar", `Plan joined: ${event.title} added to your list.`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <main className="w-full min-h-screen bg-[#000000] flex items-center justify-center">
         <Loader2 className="animate-spin text-white/40" size={48} />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="w-full min-h-screen bg-[#000000] flex flex-col items-center justify-center pb-20 pt-[100px]">
        <Header 
          onProfileClick={() => isAuthenticated ? router.push("/profile") : router.push("/auth")}
          onEventClick={() => {}}
          onNotificationsClick={() => {}}
          isSidebarOpen={false} 
        />
        <h2 className="text-3xl font-black text-white/50 uppercase">Event Not Found</h2>
        <button 
          onClick={() => router.push(`/explore/${cityUrl}`)}
          className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
        >
          Back to Explore
        </button>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#000000] pb-20 overflow-x-hidden pt-[100px]">
      <Header 
        onProfileClick={() => isAuthenticated ? router.push("/profile") : router.push("/auth")}
        onEventClick={() => {}}
        onNotificationsClick={() => {}}
        isSidebarOpen={false} 
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push(`/explore/${cityUrl}`)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group"
        >
          <div className="p-2 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest">Back to explore</span>
        </button>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(150px,auto)]">
          
          {/* Main Image Block (Large, Top-Left) */}
          <div className="md:col-span-8 md:row-span-2 relative rounded-[2rem] overflow-hidden border border-white/10 group h-[400px] md:h-full">
            {event.video_url ? (
               <video src={event.video_url} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <Image
                src={event.image || "https://picsum.photos/seed/detail/1600/900"}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                {event.category || "Highlight"}
              </span>
            </div>
          </div>

          {/* About Block (Top-Right) */}
          <div className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="font-black text-white/40 uppercase tracking-widest text-xs mb-4">About</h3>
            <p className="text-white/80 text-sm leading-relaxed overflow-y-auto no-scrollbar max-h-48">
              {event.description || "No description available for this event."}
            </p>
          </div>

          {/* Host Spotlight Block (Mid-Right) */}
          <div className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="font-black text-white/40 uppercase tracking-widest text-xs mb-4">Host Spotlight</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Users size={20} className="text-white/60" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Verified Organizer</p>
                <p className="text-white/40 text-xs mt-1">Platform Partner</p>
              </div>
            </div>
          </div>

          {/* Details Block (Mid-Left) */}
          <div className="md:col-span-8 md:row-span-1 bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-wrap gap-x-8 gap-y-6">
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><Calendar size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Date</p>
                <p className="text-sm font-bold text-white">{event.date || "TBD"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><Clock size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Time</p>
                <p className="text-sm font-bold text-white">{event.time || "TBD"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><Tag size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Category</p>
                <p className="text-sm font-bold text-white">{event.category || "General"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><MapPin size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-white">{event.location || event.cityId || "TBD"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 min-w-[160px] md:col-span-2">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><Ticket size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Price</p>
                <p className="text-sm font-bold text-white">{event.price || "Free"}</p>
              </div>
            </div>
            
            {event.venue_address && (
               <div className="flex items-center gap-3 w-full mt-2">
                 <div className="p-2.5 rounded-xl bg-white/10" style={{ color: getCategoryColour(event.category) }}><MapPin size={18} /></div>
                 <div>
                   <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Venue Address</p>
                   <p className="text-sm font-bold text-white max-w-lg">{event.venue_address}</p>
                 </div>
               </div>
            )}
          </div>

          {/* Event Name Block (Bottom-Left) */}
          <div className="md:col-span-8 md:row-span-1 bg-white border border-white/10 rounded-[2rem] p-6 md:p-10 flex flex-col justify-center transform transition-transform hover:scale-[1.01]">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-tighter leading-none">
              {event.title}
            </h1>
          </div>

          {/* Join Plan Button Block (Bottom-Right) */}
          <div className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div style={{ position: 'relative', width: '100%' }}>
              <div style={{
                position: 'absolute',
                inset: -16,
                background: getCategoryCardAura(event.category || "General"),
                filter: 'blur(20px)',
                pointerEvents: 'none',
                zIndex: 0,
              }} />
              <button
                onClick={handleJoinPlan}
                disabled={isJoined && (!event.ticket_links || event.ticket_links.length === 0)}
                className="w-full py-6 rounded-xl font-black uppercase tracking-widest text-sm transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  background: isJoined ? '#10b981' : 'rgba(255,255,255,0.97)',
                  color: isJoined ? '#fff' : '#000',
                  boxShadow: getCategoryButtonGlow(event.category || "General"),
                  border: 'none',
                }}
              >
                {isJoined ? (event.ticket_links && event.ticket_links.length > 0 ? "Book Tickets" : <><Check size={18} /> Joined</>) : "Join Plan"}
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-xs text-white/40 mt-4 font-mono text-center">
                To join this event, please log in.
              </p>
            )}
            
            {event.ticket_links && event.ticket_links.length > 0 && (
               <div className="flex gap-2 flex-wrap justify-center mt-4 z-10">
                 {event.ticket_links.map((link: any, i: number) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/60 hover:text-white border border-white/20 px-3 py-1 rounded-full uppercase">
                       {link.name || "Book Link"}
                    </a>
                 ))}
               </div>
            )}
          </div>

        </div>

        {/* Back to top */}
        <div className="flex justify-center mt-20">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 flex items-center justify-center transition-all"
          >
            <ArrowLeft size={16} className="rotate-90" />
          </button>
        </div>
      </div>
    </main>
  );
}
