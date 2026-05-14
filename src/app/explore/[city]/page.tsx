"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, Plus } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useLocation } from "@/components/LocationContext";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import BottomNav from "@/components/mobile/BottomNav";
import FiltersPanel from "@/components/FiltersPanel";
import SortByPanel from "@/components/SortByPanel";
import dynamic from "next/dynamic";
import Image from "next/image";
import { TiltCard } from "@/components/TiltCard";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryColour, getCategoryHeroAura, getCategoryCardAura, getCategoryButtonGlow, getCategoryBorderGlow, CATEGORY_LABELS, EventCategory } from "@/lib/aura";

const ProfileSidebar = dynamic(() => import("@/components/ProfileSidebar"), { ssr: false });
const EventSubmission = dynamic(() => import("@/components/EventSubmission"), { ssr: false });
const NotificationSidebar = dynamic(() => import("@/components/NotificationSidebar"), { ssr: false });

// Mock data for featured events (Spotlight Slider)
const SPOTLIGHT_EVENTS = [
  {
    id: "featured-1",
    title: "THE NEON WAREHOUSE WAVES",
    date: "OCT 24",
    location: "Secret Warehouse",
    type: "dj_night",
    description: "An exclusive underground rave featuring top international DJs. Secret location revealed to ticket holders 2 hours before the event.",
    image: "https://picsum.photos/seed/spotlight1/1600/900",
  },
  {
    id: "featured-2",
    title: "ROOFTOP SYMPHONY",
    date: "OCT 26",
    location: "Skyline Terrace",
    type: "dj_night",
    description: "Experience classical instruments fused with modern electronic beats under the stars.",
    image: "https://picsum.photos/seed/spotlight2/1600/900",
  },
  {
    id: "featured-3",
    title: "CYBERPUNK ALLEY",
    date: "OCT 31",
    location: "Downtown District 9",
    type: "club",
    description: "A futuristic street festival with neon art installations, cyberpunk cosplay, and synthwave.",
    image: "https://picsum.photos/seed/spotlight3/1600/900",
  }
];


// Map URL city names to internal short codes used in the database
function getCityCode(urlCity: string): string {
  const map: Record<string, string> = {
    delhi: "del",
    mumbai: "mum",
    bengaluru: "blr",
  };
  return map[urlCity] || urlCity;
}

