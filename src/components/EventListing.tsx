"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Clock, Filter, Star, ChevronRight, X, Music, Trophy, Layout, Search as SearchIcon, Heart, Share2, Ticket, Check, ArrowUpDown, Send, Loader2 } from "lucide-react";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useNotifications } from "./NotificationContext";
import { useAuth } from "./AuthContext";
import { parsePrice } from "@/utils/price";
import { METRO_CITIES, getCityName } from "@/constants/cities";
import Comments from "@/components/events/Comments";
import { EVENTS } from "@/constants/events";
import { useIsMobile } from "@/hooks/useMediaQuery";
import BottomSheet from "@/components/mobile/BottomSheet";

// --- SPRING CONFIG SYNC ---
const SPRING_CONFIG = { stiffness: 70, damping: 15 };

type SortOrder = "featured" | "price-low" | "price-high";

export interface EventData {
  id: string;
  title: string;
  name?: string; // Compatibility
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  category: string;
  image: string;
  featured: boolean;
  cityId: string;
  is_verified?: boolean;
  venue_address?: string;
  ticket_links?: { name: string; url: string }[];
  aadhaar_id?: string;
}

// Premium Dropdown Component
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: any) => void;
  icon?: React.ReactNode;
}

function Dropdown({ label, value, options, onChange, icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center gap-3 px-6 py-4 bg-white/10 border border-white/20 rounded-full transition-all hover:bg-white/15 min-w-[160px] md:min-w-[200px] justify-between group",
          isOpen && "border-white/40 bg-white/15"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-white/40 group-hover:text-white/80 transition-colors">{icon}</span>}
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-black mb-1">{label}</span>
            <span className="text-xs font-black text-white uppercase tracking-widest">{value}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={SPRING_CONFIG}
          className="text-white/40"
        >
          <ArrowUpDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
            transition={SPRING_CONFIG}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-black/90 border border-white/20 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl max-h-[400px] overflow-y-auto no-scrollbar"
          >
            <div className="p-2 space-y-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full px-6 py-4 text-left text-xs font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-between group",
                    value === opt 
                      ? "bg-white text-black" 
                      : "text-white/40 hover:text-white hover:bg-white/10"
                  )}
                >
                  {opt}
                  {value === opt && (
                    <motion.div 
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EventListing({ selectedCity, onAuthRequired }: { selectedCity: string | null; onAuthRequired: () => void }) {
  const isMobile = useIsMobile();
  const supabase = createClient();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<EventData | null>(null);
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All");
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_verified", true);

      let fetchedEvents: EventData[] = [];
      if (!error && data) {
         fetchedEvents = data.map(e => ({ ...e, name: e.title }));
      }
      
      const localMapped = EVENTS.map(e => ({ ...e, title: e.name, time: "18:00", location: "Various", is_verified: true })) as unknown as EventData[];
      setEvents([...localMapped, ...fetchedEvents]);
    } catch (err: any) {
      addNotification("system", `Failed to load online events: ${err.message}`);
      const localMapped = EVENTS.map(e => ({ ...e, title: e.name, time: "18:00", location: "Various", is_verified: true })) as unknown as EventData[];
      setEvents(localMapped);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJoined = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("event_id")
        .eq("profile_id", user.id)
        .eq("type", "join");
      
      if (error) throw error;
      setJoinedEvents(new Set(data.map(r => r.event_id)));
    } catch (err) {
      console.error("Error fetching joined events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) fetchJoined();

    const channel = supabase.channel("radar_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, (payload) => {
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          const newEvent = { ...(payload.new as any), name: (payload.new as any).title };
          if (newEvent.is_verified) {
             setEvents(prev => {
                const existing = prev.filter(e => e.id !== newEvent.id);
                return [newEvent, ...existing];
             });
          } else {
             setEvents(prev => prev.filter(e => e.id !== newEvent.id));
          }
        } else if (payload.eventType === "DELETE") {
           setEvents(prev => prev.filter(e => e.id !== (payload.old as any).id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const ALL_CATEGORIES = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    events.forEach(e => {
      if (e.category) e.category.split(" / ").forEach(c => cats.add(c.trim()));
    });
    return Array.from(cats).sort();
  }, [events]);

  const isJoined = (id: string) => joinedEvents.has(id);
  const joinEvent = async (id: string) => {
    if (!isAuthenticated || !user) {
      onAuthRequired();
      return;
    }

    try {
      const { error } = await supabase
        .from("rsvps")
        .insert({
          event_id: id,
          profile_id: user.id,
          type: 'join'
        });

      if (error && error.code !== '23505') throw error; // Ignore if already joined

      setJoinedEvents((prev) => new Set(prev).add(id));
      const event = events.find(e => e.id === id);
      if (event) addNotification("radar", `Plan joined: ${event.name} added to your list.`);
    } catch (err: any) {
      addNotification("system", `Join failed: ${err.message}`);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const weekStr = new Date(Date.now() + 604800000).toISOString().split("T")[0];
  const monthStr = new Date(Date.now() + 2592000000).toISOString().split("T")[0];

  const filteredEvents = useMemo(() => {
    let result = events.filter(e => e.cityId === "all" || !selectedCity || e.cityId === selectedCity);
    if (selectedCat !== "All") result = result.filter(e => e.category.includes(selectedCat));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => e.name?.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (timeFilter === "Today") result = result.filter(e => e.date === todayStr);
    else if (timeFilter === "Tomorrow") result = result.filter(e => e.date === tomorrowStr);
    else if (timeFilter === "Week") result = result.filter(e => e.date >= todayStr && e.date <= weekStr);
    else if (timeFilter === "Month") result = result.filter(e => e.date >= todayStr && e.date <= monthStr);

    return result.sort((a, b) => {
      if (sortOrder === "price-low") return parsePrice(a.price) - parsePrice(b.price);
      if (sortOrder === "price-high") return parsePrice(b.price) - parsePrice(a.price);
      return (a.featured ? -1 : 1);
    });
  }, [events, selectedCity, selectedCat, sortOrder, searchQuery, timeFilter, todayStr, tomorrowStr, weekStr, monthStr]);

  const featuredEvents = useMemo(() => filteredEvents.filter(e => e.featured), [filteredEvents]);
  const standardEvents = useMemo(() => filteredEvents.filter(e => !e.featured), [filteredEvents]);

  const handleEventClick = (event: EventData) => {
    if (!isAuthenticated) {
      onAuthRequired();
    } else {
      setExpandedEvent(event);
    }
  };

  return (
    <section id="event-listing" className="relative w-full bg-black py-20 z-30">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      <div className="max-w-[1440px] mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="font-[family-name:var(--font-lexend)] text-white text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">
              {selectedCity ? getCityName(selectedCity) : "Global"} <span className="text-white/50 italic">Events</span>
            </h2>
            <p className="font-[family-name:var(--font-roboto-mono)] text-white/80 text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Explore what's happening near you
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6 w-full overflow-hidden">
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/90 group-focus-within:text-white transition-colors">
              <SearchIcon size={18} />
            </div>
            <input 
              type="text"
              placeholder="SEARCH EVENTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/60 rounded-full py-5 pl-16 pr-8 text-white placeholder:text-white/60 outline-none focus:border-white transition-all font-black tracking-widest text-sm mix-blend-difference"
            />
          </div>

          <div className={clsx(
            "flex gap-4 w-full lg:w-auto",
            isMobile ? "overflow-x-auto no-scrollbar pb-2 px-1" : "flex-wrap md:flex-nowrap items-center"
          )}>
            {isMobile ? (
              ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={clsx(
                    "flex-shrink-0 px-6 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all",
                    selectedCat === cat 
                      ? "bg-white text-black border-white" 
                      : "bg-white/5 text-white/40 border-white/10"
                  )}
                >
                  {cat}
                </button>
              ))
            ) : (
              <>
                <Dropdown label="Categories" value={selectedCat} options={ALL_CATEGORIES} onChange={setSelectedCat} icon={<Filter size={14} />} />
                <Dropdown label="Timeframe" value={timeFilter} options={["All", "Today", "Tomorrow", "Week", "Month"]} onChange={setTimeFilter} icon={<Calendar size={14} />} />
                <Dropdown label="Sort By" value={sortOrder === "featured" ? "Featured" : sortOrder === "price-low" ? "Price: Low" : "Price: High"} options={["Featured", "Price: Low", "Price: High"]} onChange={(val) => setSortOrder(val === "Featured" ? "featured" : val === "Price: Low" ? "price-low" : "price-high")} />
              </>
            )}
          </div>
          
          {isMobile && (
             <div className="flex gap-3 w-full overflow-x-auto no-scrollbar px-1">
                {["Today", "Tomorrow", "Week", "Month"].map(time => (
                   <button
                     key={time}
                     onClick={() => setTimeFilter(time === timeFilter ? "All" : time)}
                     className={clsx(
                        "flex-shrink-0 px-5 py-3 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all",
                        timeFilter === time 
                          ? "bg-purple-500 text-white border-purple-400" 
                          : "bg-white/5 text-white/20 border-white/5"
                     )}
                   >
                      {time}
                   </button>
                ))}
             </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex items-center justify-center text-white/20">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <>
          {featuredEvents.length > 0 && (
            <div className="mb-24 scale-in overflow-hidden">
               <FeaturedCarousel items={featuredEvents} onExpand={handleEventClick} />
            </div>
          )}

          <div className="max-w-[1440px] mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${selectedCity}-${selectedCat}-${searchQuery}-${timeFilter}-${sortOrder}`}
                initial={{ opacity: 0, filter: "blur(20px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
              >
                {standardEvents.map((event) => (
                  <EventGridCard key={event.id} event={event} onExpand={handleEventClick} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}

      <AnimatePresence>
        {expandedEvent && (
          <EventDetailView 
            event={expandedEvent} 
            isJoined={isJoined(expandedEvent.id)}
            onJoin={() => joinEvent(expandedEvent.id)}
            onClose={() => setExpandedEvent(null)} 
          />
        )}
      </AnimatePresence>

    </section>
  );
}

function FeaturedCarousel({ items, onExpand }: { items: EventData[], onExpand: (e: EventData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(-${currentIndex * 85}%)`, marginLeft: "5%" }}>
        {items.map((item, idx) => (
          <motion.div key={item.id} onClick={() => onExpand(item)} className={clsx("relative min-w-[85vw] md:min-w-[60vw] aspect-[16/9] md:aspect-[21/9] mr-6 rounded-2xl overflow-hidden cursor-pointer group shrink-0", currentIndex === idx ? "opacity-100 scale-100" : "opacity-40 scale-95")}>
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2 block">{item.category}</span>
              <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tight">{item.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EventGridCard({ event, onExpand }: { event: EventData, onExpand: (e: EventData) => void }) {
  return (
    <motion.div onClick={() => onExpand(event)} whileHover={{ scale: 1.02 }} className="relative w-full aspect-[1.2/1] md:aspect-video rounded-3xl overflow-hidden cursor-pointer group bg-neutral-900 border border-white/5">
      <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-x-0 bottom-0 p-8 z-10">
        <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase mb-2 block">{event.category}</span>
        <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-2">{event.title}</h3>
        <p className="text-white/80 text-[10px] md:text-sm font-black uppercase tracking-widest">{event.price} // {event.date}</p>
      </div>
    </motion.div>
  );
}

function EventDetailView({ event, isJoined, onJoin, onClose }: { event: EventData, isJoined: boolean, onJoin: () => void, onClose: () => void }) {
  const isMobile = useIsMobile();
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [isMobile]);

  const renderContent = () => (
    <div className="flex flex-col w-full pb-20">
      {/* Header Section */}
      <div className="px-6 md:px-16 pt-12 md:pt-16 pb-8 md:pb-10 flex flex-col gap-6 md:gap-8 z-10">
         <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] pr-12">
            {event.title}
         </h2>
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4 md:pt-8 border-t border-white/10">
           {/* Left: Avatar & Info */}
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center font-black text-xl shrink-0">
               M
             </div>
             <div>
               <p className="font-bold text-white text-sm md:text-base tracking-widest uppercase">MILO Curated</p>
               <p className="text-white/40 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] mt-1">{event.category} • {event.date}</p>
             </div>
           </div>

           {/* Right: Actions */}
           <div className="flex flex-wrap items-center gap-3 md:gap-4">
             <button onClick={() => setIsLiked(!isLiked)} className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-colors bg-white/5 shrink-0">
               <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-rose-500" : ""} />
             </button>
             <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-white/40 hover:text-white transition-colors bg-white/5 shrink-0">
               <Share2 size={20} />
             </button>
             <button onClick={onJoin} disabled={isJoined} className={clsx("px-8 md:px-12 h-12 md:h-14 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all", isJoined ? "bg-emerald-500 text-black" : "bg-white text-black hover:bg-neutral-200")}>
               {isJoined ? "Joined" : "Get Tickets"}
             </button>
           </div>
         </div>
      </div>

      {/* Hero Image Section */}
      <div className="px-4 md:px-12 w-full">
        <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-neutral-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden relative group">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        </div>
      </div>
      
      {/* Details Grid Section */}
      <div className="mt-12 md:mt-16 px-6 md:px-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
         {/* Main Content (Left) */}
         <div className="lg:col-span-2 space-y-12">
           <div>
             <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.4em] mb-4">Mission Broadcast Details</h3>
             <p className="text-white/80 font-mono text-sm md:text-base leading-relaxed whitespace-pre-line">{event.description}</p>
           </div>
           
           <div className="pt-8 border-t border-white/5">
              <Comments isJoined={isJoined} /> 
           </div>
         </div>
         
         {/* Sidebar Info (Right) */}
         <div className="space-y-8 lg:pl-8 lg:border-l border-white/5">
           <div>
             <h3 className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em] mb-2">Time</h3>
             <p className="font-mono text-white text-sm md:text-base uppercase tracking-wider">{event.time}</p>
           </div>
           
           {event.venue_address && (
             <div>
               <h3 className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em] mb-2">Authorized Venue</h3>
               <p className="font-mono text-white text-sm md:text-base uppercase tracking-wider">{event.venue_address}</p>
             </div>
           )}

           <div>
             <h3 className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em] mb-2">Access Tier</h3>
             <p className="font-black text-white text-2xl md:text-3xl tracking-tighter">{event.price}</p>
           </div>

           {event.ticket_links && event.ticket_links.length > 0 && (
              <div>
                <h3 className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em] mb-4">Booking Channels</h3>
                <div className="flex flex-col gap-3">
                   {event.ticket_links.map((link, i) => (
                     <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group">
                       <span className="font-black text-white text-xs uppercase tracking-widest">{link.name || "Book Now"}</span>
                       <Ticket size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
                     </a>
                   ))}
                </div>
              </div>
           )}
         </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={!!event} onClose={onClose} snapHeight="98vh">
        {renderContent()}
      </BottomSheet>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex justify-center pt-12 md:pt-20">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: "100%" }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: "100%" }} 
        transition={SPRING_CONFIG} 
        className="relative w-full max-w-6xl bg-[#0a0a0a] border-t border-l border-r border-white/10 rounded-t-[2.5rem] overflow-y-auto no-scrollbar flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <X size={24} />
        </button>
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
