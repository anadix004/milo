"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { EVENTS, EventData } from "@/constants/events";
import { Filter, ArrowUpDown, Search, Calendar, Heart, Send } from "lucide-react";
import IdentityScan from "@/components/IdentityScan";
import Comments from "@/components/events/Comments";
import { useNotifications } from "./NotificationContext";

import { parsePrice } from "@/utils/price";

interface EventListingProps {
  selectedCity: string | null;
}

const CATEGORIES = ["All", "Music", "Tech", "Arts", "Community", "Fashion", "Culture"];

export default function EventListing({ selectedCity }: EventListingProps) {
  const { addNotification } = useNotifications();
  const [expandedEvent, setExpandedEvent] = useState<EventData | null>(null);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");
  const [sortOrder, setSortOrder] = useState<"featured" | "price-low" | "price-high">("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"All" | "Today" | "Tomorrow" | "Week">("All");
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());

  const isJoined = (id: string) => joinedEvents.has(id);
  const joinEvent = (id: string) => {
    setJoinedEvents((prev) => new Set(prev).add(id));
    const event = EVENTS.find(e => e.id === id);
    if (event) {
       addNotification("radar", `Plan synchronised: ${event.name} has been added to your identity.`);
    }
  };

  // Get relative dates for filtering
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];
  
  // Filter events by selected city + category + search + date
  const filteredEvents = useMemo(() => {
    let result = EVENTS.filter(e => e.cityId === "all" || !selectedCity || e.cityId === selectedCity);
    
    // Category Sync
    if (selectedCat !== "All") {
      result = result.filter(e => e.category.toLowerCase().includes(selectedCat.toLowerCase()));
    }

    // Search Hub Sync
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(q) || 
        e.category.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    // Temporal Sync
    if (timeFilter === "Today") {
      result = result.filter(e => e.date === todayStr);
    } else if (timeFilter === "Tomorrow") {
      result = result.filter(e => e.date === tomorrowStr);
    } else if (timeFilter === "Week") {
      result = result.filter(e => e.date >= todayStr && e.date <= nextWeekStr);
    }

    // Apply Sorting
    return result.sort((a, b) => {
      if (sortOrder === "price-low") return parsePrice(a.price) - parsePrice(b.price);
      if (sortOrder === "price-high") return parsePrice(b.price) - parsePrice(a.price);
      // Default: Featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCity, selectedCat, sortOrder, searchQuery, timeFilter, todayStr, tomorrowStr, nextWeekStr]);

  // Separate Featured vs Standard
  const featuredEvents = useMemo(() => filteredEvents.filter(e => e.featured), [filteredEvents]);
  const standardEvents = useMemo(() => filteredEvents.filter(e => !e.featured), [filteredEvents]);

  const handleExpand = (event: EventData) => {
    if (event.id === "gen-1") {
      setIsScanOpen(true);
    } else {
      setExpandedEvent(event);
    }
  };

  return (
    <section className="relative w-full bg-black py-20 z-30">
      {/* Top subtle glow for blending */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      <div className="max-w-[1440px] mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="font-[family-name:var(--font-lexend)] text-white text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">
              {selectedCity ? selectedCity : "Global"} <span className="text-white/50 italic">Radar</span>
            </h2>
            <p className="font-[family-name:var(--font-roboto-mono)] text-white/80 text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Exploring live events near you
            </p>
          </div>

          {/* Cinematic Search Hub */}
          <div className="flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/60 group-focus-within:text-white transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="SEARCH RADAR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-full py-4 pl-16 pr-8 text-white placeholder:text-white/30 outline-none focus:border-white/50 backdrop-blur-3xl transition-all font-black tracking-widest text-sm mix-blend-difference"
            />
          </div>
        </div>

        {/* Premium Filter, Sort & Time Hub */}
        <div className="flex flex-col gap-6 bg-white/[0.08] border border-white/20 p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-8">
            
            {/* Categories */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white/10 rounded-full border border-white/20 flex-1">
              <Filter size={14} className="text-white/60 whitespace-nowrap" />
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={clsx(
                      "px-5 py-2 rounded-full text-[10px] uppercase font-black tracking-[0.2em] transition-all whitespace-nowrap font-[family-name:var(--font-jakarta)]",
                      selectedCat === cat 
                        ? "bg-white text-black shadow-[0_0_20px_white]" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden xl:block w-px h-8 bg-white/20" />

            {/* Time Navigation */}
            <div className="flex items-center gap-6 px-6 py-3 bg-white/10 rounded-full border border-white/20">
              <Calendar size={14} className="text-white/60 whitespace-nowrap" />
              <div className="flex gap-6">
                {["All", "Today", "Tomorrow", "Week"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t as any)}
                    className={clsx(
                      "text-[10px] uppercase font-black tracking-[0.2em] transition-all font-[family-name:var(--font-jakarta)] whitespace-nowrap relative group",
                      timeFilter === t ? "text-white" : "text-white/60 hover:text-white"
                    )}
                  >
                    {t}
                    {timeFilter === t && (
                      <motion.div layoutId="timeUnderline" className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden xl:block w-px h-8 bg-white/20" />

            {/* Sorting */}
            <div className="flex items-center gap-6 px-6 py-3">
              <div className="flex items-center gap-3 text-white/60">
                <ArrowUpDown size={14} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-black font-[family-name:var(--font-jakarta)] whitespace-nowrap">Sort by:</span>
              </div>
              <div className="flex gap-6">
                {[
                  { id: "featured", label: "Featured" },
                  { id: "price-low", label: "Price: Low" },
                  { id: "price-high", label: "Price: High" }
                ].map((sort) => (
                  <button
                    key={sort.id}
                    onClick={() => setSortOrder(sort.id as any)}
                    className={clsx(
                      "text-[10px] uppercase font-black tracking-[0.2em] transition-all font-[family-name:var(--font-jakarta)] whitespace-nowrap relative group",
                      sortOrder === sort.id ? "text-white" : "text-white/60 hover:text-white"
                    )}
                  >
                    {sort.label}
                    {sortOrder === sort.id && (
                      <motion.div layoutId="sortUnderline" className="absolute -bottom-1 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Hot Picks - Self-Sliding Carousel */}
      {featuredEvents.length > 0 && (
        <div className="mb-24 scale-in overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 mb-8 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/20" />
            <h3 className="font-[family-name:var(--font-lexend)] text-white/60 text-xs uppercase tracking-[0.4em] font-bold">
              Hot Picks / Featured
            </h3>
          </div>
          <FeaturedCarousel items={featuredEvents} onExpand={handleExpand} />
        </div>
      )}

      {/* 2. All Events - Grid */}
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-white/20" />
          <h3 className="font-[family-name:var(--font-lexend)] text-white/60 text-xs uppercase tracking-[0.4em] font-bold">
            All Happenings
          </h3>
        </div>
        
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
              <EventGridCard key={event.id} event={event} onExpand={handleExpand} />
            ))}
            {standardEvents.length === 0 && (
              <div className="col-span-full py-32 text-center opacity-30">
                <p className="font-mono text-xs uppercase tracking-[0.5em]">No events synchronized in this radar phase</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

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

      {/* Identity Scan Modal */}
      <IdentityScan 
        isOpen={isScanOpen} 
        onClose={() => setIsScanOpen(false)} 
        onVerified={() => {
          setIsScanOpen(false);
          console.log("IDENTITY VERIFIED");
        }}
      />
    </section>
  );
}

function FeaturedCarousel({ items, onExpand }: { items: EventData[], onExpand: (e: EventData) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    };
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [items.length]);

  return (
    <div className="relative w-full overflow-hidden px-4 md:px-0">
      <div 
        className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateX(-${currentIndex * 85}%)`, marginLeft: "5%" }}
      >
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            onClick={() => onExpand(item)}
            className={clsx(
              "relative min-w-[80vw] md:min-w-[60vw] aspect-[16/9] md:aspect-[21/9] mr-6 rounded-2xl overflow-hidden cursor-pointer group shrink-0",
              currentIndex === idx ? "opacity-100 scale-100" : "opacity-40 scale-95"
            )}
          >
            <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
              <div>
                <span className="font-[family-name:var(--font-roboto-mono)] text-[10px] tracking-[0.3em] text-white/70 uppercase mb-2 block font-bold">
                  {item.category}
                </span>
                <h3 className="font-[family-name:var(--font-lexend)] text-2xl md:text-5xl font-black text-white uppercase tracking-tight">
                  {item.name}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EventGridCard({ event, onExpand }: { event: EventData, onExpand: (e: EventData) => void }) {
  return (
    <motion.div
      onClick={() => onExpand(event)}
      whileHover={{ scale: 1.02 }}
      className="relative w-full aspect-[16/9] md:aspect-video rounded-3xl overflow-hidden cursor-pointer group bg-neutral-900 border border-white/5"
    >
      <img src={event.image} alt={event.name} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
      
      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start z-10">
        <span className="font-[family-name:var(--font-roboto-mono)] text-[10px] tracking-widest text-white/60 uppercase mb-2 font-black">
          {event.category}
        </span>
        <h3 className="font-[family-name:var(--font-lexend)] text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-2">
          {event.name}
        </h3>
        <p className="font-[family-name:var(--font-lexend)] text-white/80 text-xs md:text-sm font-bold">
          {event.price} / {event.date}
        </p>
      </div>
    </motion.div>
  );
}

function EventDetailView({ event, isJoined, onJoin, onClose }: { event: EventData, isJoined: boolean, onJoin: () => void, onClose: () => void }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 1000) + 500);

  const handleLike = () => {
    if (!isJoined) return;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 font-[family-name:var(--font-jakarta)]"
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="relative w-full max-w-6xl h-full md:max-h-[85vh] bg-neutral-950 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        {/* REFINEMENT: Removed top-right close button for cinematic frame */}

        <div className="w-full md:w-1/2 h-48 md:h-full relative shrink-0">
          <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent hidden md:block" />
        </div>

        <div className="flex-1 p-8 md:p-16 flex flex-col gap-8 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.4em] mb-4 block font-black">
                {event.category} // {event.date}
              </span>
              <h2 className="font-lexend text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                {event.name}
              </h2>
            </div>
            
            {/* Insta-Style Social Actions */}
            <div className="flex items-center gap-4">
               <button 
                  onClick={handleLike}
                  disabled={!isJoined}
                  className={clsx(
                    "flex flex-col items-center gap-1 transition-all",
                    !isJoined ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:scale-95"
                  )}
               >
                 <Heart 
                    size={24} 
                    className={clsx(
                      "transition-colors duration-300", 
                      isLiked ? "fill-rose-500 text-rose-500" : "text-white/40"
                    )} 
                 />
                 {isJoined && (
                   <span className="text-[10px] font-mono text-white/40 font-bold">{likeCount}</span>
                 )}
               </button>

               <button className="flex flex-col items-center gap-1 hover:scale-110 active:scale-95 transition-all group">
                 <Send size={24} className="text-white/40 group-hover:text-white transition-colors" />
                 {isJoined && (
                   <span className="text-[10px] font-mono text-white/40 font-bold">SHARES</span>
                 )}
               </button>
            </div>
          </div>

          <p className="text-white/60 font-mono text-xs md:text-sm leading-relaxed max-w-md">
            {event.description}
          </p>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <div>
              <p className="text-white/20 text-[10px] font-mono uppercase tracking-widest mb-1">Access Tier</p>
              <p className="text-2xl font-black text-white">{event.price}</p>
            </div>
            <button 
              onClick={onJoin}
              disabled={isJoined}
              className={clsx(
                "px-12 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all active:scale-95",
                isJoined ? "bg-emerald-500 text-black animate-pulse" : "bg-white text-black"
              )}
            >
              {isJoined ? "PLAN JOINED" : "JOIN PLAN"}
            </button>
          </div>

          {/* Social Layer: Comments */}
          <Comments isJoined={isJoined} />
        </div>
      </motion.div>
    </motion.div>
  );
}
