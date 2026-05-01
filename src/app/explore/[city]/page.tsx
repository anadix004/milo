"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import Header from "@/components/Header";
import BottomNav from "@/components/mobile/BottomNav";
import FiltersPanel from "@/components/FiltersPanel";
import SortByPanel from "@/components/SortByPanel";
import dynamic from "next/dynamic";
import clsx from "clsx";
import Image from "next/image";

const ProfileSidebar = dynamic(() => import("@/components/ProfileSidebar"), { ssr: false });
const EventSubmission = dynamic(() => import("@/components/EventSubmission"), { ssr: false });
const AuthModal = dynamic(() => import("@/components/AuthModal"), { ssr: false });
const NotificationSidebar = dynamic(() => import("@/components/NotificationSidebar"), { ssr: false });
const FinalCTA = dynamic(() => import("@/components/FinalCTA"), { ssr: false });

// Mock data for featured event (Spotlight)
const SPOTLIGHT_EVENT = {
  id: "featured-1",
  title: "THE NEON WAREHOUSE WAVES",
  date: "OCT 24",
  location: "Secret Warehouse",
  type: "Techno / Underground",
  description: "An exclusive underground rave featuring top international DJs. Secret location revealed to ticket holders 2 hours before the event.",
  image: "https://images.unsplash.com/photo-1574391831460-1e5122ea36f7?w=1600&h=900&fit=crop",
};

