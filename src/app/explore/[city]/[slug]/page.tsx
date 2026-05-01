"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MapPin, Tag, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import Header from "@/components/Header";

// Mock Data
const EVENT = {
  id: "featured-1",
  title: "THE NEON WAREHOUSE WAVES",
  host: "MILO ORIGINALS x THE UNDERGROUND",
  about: "An exclusive underground rave featuring top international DJs. Secret location revealed to ticket holders 2 hours before the event. Expect heavy techno, immersive visuals, and a strictly no-camera policy. Arrive early to guarantee entry.",
  date: "OCT 24, 2026",
  time: "22:00 - 05:00",
  location: "Secret Warehouse",
  type: "Techno / Underground",
  ageLimit: "21+",
  language: "English / Hindi",
  image: "https://picsum.photos/seed/detail/1600/900",
  ticketUrl: "https://example.com/tickets",
  isAvailable: true,
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cityUrl = params?.city as string;
  const { isAuthenticated } = useAuth();
  const { cityThemeColor } = useLocation();

  const handleJoinPlan = () => {
    if (!isAuthenticated) {
      // Need auth -> Redirect to login
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
    } else {
      // Go to ticket URL
      window.open(EVENT.ticketUrl, "_blank");
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#000000] pb-20 overflow-x-hidden pt-[100px]">
      <Header 
        onProfileClick={() => isAuthenticated ? router.push("/profile") : router.push("/login")}
        onEventClick={() => {}} // Could be disabled or open modal
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
            <Image
              src={EVENT.image}
              alt={EVENT.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                Main Highlight
              </span>
            </div>
          </div>

          {/* About Block (Top-Right) */}
          <div className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="font-black text-white/40 uppercase tracking-widest text-xs mb-4">About</h3>
            <p className="text-white/80 text-sm leading-relaxed overflow-hidden">
              {EVENT.about}
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
                <p className="text-white font-bold text-sm">{EVENT.host}</p>
                <p className="text-white/40 text-xs mt-1">Verified Organizer</p>
              </div>
            </div>
          </div>

          {/* Details Block (Mid-Left) */}
          <div className="md:col-span-8 md:row-span-1 bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-wrap gap-x-8 gap-y-6">
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: cityThemeColor }}><Calendar size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Date</p>
                <p className="text-sm font-bold text-white">{EVENT.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: cityThemeColor }}><Clock size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Time</p>
                <p className="text-sm font-bold text-white">{EVENT.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: cityThemeColor }}><Tag size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Type</p>
                <p className="text-sm font-bold text-white">{EVENT.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: cityThemeColor }}><AlertCircle size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Age Limit</p>
                <p className="text-sm font-bold text-white">{EVENT.ageLimit}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 min-w-[160px] md:col-span-2">
              <div className="p-2.5 rounded-xl bg-white/10" style={{ color: cityThemeColor }}><MapPin size={18} /></div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-white">{EVENT.location}</p>
              </div>
            </div>
          </div>

          {/* Event Name Block (Bottom-Left) */}
          <div className="md:col-span-8 md:row-span-1 bg-white border border-white/10 rounded-[2rem] p-6 md:p-10 flex flex-col justify-center transform transition-transform hover:scale-[1.01]">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-tighter leading-none">
              {EVENT.title}
            </h1>
          </div>

          {/* Join Plan Button Block (Bottom-Right) */}
          <div className="md:col-span-4 md:row-span-1 bg-zinc-900 border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {EVENT.isAvailable ? (
              <button
                onClick={handleJoinPlan}
                className="w-full py-6 rounded-xl font-black uppercase tracking-widest text-sm transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: cityThemeColor, color: "white" }}
              >
                Join Plan
              </button>
            ) : (
              <button
                disabled
                className="w-full py-6 rounded-xl font-black uppercase tracking-widest text-sm bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
              >
                Unable to Join Plan
              </button>
            )}

            {!isAuthenticated && EVENT.isAvailable && (
              <p className="text-xs text-white/40 mt-4 font-mono text-center">
                To join this event, please log in.
              </p>
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