export default function ExplorePage() {
  const params = useParams();
  const router = useRouter();
  const cityUrl = params?.city as string;
  const cityCode = getCityCode(cityUrl);
  
  const { isAuthenticated } = useAuth();
  const { setSelectedCity } = useLocation();
  const [activeModal, setActiveModal] = useState<"profile" | "event" | "auth" | "notifications" | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [spotlightEvents, setSpotlightEvents] = useState<any[]>(SPOTLIGHT_EVENTS);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Auto-slide effect
  useEffect(() => {
    if (spotlightEvents.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spotlightEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [spotlightEvents.length]);

  // Fetch Featured Events
  useEffect(() => {
    if (!cityCode) return;
    const fetchSpotlight = async () => {
      const supabase = createClient();

      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("featured", true)
        .eq("cityId", cityCode)
        .order("created_at", { ascending: false })
        .limit(3);
        
      if (data && data.length > 0) {
        setSpotlightEvents(data);
        setCurrentSlide(0);
      } else {
        setSpotlightEvents(SPOTLIGHT_EVENTS); // Fallback
      }
    };
    fetchSpotlight();
  }, [cityCode]);

  // Fetch Event Grid Data
  useEffect(() => {
    if (!cityCode) return;
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      const supabase = createClient();
      
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("cityId", cityCode)
        .order("created_at", { ascending: false });
        
      if (data) {
        setEvents(data);
      }
      setIsLoadingEvents(false);
    };
    fetchEvents();
  }, [cityCode]);

  // Sync URL city with global context
  useEffect(() => {
    if (cityCode) {
      setSelectedCity(cityCode);
    }
  }, [cityCode, setSelectedCity]);

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
      <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {spotlightEvents[currentSlide]?.video_url ? (
              <video
                src={spotlightEvents[currentSlide].video_url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={spotlightEvents[currentSlide]?.image}
                alt={spotlightEvents[currentSlide]?.title || "Featured Event"}
                fill
                className="object-cover"
                priority
              />
            )}
            {/* Gradients: dark on left to transparent right, dark bottom to transparent up */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-[1]" />
            
            {/* Spotlight Aura */}
            <div 
              className="absolute inset-0 z-[2] mix-blend-screen opacity-100" 
              style={{ background: getCategoryHeroAura(spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type || 'other') }} 
            />

            {/* Spotlight Content (Bottom Left) */}
            <div className="absolute bottom-12 md:bottom-20 left-4 md:left-12 max-w-2xl z-10">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4">
                Featured Event
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
                {spotlightEvents[currentSlide]?.title || spotlightEvents[currentSlide]?.name}
              </h1>
              <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-white/70 uppercase tracking-widest mb-4">
                <span>{spotlightEvents[currentSlide]?.date}</span>
                <span className="w-1 h-1 bg-white/50 rounded-full" />
                <span>{spotlightEvents[currentSlide]?.location || spotlightEvents[currentSlide]?.cityId}</span>
                <span className="w-1 h-1 bg-white/50 rounded-full" />
                <span style={{ color: getCategoryColour(spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type || 'other') }}>
                  {CATEGORY_LABELS[(spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type) as EventCategory] || (spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type)}
                </span>
              </div>
              <p className="text-sm text-white/60 line-clamp-2 max-w-lg mb-8 leading-relaxed">
                {spotlightEvents[currentSlide]?.description}
              </p>
              <div className="flex items-center gap-4">
                <button 
                  className="px-8 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-transform hover:scale-105 active:scale-95"
                  onClick={() => router.push(`/explore/${cityUrl}/${spotlightEvents[currentSlide]?.id}`)}
                >
                  Get Tickets
                </button>
                <button 
                  className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-xs backdrop-blur-md hover:bg-white/20 transition-transform hover:scale-105 active:scale-95"
                  onClick={() => router.push(`/explore/${cityUrl}/${spotlightEvents[currentSlide]?.id}`)}
                >
                  More Info
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-4 md:right-12 flex items-center gap-2 z-20">
          {spotlightEvents.length > 1 && spotlightEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
              style={{ width: currentSlide === index ? '32px' : '16px' }}
            >
              <div className="absolute inset-0 bg-white/30 group-hover:bg-white/50 transition-colors" />
              {currentSlide === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 backdrop-blur-md"
                  style={{ 
                    backgroundColor: getCategoryColour(spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type || 'other').replace(/1\)$/, '0.4)'),
                    boxShadow: `0 0 16px ${getCategoryColour(spotlightEvents[currentSlide]?.category || spotlightEvents[currentSlide]?.type || 'other').replace(/1\)$/, '0.5)')}, inset 0 0 4px rgba(255,255,255,0.1)`
                  }}
                />
              )}
            </button>
          ))}
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
              className="w-14 h-14 rounded-2xl border border-transparent bg-white text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
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
        {isLoadingEvents ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {events.map((event) => (
              <div 
                key={event.id}
                onClick={() => router.push(`/explore/${cityUrl}/${event.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image Box */}
                <TiltCard 
                  className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-4 border border-white/5"
                  style={{
                    background: getCategoryCardAura(event.category || event.type || 'other'),
                    boxShadow: getCategoryBorderGlow(event.category || event.type || 'other')
                  }}
                >
                  <div className="absolute inset-0 bg-black/75 z-0" />
                  <Image
                    src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200"}
                    alt={event.title || "Event Image"}
                    fill
                    className="object-cover transition-all duration-700 ease-out mix-blend-overlay z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-20" />
                </TiltCard>
                
                {/* Ambient Text Area Box */}
                <div 
                  className="rounded-2xl p-5 flex flex-col gap-2 transform group-hover:-translate-y-2 transition-transform duration-500 border border-white/5 backdrop-blur-xl relative z-30"
                  style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)), ${getCategoryCardAura(event.category || event.type || 'other')}` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                      DATE - {event.date || "TBA"}
                    </span>
                    <span className="font-black text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border border-white/10" style={{ color: getCategoryColour(event.category || event.type || 'other'), backgroundColor: `${getCategoryColour(event.category || event.type || 'other')}15` }}>
                      {CATEGORY_LABELS[(event.category || event.type) as EventCategory] || (event.category || event.type)}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-xl uppercase tracking-tighter leading-tight line-clamp-2 mt-1">
                    {event.title}
                  </h3>
                  <span className="font-black text-lg mt-1" style={{ color: getCategoryColour(event.category || event.type || 'other') }}>
                    {event.price || "TBA"}
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
      
    </main>
  );
}