// Mock data for event grid
const EVENTS = [
  { id: 1, name: "Sunset Techno Vibes", date: "24-10-2026", price: "₹999", image: "https://images.unsplash.com/photo-1540039155732-684735035727?w=800" },
  { id: 2, name: "Underground Comedy Club", date: "25-10-2026", price: "₹499", image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800" },
  { id: 3, name: "Midnight Art Exhibit", date: "26-10-2026", price: "FREE", image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800" },
  { id: 4, name: "Rooftop Jazz & Wine", date: "27-10-2026", price: "₹1499", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800" },
  { id: 5, name: "Cyberpunk Cosplay Meet", date: "28-10-2026", price: "₹299", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800" },
  { id: 6, name: "Secret Indie Gig", date: "29-10-2026", price: "₹799", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800" },
];

export default function ExplorePage() {
  const params = useParams();
  const router = useRouter();
  const cityUrl = params?.city as string;
  
  const { isAuthenticated } = useAuth();
  const { setSelectedCity, selectedCity, cityThemeColor } = useLocation();
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | "notifications" | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sync URL city with global context
  useEffect(() => {
    if (cityUrl) {
      let cityCode = cityUrl;
      if (cityUrl === "delhi") cityCode = "del";
      if (cityUrl === "mumbai") cityCode = "mum";
      if (cityUrl === "bengaluru") cityCode = "blr";
      setSelectedCity(cityCode);
    }
  }, [cityUrl, setSelectedCity]);

  const closeModals = () => setActiveModal(null);

  const handleAuthGate = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      router.push("/login"); // New Auth flow
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#000000] pb-[80px] md:pb-0 overflow-x-hidden">
      <Header 
        onProfileClick={() => isAuthenticated ? router.push("/profile") : router.push("/login")}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
        onNotificationsClick={() => setActiveModal("notifications")}
        isSidebarOpen={activeModal === "profile"} 
      />

      {/* Popups & Modals */}
      <ProfileSidebar isOpen={activeModal === "profile"} onClose={closeModals} onAuthClick={() => router.push("/login")} />
      <EventSubmission isOpen={activeModal === "event"} onClose={closeModals} onAuthRedirect={() => router.push("/login")} />
      <NotificationSidebar isOpen={activeModal === "notifications"} onClose={closeModals} />
      
      <BottomNav 
        onProfileClick={() => isAuthenticated ? router.push("/profile") : router.push("/login")}
        onEventClick={() => handleAuthGate(() => setActiveModal("event"))}
        onNotificationsClick={() => setActiveModal("notifications")}
      />

      {/* SPOTLIGHT BANNER */}
      <section className="relative w-full h-[70vh] min-h-[500px]">
        <Image
          src={SPOTLIGHT_EVENT.image}
          alt={SPOTLIGHT_EVENT.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradients: dark on left to transparent right, dark bottom to transparent up */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Spotlight Content (Bottom Left) */}
        <div className="absolute bottom-12 md:bottom-20 left-4 md:left-12 max-w-2xl z-10">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4">
            Featured Event
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
            {SPOTLIGHT_EVENT.title}
          </h1>
          <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-white/70 uppercase tracking-widest mb-4">
            <span>{SPOTLIGHT_EVENT.date}</span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span>{SPOTLIGHT_EVENT.location}</span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span style={{ color: cityThemeColor }}>{SPOTLIGHT_EVENT.type}</span>
          </div>
          <p className="text-sm text-white/60 line-clamp-2 max-w-lg mb-8 leading-relaxed">
            {SPOTLIGHT_EVENT.description}
          </p>
          <div className="flex items-center gap-4">
            <button 
              className="px-8 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
              onClick={() => router.push(`/explore/${cityUrl}/${SPOTLIGHT_EVENT.id}`)}
            >
              Get Tickets
            </button>
            <button 
              className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-xs backdrop-blur-md hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
              onClick={() => router.push(`/explore/${cityUrl}/${SPOTLIGHT_EVENT.id}`)}
            >
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* TOP CONTROLS ROW */}
      <section className="sticky top-[80px] z-40 bg-black/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          <button className="flex-1 max-w-2xl bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl px-6 py-4 flex items-center gap-3 transition-colors text-white/40 group">
            <Search size={18} className="group-hover:text-white/80 transition-colors" />
            <span className="font-mono text-xs uppercase tracking-widest group-hover:text-white/80 transition-colors">Search Events...</span>
          </button>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0 relative">
            <button 
              onClick={() => setIsFiltersOpen(true)}
              className="w-14 h-14 md:w-auto md:px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors group"
            >
              <SlidersHorizontal size={18} className="text-white/60 group-hover:text-white" />
              <span className="hidden md:block font-black text-xs uppercase tracking-widest text-white/80 group-hover:text-white">Filters</span>
            </button>
            <FiltersPanel isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />

            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(true)}
                className="w-14 h-14 md:w-auto md:px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors group"
              >
                <ArrowUpDown size={18} className="text-white/60 group-hover:text-white" />
                <span className="hidden md:block font-black text-xs uppercase tracking-widest text-white/80 group-hover:text-white">Sort By</span>
              </button>
              <SortByPanel isOpen={isSortOpen} onClose={() => setIsSortOpen(false)} />
            </div>

            <button 
              onClick={() => handleAuthGate(() => setActiveModal("event"))}
              className="w-14 h-14 rounded-2xl border border-transparent text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: cityThemeColor }}
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA - EVENT GRID */}
      <section className="max-w-[1800px] mx-auto px-4 md:px-8 py-12 md:py-20">
        
        {/* Section Heading (as per prompt: Large bold Event Name heading) */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Trending Now
          </h2>
          <div className="flex items-center gap-3 text-xs font-mono text-white/50 uppercase tracking-widest">
            <span>20:00 - LATE</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>18+</span>
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            <span>VARIOUS</span>
            <div className="flex items-center gap-1 ml-4">
              <div className="w-2 h-2 rounded-full border border-white/40" />
              <div className="w-2 h-2 rounded-full border border-white/40" />
            </div>
          </div>
        </div>

        {/* 4-Column Grid */}
        {EVENTS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {EVENTS.map((event) => (
              <div 
                key={event.id}
                onClick={() => router.push(`/explore/${cityUrl}/${event.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image Box */}
                <div className="relative w-full aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden mb-4 border border-white/5">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                
                {/* White Text Area Box below card as per prompt */}
                <div className="bg-white rounded-2xl p-5 flex flex-col gap-2 transform group-hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                  <span className="font-mono text-[10px] text-black/50 uppercase tracking-widest">
                    DATE - {event.date}
                  </span>
                  <h3 className="font-black text-black text-xl uppercase tracking-tighter leading-none line-clamp-2">
                    {event.name}
                  </h3>
                  <span className="font-black text-lg mt-1" style={{ color: cityThemeColor }}>
                    {event.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 max-w-2xl">
              No Such Events Available. If You Can, Create One.
            </h3>
            <button 
              className="px-8 py-4 rounded-xl border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Back to top */}
        <div className="flex justify-center mt-20">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 flex items-center justify-center transition-all"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

      </section>
      
      <FinalCTA selectedCity={selectedCity} />
    </main>
  );
}
